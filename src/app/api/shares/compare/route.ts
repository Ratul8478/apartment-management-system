import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tickers = searchParams.get('tickers')?.split(',') || ['ALPH', 'BETA', 'GAMM'];

    const peerData = tickers.map((t) => ({
      ticker: t.toUpperCase(),
      name: `${t.toUpperCase()} Corp Financial`,
      currentPrice: Number((Math.random() * 800 + 200).toFixed(2)),
      changePercent: Number((Math.random() * 8 - 3).toFixed(2)),
      volume: Math.floor(Math.random() * 500000) + 50000,
    }));

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      peers: peerData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to compare share prices' }, { status: 500 });
  }
}
