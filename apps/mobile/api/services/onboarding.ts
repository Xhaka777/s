import { apiClient } from './apis';
import {
  CheckSessionResponse,
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
import { ApiRoutes } from '../types';

export const onboardingService = {
  completeStageOne: async (data: OnboardingStageOneRequest): Promise<OnboardingStageOneResponse> => {
    // Transform the data to match backend expectations
    const reqData = {
      email: data.email,
      phone_e164: data.phone_e164, // Transform phone_e164 to phone
      preferred_language: data.preferred_language,
      firebase_id_token: data.firebase_id_token
    };

    return await apiClient.post<OnboardingStageOneResponse>(
      ApiRoutes.ONBOARDING_STAGE_ONE,
      reqData
    );
  },

  checkSession: async (sessionToken: string): Promise<CheckSessionResponse> => {
    return await apiClient.post<CheckSessionResponse>(
      ApiRoutes.CHECK_SESSION,
      { session_token: sessionToken }
    );
  },

  completeStageTwo: async (data: OnboardingStageTwoRequest): Promise<OnboardingStageTwoResponse> => {
    return await apiClient.post<OnboardingStageTwoResponse>(
      ApiRoutes.ONBOARDING_STAGE_TWO,
      data
    )
  },

  completeStageThree: async (data: OnboardingStageThreeRequest): Promise<OnboardingStageThreeResponse> => {
    return await apiClient.post<OnboardingStageThreeResponse>(
      ApiRoutes.ONBOARDING_STAGE_THREE,
      data
    );
  },

  registerUser: async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    return await apiClient.post<CreateUserResponse>(
      ApiRoutes.REGISTER,
      data
    );
  },

  handleVeriffWebhook: async (data: VeriffWebhookRequest): Promise<VeriffWebhookResponse> => {
    return await apiClient.post<VeriffWebhookResponse>(
      ApiRoutes.VERIFF_WEBHOOK,
      data
    );
  },

  getVeriffStatus: async (sessionId: string): Promise<VeriffStatusResponse> => {
    return await apiClient.get<VeriffStatusResponse>(
      `${ApiRoutes.VERIFF_STATUS}/${sessionId}`
    );
  },

};