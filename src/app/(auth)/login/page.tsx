'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('superadmin@company.com');
  const [password, setPassword] = useState('password123');
  const [totpToken, setTotpToken] = useState('');
  const [showMfaInput, setShowMfaInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        totpToken: showMfaInput ? totpToken : undefined,
        redirect: false,
      });

      if (res?.error) {
        if (res.error.includes('MFA_REQUIRED')) {
          setShowMfaInput(true);
          setError('Please enter your 6-digit Authenticator 2FA code.');
        } else {
          setError(res.error || 'Incorrect email or password.');
        }
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication service error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-office-canvas flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-900">
      {/* Ambient Office Spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-8 space-y-6 relative z-10 overflow-hidden text-slate-900">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] absolute top-0 left-0 right-0" />

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] text-white shadow-md shadow-blue-950/30 mb-2 ring-2 ring-blue-400/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gradient-navy tracking-tight">FinTrack Pro</h1>
          <p className="text-xs font-semibold text-slate-500">
            Executive Corporate Office Portal
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 text-rose-700 text-xs rounded-2xl border border-rose-200 text-center font-bold leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">
              Corporate Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="w-full h-11 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition-all shadow-xs placeholder-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                Password
              </label>
              <Link href="/reset-password" className="text-xs font-bold text-blue-900 hover:text-blue-700 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition-all shadow-xs placeholder-slate-400"
              />
            </div>
          </div>

          {showMfaInput && (
            <div className="space-y-1.5 pt-1 animate-fadeIn">
              <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider">
                Authenticator 2FA Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-900" />
                <input
                  type="text"
                  maxLength={6}
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value)}
                  placeholder="123456"
                  className="w-full h-11 pl-10 pr-3.5 text-sm bg-blue-50 border border-blue-300 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 font-mono tracking-widest text-center"
                />
              </div>
            </div>
          )}

          <Button type="submit" isLoading={isLoading} className="w-full h-11 text-xs font-extrabold rounded-full mt-2 shadow-md shadow-blue-950/20">
            Sign In to Executive Dashboard <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Demo Accounts Quick Picker */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <span className="block text-[10px] text-slate-400 text-center font-mono font-bold uppercase tracking-widest">
            Quick 5-Role Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setEmail('superadmin@company.com');
                setPassword('password123');
                setShowMfaInput(false);
              }}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-[11px] font-bold rounded-full text-center transition-all col-span-2 shadow-2xs"
            >
              👑 Super Admin (Full Control)
            </button>
            <button
              onClick={() => {
                setEmail('admin@company.com');
                setPassword('password123');
                setShowMfaInput(false);
              }}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-full text-center transition-all"
            >
              Admin (IT)
            </button>
            <button
              onClick={() => {
                setEmail('cfo@company.com');
                setPassword('password123');
                setShowMfaInput(false);
              }}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-full text-center transition-all"
            >
              Finance Manager
            </button>
            <button
              onClick={() => {
                setEmail('analyst@company.com');
                setPassword('password123');
                setShowMfaInput(false);
              }}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-full text-center transition-all"
            >
              Finance Analyst
            </button>
            <button
              onClick={() => {
                setEmail('auditor@company.com');
                setPassword('password123');
                setShowMfaInput(false);
              }}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-full text-center transition-all"
            >
              Auditor (Read Only)
            </button>
          </div>
        </div>

        {/* Candidate & Employee Registration Callout */}
        <div className="pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600 font-medium">
            New employee or candidate?{' '}
            <Link href="/register" className="font-extrabold text-blue-900 hover:text-blue-700 transition-colors underline">
              Register Account Here
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
          <span>TOTP 2FA | Corporate Defense | HttpOnly Cookies</span>
        </div>
      </div>
    </div>
  );
}








