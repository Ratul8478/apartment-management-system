import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { financeService } from '@/server/services/financeService';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role === 'AUDITOR') {
      return NextResponse.json({ error: 'Forbidden: Auditor role is read-only' }, { status: 403 });
    }

    const body = await req.json();
    const { records, filename } = body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'No valid records array provided' }, { status: 400 });
    }

    const userId = (session.user as any).id;

    const result = await financeService.importCsv(records, userId, filename);

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${result.count} financial records`,
      count: result.count,
    });
  } catch (error: any) {
    console.error('CSV upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process CSV upload' }, { status: 500 });
  }
}
