'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export function EmployeeModal({ isOpen, onClose, onSuccess, initialData }: EmployeeModalProps) {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [designation, setDesignation] = useState(initialData?.designation || 'Financial Analyst');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = initialData ? `/api/employees/${initialData.id}` : '/api/employees';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          designation,
          department: 'Finance',
          email,
          phone,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save employee');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving employee');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Employee Record' : 'Add Finance Department Staff'}
      description="Maintain accurate records for the internal finance roster."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-brand-red text-xs rounded-lg">{error}</div>}

        <Input
          label="Full Name"
          placeholder="e.g. Rajesh Sharma"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Select
          label="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          options={[
            { label: 'CFO / Finance Head', value: 'CFO / Finance Head' },
            { label: 'Finance Manager', value: 'Finance Manager' },
            { label: 'Senior Financial Analyst', value: 'Senior Financial Analyst' },
            { label: 'Financial Analyst', value: 'Financial Analyst' },
            { label: 'Accounts Executive', value: 'Accounts Executive' },
            { label: 'Finance Intern', value: 'Finance Intern' },
          ]}
        />

        <Input
          label="Corporate Email"
          type="email"
          placeholder="employee@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Contact Phone"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-700">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Update Record' : 'Add Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
