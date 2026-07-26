'use client';

import React, { useState } from 'react';
import { SuccessPlanDTO } from '@/types/customerOps';
import { Target, Plus, CheckCircle2, Circle, Calendar, UserCheck } from 'lucide-react';

interface CustomerSuccessHubProps {
  plans: SuccessPlanDTO[];
  onCreatePlan: (title: string, objectives: string[]) => void;
}

export const CustomerSuccessHub: React.FC<CustomerSuccessHubProps> = ({ plans, onCreatePlan }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    onCreatePlan(newTitle, [newObjective || 'Complete Onboarding & AI Training']);
    setNewTitle('');
    setNewObjective('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Customer Success Hub & Success Plans</h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage enterprise adoption objectives, renewal readiness, and strategic milestones.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Success Plan
        </button>
      </div>

      {/* Success Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
                  {plan.status}
                </span>
                <h4 className="text-base font-bold text-slate-100 mt-1.5">{plan.title}</h4>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Target: {new Date(plan.targetDate).toLocaleDateString()}</span>
              </div>
            </div>

            <hr className="border-slate-800" />

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Key Objectives</span>
              {plan.objectives.map((obj) => (
                <div key={obj.id} className="flex items-center gap-2 text-xs text-slate-300">
                  {obj.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                  <span className={obj.isCompleted ? 'line-through text-slate-500' : ''}>{obj.title}</span>
                </div>
              ))}
            </div>

            {plan.notes.length > 0 && (
              <div className="p-3 bg-slate-850 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> {plan.notes[0].author}
                </div>
                <p className="italic">"{plan.notes[0].note}"</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Create Strategic Success Plan</h3>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Plan Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Q4 AI Expansion & Training"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Primary Objective</label>
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="e.g. Onboard 15 new finance team analysts"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
