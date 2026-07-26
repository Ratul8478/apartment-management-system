export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'FINANCE_MANAGER' | 'ANALYST' | 'AUDITOR';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export type MetricType = 'TURNOVER' | 'PROFIT_LOSS' | 'COST';

export type TimeRange = 'daily' | 'monthly' | 'yearly';

export interface FinanceRecordItem {
  id: string;
  recordDate: string;
  metricType: MetricType;
  amount: number;
  currency: string;
  notes?: string | null;
  source: string;
  createdById: string;
  createdAt: string;
}

export type FinanceRecord = FinanceRecordItem;

export interface ChartBucket {
  period: string;
  turnover: number;
  profit: number;
  cost: number;
  netMargin: number;
}

export interface KpiSummary {
  totalTurnover: number;
  totalProfit: number;
  growthPercent: number;
  netMarginPercent: number;
  activeEmployeeCount: number;
  currentSharePrice: number;
  sharePriceChange: number;
}

export interface EmployeeItem {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  linkedUserId?: string | null;
  createdAt: string;
}

export interface ShareValueItem {
  id: string;
  recordDate: string;
  price: number;
  currency: string;
  source: string;
}

export interface ReportItem {
  id: string;
  reportType: 'POWER_BI' | 'PRESENTATION';
  templateId: string;
  fileUrl?: string | null;
  dateRangeStart?: string | null;
  dateRangeEnd?: string | null;
  generatedById: string;
  createdAt: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedCharts?: {
    type: 'bar' | 'pie';
    title: string;
    data: { label: string; value: number }[];
  }[];
  timestamp: string;
}

export interface AuditLogItem {
  id: string;
  actorUserId: string;
  actorName?: string;
  action: string;
  targetTable: string;
  targetId?: string | null;
  metadata?: string | null;
  createdAt: string;
}
