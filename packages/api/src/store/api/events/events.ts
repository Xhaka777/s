import type { createApiSlice } from "../auth";

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description?: string | null;
  status: string;
  price_per_participant?: string | null;
  price_currency?: string | null;
  created_at: string;
}

export interface CreateEventRequest {
  organizer_id: string;
  title: string;
  description?: string | null;
  price_per_participant?: number | null;
  price_currency?: string | null;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  price_per_participant?: number;
  price_currency?: string;
}

export interface SetEventStatusRequest {
  status: "pending verification" | "verified";
}

export interface ListEventsQuery {
  q?: string;
  organizer_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface ListEventsResponse {
  items: Event[];
  total: number;
  page: number;
  limit: number;
}

export const injectEventsEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createEvent: builder.mutation<Event, CreateEventRequest>({
        query: (body) => ({
          url: "/events/",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Event"],
      }),

      listEvents: builder.query<ListEventsResponse, ListEventsQuery | void>({
        query: (params) => ({
          url: "/events/",
          params: params || {},
        }),
        providesTags: ["Event"],
      }),

      getEvent: builder.query<Event, string>({
        query: (id) => `/events/${id}`,
        providesTags: (result, error, id) => [{ type: "Event", id }],
      }),

      updateEvent: builder.mutation<Event, { id: string; data: UpdateEventRequest }>({
        query: ({ id, data }) => ({
          url: `/events/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Event", id }],
      }),

      setEventStatus: builder.mutation<Event, { id: string; data: SetEventStatusRequest }>({
        query: ({ id, data }) => ({
          url: `/events/${id}/status`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Event", id }],
      }),
    }),
  });
};

export type EventsApi = ReturnType<typeof injectEventsEndpoints>;

