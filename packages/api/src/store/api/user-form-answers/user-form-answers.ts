import type { createApiSlice } from "../auth";

export interface UserFormAnswer {
  user_id: string;
  question_id: string;
  option_id?: string;
  answer_text?: string;
}

export interface CreateAnswerRequest {
  user_id: string;
  question_id: string;
  option_id: string;
  answer_text?: string;
}

export const injectUserFormAnswersEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createAnswer: builder.mutation<UserFormAnswer, CreateAnswerRequest>({
        query: (body) => ({
          url: "/user-form-answers/",
          method: "POST",
          body,
        }),
        invalidatesTags: ["UserFormAnswer"],
      }),

      getAnswers: builder.query<UserFormAnswer[], void>({
        query: () => "/user-form-answers/",
        providesTags: ["UserFormAnswer"],
      }),

      getAnswersByUser: builder.query<UserFormAnswer[], string>({
        query: (userId) => `/user-form-answers/user/${userId}`,
        providesTags: (result, error, userId) => [{ type: "UserFormAnswer", id: `user-${userId}` }],
      }),
    }),
  });
};

export type UserFormAnswersApi = ReturnType<typeof injectUserFormAnswersEndpoints>;

