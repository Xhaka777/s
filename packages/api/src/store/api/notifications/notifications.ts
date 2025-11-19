import type { createApiSlice } from "../auth";

export interface Notification {
  id: string;
  sender_id?: string | null;
  receiver_id: string;
  title: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface CreateNotificationRequest {
  receiver_id: string;
  title: string;
  content: string;
  is_system?: boolean;
}

export interface UpdateNotificationRequest {
  read?: boolean;
}

export interface ReadStatusResponse {
  total: number;
  unread: number;
  read: number;
}

export interface MarkAllAsReadResponse {
  message: string;
}

export const injectNotificationsEndpoints = (
  apiSlice: ReturnType<typeof createApiSlice>
) => {
  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createNotification: builder.mutation<Notification, CreateNotificationRequest>({
        query: (body) => ({
          url: "/notifications/",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Notification"],
      }),

      getNotifications: builder.query<Notification[], void>({
        query: () => "/notifications/",
        providesTags: ["Notification"],
      }),

      getUnreadNotifications: builder.query<Notification[], void>({
        query: () => "/notifications/unread",
        providesTags: ["Notification"],
      }),

      markNotificationAsRead: builder.mutation<Notification, string>({
        query: (id) => ({
          url: `/notifications/${id}/read`,
          method: "PATCH",
        }),
        invalidatesTags: (result, error, id) => [{ type: "Notification", id }],
      }),

      deleteNotification: builder.mutation<void, string>({
        query: (id) => ({
          url: `/notifications/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Notification"],
      }),

      getReadStatus: builder.query<ReadStatusResponse, void>({
        query: () => "/notifications/read-status",
        providesTags: ["Notification"],
      }),

      markAllAsRead: builder.mutation<MarkAllAsReadResponse, void>({
        query: () => ({
          url: "/notifications/mark-all-read",
          method: "PATCH",
        }),
        invalidatesTags: ["Notification"],
      }),
    }),
  });
};

export type NotificationsApi = ReturnType<typeof injectNotificationsEndpoints>;

