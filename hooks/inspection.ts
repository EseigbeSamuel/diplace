import { showToast } from "@/lib";
import { getRequestWithParams, postRequest } from "@/services";
import {
  InspectionAvailabilityResponse,
  InspectionResponse,
  ScheduleInspectionPayload,
} from "@/types";
import {
  InspectionHistoryResponse,
  InspectionQueryParams,
} from "@/types/screens/inspection";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateInspection = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createInspection,
    mutateAsync: createInspectionAsync,
    isPending: isCreatingInspection,
    isError: isCreateInspectionError,
    error: createInspectionError,
    isSuccess: isCreateInspectionSuccess,
  } = useMutation({
    mutationFn: async (payload: ScheduleInspectionPayload) => {
      return await postRequest<InspectionResponse, ScheduleInspectionPayload>({
        url: `/inspection/inspections`,
        payload,
        protectedRoute: true,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["inspections"] });
      queryClient.invalidateQueries({
        queryKey: ["property-inspections", data.property.public_id],
      });
    },
    onError: (error) => {
      console.error("Failed to create inspection:", error);
    },
  });

  return {
    createInspection,
    createInspectionAsync,
    isCreatingInspection,
    isCreateInspectionError,
    createInspectionError,
    isCreateInspectionSuccess,
  };
};

export const useTransactionHistory = (params: InspectionQueryParams = {}) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["inspections", "me", params],
    queryFn: async () => {
      return await getRequestWithParams<InspectionHistoryResponse>({
        url: "/inspection/inspections/me",
        params: {
          skip: params.skip ?? 0,
          limit: params.limit ?? 100,
          sort_by: params.sort_by ?? "date_created",
          sort_order: params.sort_order ?? "desc",
          ...params,
        },
        protectedRoute: true,
      });
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled: true,
  });

  return {
    transactionHistory: data?.items ?? [],
    transactionHistoryPagination: data?.pagination,
    isTransactionHistoryLoading: isLoading,
    transactionHistoryError: error,
    refetchTransactionHistory: refetch,
    isTransactionHistoryFetching: isFetching,
  };
};

export function useGetPropertyAvailability({
  propertyId,
  enabled = true,
  params = {},
}: {
  propertyId?: string;
  enabled?: boolean;
  params?: {
    q?: string;
    skip?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    status?: string;
  };
}) {
  const query = useQuery({
    queryKey: ["property-availability", propertyId, params],
    enabled: enabled && !!propertyId,
    queryFn: async () =>
      await getRequestWithParams<InspectionAvailabilityResponse>({
        url: `/inspection/properties/${propertyId}/availability`,
        params: {
          skip: params.skip ?? 0,
          limit: params.limit ?? 100,
          sort_by: params.sort_by ?? "date_created",
          sort_order: params.sort_order ?? "asc",
          ...params,
        },
      }),
  });

  return {
    propertyAvailability: query.data?.items ?? [],
    propertyAvailabilityPagination: query.data?.pagination,
    isPropertyAvailabilityLoading: query.isLoading,
    propertyAvailabilityError: query.error,
    refetchPropertyAvailability: query.refetch,
  };
}

export function useScheduleInspection() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: ScheduleInspectionPayload) => {
      return await postRequest<InspectionResponse, ScheduleInspectionPayload>({
        url: "/inspection/inspections",
        payload,
        notifyOnError: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inspections"] });
      await queryClient.invalidateQueries({ queryKey: ["property-availability"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Inspection scheduled successfully.",
      });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unable to schedule inspection."
        : "Unable to schedule inspection.";

      showToast({
        type: "error",
        text1: "Inspection Failed",
        text2: String(message),
      });
    },
  });

  return {
    scheduleInspectionMutation: mutateAsync,
    isScheduleInspectionPending: isPending,
  };
}
