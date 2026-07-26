import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/server/services/userService';
import { auditService } from '@/server/services/auditService';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { validatePassword } from '@/lib/security/passwordPolicy';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const users = await userService.getUsers();
    const auditLogs = await auditService.getAuditLogs(
      authResult.user!.role,
      authResult.user!.id,
      { limit: 50 }
    );

    return NextResponse.json({ users, auditLogs });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_ADMIN_USERS');
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const body = await req.json();
    const actorId = authResult.user!.id;
    const actorRole = authResult.user!.role;

    // Password Policy Check
    const passwordCheck = validatePassword(body.password);
    if (!passwordCheck.isValid) {
      return NextResponse.json({ error: passwordCheck.error }, { status: 400 });
    }

    // Role Hierarchy Check: ADMIN cannot create SUPER_ADMIN accounts
    const targetRole = body.role || 'ANALYST';
    if (targetRole === 'SUPER_ADMIN' && actorRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admin can create Super Admin accounts.' },
        { status: 403 }
      );
    }

    const user = await userService.createUser(
      {
        fullName: body.fullName,
        email: body.email.toLowerCase(),
        password: body.password,
        role: targetRole,
      },
      actorId
    );

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'CREATE_ADMIN_USER');
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const body = await req.json();
    const { userId, isActive, role: updatedRole } = body;
    const actorId = authResult.user!.id;
    const actorRole = authResult.user!.role;

    // Role Hierarchy Check
    if (updatedRole === 'SUPER_ADMIN' && actorRole !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admin can assign Super Admin role.' },
        { status: 403 }
      );
    }

    const user = await userService.updateUserStatus(userId, isActive, actorId);

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'UPDATE_USER_STATUS');
  }
}
