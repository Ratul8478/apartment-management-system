'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { Bell, Search, LogOut, Calendar, ShieldCheck } from 'lucide-react';
import { getRoleBadgeColor } from '@/lib/utils';

interface TopbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function Topbar({ user }: TopbarProps) {
  const role = user?.role || 'ANALYST';
  const roleBadgeStyle = getRoleBadgeColor(role);

  return (
    <header className="h-16 px-6 bg-white/95 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between z-20 sticky top-0 shadow-2xs font-sans text-slate-900">
      {/* Left: Quick Search with Command Pill */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search records, analytics, audit logs..."
            className="w-full h-9 pl-9 pr-14 text-xs bg-slate-100 border border-slate-200 rounded-full text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition-all shadow-inner"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-500 bg-slate-200 border border-slate-300 rounded-md">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Period Badge, Notifications, User Profile & Actions */}
      <div className="flex items-center gap-4">
        {/* Reporting Period Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-900 font-bold">
          <Calendar className="w-3.5 h-3.5 text-blue-800" />
          <span>July 2026</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-800" />
          <span className="text-[11px] text-slate-500 font-normal">Q3 Active</span>
        </div>

        {/* System Intelligence Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Executive Secured</span>
        </div>

        {/* Notifications Icon */}
        <button
          className="relative p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-700 rounded-full ring-2 ring-white animate-pulse" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-950/20 ring-2 ring-blue-400/30">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-extrabold text-slate-900 truncate max-w-[120px]">
              {user?.name || 'Finance User'}
            </span>
            <span className={roleBadgeStyle.text + ' text-[10px] font-mono font-bold'}>
              {role}
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 ml-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}








