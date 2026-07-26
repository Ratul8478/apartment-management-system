'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface FinanceEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FinanceEntryModal({ isOpen, onClose, onSuccess }: FinanceEntryModalProps) {
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  const [metricType, setMetricType] = useState('TURNOVER');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/finance-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordDate,
          metricType,
          amount: parseFloat(amount),
          notes,
          currency: 'INR',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit record');
      }

      setAmount('');
      setNotes('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error creating financial record');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Financial Record" description="Enter turnover or P&L line item manually.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-brand-red text-xs rounded-lg">{error}</div>}

        <Input
          label="Record Date"
          type="date"
          value={recordDate}
          onChange={(e) => setRecordDate(e.target.value)}
          required
        />

        <Select
          label="Metric Type"
          value={metricType}
          onChange={(e) => setMetricType(e.target.value)}
          options={[
            { label: 'Turnover (Revenue)', value: 'TURNOVER' },
            { label: 'Profit / Loss', value: 'PROFIT_LOSS' },
            { label: 'Operational Cost', value: 'COST' },
          ]}
        />

        <Input
          label="Amount (INR ₹)"
          type="number"
          step="0.01"
          placeholder="e.g. 500000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <Input
          label="Notes / Description"
          placeholder="e.g. Q3 Software Services Invoice"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-700">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Record
          </Button>
        </div>
      </form>
    </Modal>
  );
}
