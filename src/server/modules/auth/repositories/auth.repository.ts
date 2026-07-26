// =======================================================
// FinTrack Pro Enterprise Auth Platform
// Auth Module Database Repositories
// =======================================================

import { prismaClient } from "@/lib/db/client";
import { User, Session, AuditLog, SystemRole, Prisma } from "@prisma/client";

export class AuthUserRepository {
  /**
   * Finds an active user by unique email address
   */
  public async findByEmail(email: string): Promise<User | null> {
    return prismaClient.user.findFirst({
      where: {
        email: email.toLowerCase(),
        deletedAt: null,
      },
    });
  }

  /**
   * Finds an active user by unique ID
   */
  public async findById(id: string): Promise<User | null> {
    return prismaClient.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  /**
   * Creates a new user identity record
   */
  public async create(data: {
    fullName: string;
    email: string;
    passwordHash: string;
    role?: SystemRole;
    organizationId?: string | null;
  }): Promise<User> {
    return prismaClient.user.create({
      data: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        role: data.role || SystemRole.ANALYST,
        organizationId: data.organizationId || null,
        isActive: true,
      },
    });
  }

  /**
   * Increment failed login counter and set account lock timestamp if threshold reached
   */
  public async recordFailedLogin(userId: string, failedCount: number, lockedUntil: Date | null): Promise<User> {
    return prismaClient.user.update({
      where: { id: userId },
      data: {
        failedLogins: failedCount,
        failedLoginAttempts: failedCount,
        lockedUntil,
        lockoutUntil: lockedUntil,
      },
    });
  }

  /**
   * Reset failed login counter upon successful authentication
   */
  public async resetFailedLogins(userId: string): Promise<User> {
    return prismaClient.user.update({
      where: { id: userId },
      data: {
        failedLogins: 0,
        failedLoginAttempts: 0,
        lockedUntil: null,
        lockoutUntil: null,
      },
    });
  }

  /**
   * Update password hash
   */
  public async updatePassword(userId: string, newPasswordHash: string): Promise<User> {
    return prismaClient.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        version: { increment: 1 },
      },
    });
  }

  /**
   * Updates user MFA or email verification state
   */
  public async updateVerificationState(userId: string, isVerified = true): Promise<User> {
    return prismaClient.user.update({
      where: { id: userId },
      data: {
        isMfaEnabled: isVerified,
        mfaEnabled: isVerified,
      },
    });
  }
}

export class AuthSessionRepository {
  /**
   * Creates a new active session
   */
  public async createSession(data: {
    userId: string;
    sessionToken: string;
    refreshToken: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<Session> {
    return prismaClient.session.create({
      data: {
        userId: data.userId,
        sessionToken: data.sessionToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
  }

  /**
   * Finds an active session by refresh token
   */
  public async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    return prismaClient.session.findUnique({
      where: { refreshToken },
    });
  }

  /**
   * Finds an active session by session token
   */
  public async findBySessionToken(sessionToken: string): Promise<Session | null> {
    return prismaClient.session.findUnique({
      where: { sessionToken },
    });
  }

  /**
   * Finds all active sessions for a user
   */
  public async findUserSessions(userId: string): Promise<Session[]> {
    return prismaClient.session.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Updates refresh token during token rotation
   */
  public async updateRefreshToken(
    sessionId: string,
    newRefreshToken: string,
    newExpiresAt: Date
  ): Promise<Session> {
    return prismaClient.session.update({
      where: { id: sessionId },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: newExpiresAt,
      },
    });
  }

  /**
   * Revokes / deletes a session
   */
  public async deleteSession(sessionId: string): Promise<void> {
    await prismaClient.session.delete({
      where: { id: sessionId },
    }).catch(() => {
      // Ignore if already deleted
    });
  }

  /**
   * Revokes all active sessions for a user
   */
  public async revokeAllUserSessions(userId: string): Promise<void> {
    await prismaClient.session.deleteMany({
      where: { userId },
    });
  }
}

export class AuthAuditRepository {
  /**
   * Logs a security authentication event to the immutable AuditLog ledger
   */
  public async logEvent(data: {
    organizationId?: string | null;
    actorUserId?: string | null;
    action: string;
    targetEntity?: string;
    targetId?: string | null;
    metadata?: Record<string, unknown>;
    ipAddress?: string | null;
    userAgent?: string | null;
  }): Promise<AuditLog | null> {
    try {
      return await prismaClient.auditLog.create({
        data: {
          organizationId: data.organizationId || null,
          actorId: data.actorUserId || null,
          actorUserId: data.actorUserId || null,
          action: data.action,
          targetEntity: data.targetEntity || "User",
          targetTable: "users",
          targetId: data.targetId || null,
          metadata: data.metadata ? (data.metadata as unknown as Prisma.InputJsonValue) : undefined,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
        },
      });
    } catch (err) {
      console.warn("[AuthAuditRepository] Failed to record audit log event:", err);
      return null;
    }
  }

  /**
   * Stores a temporary verification or reset token in SystemSetting
   */
  public async saveToken(key: string, value: string, category = "AUTH_TOKEN"): Promise<void> {
    try {
      await prismaClient.systemSetting.upsert({
        where: { key },
        update: { value, category, updatedAt: new Date() },
        create: { key, value, category },
      });
    } catch (err) {
      console.warn("[AuthAuditRepository] Failed to save system setting token:", err);
    }
  }

  /**
   * Retrieves a stored verification or reset token from SystemSetting
   */
  public async getToken(key: string): Promise<string | null> {
    try {
      const record = await prismaClient.systemSetting.findUnique({
        where: { key },
      });
      return record ? record.value : null;
    } catch (err) {
      console.warn("[AuthAuditRepository] Failed to retrieve system setting token:", err);
      return null;
    }
  }

  /**
   * Removes a consumed token from SystemSetting
   */
  public async deleteToken(key: string): Promise<void> {
    try {
      await prismaClient.systemSetting.delete({
        where: { key },
      });
    } catch {
      // Ignore if missing or error
    }
  }
}
