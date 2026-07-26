import Papa from 'papaparse';

export interface PowerBiDatasetRecord {
  Id: string;
  RecordDate: string;
  Year: number;
  Month: string;
  Quarter: string;
  MetricType: string;
  Amount: number;
  Currency: string;
  Source: string;
  CreatedBy: string;
  Notes: string;
}

export function buildPowerBiDataset(records: any[]): {
  csv: string;
  jsonSchema: any;
  recordsCount: number;
} {
  const formattedRecords: PowerBiDatasetRecord[] = records.map((r) => {
    const d = new Date(r.recordDate);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const quarter = `Q${Math.floor(d.getMonth() / 3) + 1}`;

    return {
      Id: r.id,
      RecordDate: d.toISOString().split('T')[0],
      Year: d.getFullYear(),
      Month: month,
      Quarter: quarter,
      MetricType: r.metricType,
      Amount: r.amount,
      Currency: r.currency || 'INR',
      Source: r.source,
      CreatedBy: r.createdBy?.fullName || r.createdById || 'System',
      Notes: r.notes || '',
    };
  });

  const csv = Papa.unparse(formattedRecords);

  const jsonSchema = {
    name: 'FinTrack_Pro_PowerBI_Dataset',
    tables: [
      {
        name: 'FinanceRecords',
        columns: [
          { name: 'Id', dataType: 'string' },
          { name: 'RecordDate', dataType: 'dateTime' },
          { name: 'Year', dataType: 'Int64' },
          { name: 'Month', dataType: 'string' },
          { name: 'Quarter', dataType: 'string' },
          { name: 'MetricType', dataType: 'string' },
          { name: 'Amount', dataType: 'Double' },
          { name: 'Currency', dataType: 'string' },
          { name: 'Source', dataType: 'string' },
          { name: 'CreatedBy', dataType: 'string' },
          { name: 'Notes', dataType: 'string' },
        ],
      },
    ],
    rows: formattedRecords,
  };

  return {
    csv,
    jsonSchema,
    recordsCount: formattedRecords.length,
  };
}
