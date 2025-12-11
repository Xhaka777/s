import type { createApiSlice } from "../auth";

export interface EventOrganizer {
  id: string;
  user_id: string;
  brand_name: string;
  business_phone_e164?: string | null;
  street_address?: string | null;
  city?: string | null;
  state_region?: string | null;
  postal_code?: string | null;
  country?: string | null;
  website_url?: string | null;
  eu_id_or_business_number?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganizerWithRepRequest {
  user: {
    email: string;
    first_name: string;
    last_name: string;
    phone_e164?: string | null;
  };
  organizer: {
    brand_name: string;
    contact_first_name?: string | null;
    contact_last_name?: string | null;
    business_phone_e164?: string | null;
    street_address?: string | null;
    city?: string | null;
    state_region?: string | null;
    postal_code?: string | null;
    country?: string | null;
    website_url?: string | null;
    eu_id_or_business_number?: string | null;
  };
}

export interface CreateOrganizerWithRepResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_e164?: string | null;
    role: string;
    status: string;
    must_set_password: boolean;
  };
  organizer: {
    id: string;
    user_id: string;
    brand_name: string;
  };
  activation_sent_to: string;
  email_warning?: string;
}

export interface UpdateOrganizerRequest {
  brand_name?: string;
  business_phone_e164?: string;
  street_address?: string;
  city?: string;
  state_region?: string;
  postal_code?: string;
  country?: string;
  website_url?: string;
  eu_id_or_business_number?: string;
}

export const injectEventOrganizersEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createOrganizerWithRep: builder.mutation<CreateOrganizerWithRepResponse, CreateOrganizerWithRepRequest>({
        query: (body) => ({
          url: "/event-organizers/full-create",
          method: "POST",
          body,
        }),
        invalidatesTags: ["EventOrganizer"],
      }),

      listOrganizers: builder.query<EventOrganizer[], void>({
        query: () => "/event-organizers/",
        providesTags: ["EventOrganizer"],
      }),

      getOrganizer: builder.query<EventOrganizer, string>({
        query: (id) => `/event-organizers/${id}`,
        providesTags: (result, error, id) => [{ type: "EventOrganizer", id }],
      }),

      updateOrganizer: builder.mutation<EventOrganizer, { id: string; data: UpdateOrganizerRequest }>({
        query: ({ id, data }) => ({
          url: `/event-organizers/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "EventOrganizer", id }],
      }),

      deleteOrganizer: builder.mutation<void, string>({
        query: (id) => ({
          url: `/event-organizers/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["EventOrganizer"],
      }),
    }),
  });
};

export type EventOrganizersApi = ReturnType<typeof injectEventOrganizersEndpoints>;

