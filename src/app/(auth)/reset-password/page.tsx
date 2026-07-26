'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-navy-700 p-8 space-y-6">
        <div>
          <Link href="/login" className="inline-flex items-center gap-1 text-xs text-brand-blue hover:underline mb-4 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
          <h2 className="text-xl font-bold text-text-primary dark:text-white">Reset Password</h2>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
            Enter your corporate email address to receive password reset instructions.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
              Reset Link Sent!
            </p>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
              If an account exists for {email}, a password reset link has been dispatched to your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 uppercase tracking-wider">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@company.com"
                  className="w-full h-10 pl-9 pr-3 text-sm bg-white dark:bg-navy-900 border border-surface-border dark:border-navy-700 rounded-lg text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Send Password Reset Link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
