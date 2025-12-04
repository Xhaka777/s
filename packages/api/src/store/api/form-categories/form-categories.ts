import type { createApiSlice } from "../auth";
import type { Form } from "../forms/forms";

export interface FormCategory {
  id: string;
  form_id: string;
  category_text: string;
  description?: string;
  form?: Form;
}

export interface CreateCategoryRequest {
  form_id: string;
  category_text: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  form_id?: string;
  category_text?: string;
  description?: string;
}

export const injectFormCategoriesEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createCategory: builder.mutation<FormCategory, CreateCategoryRequest>({
        query: (body) => ({
          url: "/form-categories/",
          method: "POST",
          body,
        }),
        invalidatesTags: ["FormCategory"],
      }),

      getCategories: builder.query<FormCategory[], void>({
        query: () => "/form-categories/",
        providesTags: ["FormCategory"],
      }),

      getCategory: builder.query<FormCategory, string>({
        query: (id) => `/form-categories/${id}`,
        providesTags: (result, error, id) => [{ type: "FormCategory", id }],
      }),

      updateCategory: builder.mutation<FormCategory, { id: string; data: UpdateCategoryRequest }>({
        query: ({ id, data }) => ({
          url: `/form-categories/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "FormCategory", id }],
      }),

      deleteCategory: builder.mutation<void, string>({
        query: (id) => ({
          url: `/form-categories/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["FormCategory"],
      }),

      getCategoriesByForm: builder.query<FormCategory[], string>({
        query: (formId) => `/form-categories/form/${formId}`,
        providesTags: (result, error, formId) => [{ type: "FormCategory", id: `form-${formId}` }],
      }),
    }),
  });
};

export type FormCategoriesApi = ReturnType<typeof injectFormCategoriesEndpoints>;

