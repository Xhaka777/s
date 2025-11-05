import { 
  useMutation, 
  useQueryClient,
  UseMutationOptions 
} from '@tanstack/react-query';
import { onboardingService } from '../services/onboarding';
import {
  OnboardingStageOneRequest,
  OnboardingStageOneResponse,
} from '../schema/onboarding';

// Query Keys
export const onboardingKeys = {
  all: ['onboarding'] as const,
  status: () => [...onboardingKeys.all, 'status'] as const,
  progress: () => [...onboardingKeys.all, 'progress'] as const,
  preferences: () => [...onboardingKeys.all, 'preferences'] as const,
  questionnaireTemplate: () => [...onboardingKeys.all, 'questionnaireTemplate'] as const,
  questionnaireDraft: () => [...onboardingKeys.all, 'questionnaireDraft'] as const,
  verification: (id: string) => [...onboardingKeys.all, 'verification', id] as const,
} as const;

// Complete Stage One
export const useCompleteStageOne = (
  options?: UseMutationOptions<OnboardingStageOneResponse, Error, OnboardingStageOneRequest>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: OnboardingStageOneRequest) => onboardingService.completeStageOne(data),
    onSuccess: (response) => {
      if (response.success) {
        console.log('✅ Stage One completed:', response.message);
      }
    },
    ...options,
  });
};
