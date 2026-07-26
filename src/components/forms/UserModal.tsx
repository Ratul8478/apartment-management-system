'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserModal({ isOpen, onClose, onSuccess }: UserModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ANALYST');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          role,
          password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create user account');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error provisioning user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Provision System User" description="Grant system access with role-based security permissions.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-brand-red text-xs rounded-lg">{error}</div>}

        <Input
          label="Full Name"
          placeholder="e.g. Anish Malhotra"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          label="Corporate Email"
          type="email"
          placeholder="user@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Select
          label="System Access Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { label: '👑 Super Admin (Full system control + admin management)', value: 'SUPER_ADMIN' },
            { label: 'Admin (User & template management)', value: 'ADMIN' },
            { label: 'Finance Manager (Turnover/P&L edit + report approval)', value: 'FINANCE_MANAGER' },
            { label: 'Analyst (Read-only financials + draft reports)', value: 'ANALYST' },
            { label: 'Auditor (Read-only historical view, no AI chat)', value: 'AUDITOR' },
          ]}
        />

        <Input
          label="Temporary Initial Password (10+ Chars)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="Must be at least 10 characters and not a common password."
          required
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-700">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create User Account
          </Button>
        </div>
      </form>
    </Modal>
  );
}
