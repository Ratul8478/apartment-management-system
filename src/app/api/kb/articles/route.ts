import { NextRequest, NextResponse } from 'next/server';
import { KnowledgeService } from '@/server/services/knowledgeService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || undefined;
    const category = searchParams.get('category') || undefined;

    const articles = await KnowledgeService.searchArticles({ query, category });
    return NextResponse.json({ success: true, data: articles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
