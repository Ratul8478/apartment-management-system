'use client';

import { useState, useEffect } from 'react';
import { Shield, FileText, Filter, RefreshCw, Calendar, User, Database, Tag } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  actorUserId: string;
  actorUser?: {
    fullName: string;
    email: string;
    role: string;
  };
  action: string;
  targetTable: string;
  targetId?: string;
  metadata?: string;
  createdAt: string;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableFilter, setTableFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/audit-log?limit=100';
      if (tableFilter !== 'ALL') url += `&targetTable=${tableFilter}`;
      if (actionFilter !== 'ALL') url += `&action=${actionFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setLogs(data.auditLogs || []);
      }
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [tableFilter, actionFilter]);

  const getActionBadgeColor = (action: string) => {
    if (action.includes('CREATE') || action.includes('ADD')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (action.includes('DELETE') || action.includes('DEACTIVATE')) return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    if (action.includes('IMPORT') || action.includes('UPLOAD')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (action.includes('REPORT') || action.includes('GENERATE')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">System Audit Log</h1>
              <p className="text-sm text-slate-400">
                Immutable activity tracking layer for compliance and system auditability.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-all border border-slate-700"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <Filter className="w-4 h-4 text-sky-400" />
          Filter Logs:
        </div>

        <select
          value={tableFilter}
          onChange={(e) => setTableFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
        >
          <option value="ALL">All Tables</option>
          <option value="finance_records">finance_records</option>
          <option value="employees">employees</option>
          <option value="share_values">share_values</option>
          <option value="users">users</option>
          <option value="reports">reports</option>
        </select>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
        >
          <option value="ALL">All Action Types</option>
          <option value="ADD_FINANCE_RECORD">ADD_FINANCE_RECORD</option>
          <option value="CSV_IMPORT">CSV_IMPORT</option>
          <option value="ADD_EMPLOYEE">ADD_EMPLOYEE</option>
          <option value="UPDATE_SHARE_PRICE">UPDATE_SHARE_PRICE</option>
          <option value="CREATE_USER">CREATE_USER</option>
          <option value="GENERATE_REPORT">GENERATE_REPORT</option>
        </select>

        <div className="ml-auto text-xs text-slate-400">
          Showing <span className="text-sky-400 font-semibold">{logs.length}</span> audit events
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Table</th>
                <th className="px-6 py-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-400" />
                    Fetching audit records...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No audit records found matching criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-sky-400" />
                        <div>
                          <p className="font-medium text-slate-200">{log.actorUser?.fullName || 'System'}</p>
                          <p className="text-xs text-slate-500">{log.actorUser?.email || log.actorUserId}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-indigo-400" />
                        {log.targetTable}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-slate-400 max-w-md truncate">
                      {log.metadata ? (
                        <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300">
                          {log.metadata}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
