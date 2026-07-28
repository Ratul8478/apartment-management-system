// =======================================================
// FinTrack Pro Enterprise Auth Platform
// Auth Module Database Repositories
// =======================================================

import { prismaClient } from "@/lib/db/client";
import { firebaseDbAdapter } from "@/lib/firebase/dbAdapter";
import { User, Session, AuditLog, SystemRole, Prisma } from "@prisma/client";

// In-memory session store for serverless environment fallback
const fallbackSessionMap = new Map<string, Session>();

export class AuthUserRepository {
  /**
   * Finds an active user by unique email address
   */
  public async findByEmail(email: string): Promise<User | null> {
    try {
      return await prismaClient.user.findFirst({
        where: {
          email: email.toLowerCase(),
          deletedAt: null,
        },
      });
    } catch {
      const fbUser = await firebaseDbAdapter.findUserByEmail(email);
      if (fbUser) {
        return {
          id: fbUser.id,
          organizationId: fbUser.organizationId || null,
          email: fbUser.email,
          passwordHash: fbUser.passwordHash,
          fullName: fbUser.fullName,
          role: (fbUser.role as SystemRole) || SystemRole.SUPER_ADMIN,
          isMfaEnabled: fbUser.isMfaEnabled || false,
          mfaEnabled: fbUser.mfaEnabled || false,
          mfaSecret: null,
          mfaBackupCodes: null,
          failedLogins: fbUser.failedLogins || 0,
          failedLoginAttempts: fbUser.failedLogins || 0,
          lockedUntil: fbUser.lockedUntil ? new Date(fbUser.lockedUntil) : null,
          lockoutUntil: fbUser.lockedUntil ? new Date(fbUser.lockedUntil) : null,
          isActive: fbUser.isActive,
          version: 1,
          createdAt: new Date(fbUser.createdAt),
          updatedAt: new Date(fbUser.updatedAt),
          deletedAt: null,
        } as User;
      }
      return null;
    }
  }

  /**
   * Finds an active user by unique ID
   */
  public async findById(id: string): Promise<User | null> {
    try {
      return await prismaClient.user.findFirst({
        where: {
          id,
          deletedAt: null,
        },
      });
    } catch {
      const fbUser = await firebaseDbAdapter.findUserById(id);
      if (fbUser) {
        return {
          id: fbUser.id,
          organizationId: fbUser.organizationId || null,
          email: fbUser.email,
          passwordHash: fbUser.passwordHash,
          fullName: fbUser.fullName,
          role: (fbUser.role as SystemRole) || SystemRole.SUPER_ADMIN,
          isMfaEnabled: fbUser.isMfaEnabled || false,
          mfaEnabled: fbUser.mfaEnabled || false,
          mfaSecret: null,
          mfaBackupCodes: null,
          failedLogins: fbUser.failedLogins || 0,
          failedLoginAttempts: fbUser.failedLogins || 0,
          lockedUntil: fbUser.lockedUntil ? new Date(fbUser.lockedUntil) : null,
          lockoutUntil: fbUser.lockedUntil ? new Date(fbUser.lockedUntil) : null,
          isActive: fbUser.isActive,
          version: 1,
          createdAt: new Date(fbUser.createdAt),
          updatedAt: new Date(fbUser.updatedAt),
          deletedAt: null,
        } as User;
      }
      return null;
    }
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
    try {
      return await prismaClient.user.create({
        data: {
          fullName: data.fullName,
          email: data.email.toLowerCase(),
          passwordHash: data.passwordHash,
          role: data.role || SystemRole.ANALYST,
          organizationId: data.organizationId || null,
          isActive: true,
        },
      });
    } catch {
      const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const saved = await firebaseDbAdapter.saveUser({
        id: newId,
        email: data.email,
        fullName: data.fullName,
        passwordHash: data.passwordHash,
        role: data.role || SystemRole.ANALYST,
        organizationId: data.organizationId || null,
        isActive: true,
      });

      return {
        id: saved.id,
        organizationId: saved.organizationId || null,
        email: saved.email,
        passwordHash: saved.passwordHash,
        fullName: saved.fullName,
        role: (saved.role as SystemRole) || SystemRole.ANALYST,
        isMfaEnabled: false,
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: null,
        failedLogins: 0,
        failedLoginAttempts: 0,
        lockedUntil: null,
        lockoutUntil: null,
        isActive: true,
        version: 1,
        createdAt: new Date(saved.createdAt),
        updatedAt: new Date(saved.updatedAt),
        deletedAt: null,
      } as User;
    }
  }

  /**
   * Increment failed login counter and set account lock timestamp if threshold reached
   */
  public async recordFailedLogin(userId: string, failedCount: number, lockedUntil: Date | null): Promise<User> {
    try {
      return await prismaClient.user.update({
        where: { id: userId },
        data: {
          failedLogins: failedCount,
          failedLoginAttempts: failedCount,
          lockedUntil,
          lockoutUntil: lockedUntil,
        },
      });
    } catch {
      const fbUser = await firebaseDbAdapter.findUserById(userId);
      if (fbUser) {
        fbUser.failedLogins = failedCount;
        fbUser.lockedUntil = lockedUntil ? lockedUntil.toISOString() : null;
        await firebaseDbAdapter.saveUser(fbUser);
      }
      return (fbUser as any) || ({} as User);
    }
  }

