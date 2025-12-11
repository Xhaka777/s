import type { createApiSlice } from "../auth";

export interface IssueActivationRequest {
  user_id: string;
}

export interface IssueActivationResponse {
  ok: boolean;
  sent_to: string;
}

export interface CompleteActivationRequest {
  token: string;
  new_password: string;
}

export interface CompleteActivationResponse {
  ok: boolean;
  user_id: string;
}

export const injectAccountActivationEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      issueActivation: builder.mutation<IssueActivationResponse, IssueActivationRequest>({
        query: (body) => ({
          url: "/auth/activation/issue",
          method: "POST",
          body,
        }),
      }),

      completeActivation: builder.mutation<CompleteActivationResponse, CompleteActivationRequest>({
        query: (body) => ({
          url: "/auth/activation/complete",
          method: "POST",
          body,
        }),
      }),
    }),
  });
};

export type AccountActivationApi = ReturnType<typeof injectAccountActivationEndpoints>;

