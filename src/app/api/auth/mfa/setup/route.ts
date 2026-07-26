import { NextRequest, NextResponse } from 'next/server';
import { mfa } from '@/lib/security/mfa';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req);
    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const userId = authResult.user!.id;
    const email = authResult.user!.email;

    const secret = mfa.generateSecret();
    const otpAuthUrl = mfa.generateOtpAuthUrl(secret, email);
    const backupCodes = mfa.generateBackupCodes();

    // Store pending secret in DB
    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaSecret: secret,
        mfaBackupCodes: JSON.stringify(backupCodes),
      },
    });

    return NextResponse.json({
      success: true,
      secret,
      otpAuthUrl,
      backupCodes,
    });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'MFA_SETUP');
  }
}
