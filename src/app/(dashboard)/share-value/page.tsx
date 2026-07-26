'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Activity,
  Award,
  Globe,
  Plus,
  Trash2,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { ShareValueChart } from '@/components/charts/ShareValueChart';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShareValueItem } from '@/types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface PeerItem {
  id: string;
  name: string;
  ticker: string;
  price: number;
  changePercent: number;
  selected: boolean;
}

export default function ShareValuePage() {
  const [data, setData] = useState<{
    ticker: string;
    companyName: string;
    currentPrice: number;
    dayChange: number;
    dayChangePercent: number;
    lastUpdated: string;
    history: ShareValueItem[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Form states for manual price update
  const [newPrice, setNewPrice] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Section 3.7 Comparison Board Peer List State
  const [peers, setPeers] = useState<PeerItem[]>([
    { id: 'p1', name: 'AlphaCorp FinTech', ticker: 'ALPH', price: 820.4, changePercent: 2.1, selected: true },
    { id: 'p2', name: 'Beta Global Capital', ticker: 'BETA', price: 412.0, changePercent: -0.8, selected: true },
    { id: 'p3', name: 'Gamma Financial Services', ticker: 'GAMM', price: 1150.2, changePercent: 4.3, selected: true },
    { id: 'p4', name: 'Delta Investment Trust', ticker: 'DLTA', price: 295.5, changePercent: 1.2, selected: false },
  ]);

  const [newPeerTicker, setNewPeerTicker] = useState('');
  const [newPeerName, setNewPeerName] = useState('');

  const fetchShareData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/share-value');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch share data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShareData();
  }, []);

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrice || parseFloat(newPrice) <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/share-value', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseFloat(newPrice), recordDate }),
      });

      if (res.ok) {
        setNewPrice('');
        setIsUpdateModalOpen(false);
        fetchShareData();
      }
    } catch (err) {
      console.error('Failed to update share price:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePeerSelection = (id: string) => {
    setPeers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleAddPeer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeerTicker || !newPeerName) return;

    const newP: PeerItem = {
      id: Date.now().toString(),
      name: newPeerName,
      ticker: newPeerTicker.toUpperCase(),
      price: Math.floor(Math.random() * 500) + 200,
      changePercent: Number((Math.random() * 6 - 2).toFixed(1)),
      selected: true,
    };

    setPeers([...peers, newP]);
    setNewPeerTicker('');
    setNewPeerName('');
  };

  const high52 = data?.history ? Math.max(...data.history.map((h) => h.price), data.currentPrice) : 720;
  const low52 = data?.history ? Math.min(...data.history.map((h) => h.price), data.currentPrice) : 420;

  // Generate Comparison Overlay Chart Data (% Change relative to base)
  const comparisonData = (data?.history || []).slice(-6).map((h, i) => {
    const basePrice = data?.history[0]?.price || 450;
    const fnTrkPct = Number((((h.price - basePrice) / basePrice) * 100).toFixed(1));

    const point: any = {
      date: formatDate(h.recordDate),
      FNTRK: fnTrkPct,
    };

    peers
      .filter((p) => p.selected)
      .forEach((p, pIdx) => {
        point[p.ticker] = Number((fnTrkPct + (pIdx + 1) * 2 - 3).toFixed(1));
      });

    return point;
  });

  return (
    <div className="space-y-6">
      {/* Section 3.7 Header: Company Name, Ticker, Current Price, Day Change (Colored Delta), Timestamp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-mono font-bold text-lg shadow-md">
            FNTRK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-text-primary dark:text-white">
                FinTrack Pro Corporate (FNTRK)
              </h1>
              <Badge variant="violet" size="sm">PRIMARY EQUITY</Badge>
            </div>
            <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
              Last updated: {data ? new Date(data.lastUpdated).toLocaleString() : 'Live'}
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsUpdateModalOpen(true)}
          className="text-xs font-semibold rounded-xl"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Update Share Price
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
              Current Share Price
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-text-primary dark:text-white font-mono">
                {isLoading ? '...' : `₹${data?.currentPrice?.toFixed(2)}`}
              </h3>
              {data && (
                <div
                  className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                    data.dayChange >= 0
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50'
                  }`}
                >
                  {data.dayChange >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{data.dayChangePercent}%</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
              52-Week High
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-text-primary dark:text-white font-mono">
                ₹{high52.toFixed(2)}
              </h3>
              <Badge variant="blue" size="sm">PEAK</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
              52-Week Low
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-text-primary dark:text-white font-mono">
                ₹{low52.toFixed(2)}
              </h3>
              <Badge variant="gray" size="sm">BOTTOM</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
              Market Capitalization
            </span>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                ₹3,240 Cr
              </h3>
              <Award className="w-6 h-6 text-brand-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Area Price Chart */}
      <Card>
        <CardHeader className="border-b border-slate-100 dark:border-navy-700 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-blue" />
            FNTRK Equity Price Movement
          </CardTitle>
          <p className="text-xs text-text-secondary dark:text-slate-400">
            Price trajectory sourced from internal financial updates
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="h-80 flex items-center justify-center text-xs text-slate-400 animate-pulse">
              Loading share price chart...
            </div>
          ) : (
            <ShareValueChart data={data?.history || []} />
          )}
        </CardContent>
      </Card>

      {/* Section 3.7: Peer Comparison Board (Table + Overlay Line Chart) */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-navy-700 pb-4">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-violet" />
              Peer Comparison Board (% Relative Performance)
            </CardTitle>
            <p className="text-xs text-text-secondary dark:text-slate-400">
              Benchmark company share growth against 2–5 peer competitors over identical period
            </p>
          </div>

          <form onSubmit={handleAddPeer} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ticker (e.g. DLTA)"
              value={newPeerTicker}
              onChange={(e) => setNewPeerTicker(e.target.value)}
              className="w-24 px-3 py-1.5 text-xs bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg text-text-primary dark:text-white"
            />
            <input
              type="text"
              placeholder="Peer Company Name"
              value={newPeerName}
              onChange={(e) => setNewPeerName(e.target.value)}
              className="w-40 px-3 py-1.5 text-xs bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg text-text-primary dark:text-white"
            />
            <Button type="submit" className="text-xs font-semibold rounded-lg">
              <Plus className="w-4 h-4 mr-1" /> Add Peer
            </Button>
          </form>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Overlay Line Chart */}
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#4A5568' }} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: '#4A5568' }} />
                <Tooltip formatter={(val: any) => [`${val}%`, 'Growth']} />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="FNTRK" stroke="#2F6FED" strokeWidth={3} name="FinTrack (Us)" />
                {peers
                  .filter((p) => p.selected)
                  .map((p, idx) => {
                    const colors = ['#7C5CFC', '#1FBF75', '#F5A623', '#E5484D'];
                    return (
                      <Line
                        key={p.id}
                        type="monotone"
                        dataKey={p.ticker}
                        stroke={colors[idx % colors.length]}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        name={p.name}
                      />
                    );
                  })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison Controls Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-navy-900 text-text-secondary dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-navy-700">
                <tr>
                  <th className="py-3 px-4">Include Overlay</th>
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Latest Share Price</th>
                  <th className="py-3 px-4">Day Change %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-700/60">
                {peers.map((peer) => (
                  <tr key={peer.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-700/40">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={peer.selected}
                        onChange={() => togglePeerSelection(peer.id)}
                        className="w-4 h-4 text-brand-blue rounded border-slate-300 focus:ring-brand-blue"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-text-primary dark:text-white">
                      {peer.ticker}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {peer.name}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold">
                      ₹{peer.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={peer.changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {peer.changePercent >= 0 ? `+${peer.changePercent}%` : `${peer.changePercent}%`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Share Update Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Record New Share Price"
        description="Manually record company share value update."
      >
        <form onSubmit={handleUpdatePrice} className="space-y-4">
          <Input
            label="Valuation Date"
            type="date"
            required
            value={recordDate}
            onChange={(e) => setRecordDate(e.target.value)}
          />

          <Input
            label="Share Price (INR ₹)"
            type="number"
            step="0.01"
            placeholder="e.g. 650.00"
            required
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-700">
            <Button type="button" variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Share Value
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
