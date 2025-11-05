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


// Type exports
export type OnboardingStatus = z.infer<typeof OnboardingStatusSchema>;
export type OnboardingStageOneRequest = z.infer<typeof OnboardingStageOneRequestSchema>;
export type OnboardingStageOneResponse = z.infer<typeof OnboardingStageOneResponseSchema>;
export type CheckSessionRequest = z.infer<typeof CheckSessionRequestSchema>;
export type CheckSessionResponse = z.infer<typeof CheckSessionResponseSchema>;
