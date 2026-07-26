import bcrypt from 'bcryptjs';
import { userRepo } from '../repositories/userRepo';
import { auditService } from './auditService';
import { CreateUserInput, createUserSchema } from '@/lib/validation/userSchema';

export const userService = {
  async getUsers() {
    return userRepo.findMany();
  },

  async createUser(input: CreateUserInput, actorUserId: string) {
    const validated = createUserSchema.parse(input);

    const existing = await userRepo.findByEmail(validated.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);
    const user = await userRepo.create({
      email: validated.email,
      fullName: validated.fullName,
      passwordHash,
      role: validated.role,
    });

    await auditService.logAction({
      actorUserId,
      action: 'CREATE_USER',
      targetTable: 'users',
      targetId: user.id,
      metadata: { email: user.email, role: user.role, fullName: user.fullName },
    });

    return user;
  },

  async updateUserStatus(targetUserId: string, isActive: boolean, actorUserId: string) {
    const user = await userRepo.updateStatus(targetUserId, isActive);

    await auditService.logAction({
      actorUserId,
      action: isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
      targetTable: 'users',
      targetId: user.id,
      metadata: { email: user.email, isActive },
    });

    return user;
  },
};
