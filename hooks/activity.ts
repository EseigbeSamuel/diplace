import { getRequest } from "@/services/queries";
import {
  ActiveActivitiesResponse,
  BookingDetailResponse,
  HistoryActivitiesResponse,
  InspectionDetailResponse,
  TodayActivitiesResponse,
} from "@/types";
import { useQuery } from "@tanstack/react-query";

// ─── Agent / Lister hooks (auth token scoped by backend) ─────────────────────

export const useGetActiveActivities = () => {
  return useQuery({
    queryKey: ["active-activities"],
    queryFn: () =>
      getRequest<ActiveActivitiesResponse>({
        url: "/bookings/activity/active",
      }),
  });
};

export const useGetHistoryActivities = () => {
  return useQuery({
    queryKey: ["history-activities"],
    queryFn: () =>
      getRequest<HistoryActivitiesResponse>({
        url: "/bookings/activity/history",
      }),
  });
};

export const useGetTodayActivities = () => {
  return useQuery({
    queryKey: ["today-activities"],
    queryFn: () =>
      getRequest<TodayActivitiesResponse>({
        url: "/bookings/activity/today",
      }),
  });
};

// Agent-specific hooks — same endpoints, backend scopes results by auth token role
export const useGetAgentActiveActivities = () => {
  return useQuery({
    queryKey: ["agent-active-activities"],
    queryFn: () =>
      getRequest<ActiveActivitiesResponse>({
        url: "/bookings/activity/active",
      }),
  });
};

export const useGetAgentHistoryActivities = () => {
  return useQuery({
    queryKey: ["agent-history-activities"],
    queryFn: () =>
      getRequest<HistoryActivitiesResponse>({
        url: "/bookings/activity/history",
      }),
  });
};

// ─── Renter-scoped hooks ──────────────────────────────────────────────────────

export const useGetRenterActiveActivities = () => {
  return useQuery({
    queryKey: ["renter-active-activities"],
    queryFn: () =>
      getRequest<ActiveActivitiesResponse>({
        url: "/bookings/activity/renter/active",
      }),
  });
};

export const useGetRenterHistoryActivities = () => {
  return useQuery({
    queryKey: ["renter-history-activities"],
    queryFn: () =>
      getRequest<HistoryActivitiesResponse>({
        url: "/bookings/activity/renter/history",
      }),
  });
};

export const useGetRenterTodayActivities = () => {
  return useQuery({
    queryKey: ["renter-today-activities"],
    queryFn: () =>
      getRequest<TodayActivitiesResponse>({
        url: "/bookings/activity/renter/today",
      }),
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
