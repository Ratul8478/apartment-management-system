import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full h-10 px-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 shadow-xs',
            error
              ? 'border-rose-500 text-rose-600 focus:border-rose-500'
              : 'border-slate-300 text-slate-900 focus:border-blue-600',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';







