import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { InvoiceService } from '@/server/services/invoiceService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) return authResult.response!;

    const user = await prisma.user.findUnique({
      where: { id: authResult.user!.id },
      select: { organizationId: true },
    });
    const defaultOrg = await prisma.organization.findFirst();
    const orgId = user?.organizationId || defaultOrg?.id;

    if (!orgId) throw new Error('No organization found');

    const invoices = await InvoiceService.getOrganizationInvoices(orgId);
    return NextResponse.json({ success: true, data: invoices });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_BILLING_INVOICES');
  }
}
