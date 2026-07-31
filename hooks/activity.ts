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
