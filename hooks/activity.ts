import { getRequest } from "@/services/queries";
import {
  ActiveActivitiesResponse,
  HistoryActivitiesResponse,
  TodayActivitiesResponse,
} from "@/types";
import { useQuery } from "@tanstack/react-query";

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
