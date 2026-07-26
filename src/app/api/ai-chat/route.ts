import { NextRequest, NextResponse } from 'next/server';
import { askGeminiFinanceAssistant } from '@/lib/ai/geminiClient';
import { financeService } from '@/server/services/financeService';
import { shareService } from '@/server/services/shareService';
import { prisma } from '@/lib/prisma';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';

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
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question string required' }, { status: 400 });
    }

    const role = authResult.user!.role;

    // Security check against prompt injection requesting salary/payroll data if role is ANALYST/ADMIN
    const lowerQ = question.toLowerCase();
    if ((role === 'ANALYST' || role === 'ADMIN') && (lowerQ.includes('salary') || lowerQ.includes('compensation') || lowerQ.includes('payroll'))) {
      return NextResponse.json({
        answer: "You don't have permission to view confidential employee compensation data via the Gemini AI assistant.",
        provider: 'Gemini Security Policy',
        isEstimate: false,
      });
    }

    const metrics = await financeService.getAggregatedMetrics();
    const recentRecords = await financeService.getRecords({ limit: 10 } as any);
    const shareValues = await shareService.getShareValues();

    const geminiResult = await askGeminiFinanceAssistant({
      question,
      context: {
        userRole: role,
        turnover: metrics.turnover,
        profitLoss: metrics.profitLoss,
        cost: metrics.cost,
        totalRecords: metrics.totalRecords,
        recentRecords: recentRecords.slice(0, 10),
        shareValues: shareValues.slice(-5),
      },
    });

    const disclaimer = "\n\n*Powered by Google Gemini Real-Time LLM — Grounded strictly in company financial records.*";
    const answer = geminiResult.answer + disclaimer;

    // Save AI chat log to DB
    const userId = authResult.user!.id;
    try {
      await prisma.aiChatLog.create({
        data: {
          userId,
          question,
          answer,
        },
      });
    } catch (e) {
      console.warn('Failed to save AI chat log:', e);
    }

    return NextResponse.json({
      answer,
      provider: geminiResult.provider,
      isEstimate: geminiResult.isEstimate,
      suggestedCharts: geminiResult.suggestedCharts,
    });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'AI_CHAT');
  }
}
