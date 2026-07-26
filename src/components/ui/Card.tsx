import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  darkTheme?: boolean;
}

export function Card({ className, darkTheme, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border transition-all duration-300 overflow-hidden relative',
        darkTheme
          ? 'bg-slate-900 text-white border-slate-800 shadow-xl'
          : 'bg-white text-slate-900 border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-400/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pb-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50', className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-black tracking-tight text-slate-900 flex items-center gap-2', className)} {...props}>{children}</h3>;
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props}>{children}</div>;
}








