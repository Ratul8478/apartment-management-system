'use client';

import React from 'react';
import { useRealtimeStatus } from '@/hooks/useRealtime';

interface RealtimeStatusIndicatorProps {
  showLabel?: boolean;
  className?: string;
}

/**
 * Realtime Connection Status Indicator Component
 * Displays live Firebase Realtime Database connection status badge.
 */
export const RealtimeStatusIndicator: React.FC<RealtimeStatusIndicatorProps> = ({
  showLabel = true,
  className = '',
}) => {
  const { connected } = useRealtimeStatus();

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${
        connected
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      } ${className}`}
      title={connected ? 'Firebase Realtime Database Connected' : 'Connecting to Firebase Realtime Database...'}
    >
      <span className="relative flex h-2 w-2">
        {connected && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            connected ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        ></span>
      </span>
      {showLabel && (
        <span>
          {connected ? 'Realtime Connected' : 'Realtime Sync'}
        </span>
      )}
    </div>
  );
};
