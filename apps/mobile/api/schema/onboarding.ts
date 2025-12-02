import { z } from 'zod';
import { EmailSchema, PhoneE164Schema } from './common';
import { UserLanguageSchema } from './user';

// Onboarding status schema
export const OnboardingStatusSchema = z.object({
    status: z.number().min(0).max(5),
    message: z.string(),
    details: z.object({
        currentStep: z.string(),
        progress: z.object({
            completed: z.number(),
            total: z.number(),
            percentage: z.number(),
        }),
    }),
});

// Stage One - Initial registration with phone verification
export const OnboardingStageOneRequestSchema = z.object({
    email: EmailSchema,
    phone_e164: PhoneE164Schema,
    preferred_language: UserLanguageSchema,
    firebase_id_token: z.string().min(10, 'Firebase ID token is required'),
});

export const OnboardingStageOneResponseSchema = z.object({
    success: z.boolean(),
    token: z.string(),
    message: z.string(),
});

// export const OnboardingStageOneResponseSchema = z.object({
//   session_token: z.string().min(10),
//   user_id: z.string().uuid(),
//   next_step: z.string(),
// });

export const CheckSessionRequestSchema = z.object({
    session_token: z.string().min(1, 'Session token is required'),
});

export const CheckSessionResponseSchema = z.object({
    authenticated: z.boolean(),
    requiresReauthentication: z.boolean().optional(),
    onbordingCompleted: z.boolean(),
    onboarding: OnboardingStatusSchema.optional(),
    requiresPhoneAuth: z.boolean().optional(),
})

export const OnboardingStageTwoRequestSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
});

export const OnboardingStageTwoResponseSchema = z.object({
    session_token: z.string().min(10),
});

export const OnboardingStageThreeRequestSchema = z.object({
    // user_id: z.string().uuid('User ID must be a valid UUID'),
});

export const OnboardingStageThreeResponseSchema = z.object({
    success: z.boolean(),
    session_id: z.string(), // For Veriff SDK
    verification_url: z.string(),
    message: z.string(),
});

//register user for user_id
export const CreateUserRequestSchema = z.object({
    email: z.string().email(),
    phone_e164: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone format').optional(),
    password: z.string().min(8),
    role_id: z.string().uuid(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    city: z.string().min(1),
    country: z.string().min(1),
    avatar_url: z.string().url().optional(),
    balance: z.number().min(0).default(100),
    priority: z.boolean().default(false),
    status: z.string().optional(),
});
//
export const CreateUserResponseSchema = z.object({
    id: z.string().uuid(),
    email: z.string(),
    phone_e164: z.string().optional(),
    status: z.string(),
    role_id: z.string(),
    email_verified_at: z.string().datetime().optional(),
    phone_verified_at: z.string().datetime().optional(),
    created_at: z.string().datetime(),
    last_login_at: z.string().datetime().optional(),
    first_name: z.string(),
    last_name: z.string(),
    gender: z.string().optional(),
    dob: z.string(),
    city: z.string(),
    country: z.string(),
    avatar_url: z.string().optional(),
    balance: z.number(),
    priority: z.boolean(),
});

export const VeriffWebhookRequestSchema = z.object({
    sessionId: z.string(),
    status: z.string(),
    person: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
    }).optional(),
    document: z.object({
        type: z.string().optional(),
        number: z.string().optional(),
    }).optional(),
});

export const VeriffWebhookResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export const VeriffStatusResponseSchema = z.object({
    success: z.boolean(),
    sessionId: z.string(),
    status: z.string(), // e.g., 'pending', 'approved', 'declined', etc.
});

// Type exports
export type OnboardingStatus = z.infer<typeof OnboardingStatusSchema>;
export type OnboardingStageOneRequest = z.infer<typeof OnboardingStageOneRequestSchema>;
export type OnboardingStageOneResponse = z.infer<typeof OnboardingStageOneResponseSchema>;
export type CheckSessionRequest = z.infer<typeof CheckSessionRequestSchema>;
export type CheckSessionResponse = z.infer<typeof CheckSessionResponseSchema>;
export type OnboardingStageTwoRequest = z.infer<typeof OnboardingStageTwoRequestSchema>;
export type OnboardingStageTwoResponse = z.infer<typeof OnboardingStageTwoResponseSchema>;
export type OnboardingStageThreeRequest = z.infer<typeof OnboardingStageThreeRequestSchema>;
export type OnboardingStageThreeResponse = z.infer<typeof OnboardingStageThreeResponseSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
export type VeriffWebhookRequest = z.infer<typeof VeriffWebhookRequestSchema>;
export type VeriffWebhookResponse = z.infer<typeof VeriffWebhookResponseSchema>;
export type VeriffStatusResponse = z.infer<typeof VeriffStatusResponseSchema>;
