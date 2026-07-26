'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FilePlus,
  Users,
  TrendingUp,
  FileSpreadsheet,
  Sparkles,
  Bot,
  ShieldAlert,
  Shield,
  ChevronLeft,
  ChevronRight,
  Building2,
  Zap,
  CreditCard,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface SidebarProps {
  userRole?: string;
}

export function Sidebar({ userRole = 'ANALYST' }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  const navGroups = [
    {
      title: 'CORE PLATFORM',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Customer Ops & CX', href: '/customer-ops', icon: Target, badge: 'OPS' },
        { label: 'Billing & Revenue', href: '/billing', icon: CreditCard, badge: 'SAAS' },
        { label: 'Financial Entry', href: '/data-entry', icon: FilePlus },
        { label: 'Employee Directory', href: '/employees', icon: Users },
      ],
    },
    {
      title: 'INTELLIGENCE & AI',
      items: [
        { label: 'Analytics & Insights', href: '/suggestions', icon: Sparkles, badge: 'AI' },
        { label: 'AI Assistant', href: '/ai-chat', icon: Bot, badge: 'PRO' },
        { label: 'Performance Tracker', href: '/performance', icon: Sparkles },
      ],
    },
    {
      title: 'STUDIO & REPORTS',
      items: [
        { label: 'Share Value Tracker', href: '/share-value', icon: TrendingUp },
        { label: 'Reports Studio', href: '/reports', icon: FileSpreadsheet },
        { label: 'Onboarding Setup', href: '/onboarding', icon: Zap },
      ],
    },
  ];

  if (isAdmin) {
    navGroups.push({
      title: 'ADMINISTRATION',
      items: [
        { label: 'Admin Panel', href: '/admin/users', icon: ShieldAlert },
        { label: 'System Audit Log', href: '/admin/audit-log', icon: Shield },
      ],
    });
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] text-slate-100 transition-all duration-300 z-30 border-r border-slate-800 shadow-2xl flex-shrink-0 font-sans',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-slate-800 bg-[#0B1120]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] text-white shadow-md shadow-blue-950/50 font-bold text-lg flex-shrink-0 ring-2 ring-blue-400/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-black text-base tracking-wide text-white font-sans">FinTrack Pro</span>
              <span className="text-[10px] text-blue-300 font-mono tracking-widest font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping inline-block" />
                EXECUTIVE SUITE
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto custom-scrollbar">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                {group.title}
              </h3>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group relative',
                    isActive
                      ? 'bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] border border-blue-500/40 text-white shadow-md shadow-blue-950/50 font-black'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-400 rounded-r-full shadow-sm" />
                  )}
                  <Icon className={cn('w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-blue-200' : 'text-slate-400 group-hover:text-blue-400')} />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <Badge variant="blue" size="sm" className="text-[10px] py-0.5 px-2 bg-blue-500/20 text-blue-300 border-blue-400/30 font-bold rounded-full">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Role Indicator Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800 bg-[#0B1120]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">Session Role</span>
            </div>
            <span className="text-[11px] font-bold text-blue-300 bg-blue-900/40 border border-blue-700/50 px-2.5 py-0.5 rounded-full shadow-inner">
              {userRole}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}



