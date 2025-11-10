import { z } from 'zod';

// Common validation schemas
export const UuidSchema = z.string().uuid();
export const EmailSchema = z.string().email();
export const PhoneE164Schema = z.string().regex(/^\+[1-9]\d{7,14}$/, 'Must be a valid E.164 phone number');
export const DateSchema = z.preprocess((arg) => {
  if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  return arg;
}, z.date());
export const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

// Pagination schemas
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
  });

// Common response schemas
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
  code: z.string().optional(),
});

// API Response wrapper
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ErrorResponseSchema.optional(),
    message: z.string().optional(),
  });

// Base query parameters
export const BaseQuerySchema = z.object({
  search: z.string().optional(),
  filters: z.record(z.any()).optional(),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  message?: string;
};