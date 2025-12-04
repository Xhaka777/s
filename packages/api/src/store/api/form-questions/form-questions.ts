import type { createApiSlice } from "../auth";

export interface QuestionOption {
  id: string;
  option: string;
}

export interface FormQuestion {
  id: string;
  question: string;
  question_type: string;
  category_id: string;
  options?: QuestionOption[];
}

export interface CreateQuestionRequest {
  question: string;
  category_id: string;
  question_type: string;
}

export interface UpdateQuestionRequest {
  question?: string;
  question_type?: string;
  category_id?: string;
}

export const injectFormQuestionsEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createQuestion: builder.mutation<FormQuestion, CreateQuestionRequest>({
        query: (body) => ({
          url: "/form-questions/",
          method: "POST",
          body,
        }),
        invalidatesTags: ["FormQuestion"],
      }),

      getQuestions: builder.query<FormQuestion[], void>({
        query: () => "/form-questions/",
        providesTags: ["FormQuestion"],
      }),

      getQuestion: builder.query<FormQuestion, string>({
        query: (id) => `/form-questions/${id}`,
        providesTags: (result, error, id) => [{ type: "FormQuestion", id }],
      }),

      updateQuestion: builder.mutation<FormQuestion, { id: string; data: UpdateQuestionRequest }>({
        query: ({ id, data }) => ({
          url: `/form-questions/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "FormQuestion", id }],
      }),

      deleteQuestion: builder.mutation<void, string>({
        query: (id) => ({
          url: `/form-questions/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["FormQuestion"],
      }),

      getQuestionsByCategory: builder.query<FormQuestion[], string>({
        query: (categoryId) => `/form-questions/category/${categoryId}`,
        providesTags: (result, error, categoryId) => [{ type: "FormQuestion", id: `category-${categoryId}` }],
      }),
    }),
  });
};

export type FormQuestionsApi = ReturnType<typeof injectFormQuestionsEndpoints>;

