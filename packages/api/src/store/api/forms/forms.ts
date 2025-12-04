import type { createApiSlice } from "../auth";

export interface Form {
  id: string;
  form_name: string;
  description?: string;
}

export interface CreateFormRequest {
  form_name: string;
  description?: string;
}

export interface UpdateFormRequest {
  form_name?: string;
  description?: string;
}

export interface QuestionOption {
  id: string;
  option: string;
  option_type?: string;
  display_order?: number;
}

export interface FormQuestion {
  id: string;
  question: string;
  question_type: string;
  category_id: string;
  display_order?: number;
  options: QuestionOption[];
}

export interface FormCategory {
  id: string;
  form_id: string;
  category_text: string;
  description?: string;
  category_type?: string;
  display_order?: number;
  questions: FormQuestion[];
}

export interface FormQuestionsResponse {
  id: string;
  form_name: string;
  description?: string;
  categories: FormCategory[];
}

export interface GetFormQuestionsRequest {
  formName: string;
  categoryId?: string;
}

export const injectFormsEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createForm: builder.mutation<Form, CreateFormRequest>({
        query: (body) => ({
          url: "/forms/",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Form"],
      }),

      getForms: builder.query<Form[], void>({
        query: () => "/forms/",
        providesTags: ["Form"],
      }),

      getForm: builder.query<Form, string>({
        query: (id) => `/forms/${id}`,
        providesTags: (result, error, id) => [{ type: "Form", id }],
      }),

      updateForm: builder.mutation<Form, { id: string; data: UpdateFormRequest }>({
        query: ({ id, data }) => ({
          url: `/forms/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Form", id }],
      }),

      deleteForm: builder.mutation<void, string>({
        query: (id) => ({
          url: `/forms/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Form"],
      }),

      // GET /forms/data/:formName?categoryId=...
      getQuestionsAndOptionsFromForm: builder.query<
        FormQuestionsResponse,
        GetFormQuestionsRequest
      >({
        query: ({ formName, categoryId }) => {
          const encodedFormName = encodeURIComponent(formName);
          const url = `/forms/data/${encodedFormName}`;
          return categoryId
            ? { url, params: { categoryId } }
            : { url };
        },
        providesTags: (result, error, { formName }) => [
          { type: "Form", id: formName },
          "Form",
        ],
      }),
    }),
  });
};

export type FormsApi = ReturnType<typeof injectFormsEndpoints>;

