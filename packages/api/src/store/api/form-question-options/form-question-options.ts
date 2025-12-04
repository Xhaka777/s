import type { createApiSlice } from "../auth";

export interface FormQuestionOption {
  id: string;
  question_id: string;
  option: string;
}

export interface CreateOptionRequest {
  question_id: string;
  option: string;
}

export interface UpdateOptionRequest {
  option?: string;
}

export const injectFormQuestionOptionsEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createOption: builder.mutation<FormQuestionOption, CreateOptionRequest>({
        query: (body) => ({
          url: "/form-question-options/",
          method: "POST",
          body,
        }),
        invalidatesTags: ["FormQuestionOption"],
      }),

      getOptions: builder.query<FormQuestionOption[], void>({
        query: () => "/form-question-options/",
        providesTags: ["FormQuestionOption"],
      }),

      getOption: builder.query<FormQuestionOption, string>({
        query: (id) => `/form-question-options/${id}`,
        providesTags: (result, error, id) => [{ type: "FormQuestionOption", id }],
      }),

      updateOption: builder.mutation<FormQuestionOption, { id: string; data: UpdateOptionRequest }>({
        query: ({ id, data }) => ({
          url: `/form-question-options/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "FormQuestionOption", id }],
      }),

      deleteOption: builder.mutation<void, string>({
        query: (id) => ({
          url: `/form-question-options/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["FormQuestionOption"],
      }),
    }),
  });
};

export type FormQuestionOptionsApi = ReturnType<typeof injectFormQuestionOptionsEndpoints>;

