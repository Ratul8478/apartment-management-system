import { z } from 'zod';

export const createEmployeeSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  designation: z.string().min(2, 'Designation is required'),
  department: z.string().default('Finance'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  linkedUserId: z.string().optional().nullable(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
