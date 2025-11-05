import { z } from 'zod';
import { UuidSchema, EmailSchema, PhoneE164Schema, DateSchema, DateStringSchema } from './common';

// Enums matching the backend
export const UserStatusSchema = z.enum(['active', 'locked', 'pending']);
export const GenderSchema = z.enum(['male', 'female', 'diverse']);
export const RoleSchema = z.enum(['admin', 'event_organizer', 'user']);
export const UserLanguageSchema = z.enum(['de', 'en']);

// Base user schema (what comes from the API)
export const UserSchema = z.object({
  id: UuidSchema,
  email: EmailSchema,
  phone_e164: PhoneE164Schema.nullable(),
  status: UserStatusSchema,
  role: RoleSchema,
  email_verified_at: DateSchema.nullable(),
  phone_verified_at: DateSchema.nullable(),
  created_at: DateSchema,
  last_login_at: DateSchema.nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  gender: GenderSchema.nullable(),
  dob: DateSchema.nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  balance: z.string(), // Numeric string from backend
  priority: z.boolean(),
  selected_language: UserLanguageSchema.nullable(),
  must_set_password: z.boolean(),
  session_token: z.string().nullable(),
  firebase_uuid: z.string().nullable(),
  firebase_id_token: z.string().nullable(),
});

// Create user input schema
export const CreateUserSchema = z.object({
  email: EmailSchema,
  phone_e164: PhoneE164Schema.optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  gender: GenderSchema.optional(),
  dob: DateStringSchema,
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  avatar_url: z.string().url().optional(),
  selected_language: UserLanguageSchema.optional(),
});

// Update user input schema (all fields optional except id)
export const UpdateUserSchema = z.object({
  email: EmailSchema.optional(),
  phone_e164: PhoneE164Schema.optional(),
  password: z.string().min(8).optional(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  gender: GenderSchema.optional(),
  dob: DateStringSchema.optional(),
  city: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  avatar_url: z.string().url().optional(),
  selected_language: UserLanguageSchema.optional(),
  priority: z.boolean().optional(),
});

// User profile setup schema (used during onboarding)
export const UserProfileSetupSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  gender: GenderSchema,
  dob: DateStringSchema,
});

// User location setup schema
export const UserLocationSetupSchema = z.object({
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
});

// User ID parameter schema
export const UserIdParamSchema = z.object({
  id: UuidSchema,
});

// User query parameters
export const UserQuerySchema = z.object({
  status: UserStatusSchema.optional(),
  role: RoleSchema.optional(),
  gender: GenderSchema.optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  verified: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

// Public user schema (limited fields for public API responses)
export const PublicUserSchema = UserSchema.pick({
  id: true,
  first_name: true,
  last_name: true,
  avatar_url: true,
  city: true,
  country: true,
  gender: true,
}).extend({
  age: z.number().optional(), // Calculated field
});

// User list response schema
export const UserListResponseSchema = z.array(UserSchema);
export const PublicUserListResponseSchema = z.array(PublicUserSchema);

// Balance update schema
export const UpdateBalanceSchema = z.object({
  amount: z.number(),
  operation: z.enum(['add', 'subtract', 'set']),
  description: z.string().optional(),
});

// Password schemas
export const ChangePasswordSchema = z.object({
  current_password: z.string(),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export const ResetPasswordSchema = z.object({
  token: z.string(),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserProfileSetup = z.infer<typeof UserProfileSetupSchema>;
export type UserLocationSetup = z.infer<typeof UserLocationSetupSchema>;
export type UserIdParam = z.infer<typeof UserIdParamSchema>;
export type UserQuery = z.infer<typeof UserQuerySchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
export type UpdateBalance = z.infer<typeof UpdateBalanceSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;

// Enum type exports
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type Gender = z.infer<typeof GenderSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type UserLanguage = z.infer<typeof UserLanguageSchema>;