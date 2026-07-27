// =======================================================
// FinTrack Pro Enterprise Auth Platform
// Auth Module Core Business Logic Service
// =======================================================

import { AuthUserRepository, AuthSessionRepository, AuthAuditRepository } from "../repositories/auth.repository";
import { CryptoUtils } from "../utils/crypto.utils";
import { AUTH_CONSTANTS } from "../constants/auth.constants";
import { RegisterDto, LoginDto, ChangePasswordDto } from "../dto/auth.dto";
import { AuthenticatedUser, AuthSuccessResult, TokenPair, UserSessionInfo } from "../types/auth.types";
import {
  UserAlreadyExistsError,
  InvalidCredentialsError,
  AccountLockedError,
  UserNotFoundError,
  InvalidSessionError,
  InvalidTokenError,
  AuthError,
} from "../errors/auth.errors";
import { resendEmail } from "@/lib/email/resendEmail";
import { syncUserRealtimeAuth } from "@/lib/firebase/authSync";

export class AuthService {
  private userRepo: AuthUserRepository;
  private sessionRepo: AuthSessionRepository;
  private auditRepo: AuthAuditRepository;

  constructor(
    userRepo = new AuthUserRepository(),
    sessionRepo = new AuthSessionRepository(),
    auditRepo = new AuthAuditRepository()
  ) {
    this.userRepo = userRepo;
    this.sessionRepo = sessionRepo;
    this.auditRepo = auditRepo;
  }

  /**
   * Registers a new user identity with real-time email verification, instant session creation, and Firebase Realtime DB sync
   */
  public async register(
    dto: RegisterDto,
    ipAddress?: string | null,
    userAgent?: string | null
  ): Promise<{ user: AuthenticatedUser; verificationToken: string; tokens: TokenPair }> {
    // 1. Check if user already exists
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new UserAlreadyExistsError(dto.email);
    }

    // 2. Hash password with bcrypt salt rounds = 12
    const passwordHash = await CryptoUtils.hashPassword(dto.password);

