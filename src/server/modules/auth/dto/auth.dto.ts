// =======================================================
// FinTrack Pro Enterprise Auth Platform
// Request DTO Schemas & Zod Validation Protocols
// =======================================================

import { z } from "zod";
import { SystemRole } from "@prisma/client";

// Password Strength Regex: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const RegisterDtoSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required." })
    .min(2, "Full name must be at least 2 characters long.")
    .max(150, "Full name cannot exceed 150 characters.")
    .trim(),
  email: z
    .string({ required_error: "Email address is required." })
    .email("Must be a valid email address.")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters long.")
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
    ),
  role: z.nativeEnum(SystemRole).optional().default(SystemRole.ANALYST),
  organizationId: z.string().uuid("Invalid organization ID format.").optional().nullable(),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export const LoginDtoSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .email("Must be a valid email address.")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, "Password cannot be empty."),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const RefreshTokenDtoSchema = z.object({
  refreshToken: z
    .string({ required_error: "Refresh token is required." })
    .min(1, "Refresh token cannot be empty."),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>;

export const ForgotPasswordDtoSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .email("Must be a valid email address.")
    .toLowerCase()
    .trim(),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDtoSchema>;

export const ResetPasswordDtoSchema = z.object({
  token: z.string({ required_error: "Reset token is required." }).min(1, "Reset token cannot be empty."),
  newPassword: z
    .string({ required_error: "New password is required." })
    .min(8, "New password must be at least 8 characters long.")
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
    ),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoSchema>;

export const ChangePasswordDtoSchema = z.object({
  oldPassword: z.string({ required_error: "Current password is required." }).min(1),
  newPassword: z
    .string({ required_error: "New password is required." })
    .min(8, "New password must be at least 8 characters long.")
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
    ),
});

export type ChangePasswordDto = z.infer<typeof ChangePasswordDtoSchema>;

export const VerifyEmailDtoSchema = z.object({
  token: z.string({ required_error: "Verification token is required." }).min(1),
});

export type VerifyEmailDto = z.infer<typeof VerifyEmailDtoSchema>;

export const ResendVerificationDtoSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .email("Must be a valid email address.")
    .toLowerCase()
    .trim(),
});

export type ResendVerificationDto = z.infer<typeof ResendVerificationDtoSchema>;
