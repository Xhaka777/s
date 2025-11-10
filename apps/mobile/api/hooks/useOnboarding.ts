import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
  useQuery
} from '@tanstack/react-query';
import { onboardingService } from '../services/onboarding';
import {
  CreateUserRequest,
  CreateUserResponse,
  OnboardingStageOneRequest,
  OnboardingStageOneResponse,
  OnboardingStageThreeRequest,
  OnboardingStageThreeResponse,
  OnboardingStageTwoRequest,
  OnboardingStageTwoResponse,
  VeriffStatusResponse,
  VeriffWebhookRequest,
  VeriffWebhookResponse,
} from '../schema/onboarding';
import { tokenStorage } from '../services/tokenStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        console.log('Stage One completed:', response.message);
      }
    },
    ...options,
  });
};


export const useCompleteStageTwo = (
  options?: UseMutationOptions<OnboardingStageTwoResponse, Error, OnboardingStageTwoRequest>
) => {
  return useMutation({
    mutationFn: (data: OnboardingStageTwoRequest) => onboardingService.completeStageTwo(data),
    onSuccess: async (response) => {
      //we replace the old f session_token with this new one for stage twoooo000
      await tokenStorage.saveToken(response.session_token);
    },
    ...options,
  })
}

export const useCompleteStageThree = (
  options?: UseMutationOptions<OnboardingStageThreeResponse, Error, OnboardingStageThreeRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OnboardingStageThreeRequest) => onboardingService.completeStageThree(data),
    onSuccess: (response) => {
      // Note: Stage 3 returns session_id (for Veriff), not session_token
      // no need to... update tokenStorage here
    },
    ...options,
  });
};

export const useRegisterUser = (
  options?: UseMutationOptions<CreateUserResponse, Error, CreateUserRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => onboardingService.registerUser(data),
    onSuccess: (response) => {
      console.log('User registered:', response);
      // Store user ID for Stage Three
      AsyncStorage.setItem('@spooned_user_id', response.id);
    },
    ...options,
  });
};

export const useVeriffWebhook = (
  options?: UseMutationOptions<VeriffWebhookResponse, Error, VeriffWebhookRequest>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VeriffWebhookRequest) => onboardingService.handleVeriffWebhook(data),
    onSuccess: (response) => {
      console.log('Veriff webhook processed:', response);
      // Invalidate session/onboarding queries since verification status may have changed
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },
    ...options,
  });
};

export const useVeriffStatus = (
  sessionId: string,
  options?: UseQueryOptions<VeriffStatusResponse, Error>
) => {
  return useQuery({
    queryKey: ['veriff-status', sessionId],
    queryFn: () => onboardingService.getVeriffStatus(sessionId),
    enabled: !!sessionId, // Only run query if sessionId exists
    refetchInterval: (data) => {
      // Poll every 5 seconds if status is still pending
      if (data?.status === 'pending' || data?.status === 'processing') {
        return 5000;
      }
      return false; // Stop polling when complete
    },
    ...options,
  });
};