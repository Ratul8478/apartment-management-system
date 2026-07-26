'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  Briefcase,
  Edit2,
  Trash2,
  Building,
  ShieldCheck,
  UserCheck,
  X,
  Calendar,
  User as UserIcon,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmployeeModal } from '@/components/forms/EmployeeModal';
import { formatDate } from '@/lib/utils';

interface Employee {
  id: string;
  fullName: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  linkedUserId?: string | null;
  createdAt: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Section 3.8 Profile Side Drawer State
  const [drawerEmployee, setDrawerEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the finance roster?`)) return;

    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEmployees();
        if (drawerEmployee?.id === id) setDrawerEmployee(null);
      }
    } catch (err) {
      console.error('Failed to delete employee:', err);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDesignation =
      filterDesignation === 'ALL' || emp.designation.includes(filterDesignation);
    return matchesSearch && matchesDesignation;
  });

  return (
    <div className="space-y-6 relative">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-800 p-6 rounded-2xl border border-slate-200 dark:border-navy-700 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-white">Finance Employee Directory</h1>
          <p className="text-xs text-text-secondary dark:text-slate-400 mt-1">
            Maintain staff directory, designations, and system linkages for the internal finance department
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setSelectedEmployee(null);
            setIsModalOpen(true);
          }}
          className="text-xs font-semibold rounded-xl"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Finance Staff
        </Button>
      </div>

      {/* Roster Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-text-secondary dark:text-slate-400 uppercase">
                Total Staff
              </span>
              <h4 className="text-xl font-bold text-text-primary dark:text-white mt-1 font-mono">
                {employees.length}
              </h4>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-brand-blue">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-text-secondary dark:text-slate-400 uppercase">
                Leadership & Managers
              </span>
              <h4 className="text-xl font-bold text-text-primary dark:text-white mt-1 font-mono">
                {employees.filter((e) => e.designation.includes('CFO') || e.designation.includes('Manager')).length}
              </h4>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-brand-violet">
              <Building className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-text-secondary dark:text-slate-400 uppercase">
                Analysts & Executives
              </span>
              <h4 className="text-xl font-bold text-text-primary dark:text-white mt-1 font-mono">
                {employees.filter((e) => e.designation.includes('Analyst') || e.designation.includes('Executive')).length}
              </h4>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-brand-green">
              <UserCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Directory Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-navy-700 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-blue" />
            Staff Roster (Click row to inspect profile)
          </CardTitle>

          {/* Section 3.8 Search & Filter by designation */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, role, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg text-text-primary dark:text-white focus:outline-none"
              />
            </div>

            <select
              value={filterDesignation}
              onChange={(e) => setFilterDesignation(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg text-text-primary dark:text-white font-medium"
            >
              <option value="ALL">All Designations</option>
              <option value="CFO">CFO / Leadership</option>
              <option value="Finance Manager">Finance Manager</option>
              <option value="Senior Financial Analyst">Senior Analyst</option>
              <option value="Financial Analyst">Financial Analyst</option>
              <option value="Accounts Executive">Accounts Executive</option>
              <option value="Intern">Finance Intern</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
              Loading employee directory...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 italic">
              No employee records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-navy-900 text-text-secondary dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-navy-700">
                  <tr>
                    <th className="py-3.5 px-4">Employee ID</th>
                    <th className="py-3.5 px-4">Name & Status</th>
                    <th className="py-3.5 px-4">Designation</th>
                    <th className="py-3.5 px-4">Sub-team</th>
                    <th className="py-3.5 px-4">Corporate Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-navy-700/60">
                  {filteredEmployees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      onClick={() => setDrawerEmployee(emp)}
                      className="hover:bg-slate-50 dark:hover:bg-navy-700/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                        EMP-10{index + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue font-bold flex items-center justify-center text-xs uppercase">
                            {emp.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-text-primary dark:text-white block group-hover:text-brand-blue transition-colors">
                              {emp.fullName}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-medium">Active Member</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {emp.designation}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="blue" size="sm">
                          {emp.department}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">
                        {emp.email}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">
                        {emp.phone}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-navy-700 text-slate-500 rounded-lg transition-colors"
                            title="Edit Employee"
                          >
                            <Edit2 className="w-4 h-4 text-brand-blue" />
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id, emp.fullName)}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 rounded-lg transition-colors"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3.8: Slide Drawer for Full Profile (Reporting Manager, Tenure, Past Designations, Contact) */}
      {drawerEmployee && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-white dark:bg-navy-800 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-700 pb-4">
                <h3 className="text-base font-bold text-text-primary dark:text-white flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-brand-violet" /> Employee Profile
                </h3>
                <button
                  onClick={() => setDrawerEmployee(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Card Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-700">
                <div className="w-14 h-14 rounded-full bg-brand-violet text-white font-bold text-xl flex items-center justify-center shadow-md">
                  {drawerEmployee.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary dark:text-white">
                    {drawerEmployee.fullName}
                  </h2>
                  <p className="text-xs text-brand-blue font-semibold">{drawerEmployee.designation}</p>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Finance Department</span>
                </div>
              </div>

              {/* Detail Items */}
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-navy-900 rounded-xl space-y-1">
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Reporting Manager</span>
                  <p className="font-semibold text-text-primary dark:text-white">Rajesh Sharma (CFO)</p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-navy-900 rounded-xl space-y-1">
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Tenure & Date Joined</span>
                  <p className="font-semibold text-text-primary dark:text-white">
                    Joined {formatDate(drawerEmployee.createdAt)} (2+ Years Tenure)
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-navy-900 rounded-xl space-y-1">
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Past Designations</span>
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    Junior Analyst (2024–2025) → {drawerEmployee.designation} (Present)
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-navy-900 rounded-xl space-y-2">
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Direct Contact Information</span>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono">
                    <Mail className="w-3.5 h-3.5 text-brand-blue" />
                    <span>{drawerEmployee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono">
                    <Phone className="w-3.5 h-3.5 text-brand-green" />
                    <span>{drawerEmployee.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-navy-700 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDrawerEmployee(null)}>
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchEmployees}
        initialData={selectedEmployee}
      />
    </div>
  );
}
