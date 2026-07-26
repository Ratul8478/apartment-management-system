import { employeeRepo } from '../repositories/employeeRepo';
import { auditService } from './auditService';
import { CreateEmployeeInput, UpdateEmployeeInput, createEmployeeSchema } from '@/lib/validation/employeeSchema';
import { UserRole } from '@/types';

export const employeeService = {
  async getEmployees(role: UserRole = 'ANALYST') {
    return employeeRepo.findMany(role);
  },

  async getEmployeeById(id: string, role: UserRole = 'ANALYST') {
    return employeeRepo.findById(id, role);
  },

  async createEmployee(input: CreateEmployeeInput, actorUserId: string) {
    const validated = createEmployeeSchema.parse(input);
    const employee = await employeeRepo.create(validated);

    await auditService.logAction({
      actorUserId,
      action: 'ADD_EMPLOYEE',
      targetTable: 'employees',
      targetId: employee.id,
      metadata: {
        fullName: employee.fullName,
        designation: employee.designation,
        department: employee.department,
        email: employee.email,
      },
    });

    return employee;
  },

  async updateEmployee(id: string, input: UpdateEmployeeInput, actorUserId: string) {
    const employee = await employeeRepo.update(id, input);

    await auditService.logAction({
      actorUserId,
      action: 'UPDATE_EMPLOYEE',
      targetTable: 'employees',
      targetId: employee.id,
      metadata: { updatedFields: Object.keys(input) },
    });

    return employee;
  },

  async deleteEmployee(id: string, actorUserId: string) {
    const employee = await employeeRepo.delete(id);

    await auditService.logAction({
      actorUserId,
      action: 'DELETE_EMPLOYEE',
      targetTable: 'employees',
      targetId: id,
      metadata: { fullName: employee.fullName, email: employee.email },
    });

    return employee;
  },
};
