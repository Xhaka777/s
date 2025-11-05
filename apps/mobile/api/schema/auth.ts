import { z } from 'zod';
import { EmailSchema, PhoneE164Schema } from './common';
import { UserLanguageSchema, UserSchema } from './user';

export const SignUpRequestSchema = z.object({
    email: EmailSchema,
    phone_e164: PhoneE164Schema,
    preferred_language: UserLanguageSchema.default('en'),
    firebase_id_token: z.string().min(10, 'Firebase ID token is required'),
});

export const SignUpResponseSchema = z.object({
    user: UserSchema,
    session_token: z.string(),
    needs_profile_setup: z.boolean(),
});

export const SignInRequestSchema = z.object({
    email: EmailSchema,
    password: z.string().min(1, 'Password is required'),
});

export const SignInWithPhoneSchema = z.object({
    phone_e164: PhoneE164Schema,
    verification_code: z.string().length(6, 'Verification code must be 6 digits'),
});

export const SignInResponseSchema = z.object({
    user: UserSchema,
    session_token: z.string(),
    acess_token: z.string(),
    refresh_token: z.string(),
    expires_in: z.number(),
});

export const ForgotPasswordRequestSchema = z.object({
    email: EmailSchema
});

export const ForgotPasswordResponseSchema = z.object({
    message: z.string(),
    reset_token_sent: z.boolean(),
});

export const ResetPasswordRequestSchema = z.object({
    reset_token: z.string(),
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Password don't match",
    path: ["confirm_password"],
})

export const SendPhoneVerificationSchema = z.object({
    phone_e164: PhoneE164Schema,
})

export const VerifyPhoneSchema = z.object({
  phone_e164: PhoneE164Schema,
  verification_code: z.string().length(6, 'Verification code must be 6 digits'),
});


export const PhoneVerificationResponseSchema = z.object({
  verified: z.boolean(),
  user: UserSchema.optional(),
});

// Email verification schemas
export const SendEmailVerificationSchema = z.object({
  email: EmailSchema,
});

export const VerifyEmailSchema = z.object({
  email: EmailSchema,
  verification_token: z.string(),
});

export const EmailVerificationResponseSchema = z.object({
  verified: z.boolean(),
  user: UserSchema.optional(),
});

// Token refresh schemas
export const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string(),
});

export const RefreshTokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
});

// Session validation schemas
export const ValidateSessionRequestSchema = z.object({
  session_token: z.string(),
});

export const ValidateSessionResponseSchema = z.object({
  valid: z.boolean(),
  user: UserSchema.optional(),
  expires_at: z.string().optional(),
});

// Firebase auth schemas
export const FirebaseAuthRequestSchema = z.object({
  firebase_id_token: z.string(),
  firebase_uid: z.string(),
});

export const FirebaseAuthResponseSchema = z.object({
  user: UserSchema,
  session_token: z.string(),
  is_new_user: z.boolean(),
});

// Logout schema
export const LogoutRequestSchema = z.object({
  session_token: z.string().optional(),
  device_id: z.string().optional(),
});

export const LogoutResponseSchema = z.object({
  message: z.string(),
  logged_out: z.boolean(),
});

// Change password schema (for authenticated users)
export const ChangePasswordRequestSchema = z.object({
  current_password: z.string(),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

// Check email/phone availability schemas
export const CheckEmailAvailabilitySchema = z.object({
  email: EmailSchema,
});

export const CheckPhoneAvailabilitySchema = z.object({
  phone_e164: PhoneE164Schema,
});

export const AvailabilityResponseSchema = z.object({
  available: z.boolean(),
  message: z.string().optional(),
});

// Social auth schemas (if needed later)
export const SocialAuthRequestSchema = z.object({
  provider: z.enum(['google', 'facebook', 'apple']),
  access_token: z.string(),
  email: EmailSchema.optional(),
  name: z.string().optional(),
});

// Account deletion schema
export const DeleteAccountRequestSchema = z.object({
  password: z.string().optional(),
  confirmation: z.literal('DELETE_MY_ACCOUNT'),
  reason: z.string().optional(),
});

export const DeleteAccountResponseSchema = z.object({
  deleted: z.boolean(),
  message: z.string(),
});

// Type exports
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
export type SignUpResponse = z.infer<typeof SignUpResponseSchema>;
export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type SignInWithPhone = z.infer<typeof SignInWithPhoneSchema>;
export type SignInResponse = z.infer<typeof SignInResponseSchema>;
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
export type ForgotPasswordResponse = z.infer<typeof ForgotPasswordResponseSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type SendPhoneVerification = z.infer<typeof SendPhoneVerificationSchema>;
export type VerifyPhone = z.infer<typeof VerifyPhoneSchema>;
export type PhoneVerificationResponse = z.infer<typeof PhoneVerificationResponseSchema>;
export type SendEmailVerification = z.infer<typeof SendEmailVerificationSchema>;
export type VerifyEmail = z.infer<typeof VerifyEmailSchema>;
export type EmailVerificationResponse = z.infer<typeof EmailVerificationResponseSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
export type ValidateSessionRequest = z.infer<typeof ValidateSessionRequestSchema>;
export type ValidateSessionResponse = z.infer<typeof ValidateSessionResponseSchema>;
export type FirebaseAuthRequest = z.infer<typeof FirebaseAuthRequestSchema>;
export type FirebaseAuthResponse = z.infer<typeof FirebaseAuthResponseSchema>;
export type LogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
export type CheckEmailAvailability = z.infer<typeof CheckEmailAvailabilitySchema>;
export type CheckPhoneAvailability = z.infer<typeof CheckPhoneAvailabilitySchema>;
export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>;
export type SocialAuthRequest = z.infer<typeof SocialAuthRequestSchema>;
export type DeleteAccountRequest = z.infer<typeof DeleteAccountRequestSchema>;
export type DeleteAccountResponse = z.infer<typeof DeleteAccountResponseSchema>;
