import { NextRequest, NextResponse } from 'next/server';
import { shareService } from '@/server/services/shareService';
import { authorizeApiRequest, handleSanitizedApiError } from '@/lib/security/apiGuard';

export async function GET(req: NextRequest) {
  try {
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'ANALYST', 'AUDITOR'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const history = await shareService.getShareValues();

    const currentPrice = history.length > 0 ? Number(history[history.length - 1].price) : 640.5;
    const prevPrice = history.length > 1 ? Number(history[history.length - 2].price) : 610.0;
    const dayChange = Number((currentPrice - prevPrice).toFixed(2));
    const dayChangePercent = Number(((dayChange / prevPrice) * 100).toFixed(2));

    const peers = [
      { name: 'AlphaCorp FinTech', ticker: 'ALPH', price: 820.4, changePercent: +2.1 },
      { name: 'Beta Global Capital', ticker: 'BETA', price: 412.0, changePercent: -0.8 },
      { name: 'Gamma Financial Services', ticker: 'GAMM', price: 1150.2, changePercent: +4.3 },
    ];

    const lastUpdated = history.length > 0 ? history[history.length - 1].createdAt : new Date().toISOString();

    return NextResponse.json({
      ticker: 'FNTRK',
      companyName: 'FinTrack Pro Corporate',
      currentPrice,
      dayChange,
      dayChangePercent,
      lastUpdated: new Date(lastUpdated).toISOString(),
      isCachedFallback: false,
      statusMessage: `Live share data updated as of ${new Date(lastUpdated).toLocaleString()}`,
      history,
      peers,
    });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'GET_SHARE_VALUE');
  }
}

export async function POST(req: NextRequest) {
  try {
    // Only SUPER_ADMIN manages share price data source / API key!
    const authResult = await authorizeApiRequest(req, {
      allowedRoles: ['SUPER_ADMIN'],
    });

    if (!authResult.isAuthorized) {
      return authResult.response!;
    }

    const body = await req.json();
    const userId = authResult.user!.id;

    const record = await shareService.addShareValue(
      {
        price: parseFloat(body.price),
        recordDate: body.recordDate ? new Date(body.recordDate) : new Date(),
        currency: body.currency || 'INR',
        source: body.source || 'MANUAL',
      },
      userId
    );

    return NextResponse.json({ success: true, share: record });
  } catch (error: any) {
    return handleSanitizedApiError(error, 'CREATE_SHARE_VALUE');
  }
}
