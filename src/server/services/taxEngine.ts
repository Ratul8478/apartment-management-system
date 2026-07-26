import { TaxType, TaxCalculationResult } from '@/types/billing';
import { prisma } from '@/lib/prisma';

export class TaxEngine {
  /**
   * Calculates applicable taxes for a given organization location and subtotal.
   */
  public static async calculateTax(params: {
    country: string;
    state?: string | null;
    subtotal: number;
    taxId?: string | null;
    isTaxExempt?: boolean;
    exemptionCode?: string;
  }): Promise<TaxCalculationResult> {
    const { country, state, subtotal, isTaxExempt, exemptionCode } = params;

    if (subtotal <= 0 || isTaxExempt) {
      return {
        subtotal,
        country,
        state: state || null,
        taxType: TaxType.GST,
        taxRate: 0,
        taxAmount: 0,
        totalWithTax: subtotal,
        isExempt: !!isTaxExempt,
        exemptionCode: exemptionCode || 'EXEMPT_CUSTOMER',
        taxRuleName: 'Tax Exempt',
      };
    }

    // Lookup matching active tax rule from database
    const rule = await prisma.taxRule.findFirst({
      where: {
        country: country.toUpperCase(),
        isActive: true,
        ...(state ? { OR: [{ state: state }, { state: null }] } : { state: null }),
      },
      orderBy: { state: 'desc' }, // Prefer state-specific rule first
    });

    if (!rule) {
      // Fallback default tax rates based on country code
      let rate = 0;
      let taxType: TaxType = TaxType.GST;
      let ruleName = 'Default Zero Tax';

      const countryUpper = country.toUpperCase();
      if (countryUpper === 'IN') {
        rate = 18.0;
        taxType = TaxType.GST;
        ruleName = 'GST India (Fallback 18%)';
      } else if (countryUpper === 'GB') {
        rate = 20.0;
        taxType = TaxType.VAT;
        ruleName = 'VAT UK (Fallback 20%)';
      } else if (countryUpper === 'DE' || countryUpper === 'FR') {
        rate = 19.0;
        taxType = TaxType.VAT;
        ruleName = 'VAT EU (Fallback 19%)';
      } else if (countryUpper === 'US') {
        rate = 8.25;
        taxType = TaxType.SALES_TAX;
        ruleName = 'US Sales Tax (Fallback 8.25%)';
      }

      const taxAmount = Math.round(subtotal * (rate / 100) * 100) / 100;
      return {
        subtotal,
        country: countryUpper,
        state: state || null,
        taxType,
        taxRate: rate,
        taxAmount,
        totalWithTax: Math.round((subtotal + taxAmount) * 100) / 100,
        isExempt: false,
        taxRuleName: ruleName,
      };
    }

    const rateNum = Number(rule.rate);
    const taxAmount = Math.round(subtotal * (rateNum / 100) * 100) / 100;

    return {
      subtotal,
      country: rule.country,
      state: rule.state,
      taxType: rule.taxType,
      taxRate: rateNum,
      taxAmount,
      totalWithTax: Math.round((subtotal + taxAmount) * 100) / 100,
      isExempt: false,
      taxRuleName: rule.name,
    };
  }
}
