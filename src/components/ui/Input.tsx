import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full h-10 px-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 shadow-xs placeholder-slate-400',
            error
              ? 'border-rose-500 text-rose-600 focus:border-rose-500'
              : 'border-slate-300 text-slate-900 focus:border-blue-600',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';







