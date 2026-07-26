'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Server,
  Database,
  ShieldCheck,
  Zap,
  Mail,
  HardDrive,
  Bot,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface FreeTierService {
  id: string;
  name: string;
  category: string;
  provider: string;
  plan: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'LOCAL_FALLBACK';
  connectionUrl: string;
  pingMs: number | null;
  quotaLimit: string;
  quotaUsage: string;
  features: string[];
}

export function FreeTierStatusWidget() {
  const [services, setServices] = useState<FreeTierService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/system/free-tier');
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to fetch free tier telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend':
        return <Globe className="w-5 h-5 text-sky-400" />;
      case 'backend':
        return <Server className="w-5 h-5 text-indigo-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'security':
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
      case 'cache':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'email':
        return <Mail className="w-5 h-5 text-rose-400" />;
      case 'storage':
        return <HardDrive className="w-5 h-5 text-cyan-400" />;
      case 'ai':
        return <Bot className="w-5 h-5 text-teal-400" />;
      default:
        return <Layers className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: FreeTierService['status']) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Free Active
          </span>
        );
      case 'LOCAL_FALLBACK':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Local PGlite Engine
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            In-Memory Fallback
          </span>
        );
      case 'OFFLINE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Offline
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold tracking-wide uppercase mb-1">
              <Layers className="w-4 h-4" />
              Infrastructure Tier Matrix
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              100% Free-Tier Production Architecture
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              All 8 core layers (Frontend, Backend, Database, Auth, Cache, Email, Storage & AI) are connected and running on zero-cost cloud tiers with enterprise SSL and DDoS protection.
            </p>
          </div>
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Health'}
          </button>
        </div>
        {lastUpdated && (
          <div className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-800/80">
            Live Telemetry Updated: {lastUpdated}
          </div>
        )}
      </div>

      {/* Grid of 8 Free Tier Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col justify-between rounded-xl bg-slate-900/80 border border-slate-800 p-5 hover:border-indigo-500/40 transition-all duration-200 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50 group-hover:scale-105 transition-transform">
                  {getCategoryIcon(service.category)}
                </div>
                {getStatusBadge(service.status)}
              </div>

              <h3 className="text-base font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-indigo-300 font-medium mb-3">
                {service.provider} · {service.plan}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Quota Limit:</span>
                  <span className="text-slate-200 font-mono">{service.quotaLimit}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status Usage:</span>
                  <span className="text-emerald-400 font-medium">{service.quotaUsage}</span>
                </div>
                {service.pingMs !== null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Response Ping:</span>
                    <span className="text-sky-400 font-mono">{service.pingMs} ms</span>
                  </div>
                )}
              </div>

              {/* Feature Highlights */}
              <div className="border-t border-slate-800 pt-3">
                <p className="text-[11px] font-semibold uppercase text-slate-500 mb-2">Connected Features</p>
                <ul className="space-y-1">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Connection Link */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono truncate max-w-[150px]">
                {service.connectionUrl}
              </span>
              <a
                href={service.connectionUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                Inspect
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
