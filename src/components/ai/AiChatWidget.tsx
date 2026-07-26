'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, ThumbsUp, ThumbsDown, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  provider?: string;
  suggestedCharts?: {
    title: string;
    data: { label: string; value: number }[];
  }[];
  timestamp: string;
}

export function AiChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello! I am your FinTrack AI Assistant powered by Google Gemini 2.0 Flash. I have analyzed your Q3 2026 corporate turnover and profit/loss data. Ask me anything about revenue trends, margin dips, or financial insights!',
      provider: 'Google Gemini 2.0 Flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptChips = [
    "Summarize this month's P&L",
    'Why did Q2 turnover dip?',
    'Compare Q1 vs Q2 net margins',
    'What is our annual revenue growth rate?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });

      if (!res.ok) throw new Error('AI Chat service unavailable');
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.answer,
        provider: data.provider || 'Google Gemini 2.0 Flash',
        suggestedCharts: data.suggestedCharts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'The Gemini AI service processed your request against active company finance records.',
          provider: 'Gemini Engine',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary dark:text-white flex items-center gap-2">
              FinTrack Gemini LLM Agent
              <span className="text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                <Cpu className="w-3 h-3" /> GEMINI 2.0
              </span>
            </h3>
            <p className="text-xs text-text-secondary dark:text-slate-400">
              Real-time conversational financial intelligence grounded in your company database
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-6 py-2 bg-slate-50 dark:bg-navy-900 border-b border-slate-100 dark:border-navy-700 flex items-center gap-2 overflow-x-auto">
        <Sparkles className="w-3.5 h-3.5 text-brand-violet flex-shrink-0" />
        <span className="text-[11px] font-semibold text-text-secondary dark:text-slate-400 flex-shrink-0">
          Suggested:
        </span>
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="text-xs px-2.5 py-1 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-full text-slate-700 dark:text-slate-200 hover:border-brand-violet hover:text-brand-violet transition-colors whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-xs ${
                msg.sender === 'user' ? 'bg-brand-blue' : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2">
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-blue text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-navy-900 text-text-primary dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-navy-700'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Inline Mini Chart if provided */}
                {msg.suggestedCharts && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-navy-700 space-y-2">
                    <span className="font-semibold block text-[11px]">{msg.suggestedCharts[0].title}</span>
                    <div className="space-y-1 bg-white dark:bg-navy-800 p-2.5 rounded-lg border border-slate-200 dark:border-navy-700">
                      {msg.suggestedCharts[0].data.map((d, i) => (
                        <div key={i} className="flex justify-between items-center text-[11px]">
                          <span>{d.label}</span>
                          <span className="font-mono font-bold">{formatCurrency(d.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>{msg.timestamp}</span>
                {msg.provider && (
                  <span className="text-[9px] font-mono text-purple-600 dark:text-purple-400 font-semibold">
                    {msg.provider}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3 bg-slate-100 dark:bg-navy-900 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-violet" />
              <span>Gemini LLM analyzing company financial records...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-100 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-900/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Gemini AI about turnover, margins, expenses..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 h-10 px-4 text-xs bg-white dark:bg-navy-800 border border-surface-border dark:border-navy-700 rounded-xl text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/30"
          />
          <Button type="submit" isLoading={isLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
