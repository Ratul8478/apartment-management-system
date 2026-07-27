'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Lock, Mail, User, ArrowRight, ShieldCheck, CheckCircle2, UserPlus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'ANALYST' | 'FINANCE_MANAGER' | 'AUDITOR'>('ANALYST');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(pass)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(pass)) return 'Password must contain at least one lowercase letter.';
    if (!/\d/.test(pass)) return 'Password must contain at least one number.';
    if (!/[^A-Za-z0-9]/.test(pass)) return 'Password must contain at least one special character.';
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        if (data.errors && typeof data.errors === 'object') {
          const firstField = Object.keys(data.errors)[0];
          const fieldErrs = data.errors[firstField];
          const firstErr = Array.isArray(fieldErrs) ? fieldErrs[0] : fieldErrs;
          setError(firstErr || data.message || `Registration failed (Status ${res.status}).`);
        } else {
          setError(data.message || `Registration failed (Status ${res.status}).`);
        }
      } else {
        setSuccessMsg('✅ Registration successful! Real-time confirmation message dispatched to your email. Redirecting directly to Executive Dashboard...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 800);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication service error during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-office-canvas flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-900">
      {/* Ambient Office Spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-8 space-y-6 relative z-10 overflow-hidden text-slate-900">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] absolute top-0 left-0 right-0" />

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] text-white shadow-md shadow-blue-950/30 mb-2 ring-2 ring-blue-400/30">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gradient-navy tracking-tight">Candidate & Employee Registration</h1>
          <p className="text-xs font-semibold text-slate-500">
            FinTrack Pro Enterprise Onboarding Portal
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 text-rose-700 text-xs rounded-2xl border border-rose-200 flex items-center gap-2 font-bold leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center gap-2 font-bold leading-relaxed">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-11 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition-all shadow-xs placeholder-slate-400"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">
              Corporate / Personal Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@company.com"
                className="w-full h-11 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition-all shadow-xs placeholder-slate-400"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">
              Position / Initial Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full h-11 px-3.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition-all shadow-xs"
            >
              <option value="ANALYST">Candidate / Finance Analyst</option>
              <option value="FINANCE_MANAGER">Finance Manager</option>
              <option value="AUDITOR">Auditor (Read Only)</option>
            </select>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                Password
              </label>
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

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition-all shadow-xs placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 font-mono">
            * Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char (@$!%*?&)
          </p>

          <Button type="submit" isLoading={isLoading} className="w-full h-11 text-xs font-extrabold rounded-full mt-2 shadow-md shadow-blue-950/20">
            Create Candidate Account <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-extrabold text-blue-900 hover:text-blue-700 transition-colors underline">
              Sign In to Executive Dashboard
            </Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
          <span>SOC2 Type II Encrypted | Role-Based Access</span>
        </div>
      </div>
    </div>
  );
}
