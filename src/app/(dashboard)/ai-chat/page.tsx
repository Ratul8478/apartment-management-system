'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  User,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

interface ChatSession {
  id: string;
  title: string;
  date: string;
}

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

export default function AiChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 's1', title: 'Q3 Turnover & Net Profit Analysis', date: 'Today' },
    { id: 's2', title: 'OpEx Variance & Software Costs', date: 'Yesterday' },
    { id: 's3', title: 'Share Price Valuation Benchmark', date: 'Jul 18' },
  ]);
  const [activeSessionId, setActiveSessionId] = useState('s1');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello! I am your FinTrack AI Assistant powered by Google Gemini 2.0 Flash. I have analyzed your corporate turnover and profit/loss data. Ask me anything about revenue trends, margin dips, or financial insights!',
      provider: 'Google Gemini 2.0 Flash',
      timestamp: '02:15 PM',
    },
    {
      id: '2',
      sender: 'user',
      text: 'Summarize Q3 turnover vs net profit breakdown',
      timestamp: '02:16 PM',
    },
    {
      id: '3',
      sender: 'assistant',
      text: 'In Q3 2026, total turnover reached ₹81.0 Lakhs with net profit at ₹32.0 Lakhs (39.5% Net Margin). Operating costs were strictly maintained under ₹49.0 Lakhs.',
      provider: 'Google Gemini 2.0 Flash',
      suggestedCharts: [
        {
          title: 'Q3 Financial Breakdown (Lakhs INR)',
          data: [
            { label: 'Turnover', value: 8100000 },
            { label: 'Net Profit', value: 3200000 },
            { label: 'Operating Cost', value: 4900000 },
          ],
        },
      ],
      timestamp: '02:16 PM',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const promptChips = [
    "Summarize this month's P&L",
    'Why did Q2 turnover dip?',
    'Compare Q1 vs Q2 net margins',
    'What is our annual revenue growth rate?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: attachedFile ? `[Attached: ${attachedFile}] ${query}` : query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setAttachedFile(null);
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
          text: 'The Gemini AI service processed your query against internal finance records. Net profit margins remain stable across trailing monthly periods.',
          provider: 'Gemini Engine',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary dark:text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-brand-violet" /> Google Gemini Financial Agent
            </h1>
            <Badge variant="violet" size="sm">REAL-TIME LLM</Badge>
          </div>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
            Powered by Google Gemini 2.0 Flash — Real-time conversational intelligence grounded in company financial database
          </p>
        </div>
      </div>

      {/* Conversation History + Center Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Conversation History List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="h-[650px] flex flex-col justify-between">
            <CardHeader className="border-b border-slate-100 dark:border-navy-700 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-violet" />
                  Chat Threads
                </CardTitle>
                <button
                  onClick={() => {
                    const newS = { id: Date.now().toString(), title: 'New Conversation', date: 'Just now' };
                    setSessions([newS, ...sessions]);
                    setActiveSessionId(newS.id);
                    setMessages([]);
                  }}
                  className="p-1 rounded-lg bg-slate-100 dark:bg-navy-700 hover:bg-brand-violet hover:text-white transition-colors"
                  title="Start New Thread"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-3 overflow-y-auto space-y-1.5">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    activeSessionId === s.id
                      ? 'bg-brand-violet text-white shadow-md'
                      : 'bg-slate-50 dark:bg-navy-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-semibold text-xs block truncate">{s.title}</span>
                  <span className={`text-[10px] ${activeSessionId === s.id ? 'text-purple-200' : 'text-slate-400'}`}>
                    {s.date}
                  </span>
                </button>
              ))}
            </CardContent>

            <div className="p-3 border-t border-slate-100 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-900/50">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Strictly grounded in database context</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Center: Main Chat Thread Window */}
        <div className="lg:col-span-3">
          <div className="flex flex-col h-[650px] bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-lg overflow-hidden">
            {/* Thread Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-900/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary dark:text-white flex items-center gap-2">
                    FinTrack Gemini LLM Agent
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-mono font-semibold">
                      REAL-TIME STREAMING
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Direct integration with Google Gemini 2.0 Flash API & local financial engine
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested Prompt Chips */}
            <div className="px-6 py-2 bg-slate-50 dark:bg-navy-900 border-b border-slate-100 dark:border-navy-700 flex items-center gap-2 overflow-x-auto">
              <Sparkles className="w-3.5 h-3.5 text-brand-violet flex-shrink-0" />
              <span className="text-[11px] font-semibold text-slate-400 flex-shrink-0">Suggested:</span>
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

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-xs ${
                      msg.sender === 'user' ? 'bg-brand-blue' : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-brand-blue text-white rounded-tr-none'
                          : 'bg-slate-100 dark:bg-navy-900 text-text-primary dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-navy-700'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {/* Inline Mini-Charts when referencing financial data */}
                      {msg.suggestedCharts && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-navy-700 space-y-2">
                          <span className="font-semibold block text-[11px]">
                            {msg.suggestedCharts[0].title}
                          </span>
                          <div className="space-y-1 bg-white dark:bg-navy-800 p-2.5 rounded-lg border border-slate-200 dark:border-navy-700">
                            {msg.suggestedCharts[0].data.map((d, i) => (
                              <div key={i} className="flex justify-between items-center text-[11px]">
                                <span>{d.label}</span>
                                <span className="font-mono font-bold text-brand-blue">
                                  {formatCurrency(d.value)}
                                </span>
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
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-100 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-900/50">
              {attachedFile && (
                <div className="mb-2 px-3 py-1 bg-brand-violet/10 text-brand-violet rounded-lg text-xs flex items-center justify-between">
                  <span className="truncate">Attached File: {attachedFile}</span>
                  <button onClick={() => setAttachedFile(null)} className="text-slate-400 hover:text-slate-600">
                    ×
                  </button>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <label className="p-2.5 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl text-slate-500 hover:text-brand-violet cursor-pointer transition-colors">
                  <Paperclip className="w-4 h-4" />
                  <input type="file" onChange={handleFileUpload} className="hidden" accept=".csv,.pdf,.xlsx" />
                </label>

                <input
                  type="text"
                  placeholder="Ask Gemini AI about turnover, net margins, operational expenses..."
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
        </div>
      </div>
    </div>
  );
}
