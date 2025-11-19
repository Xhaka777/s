import type { createApiSlice } from "../auth";

export interface ElasticIndex {
  health?: string;
  status?: string;
  index?: string;
  uuid?: string;
  pri?: string;
  rep?: string;
  "docs.count"?: string;
  "docs.deleted"?: string;
  "store.size"?: string;
  "pri.store.size"?: string;
}

export interface UpsertUserRequest {
  user_id: string;
  nogos?: Array<{ text: string; vector?: number[] }>;
  hobbies?: Array<{ text: string; vector?: number[] }>;
  [key: string]: any;
}

export interface UpsertUserResponse {
  result: string;
  _id: string;
  _index: string;
}

export interface UserMatch {
  user_id: string;
  score: number;
  [key: string]: any;
}

export interface GetMatchesResponse {
  matches: UserMatch[];
}

export const injectElasticEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getIndices: builder.query<ElasticIndex[], void>({
        query: () => "/elastic/indices",
      }),

      createUsersIndex: builder.mutation<any, void>({
        query: () => ({
          url: "/elastic/users/index",
          method: "POST",
        }),
      }),

      upsertUser: builder.mutation<UpsertUserResponse, UpsertUserRequest>({
        query: (body) => ({
          url: "/elastic/users",
          method: "POST",
          body,
        }),
      }),

      getMatches: builder.query<GetMatchesResponse, { id: string; threshold?: number }>({
        query: ({ id, threshold }) => ({
          url: `/elastic/users/${id}/matches`,
          params: threshold ? { threshold } : {},
        }),
      }),
    }),
  });
};

export type ElasticApi = ReturnType<typeof injectElasticEndpoints>;

