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
    }),
  });
};

export type FormsApi = ReturnType<typeof injectFormsEndpoints>;

