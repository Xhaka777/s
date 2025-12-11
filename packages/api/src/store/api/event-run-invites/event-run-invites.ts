import type { createApiSlice } from "../auth";

export interface EventRunInvite {
  id: string;
  user_id: string;
  event_run_id: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface CreateEventRunInviteRequest {
  user_id: string;
  event_run_id: string;
  status?: "pending" | "accepted" | "declined" | "cancelled";
}

export interface UpdateInviteStatusRequest {
  status: "pending" | "accepted" | "declined" | "cancelled";
}

export interface ListEventRunInvitesResponse {
  items: EventRunInvite[];
  total: number;
  page: number;
  limit: number;
}

export const injectEventRunInvitesEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createInvite: builder.mutation<EventRunInvite, CreateEventRunInviteRequest>({
        query: (body) => ({
          url: "/event-run-invites/",
          method: "POST",
          body,
        }),
        invalidatesTags: ["EventRunInvite"],
      }),

      listInvites: builder.query<ListEventRunInvitesResponse, void>({
        query: () => "/event-run-invites/",
        providesTags: ["EventRunInvite"],
      }),

      getInvite: builder.query<EventRunInvite, string>({
        query: (id) => `/event-run-invites/${id}`,
        providesTags: (result, error, id) => [{ type: "EventRunInvite", id }],
      }),

      updateInviteStatus: builder.mutation<EventRunInvite, { id: string; data: UpdateInviteStatusRequest }>({
        query: ({ id, data }) => ({
          url: `/event-run-invites/${id}/status`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "EventRunInvite", id }],
      }),

      acceptInvite: builder.mutation<EventRunInvite, string>({
        query: (id) => ({
          url: `/event-run-invites/${id}/accept`,
          method: "PATCH",
        }),
        invalidatesTags: (result, error, id) => [{ type: "EventRunInvite", id }],
      }),

      declineInvite: builder.mutation<EventRunInvite, string>({
        query: (id) => ({
          url: `/event-run-invites/${id}/decline`,
          method: "PATCH",
        }),
        invalidatesTags: (result, error, id) => [{ type: "EventRunInvite", id }],
      }),

      deleteInvite: builder.mutation<void, string>({
        query: (id) => ({
          url: `/event-run-invites/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["EventRunInvite"],
      }),
    }),
  });
};

export type EventRunInvitesApi = ReturnType<typeof injectEventRunInvitesEndpoints>;

