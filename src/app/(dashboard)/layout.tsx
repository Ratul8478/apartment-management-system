'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Bot, X, Sparkles } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { AiChatWidget } from '@/components/ai/AiChatWidget';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAiFloatingOpen, setIsAiFloatingOpen] = useState(false);

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
  }

  const userRole = (session?.user as any)?.role || 'ADMIN';

  return (
    <div className="flex h-screen bg-office-canvas text-slate-900 overflow-hidden relative font-sans">
      {/* Sidebar */}
      <Sidebar userRole={userRole} />

      {/* Main Wrapper with Padding for Floating Deck Effect */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden p-2 sm:p-3 lg:p-4">
        {/* Floating Executive Deck Container */}
        <div className="flex-1 flex flex-col rounded-3xl floating-deck overflow-hidden shadow-xl relative border border-slate-300/80 bg-white/98">
          {/* Topbar integrated into deck header */}
          <Topbar user={session?.user} />

          {/* Page Body Viewport inside Floating Card */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>
      </div>

      {/* Floating AI Assistant Trigger Button & Drawer */}
      <div className="fixed bottom-6 right-8 z-50">
        {isAiFloatingOpen ? (
          <div className="w-[420px] shadow-2xl rounded-3xl overflow-hidden border border-blue-300 bg-white/98 backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-200 text-slate-900">
            <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] text-white text-xs border-b border-blue-800/30">
              <span className="font-extrabold tracking-wide flex items-center gap-2 text-white">
                <Bot className="w-4 h-4 text-blue-200 animate-pulse" />
                <span>Executive Office AI Studio</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-mono">v5.5</span>
              </span>
              <button
                onClick={() => setIsAiFloatingOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-[520px]">
              <AiChatWidget />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAiFloatingOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#2563EB] hover:from-[#1E347B] hover:to-[#1D4ED8] text-white text-xs font-extrabold rounded-full shadow-lg shadow-blue-950/30 hover:scale-105 active:scale-95 transition-all group ring-4 ring-blue-900/10"
            title="Ask Executive AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide">Executive AI</span>
            <span className="w-2 h-2 rounded-full bg-blue-300 animate-ping" />
          </button>
        )}
      </div>
    </div>
  );
}








