import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-extrabold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-800/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 rounded-full';

    const variants = {
      primary: 'bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] hover:from-[#1E347B] hover:to-[#1D4ED8] text-white shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 border border-blue-400/20',
      secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300/80 shadow-2xs',
      destructive: 'bg-gradient-to-r from-rose-700 to-red-700 hover:from-rose-600 hover:to-red-600 text-white shadow-md shadow-rose-900/20',
      outline: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-2xs',
      ghost: 'bg-transparent text-blue-900 hover:bg-blue-50',
    };

    const sizes = {
      sm: 'h-8 px-3.5 text-xs',
      md: 'h-10 px-5 text-xs tracking-wide',
      lg: 'h-12 px-7 text-sm tracking-wide',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';



