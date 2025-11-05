import { apiClient } from './apis';
import {
  CheckSessionResponse,
  OnboardingStageOneRequest,
  OnboardingStageOneResponse,
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
  }

};