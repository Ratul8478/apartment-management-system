// =======================================================
// FinTrack Pro Enterprise Auth Platform
// Auth Presentation Layer Controller
// =======================================================

import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../services/auth.service";
import {
  RegisterDtoSchema,
  LoginDtoSchema,
  RefreshTokenDtoSchema,
  ChangePasswordDtoSchema,
  VerifyEmailDtoSchema,
  ForgotPasswordDtoSchema,
  ResetPasswordDtoSchema,
} from "../dto/auth.dto";
import { AUTH_CONSTANTS } from "../constants/auth.constants";
import { AuthError } from "../errors/auth.errors";
import { CryptoUtils } from "../utils/crypto.utils";

export class AuthController {
  private authService: AuthService;

  constructor(authService = new AuthService()) {
    this.authService = authService;
  }

  /**
   * Helper to extract client IP address and User Agent
   */
  private getClientInfo(req: NextRequest): { ipAddress: string | null; userAgent: string | null } {
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null;
    const userAgent = req.headers.get("user-agent") || null;
    return { ipAddress, userAgent };
  }

  /**
   * Standardized Error Response Handler
   */
  private handleError(error: unknown): NextResponse {
    if (error instanceof AuthError) {
      return NextResponse.json(
        {
          success: false,
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: error.statusCode }
      );
    }

    console.error("[AuthController Error]", error);

    const errMessage = String((error as any)?.message || error);
    const isDbError = errMessage.includes("Can't reach database") || 
                      errMessage.includes("PrismaClientInitializationError") ||
                      errMessage.includes("P1001");

    return NextResponse.json(
      {
        success: false,
        code: isDbError ? "DATABASE_CONNECTION_ERROR" : "INTERNAL_SERVER_ERROR",
        message: isDbError
          ? "Database service is currently unreachable. Please check database connection settings."
          : "An unexpected security system error occurred. Please try again later.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }

  /**
   * POST /api/auth/register
   */
  public async handleRegister(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const validationResult = RegisterDtoSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            code: "VALIDATION_ERROR",
            message: "Validation failed for registration payload.",
            errors: validationResult.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const { ipAddress, userAgent } = this.getClientInfo(req);
      const result = await this.authService.register(validationResult.data, ipAddress, userAgent);

      return NextResponse.json(
        {
          success: true,
          message: "User identity registered successfully. Verification token generated.",
          data: {
            user: result.user,
            verificationToken: result.verificationToken,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  public async handleLogin(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const validationResult = LoginDtoSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            code: "VALIDATION_ERROR",
            message: "Validation failed for login payload.",
            errors: validationResult.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const { ipAddress, userAgent } = this.getClientInfo(req);
      const result = await this.authService.login(validationResult.data, ipAddress, userAgent);

      const response = NextResponse.json(
        {
          success: true,
          message: "Authentication successful.",
          data: {
            user: result.user,
            tokens: result.tokens,
          },
        },
        { status: 200 }
      );

      response.cookies.set(
        AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME,
        result.tokens.accessToken,
        {
          ...AUTH_CONSTANTS.COOKIE_OPTIONS,
          maxAge: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN_SECONDS,
        }
      );

      response.cookies.set(
        AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME,
        result.tokens.refreshToken,
        {
          ...AUTH_CONSTANTS.COOKIE_OPTIONS,
          maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN_SECONDS,
        }
      );

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST /api/auth/refresh
   */
  public async handleRefreshTokens(req: NextRequest): Promise<NextResponse> {
    try {
      let refreshToken = req.cookies.get(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME)?.value;

      if (!refreshToken) {
        const body = await req.json().catch(() => ({}));
        const validationResult = RefreshTokenDtoSchema.safeParse(body);
        if (validationResult.success) {
          refreshToken = validationResult.data.refreshToken;
        }
      }

      if (!refreshToken) {
        return NextResponse.json(
          {
            success: false,
            code: "MISSING_REFRESH_TOKEN",
            message: "Refresh token cookie or payload is required.",
          },
          { status: 401 }
        );
      }

      const { ipAddress, userAgent } = this.getClientInfo(req);
      const tokens = await this.authService.refreshTokens(refreshToken, ipAddress, userAgent);

      const response = NextResponse.json(
        {
          success: true,
          message: "Tokens refreshed successfully.",
          data: { tokens },
        },
        { status: 200 }
      );

      response.cookies.set(
        AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME,
        tokens.accessToken,
        {
          ...AUTH_CONSTANTS.COOKIE_OPTIONS,
          maxAge: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN_SECONDS,
        }
      );

      response.cookies.set(
        AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME,
        tokens.refreshToken,
        {
          ...AUTH_CONSTANTS.COOKIE_OPTIONS,
          maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN_SECONDS,
        }
      );

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  public async handleLogout(req: NextRequest): Promise<NextResponse> {
    try {
      const accessToken = req.cookies.get(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME)?.value ||
        req.headers.get("authorization")?.replace("Bearer ", "");

      if (accessToken) {
        try {
          const payload = CryptoUtils.verifyAccessToken(accessToken);
          const { ipAddress, userAgent } = this.getClientInfo(req);
          await this.authService.logout(payload.sessionId, payload.sub, ipAddress, userAgent);
        } catch {
          // Token verification failed or already expired, proceed to clear cookies
        }
      }

      const response = NextResponse.json(
        {
          success: true,
          message: "Logged out successfully.",
        },
        { status: 200 }
      );

      response.cookies.delete(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME);
      response.cookies.delete(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME);

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST /api/auth/verify-email
   */
  public async handleVerifyEmail(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const validationResult = VerifyEmailDtoSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            code: "VALIDATION_ERROR",
            message: "Verification token is required.",
          },
          { status: 400 }
        );
      }

      const { ipAddress, userAgent } = this.getClientInfo(req);
      await this.authService.verifyEmail(validationResult.data.token, ipAddress, userAgent);

      return NextResponse.json(
        {
          success: true,
          message: "Email address verified successfully.",
        },
        { status: 200 }
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  public async handleForgotPassword(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const validationResult = ForgotPasswordDtoSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            code: "VALIDATION_ERROR",
            message: "Valid email address is required.",
          },
          { status: 400 }
        );
      }

      const { ipAddress, userAgent } = this.getClientInfo(req);
      const { resetToken } = await this.authService.forgotPassword(validationResult.data.email, ipAddress, userAgent);

      return NextResponse.json(
        {
          success: true,
          message: "If an account exists with that email, a password reset link has been dispatched.",
          data: { resetToken },
        },
        { status: 200 }
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  public async handleResetPassword(req: NextRequest): Promise<NextResponse> {
    try {
      const body = await req.json();
      const validationResult = ResetPasswordDtoSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            code: "VALIDATION_ERROR",
            message: "Validation failed for password reset payload.",
            errors: validationResult.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const { ipAddress, userAgent } = this.getClientInfo(req);
      await this.authService.resetPassword(
        validationResult.data.token,
        validationResult.data.newPassword,
        ipAddress,
        userAgent
      );

      return NextResponse.json(
        {
          success: true,
          message: "Password reset successfully. You may now log in with your new password.",
        },
        { status: 200 }
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * GET /api/auth/sessions
   */
  public async handleGetActiveSessions(req: NextRequest): Promise<NextResponse> {
    try {
      const accessToken = req.cookies.get(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME)?.value ||
        req.headers.get("authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        return NextResponse.json(
          { success: false, code: "UNAUTHORIZED", message: "Authentication access token is missing." },
          { status: 401 }
        );
      }

      const payload = CryptoUtils.verifyAccessToken(accessToken);
      const sessions = await this.authService.getActiveSessions(payload.sub);

      return NextResponse.json(
        {
          success: true,
          data: { sessions },
        },
        { status: 200 }
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE /api/auth/sessions
   */
  public async handleTerminateAllSessions(req: NextRequest): Promise<NextResponse> {
    try {
      const accessToken = req.cookies.get(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME)?.value ||
        req.headers.get("authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        return NextResponse.json(
          { success: false, code: "UNAUTHORIZED", message: "Authentication access token is missing." },
          { status: 401 }
        );
      }

      const payload = CryptoUtils.verifyAccessToken(accessToken);
      const { ipAddress, userAgent } = this.getClientInfo(req);
      await this.authService.terminateAllSessions(payload.sub, ipAddress, userAgent);

      const response = NextResponse.json(
        {
          success: true,
          message: "All active device sessions terminated.",
        },
        { status: 200 }
      );

      response.cookies.delete(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME);
      response.cookies.delete(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME);

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE /api/auth/sessions/[sessionId]
   */
  public async handleTerminateSession(req: NextRequest, sessionId: string): Promise<NextResponse> {
    try {
      const accessToken = req.cookies.get(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME)?.value ||
        req.headers.get("authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        return NextResponse.json(
          { success: false, code: "UNAUTHORIZED", message: "Authentication access token is missing." },
          { status: 401 }
        );
      }

      const payload = CryptoUtils.verifyAccessToken(accessToken);
      const { ipAddress, userAgent } = this.getClientInfo(req);
      await this.authService.terminateSession(payload.sub, sessionId, ipAddress, userAgent);

      return NextResponse.json(
        {
          success: true,
          message: "Specified session terminated successfully.",
        },
        { status: 200 }
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  public async handleGetCurrentUser(req: NextRequest): Promise<NextResponse> {
    try {
      const accessToken = req.cookies.get(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME)?.value ||
        req.headers.get("authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        return NextResponse.json(
          {
            success: false,
            code: "UNAUTHORIZED",
            message: "Authentication access token is missing.",
          },
          { status: 401 }
        );
      }

      const payload = CryptoUtils.verifyAccessToken(accessToken);
      const user = await this.authService.getCurrentUser(payload.sub);

      return NextResponse.json(
        {
          success: true,
          data: { user },
        },
        { status: 200 }
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST /api/auth/change-password
   */
  public async handleChangePassword(req: NextRequest): Promise<NextResponse> {
    try {
      const accessToken = req.cookies.get(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME)?.value ||
        req.headers.get("authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        return NextResponse.json(
          {
            success: false,
            code: "UNAUTHORIZED",
            message: "Authentication access token is missing.",
          },
          { status: 401 }
        );
      }

      const payload = CryptoUtils.verifyAccessToken(accessToken);
      const body = await req.json();
      const validationResult = ChangePasswordDtoSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            code: "VALIDATION_ERROR",
            message: "Validation failed for password change payload.",
            errors: validationResult.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const { ipAddress, userAgent } = this.getClientInfo(req);
      await this.authService.changePassword(payload.sub, validationResult.data, ipAddress, userAgent);

      const response = NextResponse.json(
        {
          success: true,
          message: "Password updated successfully. Please log in with your new password.",
        },
        { status: 200 }
      );

      response.cookies.delete(AUTH_CONSTANTS.ACCESS_TOKEN_COOKIE_NAME);
      response.cookies.delete(AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_NAME);

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }
}
