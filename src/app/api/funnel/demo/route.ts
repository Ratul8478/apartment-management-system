import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, companySize, role, type } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    console.log(`[Funnel Request] ${type || 'Demo Request'}:`, {
      name,
      email,
      company: company || 'N/A',
      companySize: companySize || 'N/A',
      role: role || 'N/A',
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Request received successfully! Our enterprise finance team will reach out within 2 hours.',
      submissionId: `sub_${Date.now()}`,
    });
  } catch (error: any) {
    console.error('Funnel demo request error:', error);
    return NextResponse.json({ error: 'Failed to record demo request' }, { status: 500 });
  }
}
