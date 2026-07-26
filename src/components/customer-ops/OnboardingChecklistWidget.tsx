'use client';

import React from 'react';
import { OnboardingStepDTO } from '@/types/customerOps';
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingChecklistWidgetProps {
  steps: OnboardingStepDTO[];
  completionPercentage: number;
  onMarkComplete: (stepKey: string) => void;
}

export const OnboardingChecklistWidget: React.FC<OnboardingChecklistWidgetProps> = ({
  steps,
  completionPercentage,
  onMarkComplete,
}) => {
  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100">Guided Organization Onboarding</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Step-by-Step Guidance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete your onboarding tasks to maximize grounded AI accuracy and feature capabilities.
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold text-indigo-400">{completionPercentage}%</div>
          <div className="text-xs text-slate-400">Completed</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
              step.isCompleted
                ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                : 'bg-slate-850 border-slate-700/80 text-slate-200 shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              {step.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />
              )}
              <span className={`text-sm font-medium ${step.isCompleted ? 'line-through' : ''}`}>
                {step.stepName}
              </span>
            </div>

            {!step.isCompleted && (
              <button
                onClick={() => onMarkComplete(step.stepKey)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1"
              >
                <span>Complete</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
