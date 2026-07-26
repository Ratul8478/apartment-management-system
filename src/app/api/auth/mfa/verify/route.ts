import { NextRequest, NextResponse } from 'next/server';
import { mfa } from '@/lib/security/mfa';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { auditService } from '@/server/services/auditService';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const { token } = await req.json();
    const userId = authResult.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaSecret: true },
    });

    if (!user || !user.mfaSecret) {
      return NextResponse.json({ error: 'MFA setup not initiated. Please generate setup QR code first.' }, { status: 400 });
    }

    const isValid = mfa.verifyToken(token, user.mfaSecret);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid 2FA code. Please try again.' }, { status: 400 });
    }

    // Enable MFA for user
    await prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    });

    await auditService.logAction({
      actorUserId: userId,
      action: 'ENABLE_MFA',
      targetTable: 'users',
      targetId: userId,
    });

    return NextResponse.json({ success: true, message: 'Two-Factor Authentication successfully enabled!' });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'MFA_VERIFY');
  }
}
