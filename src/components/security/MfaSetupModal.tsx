'use client';

import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, KeyRound, Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MfaSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MfaSetupModal({ isOpen, onClose, onSuccess }: MfaSetupModalProps) {
  const [step, setStep] = useState<'INITIAL' | 'SCAN' | 'BACKUP'>('INITIAL');
  const [secret, setSecret] = useState('');
  const [otpAuthUrl, setOtpAuthUrl] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const startSetup = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/mfa/setup', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize MFA setup');

      setSecret(data.secret);
      setOtpAuthUrl(data.otpAuthUrl);
      setBackupCodes(data.backupCodes || []);
      setStep('SCAN');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Verification failed');

      setStep('BACKUP');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-navy-700 p-6 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary dark:text-white">
              Two-Factor Authentication (2FA / TOTP)
            </h3>
            <p className="text-xs text-text-secondary dark:text-slate-400">
              Mandatory security layer for Super Admin, Admin & CFO roles
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs rounded-xl border border-rose-500/20 text-center font-semibold">
            {error}
          </div>
        )}

        {step === 'INITIAL' && (
          <div className="space-y-4 text-center py-4">
            <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
            <p className="text-sm text-text-secondary dark:text-slate-300 leading-relaxed">
              Protect your finance account using Google Authenticator, Microsoft Authenticator, or 1Password.
            </p>
            <Button onClick={startSetup} isLoading={isLoading} className="w-full h-11 text-sm font-bold rounded-xl">
              Begin 2FA Setup
            </Button>
          </div>
        )}

        {step === 'SCAN' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-navy-950 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-3">
              <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 uppercase tracking-wider">
                1. Authenticator Secret Key
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold select-all overflow-x-auto">
                  {secret}
                </code>
                <button
                  type="button"
                  onClick={copySecret}
                  className="px-3 py-2.5 bg-slate-200 dark:bg-navy-800 hover:bg-slate-300 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Enter this key manually into Google Authenticator or scan using app.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary dark:text-slate-300 uppercase tracking-wider">
                2. Enter 6-Digit Code from Authenticator App
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="123456"
                  className="w-full h-11 pl-10 pr-3.5 text-sm bg-slate-50/80 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 rounded-xl text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-mono tracking-widest text-center"
                />
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full h-11 text-sm font-bold rounded-xl">
              Verify & Activate 2FA
            </Button>
          </form>
        )}

        {step === 'BACKUP' && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-1" />
              <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Two-Factor Authentication Enabled!
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Save these emergency recovery codes in a safe place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-navy-950 rounded-xl font-mono text-xs text-center text-text-primary dark:text-slate-200">
              {backupCodes.map((c, i) => (
                <div key={i} className="p-1.5 bg-white dark:bg-navy-900 rounded border border-slate-200 dark:border-navy-800">
                  {c}
                </div>
              ))}
            </div>

            <Button onClick={onClose} className="w-full h-11 text-sm font-bold rounded-xl">
              Done & Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
