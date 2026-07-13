export interface NotificationItem {
  title: string;
  message: string;
  notification_type: string;
  priority: string;
  data?: Record<string, any> | null;
  action_url?: string | null;
  scheduled_for?: string | null;
  expires_at?: string | null;
  public_id: string;
  user_id: string;
  is_read: boolean;
  read_at?: string | null;
  is_expired: boolean;
  is_scheduled: boolean;
  date_created: string;
  date_modified: string;
}

export interface ListNotificationsResponse {
  items: NotificationItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface NotificationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  system_notifications: boolean;
  property_notifications: boolean;
  agent_notifications: boolean;
  payment_notifications: boolean;
  booking_notifications: boolean;
  review_notifications: boolean;
  promotion_notifications: boolean;
  digest_frequency: string;
  quiet_hours_start?: string | null;
  quiet_hours_end?: string | null;
  public_id: string;
  user_id: string;
  date_created: string;
  date_modified: string;
}

export interface NotificationStats {
  total_count: number;
  unread_count: number;
  read_count: number;
}
