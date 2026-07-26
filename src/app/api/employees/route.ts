import { NextRequest, NextResponse } from 'next/server';
import { employeeService } from '@/server/services/employeeService';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'ANALYST'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const employees = await employeeService.getEmployees(authResult.user!.role);
    return NextResponse.json(employees);
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_EMPLOYEES');
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const body = await req.json();
    const userId = authResult.user!.id;

    const employee = await employeeService.createEmployee(
      {
        fullName: body.fullName,
        designation: body.designation || 'Financial Analyst',
        department: body.department || 'Finance',
        email: body.email,
        phone: body.phone || '+91 98765 00000',
        linkedUserId: body.linkedUserId || null,
      },
      userId
    );

    return NextResponse.json({ success: true, employee });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'CREATE_EMPLOYEE');
  }
}
