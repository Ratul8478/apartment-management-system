import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formatted = '';
  if (currency === 'INR') {
    // Format in Lakhs / Crores or standard Indian comma numbering
    if (absAmount >= 10000000) {
      formatted = `₹${(absAmount / 10000000).toFixed(2)} Cr`;
    } else if (absAmount >= 100000) {
      formatted = `₹${(absAmount / 100000).toFixed(2)} L`;
    } else {
      formatted = `₹${absAmount.toLocaleString('en-IN')}`;
    }
  } else {
    formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(absAmount);
  }

  return isNegative ? `-${formatted}` : formatted;
}

export function formatFullCurrency(amount: number, currency: string = 'INR'): string {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatPercentage(val: number): string {
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
}

export function getRoleBadgeColor(role: string): { bg: string; text: string } {
  switch (role) {
    case 'SUPER_ADMIN':
      return { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-800 dark:text-purple-300' };
    case 'ADMIN':
      return { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-800 dark:text-blue-300' };
    case 'FINANCE_MANAGER':
      return { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-800 dark:text-emerald-300' };
    case 'ANALYST':
      return { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-800 dark:text-indigo-300' };
    default:
      return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-800 dark:text-gray-300' };
  }
}
