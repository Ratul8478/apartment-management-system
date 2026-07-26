import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, adminName, adminEmail, password, baseCurrency, teamInvites } = body;

    if (!companyName || !adminEmail || !password || !adminName) {
      return NextResponse.json({ error: 'Company name, admin name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create Admin User
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail.toLowerCase(),
        fullName: adminName,
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
    });

    // Create Employee record for Admin
    await prisma.employee.create({
      data: {
        fullName: adminName,
        designation: 'Finance Administrator',
        department: 'Finance Leadership',
        email: adminEmail.toLowerCase(),
        phone: '+91 98765 00000',
        linkedUserId: adminUser.id,
      },
    });

    // Process team invites if provided
    if (teamInvites && Array.isArray(teamInvites) && teamInvites.length > 0) {
      for (const invite of teamInvites) {
        if (invite.email && invite.fullName) {
          try {
            await prisma.employee.create({
              data: {
                fullName: invite.fullName,
                designation: invite.role === 'FINANCE_MANAGER' ? 'Finance Manager' : 'Financial Analyst',
                department: 'Finance',
                email: invite.email,
                phone: '+91 98765 00000',
              },
            });
          } catch (e) {
            console.warn('Failed to create invited employee:', e);
          }
        }
      }
    }

    // Log Audit Event
    await prisma.auditLog.create({
      data: {
        actorUserId: adminUser.id,
        action: 'CREATE_ORGANIZATION',
        targetTable: 'users',
        targetId: adminUser.id,
        metadata: JSON.stringify({ companyName, baseCurrency: baseCurrency || 'INR', invitedMembersCount: teamInvites?.length || 0 }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Organization created successfully',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        fullName: adminUser.fullName,
        role: adminUser.role,
      },
      redirectTo: '/onboarding',
    });
  } catch (error: any) {
    console.error('Organization creation funnel error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create organization' }, { status: 500 });
  }
}
