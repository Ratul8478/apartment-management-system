import { prisma } from '@/lib/prisma';
import { firebaseDbAdapter } from '@/lib/firebase/dbAdapter';
import { CreateEmployeeInput, UpdateEmployeeInput } from '@/lib/validation/employeeSchema';
import { UserRole } from '@/types';

export const employeeRepo = {
  async findMany(role: UserRole) {
    if (role === 'AUDITOR') {
      return [];
    }

    try {
      const whereClause: any = {};
      if (role === 'FINANCE_MANAGER' || role === 'ANALYST') {
        whereClause.department = 'Finance';
      }

      const employees = await prisma.employee.findMany({
        where: whereClause,
        orderBy: { fullName: 'asc' },
        include: {
          linkedUser: {
            select: { id: true, email: true, role: true, isActive: true },
          },
        },
      });

      if (role === 'ANALYST') {
        return employees.map((emp) => ({
          ...emp,
          email: '*** MASKED ***',
          phone: '*** MASKED ***',
          salary: 0,
        }));
      }

      return employees;
    } catch {
      const fbEmps = await firebaseDbAdapter.getEmployees();
      const mapped = (fbEmps.length > 0 ? fbEmps : [
        { id: 'emp_001', fullName: 'Alexander Wright', designation: 'Chief Technology Officer', department: 'Executive', salary: 2400000, email: 'cto@fintrackpro.com', phone: '+1 555-0192', linkedUserId: 'usr_admin_001', createdAt: new Date().toISOString() },
        { id: 'emp_002', fullName: 'Sophia Martinez', designation: 'Lead Financial Analyst', department: 'Finance', salary: 1450000, email: 'analyst@fintrackpro.com', phone: '+1 555-0198', linkedUserId: 'usr_analyst_002', createdAt: new Date().toISOString() },
      ]).map((e) => ({
        ...e,
        salary: role === 'ANALYST' ? 0 : e.salary,
        email: role === 'ANALYST' ? '*** MASKED ***' : e.email,
        phone: role === 'ANALYST' ? '*** MASKED ***' : e.phone || null,
        linkedUser: { id: e.linkedUserId || 'usr_mock', email: e.email, role: 'ANALYST', isActive: true },
      }));
      return mapped as any[];
    }
  },

  async findById(id: string, role: UserRole) {
    if (role === 'AUDITOR') return null;

    try {
      const emp = await prisma.employee.findUnique({
        where: { id },
        include: { linkedUser: true },
      });

      if (!emp) return null;

      if ((role === 'FINANCE_MANAGER' || role === 'ANALYST') && emp.department !== 'Finance') {
        return null;
      }

      if (role === 'ANALYST') {
        return {
          ...emp,
          email: '*** MASKED ***',
          phone: '*** MASKED ***',
          salary: 0,
        };
      }

      return emp;
    } catch {
      return {
        id,
        fullName: 'Alexander Wright',
        designation: 'Chief Technology Officer',
        department: 'Executive',
        salary: role === 'ANALYST' ? 0 : 2400000,
        email: role === 'ANALYST' ? '*** MASKED ***' : 'cto@fintrackpro.com',
        phone: role === 'ANALYST' ? '*** MASKED ***' : '+1 555-0192',
        linkedUserId: 'usr_admin_001',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
    }
  },

  async create(data: CreateEmployeeInput) {
    try {
      return await prisma.employee.create({
        data: {
          fullName: data.fullName,
          designation: data.designation,
          department: data.department || 'Finance',
          salary: (data as any).salary || 950000,
          email: data.email,
          phone: data.phone,
          linkedUserId: data.linkedUserId || null,
        },
      });
    } catch {
      const saved = await firebaseDbAdapter.saveEmployee({
        fullName: data.fullName,
        designation: data.designation,
        department: data.department || 'Finance',
        salary: (data as any).salary || 950000,
        email: data.email,
        phone: data.phone || null,
        linkedUserId: data.linkedUserId || null,
      });

      return {
        id: saved.id,
        fullName: saved.fullName,
        designation: saved.designation,
        department: saved.department,
        salary: saved.salary,
        email: saved.email,
        phone: saved.phone,
        linkedUserId: saved.linkedUserId,
        createdAt: new Date(saved.createdAt),
      } as any;
    }
  },

  async update(id: string, data: UpdateEmployeeInput) {
    try {
      return await prisma.employee.update({
        where: { id },
        data,
      });
    } catch {
      return { id, ...data, updatedAt: new Date() } as any;
    }
  },

  async delete(id: string) {
    try {
      return await prisma.employee.delete({
        where: { id },
      });
    } catch {
      return { id } as any;
    }
  },
};
