import { NextRequest, NextResponse } from 'next/server';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { InvoiceService } from '@/server/services/invoiceService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const invoice = await InvoiceService.getInvoiceById(params.id);
    if (!invoice) {
      return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: invoice });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_BILLING_INVOICE_BY_ID');
  }
}
