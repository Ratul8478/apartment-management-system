// =======================================================
// FinTrack Pro Enterprise Auth Platform
// Authentication & Authorization HTTP Middleware Guards
// =======================================================

import { NextRequest, NextResponse } from "next/server";
import { CryptoUtils } from "../utils/crypto.utils";
import { AUTH_CONSTANTS } from "../constants/auth.constants";
import { JwtTokenPayload } from "../types/auth.types";
import { SystemRole } from "@prisma/client";

export interface AuthenticatedNextRequest extends NextRequest {
  user?: JwtTokenPayload;
}

/**
 * Validates JWT Access Token from Cookie or Authorization Header
 */
export async function authenticateRequest(
  req: NextRequest
): Promise<{ user: JwtTokenPayload } | NextResponse> {
  const token =
    req.cookies.get(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME)?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        code: "UNAUTHORIZED",
        message: "Authentication access token is missing or invalid.",
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  }

  try {
    const payload = CryptoUtils.verifyAccessToken(token);
    return { user: payload };
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        code: error.code || "INVALID_TOKEN",
        message: error.message || "Invalid or expired authentication token.",
        timestamp: new Date().toISOString(),
      },
      { status: 401 }
    );
  }
}

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 */
export function requireRole(allowedRoles: SystemRole[], userRole: SystemRole): boolean {
  return allowedRoles.includes(userRole);
}
