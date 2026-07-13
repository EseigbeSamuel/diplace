import { getRequest } from "@/services";
import {
  ListPropertyReviewsParams,
  ListPropertyReviewsResponse,
} from "@/types";
import { useQuery } from "@tanstack/react-query";

const normalizeReviewParams = (
  params?: ListPropertyReviewsParams,
): Record<string, string | number | boolean> => {
  if (!params) return {};

  return Object.entries(params).reduce<Record<string, string | number | boolean>>(
    (acc, [key, value]) => {
      if (value === undefined || value === null || value === "") return acc;
      acc[key] = value;
      return acc;
    },
    {},
  );
};

export function useListReviews({
  params,
  enabled = true,
}: {
  params?: ListPropertyReviewsParams;
  enabled?: boolean;
} = {}) {
  const query = useQuery({
    queryKey: ["property-reviews", params],
    enabled,
    queryFn: async () => {
      return await getRequest<ListPropertyReviewsResponse>({
        url: "/property-reviews",
        params: normalizeReviewParams({
          skip: 0,
          limit: 100,
          sort_by: "date_created",
          sort_order: "desc",
          ...params,
        }),
        protectedRoute: true,
      });
    },
  });

  return {
    reviews: query.data?.items ?? [],
    reviewsTotal: query.data?.pagination.total_items ?? 0,
    isReviewsLoading: query.isLoading,
    reviewsError: query.error,
    refetchReviews: query.refetch,
  };
}

export function useListPropertyReviews({
  propertyId,
  enabled = true,
  params,
}: {
  propertyId?: string;
  enabled?: boolean;
  params?: Omit<ListPropertyReviewsParams, "property_id">;
}) {
  const query = useQuery({
    queryKey: ["property-reviews", propertyId, params],
    enabled: enabled && !!propertyId,
    queryFn: async () => {
      return await getRequest<ListPropertyReviewsResponse>({
        url: `/property-reviews/${propertyId}/reviews`,
        params: normalizeReviewParams({
          skip: 0,
          limit: 100,
          sort_by: "date_created",
          sort_order: "desc",
          ...params,
        }),
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
