// =======================================================
// FinTrack Pro Enterprise Auth Platform
// Cryptographic Utility Functions & JWT Engine
// =======================================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AUTH_CONSTANTS } from "../constants/auth.constants";
import { JwtTokenPayload, RefreshTokenPayload } from "../types/auth.types";
import { InvalidTokenError, TokenExpiredError } from "../errors/auth.errors";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fintrack-pro-production-secret-jwt-key-2026-min32char";

export class CryptoUtils {
  /**
   * Hashes plain text password using bcrypt with salt rounds = 12
   */
  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compares plain text password against bcrypt hash
   */
  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generates a signed Access Token JWT (15-minute lifespan)
   */
  public static generateAccessToken(payload: Omit<JwtTokenPayload, "iat" | "exp">): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      algorithm: "HS256",
    });
  }

  /**
   * Generates a signed Refresh Token JWT (7-day lifespan)
   */
  public static generateRefreshToken(payload: Omit<RefreshTokenPayload, "iat" | "exp">): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN_SECONDS,
      algorithm: "HS256",
    });
  }

  /**
   * Verifies an Access Token JWT signature and expiration
   */
  public static verifyAccessToken(token: string): JwtTokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtTokenPayload;
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError();
      }
      throw new InvalidTokenError();
    }
  }

  /**
   * Verifies a Refresh Token JWT signature and expiration
   */
  public static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError("Refresh token has expired. Please log in again.");
      }
      throw new InvalidTokenError("Invalid refresh token signature.");
    }
  }

  /**
   * Generates a cryptographically secure random opaque token string (HEX)
   */
  public static generateOpaqueToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString("hex");
  }
}
