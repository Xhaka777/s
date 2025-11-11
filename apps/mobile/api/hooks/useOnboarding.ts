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
import { VERIFF_STATUS, VeriffUtils } from '../../utils/VeriffUtils';

// Query Keys
export const onboardingKeys = {
  all: ['onboarding'] as const,
  status: () => [...onboardingKeys.all, 'status'] as const,
  progress: () => [...onboardingKeys.all, 'progress'] as const,
  preferences: () => [...onboardingKeys.all, 'preferences'] as const,
  questionnaireTemplate: () => [...onboardingKeys.all, 'questionnaireTemplate'] as const,
  questionnaireDraft: () => [...onboardingKeys.all, 'questionnaireDraft'] as const,
  verification: (id: string) => [...onboardingKeys.all, 'verification', id] as const,
  veriffStatus: (sessionId: string) => [...onboardingKeys.all, 'veriff', sessionId] as const,
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
    onSuccess: async (response) => {
      if (response.success && response.session_id) {
        // Store the Veriff session ID for later use
        await VeriffUtils.saveSessionId(response.session_id);
        console.log('Stage Three completed - Veriff session created:', response.session_id);
      }
    },
    onError: (error) => {
      console.error('Stage Three failed:', error);
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
    onSuccess: async (response) => {
      console.log('Veriff webhook processed:', response);
      // Invalidate session/onboarding queries since verification status may have changed
      queryClient.invalidateQueries({ queryKey: onboardingKeys.all });
    },
    ...options,
  });
};

export const useVeriffStatus = (
  sessionId: string,
  options?: UseQueryOptions<VeriffStatusResponse, Error>
) => {
  return useQuery({
    queryKey: onboardingKeys.veriffStatus(sessionId),
    queryFn: async () => {
      const response = await onboardingService.getVeriffStatus(sessionId);
      
      // Save the latest status to AsyncStorage
      if (response.status) {
        await VeriffUtils.saveVerificationStatus(response.status);
      }
      
      return response;
    },
    enabled: !!sessionId, // Only run query if sessionId exists
    staleTime: 10000, // Consider data stale after 10 seconds
    refetchInterval: (data, query) => {
      // Poll every 5 seconds if status is still pending/processing
      if (data?.status === VERIFF_STATUS.PENDING || data?.status === VERIFF_STATUS.PROCESSING) {
        return 5000;
      }
      return false; // Stop polling when complete
    },
    refetchIntervalInBackground: false, // Don't poll in background
    retry: (failureCount, error) => {
      // Don't retry more than 3 times
      if (failureCount >= 3) return false;
      
      // Don't retry on 404 (session not found)
      if (error.message?.includes('404')) return false;
      
      return true;
    },
    ...options,
  });
};

export const useStoredVeriffSession = () => {
  return useQuery({
    queryKey: ['stored-veriff-session'],
    queryFn: () => VeriffUtils.getSessionId(),
    staleTime: Infinity, // Don't refetch unless manually invalidated
  });
};

// Hook to get stored verification status
export const useStoredVerificationStatus = () => {
  return useQuery({
    queryKey: ['stored-verification-status'],
    queryFn: () => VeriffUtils.getVerificationStatus(),
    staleTime: 30000, // Consider stale after 30 seconds
  });
};

// Custom hook for complete verification flow
export const useVerificationFlow = () => {
  const queryClient = useQueryClient();
  
  const clearVerificationData = async () => {
    await VeriffUtils.clearSessionId();
    await AsyncStorage.removeItem('@verification_status');
    queryClient.invalidateQueries({ queryKey: ['stored-veriff-session'] });
    queryClient.invalidateQueries({ queryKey: ['stored-verification-status'] });
  };

  const resetVerificationFlow = async () => {
    await clearVerificationData();
    queryClient.invalidateQueries({ queryKey: onboardingKeys.all });
  };

  return {
    clearVerificationData,
    resetVerificationFlow,
  };
};