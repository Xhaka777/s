import type { createApiSlice } from "../auth";

export interface UploadTestResponse {
  fileUrls: string[];
  name: string;
  lastName: string;
}

export const injectUploadsEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      uploadTest: builder.mutation<UploadTestResponse, FormData>({
        query: (formData) => ({
          url: "/uploads/test",
          method: "POST",
          body: formData,
        }),
      }),
    }),
  });
};

export type UploadsApi = ReturnType<typeof injectUploadsEndpoints>;

