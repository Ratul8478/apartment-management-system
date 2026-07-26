import { prisma } from '@/lib/prisma';
import { InvoiceStatus, BillingReason, InvoiceDTO, InvoiceLineItemDTO } from '@/types/billing';
import { TaxEngine } from './taxEngine';

export class InvoiceService {
  /**
   * Generates a new invoice number sequentially.
   */
  public static async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;
    const lastInvoice = await prisma.billingInvoice.findFirst({
      where: { invoiceNumber: { startsWith: prefix } },
      orderBy: { invoiceNumber: 'desc' },
    });

    let nextSeq = 1;
    if (lastInvoice) {
      const parts = lastInvoice.invoiceNumber.split('-');
      if (parts.length === 3) {
        const parsed = parseInt(parts[2], 10);
        if (!isNaN(parsed)) {
          nextSeq = parsed + 1;
        }
      }
    }

    return `${prefix}${nextSeq.toString().padStart(5, '0')}`;
  }

  /**
   * Creates an invoice with tax line items.
   */
  public static async createInvoice(params: {
    organizationId: string;
    subscriptionId?: string;
    billingReason: BillingReason;
    periodStart: Date;
    periodEnd: Date;
    dueDate?: Date;
    lineItems: { description: string; quantity: number; unitPrice: number; proration?: boolean }[];
    currency?: string;
  }): Promise<InvoiceDTO> {
    const org = await prisma.organization.findUnique({
      where: { id: params.organizationId },
    });

    if (!org) {
      throw new Error(`Organization with ID ${params.organizationId} not found`);
    }

    let subtotal = 0;
    const itemsWithAmounts = params.lineItems.map((item) => {
      const amount = Math.round(item.quantity * item.unitPrice * 100) / 100;
      subtotal += amount;
      return { ...item, amount };
    });

    subtotal = Math.round(subtotal * 100) / 100;

    // Calculate Tax via TaxEngine
    const taxCalc = await TaxEngine.calculateTax({
      country: org.currency === 'INR' ? 'IN' : 'US',
      subtotal,
      taxId: org.taxId,
    });

    const taxTotal = taxCalc.taxAmount;
    const total = taxCalc.totalWithTax;
    const invoiceNumber = await this.generateInvoiceNumber();

    const due = params.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days default

    const invoice = await prisma.billingInvoice.create({
      data: {
        invoiceNumber,
        organizationId: params.organizationId,
        subscriptionId: params.subscriptionId || null,
        status: InvoiceStatus.FINALIZED,
        billingReason: params.billingReason,
        periodStart: params.periodStart,
        periodEnd: params.periodEnd,
        subtotal,
        taxTotal,
        discountTotal: 0,
        total,
        amountPaid: 0,
        amountRemaining: total,
        currency: params.currency || org.currency || 'USD',
        finalizedAt: new Date(),
        dueDate: due,
        lineItems: {
          create: itemsWithAmounts.map((i) => ({
            description: i.description,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            amount: i.amount,
            proration: i.proration || false,
            taxAmount: Math.round((i.amount / (subtotal || 1)) * taxTotal * 100) / 100,
          })),
        },
      },
      include: {
        lineItems: true,
      },
    });

    return this.mapToDTO(invoice);
  }

  /**
   * Marks an invoice as PAID upon successful payment capture.
   */
  public static async markInvoicePaid(invoiceId: string, gatewayPaymentId: string): Promise<InvoiceDTO> {
    const inv = await prisma.billingInvoice.findUnique({
      where: { id: invoiceId },
    });
    if (!inv) throw new Error('Invoice not found');

    const updated = await prisma.billingInvoice.update({
      where: { id: invoiceId },
      data: {
        status: InvoiceStatus.PAID,
        amountPaid: inv.total,
        amountRemaining: 0,
        gatewayPaymentId,
        paidAt: new Date(),
      },
      include: { lineItems: true },
    });

    return this.mapToDTO(updated);
  }

  /**
   * Retrieves invoices for an organization.
   */
  public static async getOrganizationInvoices(organizationId: string): Promise<InvoiceDTO[]> {
    const invoices = await prisma.billingInvoice.findMany({
      where: { organizationId },
      include: { lineItems: true },
      orderBy: { createdAt: 'desc' },
    });

    return invoices.map((inv) => this.mapToDTO(inv));
  }

  /**
   * Retrieves single invoice by ID with items.
   */
  public static async getInvoiceById(invoiceId: string): Promise<InvoiceDTO | null> {
    const invoice = await prisma.billingInvoice.findUnique({
      where: { id: invoiceId },
      include: { lineItems: true },
    });

    return invoice ? this.mapToDTO(invoice) : null;
  }

  private static mapToDTO(inv: any): InvoiceDTO {
    return {
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      organizationId: inv.organizationId,
      subscriptionId: inv.subscriptionId,
      status: inv.status as InvoiceStatus,
      billingReason: inv.billingReason as BillingReason,
      periodStart: inv.periodStart.toISOString(),
      periodEnd: inv.periodEnd.toISOString(),
      subtotal: Number(inv.subtotal),
      taxTotal: Number(inv.taxTotal),
      discountTotal: Number(inv.discountTotal),
      total: Number(inv.total),
      amountPaid: Number(inv.amountPaid),
      amountRemaining: Number(inv.amountRemaining),
      currency: inv.currency,
      gatewayPaymentId: inv.gatewayPaymentId,
      pdfUrl: inv.pdfUrl,
      finalizedAt: inv.finalizedAt ? inv.finalizedAt.toISOString() : null,
      paidAt: inv.paidAt ? inv.paidAt.toISOString() : null,
      dueDate: inv.dueDate.toISOString(),
      lineItems: inv.lineItems.map((item: any) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        amount: Number(item.amount),
        proration: item.proration,
        taxAmount: Number(item.taxAmount),
      })),
    };
  }
}
