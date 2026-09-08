import { useUser } from "@/contexts/user-context";
import { getRequest } from "@/services/queries";
import {
  ActiveActivitiesResponse,
  BookingDetailResponse,
  HistoryActivitiesResponse,
  InspectionDetailResponse,
  TodayActivitiesResponse,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";

// ─── Agent / Lister hooks (auth token scoped by backend) ─────────────────────

export const useGetActiveActivities = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["active-activities"],
    queryFn: () =>
      getRequest<ActiveActivitiesResponse>({
        url: "/bookings/activity/active",
      }),
    enabled: options?.enabled ?? true,
  });
};

export const useGetHistoryActivities = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["history-activities"],
    queryFn: () =>
      getRequest<HistoryActivitiesResponse>({
        url: "/bookings/activity/history",
      }),
    enabled: options?.enabled ?? true,
  });
};

export const useGetTodayActivities = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["today-activities"],
    queryFn: () =>
      getRequest<TodayActivitiesResponse>({
        url: "/bookings/activity/today",
      }),
    enabled: options?.enabled ?? true,
  });
};

// Agent-specific hooks — same endpoints, backend scopes results by auth token role
export const useGetAgentActiveActivities = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["agent-active-activities"],
    queryFn: () =>
      getRequest<ActiveActivitiesResponse>({
        url: "/bookings/activity/active",
      }),
    enabled: options?.enabled ?? true,
  });
};

export const useGetAgentHistoryActivities = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["agent-history-activities"],
    queryFn: () =>
      getRequest<HistoryActivitiesResponse>({
        url: "/bookings/activity/history",
      }),
    enabled: options?.enabled ?? true,
  });
};

export const useGetAgentTodayActivities = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["agent-today-activities"],
    queryFn: () =>
      getRequest<TodayActivitiesResponse>({
        url: "/bookings/activity/today",
      }),
    enabled: options?.enabled ?? true,
  });
};

// ─── Renter-scoped hooks ──────────────────────────────────────────────────────

export const useGetRenterActiveActivities = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["renter-active-activities"],
    queryFn: () =>
      getRequest<ActiveActivitiesResponse>({
        url: "/bookings/activity/renter/active",
      }),
    enabled: options?.enabled ?? true,
  });
};

export const useGetRenterHistoryActivities = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["renter-history-activities"],
    queryFn: () =>
      getRequest<HistoryActivitiesResponse>({
        url: "/bookings/activity/renter/history",
      }),
    enabled: options?.enabled ?? true,
  });
};

export const useGetRenterTodayActivities = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["renter-today-activities"],
    queryFn: () =>
      getRequest<TodayActivitiesResponse>({
        url: "/bookings/activity/renter/today",
      }),
    enabled: options?.enabled ?? true,
  });
};

// ─── Detail hooks (single item, called from the detail screen) ────────────────

/** Fetch full inspection detail — use for status: scheduled | inspected */
export const useGetInspectionDetail = (inspectionId: string) => {
  return useQuery({
    queryKey: ["inspection-detail", inspectionId],
    queryFn: () =>
      getRequest<InspectionDetailResponse>({
        url: `/bookings/activity/inspections/${inspectionId}`,
      }),
    enabled: !!inspectionId,
  });
};

/** Fetch full booking detail — use for status: reserved | booked */
export const useGetBookingDetail = (bookingId: string) => {
  return useQuery({
    queryKey: ["booking-detail", bookingId],
    queryFn: () =>
      getRequest<BookingDetailResponse>({
        url: `/bookings/activity/bookings/${bookingId}`,
      }),
    enabled: !!bookingId,
  });
};

// ─── Activity Notification Badge Hook ─────────────────────────────────────────

export const useActivityBadge = () => {
  const { userType } = useUser();
  const isRenter = userType === "renter";

  const renterQuery = useGetRenterActiveActivities({ enabled: isRenter });
  const agentQuery = useGetAgentActiveActivities({ enabled: !isRenter });

  const activeData = isRenter ? renterQuery.data : agentQuery.data;
  const [viewedIds, setViewedIds] = useState<string[]>([]);

  const storageKey = `@diplace_viewed_activities_${userType}`;

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(storageKey)
      .then((val) => {
        if (isMounted && val) {
          try {
            setViewedIds(JSON.parse(val));
          } catch {}
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [storageKey]);

  // Collect all active activity items
  const allItems = useMemo(() => {
    if (!activeData) return [];
    return [
      ...(activeData.scheduled ?? []),
      ...(activeData.reserved ?? []),
      ...(activeData.booked ?? []),
      ...(activeData.inspected ?? []),
    ];
  }, [activeData]);

  // Find all items that are new and haven't been viewed yet
  const unviewedNewItems = useMemo(() => {
    return allItems.filter((item) => {
      if (!item.is_new) return false;
      const id = item.booking_id || item.inspection_id;
      if (!id) return false;
      return !viewedIds.includes(id);
    });
  }, [allItems, viewedIds]);

  const hasUnviewedActivity = unviewedNewItems.length > 0;

  const markActivitiesAsViewed = useCallback(async () => {
    const idsToMark = allItems
      .filter((item) => item.is_new)
      .map((item) => item.booking_id || item.inspection_id)
      .filter(Boolean);

    if (idsToMark.length === 0) return;

    const merged = Array.from(new Set([...viewedIds, ...idsToMark]));
    setViewedIds(merged);
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(merged));
    } catch (e) {
      console.error("Failed to save viewed activities", e);
    }
  }, [allItems, viewedIds, storageKey]);

  return {
    hasUnviewedActivity,
    unviewedCount: unviewedNewItems.length,
    markActivitiesAsViewed,
    refetchActivities: isRenter ? renterQuery.refetch : agentQuery.refetch,
  };
};

