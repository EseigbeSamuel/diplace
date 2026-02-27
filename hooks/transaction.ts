import { getRequestWithParams } from "@/services";
import {
  TransactionHistoryResponse,
  TransactionQueryParams,
} from "@/types/screens/transaction";
import { useQuery } from "@tanstack/react-query";

export const useTransactionHistory = (params: TransactionQueryParams = {}) => {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["transactions", "me", params],
    queryFn: async () => {
      return await getRequestWithParams<TransactionHistoryResponse>({
        url: "/bookings/transactions/me",
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
