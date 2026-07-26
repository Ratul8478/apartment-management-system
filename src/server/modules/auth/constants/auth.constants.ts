// =======================================================
// FinTrack Pro Enterprise Auth Platform
// Security Constants & Configuration Defaults
// =======================================================

export const AUTH_CONSTANTS = {
  // Password Hashing
  BCRYPT_SALT_ROUNDS: 12,

  // JWT Durations
  ACCESS_TOKEN_EXPIRES_IN_SECONDS: 15 * 60,       // 15 minutes
  REFRESH_TOKEN_EXPIRES_IN_SECONDS: 7 * 24 * 60 * 60, // 7 days
  RESET_TOKEN_EXPIRES_IN_SECONDS: 60 * 60,         // 1 hour

  // Lockout Security Thresholds
  MAX_FAILED_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,

  // Secure HTTP Cookie Names
  ACCESS_TOKEN_COOKIE_NAME: "fintrack_access_token",
  REFRESH_TOKEN_COOKIE_NAME: "fintrack_refresh_token",

  // Cookie Security Defaults
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  },
};