  /**
   * Reset failed login counter upon successful authentication
   */
  public async resetFailedLogins(userId: string): Promise<User> {
    try {
      return await prismaClient.user.update({
        where: { id: userId },
        data: {
          failedLogins: 0,
          failedLoginAttempts: 0,
          lockedUntil: null,
          lockoutUntil: null,
        },
      });
    } catch {
      const fbUser = await firebaseDbAdapter.findUserById(userId);
      if (fbUser) {
        fbUser.failedLogins = 0;
        fbUser.lockedUntil = null;
        await firebaseDbAdapter.saveUser(fbUser);
      }
      return (fbUser as any) || ({} as User);
    }
  }

  /**
   * Update password hash
   */
  public async updatePassword(userId: string, newPasswordHash: string): Promise<User> {
    try {
      return await prismaClient.user.update({
        where: { id: userId },
        data: {
          passwordHash: newPasswordHash,
          version: { increment: 1 },
        },
      });
    } catch {
      const fbUser = await firebaseDbAdapter.findUserById(userId);
      if (fbUser) {
        fbUser.passwordHash = newPasswordHash;
        await firebaseDbAdapter.saveUser(fbUser);
      }
      return (fbUser as any) || ({} as User);
    }
  }

  /**
   * Updates user MFA or email verification state
   */
  public async updateVerificationState(userId: string, isVerified = true): Promise<User> {
    try {
      return await prismaClient.user.update({
        where: { id: userId },
        data: {
          isMfaEnabled: isVerified,
          mfaEnabled: isVerified,
        },
      });
    } catch {
      const fbUser = await firebaseDbAdapter.findUserById(userId);
      if (fbUser) {
        fbUser.isMfaEnabled = isVerified;
        fbUser.mfaEnabled = isVerified;
        await firebaseDbAdapter.saveUser(fbUser);
      }
      return (fbUser as any) || ({} as User);
    }
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
    try {
      return await prismaClient.session.create({
        data: {
          userId: data.userId,
          sessionToken: data.sessionToken,
          refreshToken: data.refreshToken,
          expiresAt: data.expiresAt,
          ipAddress: data.ipAddress || null,
          userAgent: data.userAgent || null,
        },
      });
    } catch {
      const sessionObj: Session = {
        id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: data.userId,
        sessionToken: data.sessionToken,
        refreshToken: data.refreshToken,
        userAgent: data.userAgent || null,
        ipAddress: data.ipAddress || null,
        expiresAt: data.expiresAt,
        createdAt: new Date(),
      };
      fallbackSessionMap.set(sessionObj.id, sessionObj);
      fallbackSessionMap.set(`ref_${data.refreshToken}`, sessionObj);
      fallbackSessionMap.set(`token_${data.sessionToken}`, sessionObj);
      return sessionObj;
    }
  }

  /**
   * Finds an active session by refresh token
   */
  public async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    try {
      return await prismaClient.session.findUnique({
        where: { refreshToken },
      });
    } catch {
      return fallbackSessionMap.get(`ref_${refreshToken}`) || null;
    }
  }

  /**
   * Finds an active session by session token
   */
  public async findBySessionToken(sessionToken: string): Promise<Session | null> {
    try {
      return await prismaClient.session.findUnique({
        where: { sessionToken },
      });
    } catch {
      return fallbackSessionMap.get(`token_${sessionToken}`) || null;
    }
  }

  /**
   * Finds all active sessions for a user
   */
  public async findUserSessions(userId: string): Promise<Session[]> {
    try {
      return await prismaClient.session.findMany({
        where: {
          userId,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      const list: Session[] = [];
      fallbackSessionMap.forEach((s) => {
        if (s.userId === userId && s.expiresAt > new Date()) {
          list.push(s);
        }
      });
      return list;
    }
  }

  /**
   * Updates refresh token during token rotation
   */
  public async updateRefreshToken(
    sessionId: string,
    newRefreshToken: string,
    newExpiresAt: Date
  ): Promise<Session> {
    try {
      return await prismaClient.session.update({
        where: { id: sessionId },
        data: {
          refreshToken: newRefreshToken,
          expiresAt: newExpiresAt,
        },
      });
    } catch {
      const session = fallbackSessionMap.get(sessionId);
      if (session) {
        session.refreshToken = newRefreshToken;
        session.expiresAt = newExpiresAt;
        fallbackSessionMap.set(`ref_${newRefreshToken}`, session);
      }
      return (session as Session) || ({ id: sessionId, refreshToken: newRefreshToken, expiresAt: newExpiresAt } as Session);
    }
  }

  /**
   * Revokes / deletes a session
   */
  public async deleteSession(sessionId: string): Promise<void> {
    try {
      await prismaClient.session.delete({
        where: { id: sessionId },
      });
    } catch {
      fallbackSessionMap.delete(sessionId);
    }
  }

  /**
   * Revokes all active sessions for a user
   */
  public async revokeAllUserSessions(userId: string): Promise<void> {
    try {
      await prismaClient.session.deleteMany({
        where: { userId },
      });
    } catch {
      fallbackSessionMap.forEach((s, key) => {
        if (s.userId === userId) {
          fallbackSessionMap.delete(key);
        }
      });
    }
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
