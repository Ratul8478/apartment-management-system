import pptxgen from 'pptxgenjs';

export interface PptExportOptions {
  title: string;
  subtitle?: string;
  templateId?: string;
  metrics: {
    turnover: number;
    profitLoss: number;
    cost: number;
  };
  records: Array<{
    recordDate: string | Date;
    metricType: string;
    amount: number;
    currency: string;
    notes?: string | null;
  }>;
}

export async function generatePptPresentation(options: PptExportOptions): Promise<Buffer> {
  const pptx = new pptxgen();

  // Set Presentation Properties
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'FinTrack Pro Engine';
  pptx.company = 'FinTrack Pro';
  pptx.title = options.title;

  // Slide 1: Title Slide
  const slide1 = pptx.addSlide();
  slide1.background = { color: '0F172A' };

  slide1.addText('FinTrack Pro Executive Briefing', {
    x: 0.8,
    y: 1.8,
    w: '80%',
    h: 1.0,
    fontSize: 36,
    bold: true,
    color: '38BDF8',
    fontFace: 'Arial',
  });

  slide1.addText(options.title || 'Financial Performance Report', {
    x: 0.8,
    y: 2.8,
    w: '80%',
    h: 0.8,
    fontSize: 22,
    color: 'F8FAFC',
    fontFace: 'Arial',
  });

  slide1.addText(`Generated on: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}`, {
    x: 0.8,
    y: 4.5,
    w: '80%',
    h: 0.5,
    fontSize: 14,
    color: '94A3B8',
    fontFace: 'Arial',
  });

  // Slide 2: KPI Summary Overview
  const slide2 = pptx.addSlide();
  slide2.addText('Key Financial Indicators', {
    x: 0.8,
    y: 0.6,
    w: '80%',
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: '0F172A',
  });

  const formatCurrency = (val: number) => `INR ${(val / 100000).toFixed(2)} Lakhs`;

  // Turnover Card
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.6,
    w: 3.6,
    h: 2.2,
    fill: { color: 'EFF6FF' },
    line: { color: '3B82F6', width: 1.5 },
  });
  slide2.addText('Total Turnover', {
    x: 1.0,
    y: 1.8,
    w: 3.2,
    h: 0.4,
    fontSize: 16,
    color: '1E40AF',
    bold: true,
  });
  slide2.addText(formatCurrency(options.metrics.turnover), {
    x: 1.0,
    y: 2.3,
    w: 3.2,
    h: 0.8,
    fontSize: 26,
    color: '1E3A8A',
    bold: true,
  });

  // Net Profit Card
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 4.8,
    y: 1.6,
    w: 3.6,
    h: 2.2,
    fill: { color: 'ECFDF5' },
    line: { color: '10B981', width: 1.5 },
  });
  slide2.addText('Net Profit / Loss', {
    x: 5.0,
    y: 1.8,
    w: 3.2,
    h: 0.4,
    fontSize: 16,
    color: '065F46',
    bold: true,
  });
  slide2.addText(formatCurrency(options.metrics.profitLoss), {
    x: 5.0,
    y: 2.3,
    w: 3.2,
    h: 0.8,
    fontSize: 26,
    color: '047857',
    bold: true,
  });

  // Cost Card
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 8.8,
    y: 1.6,
    w: 3.6,
    h: 2.2,
    fill: { color: 'FEF2F2' },
    line: { color: 'EF4444', width: 1.5 },
  });
  slide2.addText('Operational Cost', {
    x: 9.0,
    y: 1.8,
    w: 3.2,
    h: 0.4,
    fontSize: 16,
    color: '991B1B',
    bold: true,
  });
  slide2.addText(formatCurrency(options.metrics.cost), {
    x: 9.0,
    y: 2.3,
    w: 3.2,
    h: 0.8,
    fontSize: 26,
    color: 'B91C1C',
    bold: true,
  });

  // Slide 3: Finance Ledger Table
  const slide3 = pptx.addSlide();
  slide3.addText('Financial Ledger Breakdown', {
    x: 0.8,
    y: 0.6,
    w: '80%',
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: '0F172A',
  });

  const tableHeader = [
    { text: 'Date', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
    { text: 'Metric', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
    { text: 'Amount (INR)', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
    { text: 'Notes', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
  ];

  const tableRows = options.records.slice(0, 8).map((r) => [
    { text: new Date(r.recordDate).toLocaleDateString() },
    { text: r.metricType },
    { text: `₹${r.amount.toLocaleString()}` },
    { text: r.notes || '-' },
  ]);

  slide3.addTable([tableHeader, ...tableRows] as any, {
    x: 0.8,
    y: 1.5,
    w: 11.6,
    colW: [2.0, 2.5, 2.5, 4.6],
    fontSize: 12,
    border: { pt: 1, color: 'E2E8F0' },
  });

  // Generate buffer
  const buffer = (await pptx.write({ outputType: 'nodebuffer' })) as Buffer;
  return buffer;
}
