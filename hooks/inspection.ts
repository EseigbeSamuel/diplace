import { getRequestWithParams, postRequest } from "@/services";
import {
  CreateInspectionResponse,
  InspectionHistoryResponse,
  InspectionPayload,
  InspectionQueryParams,
} from "@/types/screens/inspection";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    mutationFn: async (payload: InspectionPayload) => {
      return await postRequest<CreateInspectionResponse, InspectionPayload>({
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
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    enabled: true,
  });

  return {
    transactionHistory: data,
    isTransactionHistoryLoading: isLoading,
    transactionHistoryError: error,
    refetchTransactionHistory: refetch,
    isTransactionHistoryFetching: isFetching,
  };
};
