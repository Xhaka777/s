import type { createApiSlice } from "../auth";

export interface EventRun {
  id: string;
  event_id: string;
  status: "scheduled" | "live" | "finished" | "cancelled";
  format?: string | null;
  age_group?: string | null;
  ideal_capacity?: number | null;
  minimum_capacity?: number | null;
  location?: string | null;
  street_address?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  timezone?: string | null;
  pricing_notes?: string | null;
  food_beverage_concept?: string | null;
  weather_dependent?: boolean;
  plan_b_description?: string | null;
  created_at: string;
  scheduled_start_date?: string | null;
  scheduled_time?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
}

export interface CreateEventRunRequest {
  event_id: string;
  status?: "scheduled" | "live" | "finished" | "cancelled";
  format?: string | null;
  age_group?: string | null;
  ideal_capacity?: number | null;
  minimum_capacity?: number | null;
  location?: string | null;
  street_address?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  timezone?: string | null;
  pricing_notes?: string | null;
  food_beverage_concept?: string | null;
  weather_dependent?: boolean | null;
  plan_b_description?: string | null;
  scheduled_start_date?: string | null;
  scheduled_time?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
}

export interface UpdateEventRunRequest {
  status?: "scheduled" | "live" | "finished" | "cancelled";
  format?: string;
  age_group?: string;
  ideal_capacity?: number;
  minimum_capacity?: number;
  location?: string;
  street_address?: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  pricing_notes?: string;
  food_beverage_concept?: string;
  weather_dependent?: boolean;
  plan_b_description?: string;
  scheduled_start_date?: string;
  scheduled_time?: string;
  started_at?: string;
  ended_at?: string;
}

export interface SetEventRunStatusRequest {
  status: "scheduled" | "live" | "finished" | "cancelled";
}

export interface ListEventRunsResponse {
  items: EventRun[];
  total: number;
  page: number;
  limit: number;
}

export interface CheckAvailabilityQuery {
  user_id: string;
  event_run_id: string;
  start_time: string;
  end_time: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  conflicts?: any[];
}

export const injectEventRunsEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      checkUserAvailability: builder.query<CheckAvailabilityResponse, CheckAvailabilityQuery>({
        query: (params) => ({
          url: "/event-runs/check-availability",
          params,
        }),
      }),

      createEventRun: builder.mutation<EventRun, CreateEventRunRequest>({
        query: (body) => ({
          url: "/event-runs/",
          method: "POST",
          body,
        }),
        invalidatesTags: ["EventRun"],
      }),

      listEventRuns: builder.query<ListEventRunsResponse, void>({
        query: () => "/event-runs/",
        providesTags: ["EventRun"],
      }),

      getEventRun: builder.query<EventRun, string>({
        query: (id) => `/event-runs/${id}`,
        providesTags: (result, error, id) => [{ type: "EventRun", id }],
      }),

      updateEventRun: builder.mutation<EventRun, { id: string; data: UpdateEventRunRequest }>({
        query: ({ id, data }) => ({
          url: `/event-runs/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "EventRun", id }],
      }),

      setEventRunStatus: builder.mutation<EventRun, { id: string; data: SetEventRunStatusRequest }>({
        query: ({ id, data }) => ({
          url: `/event-runs/${id}/status`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "EventRun", id }],
      }),

      deleteEventRun: builder.mutation<void, string>({
        query: (id) => ({
          url: `/event-runs/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["EventRun"],
      }),
    }),
  });
};

export type EventRunsApi = ReturnType<typeof injectEventRunsEndpoints>;

