import { prisma } from '@/lib/prisma';
import { CreateEmployeeInput, UpdateEmployeeInput } from '@/lib/validation/employeeSchema';
import { UserRole } from '@/types';

export const employeeRepo = {
  async findMany(role: UserRole) {
    if (role === 'AUDITOR') {
      return [];
    }

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

    // Query-level Field Masking for ANALYST role
    if (role === 'ANALYST') {
      return employees.map((emp) => ({
        ...emp,
        email: '*** MASKED ***',
        phone: '*** MASKED ***',
        salary: 0, // Mask salary at query level
      }));
    }

    return employees;
  },

  async findById(id: string, role: UserRole) {
    if (role === 'AUDITOR') return null;

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
  },

  async create(data: CreateEmployeeInput) {
    return prisma.employee.create({
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
  },

  async update(id: string, data: UpdateEmployeeInput) {
    return prisma.employee.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.employee.delete({
      where: { id },
    });
  },
};
