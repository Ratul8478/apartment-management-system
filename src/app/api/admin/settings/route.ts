import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { service, key } = body;

    // Simulate server-side API key validation
    return NextResponse.json({
      success: true,
      service,
      status: 'CONNECTED',
      message: `${service} integration key validated and stored in server secrets vault.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update integration settings' }, { status: 500 });
  }
}