    // 3. Create user record in DB
    const user = await this.userRepo.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      role: dto.role,
      organizationId: dto.organizationId,
    });

    // 4. Generate Email Verification Token & OTP Code
    const verificationToken = CryptoUtils.generateOpaqueToken(32);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await this.auditRepo.saveToken(`email_verify:${verificationToken}`, JSON.stringify({ userId: user.id, email: user.email, otpCode }));

    // 5. Dispatch Real-Time Confirmation Email directly to user inbox
    try {
      await resendEmail.sendVerificationEmail(user.email, user.fullName, verificationToken, otpCode);
    } catch (emailErr) {
      console.warn('[Realtime Email Dispatch Notice]', emailErr);
    }

    // 6. Sync User Identity & Auth State to Firebase Realtime Database
    try {
      await syncUserRealtimeAuth({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        organizationId: user.organizationId,
        isVerified: true,
        registeredAt: new Date().toISOString(),
      });
    } catch (fbErr) {
      console.warn('[Firebase Realtime Sync Notice]', fbErr);
    }

    // 7. Create immediate authenticated session for direct dashboard entry
    const now = new Date();
    const sessionToken = CryptoUtils.generateOpaqueToken(32);
    const refreshTokenString = CryptoUtils.generateOpaqueToken(32);
    const sessionExpiresAt = new Date(now.getTime() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000);

    const session = await this.sessionRepo.createSession({
      userId: user.id,
      sessionToken,
      refreshToken: refreshTokenString,
      expiresAt: sessionExpiresAt,
      ipAddress,
      userAgent,
    });

    const accessToken = CryptoUtils.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      sessionId: session.id,
    });

    const jwtRefreshToken = CryptoUtils.generateRefreshToken({
      sub: user.id,
      sessionId: session.id,
      tokenFamily: refreshTokenString,
    });

    // 8. Log Security Audit Event
    await this.auditRepo.logEvent({
      organizationId: user.organizationId,
      actorUserId: user.id,
      action: "USER_REGISTERED_AUTO_LOGGED_IN",
      targetId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      user: this.mapToAuthenticatedUser(user),
      verificationToken,
      tokens: {
        accessToken,
        refreshToken: jwtRefreshToken,
        tokenType: "Bearer",
        expiresInSeconds: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      },
    };
  }

  /**
   * Authenticates user credentials and issues session + JWT token pair with real-time alerts & Firebase sync
   */
  public async login(
    dto: LoginDto,
    ipAddress?: string | null,
    userAgent?: string | null
  ): Promise<AuthSuccessResult> {
    // 1. Locate user by email
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // 2. Check if account is currently locked
    const now = new Date();
    if (user.lockedUntil && user.lockedUntil > now) {
      throw new AccountLockedError(user.lockedUntil);
    }

    // 3. Verify bcrypt password
    const isPasswordValid = await CryptoUtils.comparePassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      const newFailedCount = user.failedLogins + 1;
      let lockedUntil: Date | null = null;

      if (newFailedCount >= AUTH_CONSTANTS.MAX_FAILED_LOGIN_ATTEMPTS) {
        lockedUntil = new Date(now.getTime() + AUTH_CONSTANTS.LOCKOUT_DURATION_MINUTES * 60 * 1000);
      }

      await this.userRepo.recordFailedLogin(user.id, newFailedCount, lockedUntil);

      await this.auditRepo.logEvent({
        organizationId: user.organizationId,
        actorUserId: user.id,
        action: "LOGIN_FAILED",
        targetId: user.id,
        metadata: { failedCount: newFailedCount, isLocked: !!lockedUntil },
        ipAddress,
        userAgent,
      });

      if (lockedUntil) {
        throw new AccountLockedError(lockedUntil);
      }

      throw new InvalidCredentialsError();
    }

    // 4. Reset failed login counter on success
    if (user.failedLogins > 0 || user.lockedUntil !== null) {
      await this.userRepo.resetFailedLogins(user.id);
    }

    // 5. Generate secure session tokens & opaque tokens
    const sessionToken = CryptoUtils.generateOpaqueToken(32);
    const refreshTokenString = CryptoUtils.generateOpaqueToken(32);
    const sessionExpiresAt = new Date(now.getTime() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000);

    // 6. Create session in DB
    const session = await this.sessionRepo.createSession({
      userId: user.id,
      sessionToken,
      refreshToken: refreshTokenString,
      expiresAt: sessionExpiresAt,
      ipAddress,
      userAgent,
    });

    // 7. Sign JWT Access Token
    const accessToken = CryptoUtils.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      sessionId: session.id,
    });

    // 8. Sign JWT Refresh Token
    const jwtRefreshToken = CryptoUtils.generateRefreshToken({
      sub: user.id,
      sessionId: session.id,
      tokenFamily: refreshTokenString,
    });

    // 9. Dispatch Real-Time Login Alert Notification
    resendEmail.sendLoginAlertEmail(user.email, user.fullName, ipAddress, userAgent).catch(() => {});

    // 10. Sync Live Session & Active Auth to Firebase Realtime Database
    syncUserRealtimeAuth({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      organizationId: user.organizationId,
      isVerified: true,
      lastLoginAt: new Date().toISOString(),
      lastActiveSessionId: session.id,
    }).catch(() => {});

    // 11. Log Security Audit Event
    await this.auditRepo.logEvent({
      organizationId: user.organizationId,
      actorUserId: user.id,
      action: "LOGIN_SUCCESS",
      targetId: session.id,
      ipAddress,
      userAgent,
    });

    return {
      user: this.mapToAuthenticatedUser(user),
      tokens: {
        accessToken,
        refreshToken: jwtRefreshToken,
        tokenType: "Bearer",
        expiresInSeconds: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      },
      session: {
        sessionId: session.id,
        userId: user.id,
        sessionToken: session.sessionToken,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
      },
    };
  }

  /**
   * Refreshes JWT token pair using Refresh Token rotation
   */
  public async refreshTokens(
    refreshTokenJwt: string,
    ipAddress?: string | null,
    userAgent?: string | null
  ): Promise<TokenPair> {
    const payload = CryptoUtils.verifyRefreshToken(refreshTokenJwt);
    const session = await this.sessionRepo.findByRefreshToken(payload.tokenFamily);

    if (!session || session.expiresAt < new Date()) {
      throw new InvalidSessionError("Session expired or revoked.");
    }

    const user = await this.userRepo.findById(session.userId);
    if (!user || !user.isActive) {
      throw new InvalidSessionError("User account is inactive or disabled.");
    }

    const newRefreshTokenString = CryptoUtils.generateOpaqueToken(32);
    const newExpiresAt = new Date(Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000);

    await this.sessionRepo.updateRefreshToken(session.id, newRefreshTokenString, newExpiresAt);

    const newAccessToken = CryptoUtils.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      sessionId: session.id,
    });

    const newJwtRefreshToken = CryptoUtils.generateRefreshToken({
      sub: user.id,
      sessionId: session.id,
      tokenFamily: newRefreshTokenString,
    });

    await this.auditRepo.logEvent({
      organizationId: user.organizationId,
      actorUserId: user.id,
      action: "TOKEN_REFRESHED",
      targetId: session.id,
      ipAddress,
      userAgent,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newJwtRefreshToken,
      tokenType: "Bearer",
      expiresInSeconds: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    };
  }

  /**
   * Terminate active session (Logout)
   */
  public async logout(sessionId: string, userId: string, ipAddress?: string | null, userAgent?: string | null): Promise<void> {
    await this.sessionRepo.deleteSession(sessionId);

    await this.auditRepo.logEvent({
      actorUserId: userId,
      action: "LOGOUT_SUCCESS",
      targetId: sessionId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Verifies an email confirmation token
   */
  public async verifyEmail(token: string, ipAddress?: string | null, userAgent?: string | null): Promise<void> {
    const rawData = await this.auditRepo.getToken(`email_verify:${token}`);
    if (!rawData) {
      throw new InvalidTokenError("Email verification token is invalid or has expired.");
    }

    const payload = JSON.parse(rawData);
    await this.userRepo.updateVerificationState(payload.userId, true);
    await this.auditRepo.deleteToken(`email_verify:${token}`);

    await this.auditRepo.logEvent({
      actorUserId: payload.userId,
      action: "EMAIL_VERIFIED",
      targetId: payload.userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Issues password reset token link
   */
  public async forgotPassword(email: string, ipAddress?: string | null, userAgent?: string | null): Promise<{ resetToken: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      // Return dummy token for timing attack protection
      return { resetToken: CryptoUtils.generateOpaqueToken(32) };
    }

    const resetToken = CryptoUtils.generateOpaqueToken(32);
    await this.auditRepo.saveToken(`pwd_reset:${resetToken}`, JSON.stringify({ userId: user.id, email: user.email }));

    await this.auditRepo.logEvent({
      organizationId: user.organizationId,
      actorUserId: user.id,
      action: "PASSWORD_RESET_REQUESTED",
      targetId: user.id,
      ipAddress,
      userAgent,
    });

    return { resetToken };
  }

  /**
   * Executes password reset with token
   */
  public async resetPassword(token: string, newPassword: string, ipAddress?: string | null, userAgent?: string | null): Promise<void> {
    const rawData = await this.auditRepo.getToken(`pwd_reset:${token}`);
    if (!rawData) {
      throw new InvalidTokenError("Password reset token is invalid or has expired.");
    }

    const payload = JSON.parse(rawData);
    const newHash = await CryptoUtils.hashPassword(newPassword);

    await this.userRepo.updatePassword(payload.userId, newHash);
    await this.sessionRepo.revokeAllUserSessions(payload.userId);
    await this.auditRepo.deleteToken(`pwd_reset:${token}`);

    await this.auditRepo.logEvent({
      actorUserId: payload.userId,
      action: "PASSWORD_RESET_EXECUTED",
      targetId: payload.userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Lists all active device sessions for current user
   */
  public async getActiveSessions(userId: string): Promise<UserSessionInfo[]> {
    const sessions = await this.sessionRepo.findUserSessions(userId);
    return sessions.map((s) => ({
      sessionId: s.id,
      userId: s.userId,
      sessionToken: s.sessionToken,
      refreshToken: s.refreshToken,
      expiresAt: s.expiresAt,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
    }));
  }

  /**
   * Terminates a single device session
   */
  public async terminateSession(userId: string, sessionId: string, ipAddress?: string | null, userAgent?: string | null): Promise<void> {
    await this.sessionRepo.deleteSession(sessionId);

    await this.auditRepo.logEvent({
      actorUserId: userId,
      action: "SESSION_TERMINATED",
      targetId: sessionId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Terminates all device sessions for a user
   */
  public async terminateAllSessions(userId: string, ipAddress?: string | null, userAgent?: string | null): Promise<void> {
    await this.sessionRepo.revokeAllUserSessions(userId);

    await this.auditRepo.logEvent({
      actorUserId: userId,
      action: "ALL_SESSIONS_TERMINATED",
      targetId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Retrieves active authenticated user details
   */
  public async getCurrentUser(userId: string): Promise<AuthenticatedUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    return this.mapToAuthenticatedUser(user);
  }

  /**
   * Changes user password and revokes all active sessions
   */
  public async changePassword(
    userId: string,
    dto: ChangePasswordDto,
    ipAddress?: string | null,
    userAgent?: string | null
  ): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const isValid = await CryptoUtils.comparePassword(dto.oldPassword, user.passwordHash);
    if (!isValid) {
      throw new AuthError("Current password provided is incorrect.", 400, "INVALID_OLD_PASSWORD");
    }

    const newHash = await CryptoUtils.hashPassword(dto.newPassword);
    await this.userRepo.updatePassword(userId, newHash);
    await this.sessionRepo.revokeAllUserSessions(userId);

    await this.auditRepo.logEvent({
      organizationId: user.organizationId,
      actorUserId: userId,
      action: "PASSWORD_CHANGED",
      targetId: userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Maps Prisma User entity to public AuthenticatedUser interface
   */
  private mapToAuthenticatedUser(user: any): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      organizationId: user.organizationId,
      isMfaEnabled: user.isMfaEnabled || user.mfaEnabled || false,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
