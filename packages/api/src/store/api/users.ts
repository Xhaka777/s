import type { createApiSlice } from "./auth";

export interface User {
  id: string;
  email: string;
  phone_e164?: string;
  status: string;
  email_verified_at?: string;
  phone_verified_at?: string;
  created_at: string;
  last_login_at?: string;
  first_name: string;
  last_name: string;
  gender?: string;
  dob?: string;
  city?: string;
  country?: string;
  avatar_url?: string;
  balance?: number;
  priority?: boolean;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  dob: string;
  city: string;
  country: string;
  phone_e164?: string;
  status?: string;
  gender?: string;
  avatar_url?: string;
  balance?: number;
  priority?: boolean;
}

export interface CreateUserResponse {
  user: User;
  token: string;
}

export interface UpdateUserRequest {
  email?: string;
  phone_e164?: string;
  password?: string;
  status?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  dob?: string;
  city?: string;
  country?: string;
  avatar_url?: string;
  balance?: number;
  priority?: boolean;
}

export interface OnboardingStatusResponse {
  status: number;
  message: string;
  details?: {
    currentStep: string;
    progress: {
      completed: number;
      total: number;
      percentage: number;
    };
  };
}

export interface CompleteOnboardingStageOneRequest {
  email: string;
  phone_e164: string;
  preferred_language: string;
  firebase_id_token: string;
}

export interface CompleteOnboardingStageOneResponse {
  session_token: string;
}

export interface CheckSessionRequest {
  session_token: string;
}

export interface PendingPostEvaluationForm {
  hasPendingForm: boolean;
  formId?: string;
  formName?: string;
  progress?: {
    completed: number;
    total: number;
  };
}

export interface CheckSessionResponse {
  authenticated: boolean;
  requiresReauthentication?: boolean;
  onboardingCompleted: boolean;
  onboarding?: OnboardingStatusResponse;
  requiresPhoneAuth?: boolean;
  isSuspended?: boolean;
  pendingPostEvaluationForm?: PendingPostEvaluationForm;
}

export interface SearchUsersQuery {
  q: string;
}

export interface CompleteOnboardingStageTwoRequest {
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  city: string;
  country: string;
}

export interface CompleteOnboardingStageTwoResponse {
  success: boolean;
  message: string;
}

export interface CompleteOnboardingStageThreeRequest {
  // No body needed - user is extracted from token
}

export interface CompleteOnboardingStageThreeResponse {
  success: boolean;
  session_id: string;
  message: string;
}

export interface VeriffWebhookRequest {
  sessionId: string;
  status: string;
  person?: {
    firstName?: string;
    lastName?: string;
  };
  document?: {
    type?: string;
    number?: string;
  };
}

export interface VeriffWebhookResponse {
  success: boolean;
  message: string;
}

export interface VeriffStatusResponse {
  success: boolean;
  sessionId: string;
  status: string;
}

export const injectUsersEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      // POST /users/check-session
      checkSession: builder.mutation<CheckSessionResponse, CheckSessionRequest>({
        query: (body) => ({
          url: "/users/check-session",
          method: "POST",
          body,
        }),
      }),

      // POST /users/onboardingStageOne
      completeOnboardingStageOne: builder.mutation<
        CompleteOnboardingStageOneResponse,
        CompleteOnboardingStageOneRequest
      >({
        query: (body) => ({
          url: "/users/onboardingStageOne",
          method: "POST",
          body,
        }),
      }),

      // POST /users/onboardingStageTwo
      completeOnboardingStageTwo: builder.mutation<
        CompleteOnboardingStageTwoResponse,
        CompleteOnboardingStageTwoRequest
      >({
        query: (body) => ({
          url: "/users/onboardingStageTwo",
          method: "POST",
          body,
        }),
        invalidatesTags: ["User", "Onboarding"],
      }),

      // POST /users/onboardingStageThree
      completeOnboardingStageThree: builder.mutation<
        CompleteOnboardingStageThreeResponse,
        void
      >({
        query: () => ({
          url: "/users/onboardingStageThree",
          method: "POST",
        }),
        invalidatesTags: ["User", "Onboarding"],
      }),

      // POST /users/register
      createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
        query: (body) => ({
          url: "/users/register",
          method: "POST",
          body,
        }),
        invalidatesTags: ["User"],
      }),

      // GET /users/
      getUsers: builder.query<User[], void>({
        query: () => "/users/",
        providesTags: ["User"],
      }),

      // GET /users/:id
      getUser: builder.query<User, string>({
        query: (id) => `/users/${id}`,
        providesTags: (result, error, id) => [{ type: "User", id }],
      }),

      // PUT /users/:id
      updateUser: builder.mutation<User, { id: string; data: UpdateUserRequest }>({
        query: ({ id, data }) => ({
          url: `/users/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
      }),

      // GET /users/:id/onboarding-status
      getUsersOnboardingStatus: builder.query<OnboardingStatusResponse, string>({
        query: (id) => `/users/${id}/onboarding-status`,
        providesTags: (result, error, id) => [{ type: "User", id }, "Onboarding"],
      }),

      // GET /users/search?q=...
      searchUsers: builder.query<User[], SearchUsersQuery>({
        query: ({ q }) => ({
          url: "/users/search",
          params: { q },
        }),
        providesTags: ["User"],
      }),

      // POST /users/veriff/webhook
      handleVeriffWebhook: builder.mutation<
        VeriffWebhookResponse,
        VeriffWebhookRequest
      >({
        query: (body) => ({
          url: "/users/veriff/webhook",
          method: "POST",
          body,
        }),
        invalidatesTags: ["User", "Onboarding"],
      }),

      // GET /users/veriff/status/:sessionId
      getVeriffStatus: builder.query<VeriffStatusResponse, string>({
        query: (sessionId) => `/users/veriff/status/${sessionId}`,
        providesTags: ["User", "Onboarding"],
      }),
    }),
  });
};

export type UsersApi = ReturnType<typeof injectUsersEndpoints>;

