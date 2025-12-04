import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../types";
//   import { logOut } from "../slice/auth/auth.slice";

export const createApiSlice = (baseUrl: string) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    mode: "cors",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });

  const customFetchBase: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      //   api.dispatch(logOut());
    }

    return result;
  };

  return createApi({
    baseQuery: customFetchBase,
    endpoints: (builder) => ({}),
    tagTypes: [
      "User",
      "Auth",
      "Onboarding",
      "Event",
      "EventRun",
      "EventRunInvite",
      "EventOrganizer",
      "Notification",
      "Form",
      "FormCategory",
      "FormQuestion",
      "FormQuestionOption",
      "UserFormAnswer",
      "Upload",
      "Elastic",
    ],
  });
};


export const apiSlice = createApiSlice("");
