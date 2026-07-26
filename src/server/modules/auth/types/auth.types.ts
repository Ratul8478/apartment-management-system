// =======================================================
// FinTrack Pro Enterprise Auth Platform
// Domain Types & Payload Specifications
// =======================================================

import { SystemRole } from "@prisma/client";

export interface JwtTokenPayload {
  sub: string;             // User ID (UUID)
  email: string;           // User Email
  role: SystemRole;        // System RBAC Role
  organizationId: string | null; // Tenant Org ID
  sessionId: string;       // Active Session UUID
  iat?: number;            // Issued At Timestamp
  exp?: number;            // Expiration Timestamp
}

export interface RefreshTokenPayload {
  sub: string;             // User ID (UUID)
  sessionId: string;       // Active Session UUID
  tokenFamily: string;     // Token Rotation Family ID
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: SystemRole;
  organizationId: string | null;
  isMfaEnabled: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSessionInfo {
  sessionId: string;
  userId: string;
  sessionToken: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresInSeconds: number;
}

export interface AuthSuccessResult {
  user: AuthenticatedUser;
  tokens: TokenPair;
  session: UserSessionInfo;
}

export enum AccountStatus {
  GUEST = "GUEST",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  ACTIVE = "ACTIVE",
  LOCKED = "LOCKED",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}
