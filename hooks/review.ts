import { showToast } from "@/lib";
import { deleteRequest, getRequest, postRequest, putRequest } from "@/services";
import {
  AgentReviewItem,
  ListAgentReviewsParams,
  ListAgentReviewsResponse,
  ListPropertyReviewsParams,
  ListPropertyReviewsResponse,
  PropertyReviewItem,
  PropertyReviewPayload,
  ReviewPayload,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const normalizeReviewParams = (
  params?: ListPropertyReviewsParams | ListAgentReviewsParams,
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

const getReviewErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return fallback;
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join("\n");
  return detail || error.response?.data?.message || error.message || fallback;
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

export function useCreatePropertyReview() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      propertyId,
      payload,
    }: {
      propertyId: string;
      payload: PropertyReviewPayload;
    }) =>
      await postRequest<PropertyReviewItem, PropertyReviewPayload>({
        url: `/property-reviews/${propertyId}`,
        payload,
        notifyOnError: false,
      }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["property-reviews"] });
      await queryClient.invalidateQueries({
        queryKey: ["property-reviews", variables.propertyId],
      });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Review submitted successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Review Failed",
        text2: getReviewErrorMessage(error, "Unable to submit review."),
      });
    },
  });

  return {
    createPropertyReviewMutation: mutateAsync,
    isCreatePropertyReviewPending: isPending,
  };
}

export function useUpdatePropertyReview() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      propertyId,
      reviewId,
      payload,
    }: {
      propertyId: string;
      reviewId: string;
      payload: PropertyReviewPayload;
    }) =>
      await putRequest<PropertyReviewItem, PropertyReviewPayload>({
        url: `/property-reviews/${propertyId}/reviews/${reviewId}`,
        payload,
        notifyOnError: false,
      }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["property-reviews"] });
      await queryClient.invalidateQueries({
        queryKey: ["property-reviews", variables.propertyId],
      });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Review updated successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Review Update Failed",
        text2: getReviewErrorMessage(error, "Unable to update review."),
      });
    },
  });

  return {
    updatePropertyReviewMutation: mutateAsync,
    isUpdatePropertyReviewPending: isPending,
  };
}

export function useDeletePropertyReview() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      propertyId,
      reviewId,
    }: {
      propertyId: string;
      reviewId: string;
    }) =>
      await deleteRequest<void>({
        url: `/property-reviews/${propertyId}/reviews/${reviewId}`,
        notifyOnError: false,
      }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["property-reviews"] });
      await queryClient.invalidateQueries({
        queryKey: ["property-reviews", variables.propertyId],
      });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Review deleted successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Delete Review Failed",
        text2: getReviewErrorMessage(error, "Unable to delete review."),
      });
    },
  });

  return {
    deletePropertyReviewMutation: mutateAsync,
    isDeletePropertyReviewPending: isPending,
  };
}

export function useListAgentReviews({
  agentId,
  enabled = true,
  params,
}: {
  agentId?: string;
  enabled?: boolean;
  params?: Omit<ListAgentReviewsParams, "agent_id">;
} = {}) {
  const query = useQuery({
    queryKey: ["agent-reviews", agentId, params],
    enabled: enabled && !!agentId,
    queryFn: async () =>
      await getRequest<ListAgentReviewsResponse>({
        url: `/agent-reviews/${agentId}/reviews`,
        params: normalizeReviewParams({
          skip: 0,
          limit: 100,
          sort_by: "date_created",
          sort_order: "desc",
          ...params,
        }),
        protectedRoute: true,
      }),
  });

  return {
    agentReviews: query.data?.items ?? [],
    agentReviewsTotal: query.data?.pagination.total_items ?? 0,
    isAgentReviewsLoading: query.isLoading,
    agentReviewsError: query.error,
    refetchAgentReviews: query.refetch,
  };
}

export function useCreateAgentReview() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      agentId,
      payload,
    }: {
      agentId: string;
      payload: ReviewPayload;
    }) =>
      await postRequest<AgentReviewItem, ReviewPayload>({
        url: `/agent-reviews/${agentId}`,
        payload,
        notifyOnError: false,
      }),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["agent-reviews"] });
      await queryClient.invalidateQueries({
        queryKey: ["agent-reviews", variables.agentId],
      });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Agent review submitted successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Review Failed",
        text2: getReviewErrorMessage(error, "Unable to submit agent review."),
      });
    },
  });

  return {
    createAgentReviewMutation: mutateAsync,
    isCreateAgentReviewPending: isPending,
  };
}

export function useUpdateAgentReview() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      reviewId,
      payload,
    }: {
      reviewId: string;
      payload: ReviewPayload;
    }) =>
      await putRequest<AgentReviewItem, ReviewPayload>({
        url: `/agent-reviews/${reviewId}`,
        payload,
        notifyOnError: false,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["agent-reviews"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Agent review updated successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Review Update Failed",
        text2: getReviewErrorMessage(error, "Unable to update agent review."),
      });
    },
  });

  return {
    updateAgentReviewMutation: mutateAsync,
    isUpdateAgentReviewPending: isPending,
  };
}

export function useDeleteAgentReview() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (reviewId: string) =>
      await deleteRequest<void>({
        url: `/agent-reviews/${reviewId}`,
        notifyOnError: false,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["agent-reviews"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Agent review deleted successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Delete Review Failed",
        text2: getReviewErrorMessage(error, "Unable to delete agent review."),
      });
    },
  });

  return {
    deleteAgentReviewMutation: mutateAsync,
    isDeleteAgentReviewPending: isPending,
  };
}
