import { NextRequest, NextResponse } from 'next/server';
import { employeeService } from '@/server/services/employeeService';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const body = await req.json();
    const updated = await employeeService.updateEmployee(params.id, body, authResult.user!.id);

    return NextResponse.json({ success: true, employee: updated });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'UPDATE_EMPLOYEE');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    await employeeService.deleteEmployee(params.id, authResult.user!.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'DELETE_EMPLOYEE');
  }
}
