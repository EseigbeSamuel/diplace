import { getRequest } from "@/services";
import { ListPropertyReviewsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useListPropertyReviews({
  propertyId,
  enabled = true,
}: {
  propertyId?: string;
  enabled?: boolean;
}) {
  const query = useQuery({
    queryKey: ["property-reviews", propertyId],
    enabled: enabled && !!propertyId,
    queryFn: async () => {
      return await getRequest<ListPropertyReviewsResponse>({
        url: `/property-reviews/${propertyId}/reviews`,
        params: {
          skip: 0,
          limit: 100,
          sort_by: "date_created",
          sort_order: "desc",
        },
        protectedRoute: true,
      });
    },
  });

  return {
    propertyReviews: query.data?.items ?? [],
    propertyReviewsTotal: query.data?.pagination.total_items ?? 0,
    isPropertyReviewsLoading: query.isLoading,
    propertyReviewsError: query.error,
    refetchPropertyReviews: query.refetch,
  };
}
