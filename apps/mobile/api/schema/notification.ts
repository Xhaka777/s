import { z } from 'zod';
import { UuidSchema, DateSchema } from './common';
import { PublicUserSchema } from './user';

// Base notification schema
export const NotificationSchema = z.object({
  id: UuidSchema,
  sender_id: UuidSchema.nullable(),
  receiver_id: UuidSchema,
  title: z.string(),
  content: z.string(),
  read: z.boolean(),
  created_at: DateSchema,
});

// Notification with populated sender/receiver
export const NotificationWithUsersSchema = NotificationSchema.extend({
  sender: PublicUserSchema.nullable(),
  receiver: PublicUserSchema,
});

// Create notification input schema
export const CreateNotificationSchema = z.object({
  receiver_id: UuidSchema,
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  sender_id: UuidSchema.optional(), // Optional for system notifications
});

// Update notification schema (mainly for marking as read)
export const UpdateNotificationSchema = z.object({
  read: z.boolean(),
});

// Notification ID parameter schema
export const NotificationIdParamSchema = z.object({
  id: UuidSchema,
});

// Notification query parameters
export const NotificationQuerySchema = z.object({
  read: z.coerce.boolean().optional(),
  sender_id: UuidSchema.optional(),
  receiver_id: UuidSchema.optional(),
  search: z.string().optional(),
  from_date: DateSchema.optional(),
  to_date: DateSchema.optional(),
});

// Bulk notification operations
export const BulkMarkReadSchema = z.object({
  notification_ids: z.array(UuidSchema),
});

export const BulkDeleteNotificationsSchema = z.object({
  notification_ids: z.array(UuidSchema),
});

// Notification list response schema
export const NotificationListResponseSchema = z.array(NotificationSchema);
export const NotificationWithUsersListResponseSchema = z.array(NotificationWithUsersSchema);

// Notification stats schema
export const NotificationStatsSchema = z.object({
  total_count: z.number(),
  unread_count: z.number(),
  read_count: z.number(),
});

// Push notification settings schema
export const NotificationSettingsSchema = z.object({
  push_enabled: z.boolean(),
  email_enabled: z.boolean(),
  event_invitations: z.boolean(),
  messages: z.boolean(),
  marketing: z.boolean(),
});

export const UpdateNotificationSettingsSchema = NotificationSettingsSchema.partial();

// Type exports
export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationWithUsers = z.infer<typeof NotificationWithUsersSchema>;
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof UpdateNotificationSchema>;
export type NotificationIdParam = z.infer<typeof NotificationIdParamSchema>;
export type NotificationQuery = z.infer<typeof NotificationQuerySchema>;
export type BulkMarkRead = z.infer<typeof BulkMarkReadSchema>;
export type BulkDeleteNotifications = z.infer<typeof BulkDeleteNotificationsSchema>;
export type NotificationStats = z.infer<typeof NotificationStatsSchema>;
export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;
export type UpdateNotificationSettings = z.infer<typeof UpdateNotificationSettingsSchema>;