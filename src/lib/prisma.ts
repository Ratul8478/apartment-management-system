import { prismaClient } from './db/client';

/**
 * FinTrack Pro — Prisma Client Re-export Module
 * 
 * Maintained for backwards compatibility with legacy import paths (`import { prisma } from '@/lib/prisma'`).
 * Delegates directly to the enterprise singleton instance managed by the Database Platform Provider.
 */

export const prisma = prismaClient;
export default prismaClient;
