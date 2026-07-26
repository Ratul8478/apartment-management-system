// =======================================================
// FinTrack Pro Enterprise Auth Platform
// Standardized Domain Error Hierarchy
// =======================================================

export class AuthError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 400, code = "AUTH_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message = "Invalid email or password credentials provided.") {
    super(message, 401, "INVALID_CREDENTIALS");
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor(email: string) {
    super(`An identity with email address '${email}' is already registered.`, 409, "USER_ALREADY_EXISTS");
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = "Authentication credentials required to access this resource.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = "You do not possess the required permissions to access this resource.") {
    super(message, 403, "FORBIDDEN");
  }
}

export class AccountLockedError extends AuthError {
  constructor(lockedUntil?: Date) {
    const timeInfo = lockedUntil ? ` until ${lockedUntil.toISOString()}` : "";
    super(`Account locked due to consecutive failed login attempts${timeInfo}.`, 423, "ACCOUNT_LOCKED");
  }
}

export class TokenExpiredError extends AuthError {
  constructor(message = "The authentication token has expired. Please log in again.") {
    super(message, 401, "TOKEN_EXPIRED");
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message = "Invalid or tampered authentication token signature.") {
    super(message, 401, "INVALID_TOKEN");
  }
}

export class UserNotFoundError extends AuthError {
  constructor(identifier: string) {
    super(`User identity '${identifier}' was not found.`, 404, "USER_NOT_FOUND");
  }
}

export class InvalidSessionError extends AuthError {
  constructor(message = "Session is invalid, revoked, or expired.") {
    super(message, 401, "INVALID_SESSION");
  }
}
