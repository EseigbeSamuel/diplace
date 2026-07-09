export interface NotificationItem {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: string;
  title: string;
  description?: string;
  message?: string;
  is_read: boolean;
  read_at?: string | null;
  notification_type?: string;
  data?: Record<string, any> | null;
}

export interface ListNotificationsResponse {
  pagination: {
    total_items: number;
    limit: number;
    skip: number;
    total_pages: number;
  };
  items: NotificationItem[];
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  in_app?: boolean;
}

export interface NotificationStats {
  total_count: number;
  unread_count: number;
  read_count: number;
}
