import { z } from 'zod';

export const UserRoleEnum = z.enum(['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'ANALYST', 'AUDITOR']);

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Full name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: UserRoleEnum.default('ANALYST'),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
