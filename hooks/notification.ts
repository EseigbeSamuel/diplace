import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "@/services";
import {
  ListNotificationsResponse,
  NotificationPreferences,
  NotificationStats,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib";

export function useMyNotifications({
  enabled = true,
  limit = 50,
  skip = 0,
  is_read,
}: {
  enabled?: boolean;
  limit?: number;
  skip?: number;
  is_read?: boolean;
} = {}) {
  const query = useQuery({
    queryKey: ["my-notifications", { limit, skip, is_read }],
    enabled,
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {
        limit,
        skip,
      };
      if (is_read !== undefined) {
        params.is_read = is_read;
      }
      return await getRequest<ListNotificationsResponse>({
        url: "/user-notifications/",
        params,
        protectedRoute: true,
      });
    },
  });

  return {
    notifications: query.data?.items ?? [],
    pagination: query.data?.pagination,
    isNotificationsLoading: query.isLoading,
    isNotificationsFetching: query.isFetching,
    notificationsError: query.error,
    refetchNotifications: query.refetch,
  };
}

export function useNotificationUnreadCount({ enabled = true }: { enabled?: boolean } = {}) {
  const query = useQuery({
    queryKey: ["notifications-unread-count"],
    enabled,
    queryFn: async () => {
      return await getRequest<{ unread_count: number }>({
        url: "/user-notifications/unread-count",
        protectedRoute: true,
      });
    },
  });

  return {
    unreadCount: query.data?.unread_count ?? 0,
    isUnreadCountLoading: query.isLoading,
    unreadCountError: query.error,
    refetchUnreadCount: query.refetch,
  };
}

export function useNotificationStats({ enabled = true }: { enabled?: boolean } = {}) {
  const query = useQuery({
    queryKey: ["notifications-stats"],
    enabled,
    queryFn: async () => {
      return await getRequest<NotificationStats>({
        url: "/user-notifications/stats",
        protectedRoute: true,
      });
    },
  });

  return {
    stats: query.data,
    isStatsLoading: query.isLoading,
    statsError: query.error,
    refetchStats: query.refetch,
  };
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ notificationId }: { notificationId: string }) => {
      return await postRequest<any, Record<string, never>>({
        url: `/user-notifications/${notificationId}/read`,
        payload: {},
        protectedRoute: true,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications-stats"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Unable to mark notification as read.";
      showToast({
        type: "error",
        text1: "Error",
        text2: message,
      });
    },
  });

  return {
    markReadMutation: mutateAsync,
    markReadPending: isPending,
  };
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      return await postRequest<any, Record<string, never>>({
        url: "/user-notifications/read-all",
        payload: {},
        protectedRoute: true,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications-stats"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Unable to mark all notifications as read.";
      showToast({
        type: "error",
        text1: "Error",
        text2: message,
      });
    },
  });

  return {
    markAllReadMutation: mutateAsync,
    markAllReadPending: isPending,
  };
}

export function useMarkMultipleNotificationsRead() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ notificationIds }: { notificationIds: string[] }) => {
      return await postRequest<any, { notification_ids: string[] }>({
        url: "/user-notifications/read",
        payload: { notification_ids: notificationIds },
        protectedRoute: true,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications-stats"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Unable to mark notifications as read.";
      showToast({
        type: "error",
        text1: "Error",
        text2: message,
      });
    },
  });

  return {
    markMultipleReadMutation: mutateAsync,
    markMultipleReadPending: isPending,
  };
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ notificationId }: { notificationId: string }) => {
      return await deleteRequest<any>({
        url: `/user-notifications/${notificationId}`,
        protectedRoute: true,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications-stats"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Unable to delete notification.";
      showToast({
        type: "error",
        text1: "Error",
        text2: message,
      });
    },
  });

  return {
    deleteNotificationMutation: mutateAsync,
    deleteNotificationPending: isPending,
  };
}

export function useNotificationPreferences() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      return await getRequest<NotificationPreferences>({
        url: "/user-notifications/preferences/me",
        protectedRoute: true,
      });
    },
  });

  const { mutateAsync: updatePreferences, isPending: isUpdating } = useMutation({
    mutationFn: async (payload: NotificationPreferences) => {
      return await putRequest<NotificationPreferences, NotificationPreferences>({
        url: "/user-notifications/preferences/me",
        payload,
        protectedRoute: true,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Notification preferences updated successfully.",
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Unable to update preferences.";
      showToast({
        type: "error",
        text1: "Error",
        text2: message,
      });
    },
  });

  return {
    preferences: query.data,
    isPreferencesLoading: query.isLoading,
    preferencesError: query.error,
    updatePreferencesMutation: updatePreferences,
    isUpdatingPreferences: isUpdating,
  };
}
