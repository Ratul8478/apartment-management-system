import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/server/modules/auth/controllers/auth.controller";
import { prisma } from "@/lib/prisma";
import { syncUserRealtimeAuth } from "@/lib/firebase/authSync";

const controller = new AuthController();

export async function POST(req: NextRequest) {
  return controller.handleVerifyEmail(req);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (token && email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isActive: true },
        });

        // Sync verified state to Firebase Realtime Database
        await syncUserRealtimeAuth({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          organizationId: user.organizationId,
          isVerified: true,
        });
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/dashboard?emailVerified=true`);
  } catch (error) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/dashboard?emailVerified=true`);
  }
}

