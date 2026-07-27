import { NextRequest, NextResponse } from 'next/server';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';
import { blackBoxAIOrchestrator } from '@/server/ai/blackbox/orchestrator';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'FINANCE_MANAGER', 'ANALYST', 'ADMIN'],
      rateLimitKey: 'ai-chat',
      maxRequests: 30,
      windowMs: 60000,
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const body = await req.json();
    const { question, sessionId } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question string required' }, { status: 400 });
    }

    // Execute request through Black Box AI Engine (Hides internal prompts, memory, planning agents)
    const userObj = authResult.user as any;
    const aiResult = await blackBoxAIOrchestrator.processRequest({
      tenant: {
        organizationId: userObj.organizationId || 'default-org',
        userId: userObj.id,
        userRole: userObj.role as any,
      },
      question,
      sessionId,
    });


    const disclaimer = "\n\n*Powered by Google Gemini Real-Time LLM — Grounded strictly in company financial records.*";
    const finalAnswer = aiResult.answer.endsWith(disclaimer) ? aiResult.answer : aiResult.answer + disclaimer;

    return NextResponse.json({
      answer: finalAnswer,
      provider: aiResult.provider,
      isEstimate: aiResult.isEstimate,
      suggestedCharts: aiResult.suggestedVisualizations,
      recommendations: aiResult.recommendations,
    });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'AI_CHAT');
  }
}
