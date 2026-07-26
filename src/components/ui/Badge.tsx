import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'blue' | 'green' | 'red' | 'amber' | 'violet' | 'gray';
  size?: 'sm' | 'md';
}

export function Badge({ className, variant = 'blue', size = 'sm', children, ...props }: BadgeProps) {
  const variants = {
    blue: 'bg-blue-50/90 text-blue-700 border-blue-200/80 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800/80 shadow-2xs',
    green: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/80 shadow-2xs',
    red: 'bg-rose-50/90 text-rose-700 border-rose-200/80 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/80 shadow-2xs',
    amber: 'bg-amber-50/90 text-amber-800 border-amber-200/80 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/80 shadow-2xs',
    violet: 'bg-purple-50/90 text-purple-700 border-purple-200/80 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800/80 shadow-2xs',
    gray: 'bg-slate-100/90 text-slate-700 border-slate-200/80 dark:bg-navy-800 dark:text-slate-300 dark:border-navy-700 shadow-2xs',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase',
    md: 'px-3 py-1 text-xs font-semibold tracking-wide uppercase',
  };

  return (
    <span
      className={cn('inline-flex items-center rounded-full border transition-colors', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
