'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ArrowRight } from 'lucide-react';

interface LandingHeaderProps {
  onOpenModal: (modal: 'DEMO' | 'CREATE_ORG' | 'CONSULTATION' | 'WATCH_DEMO' | 'CONTACT_SALES') => void;
}

export function LandingHeader({ onOpenModal }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              FinTrack <span className="text-sky-400">Pro</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Enterprise Finance OS
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-sky-400 transition-colors">Features</a>
          <a href="#benefits" className="hover:text-sky-400 transition-colors">Benefits</a>
          <a href="#how-it-works" className="hover:text-sky-400 transition-colors">How It Works</a>
          <a href="#preview" className="hover:text-sky-400 transition-colors">Dashboard Preview</a>
          <a href="#testimonials" className="hover:text-sky-400 transition-colors">Testimonials</a>
          <a href="#security" className="hover:text-sky-400 transition-colors">Security</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenModal('CONTACT_SALES')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-sky-400 transition-colors"
          >
            Contact Sales
          </button>
          <Link
            href="/login"
            className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-3.5 py-2 text-sm font-semibold text-sky-400 border border-sky-500/30 hover:border-sky-400 hover:bg-sky-500/10 rounded-xl transition-all"
          >
            Register
          </Link>
          <button
            onClick={() => onOpenModal('CREATE_ORG')}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white hover:opacity-95 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            Create Organization <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
