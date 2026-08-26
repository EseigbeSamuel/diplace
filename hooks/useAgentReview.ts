import { showToast } from "@/lib";
import { deleteRequest, getRequest, postRequest, putRequest } from "@/services";
import {
  AgentReviewItem,
  ListAgentReviewsParams,
  ListAgentReviewsResponse,
  ReviewPayload,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const normalizeReviewParams = (
  params?: ListAgentReviewsParams,
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

const getReviewErrorMessage = (error: unknown, fallback: string = "Something went wrong"): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((d: any) => d?.msg || String(d)).join("\n");
  }
  if (typeof detail === "string") return detail;
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallback
  );
};

export function useListAgentReviews({
  params,
  enabled = true,
}: {
  params?: ListAgentReviewsParams;
  enabled?: boolean;
} = {}) {
  const query = useQuery({
    queryKey: ["agent-reviews", params],
    enabled,
    queryFn: async () =>
      await getRequest<ListAgentReviewsResponse>({
        url: "/agent-reviews",
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
    agentReviewsTotal: query.data?.pagination?.total_items ?? 0,
    pagination: query.data?.pagination,
    isAgentReviewsLoading: query.isLoading,
    agentReviewsError: query.error,
    refetchAgentReviews: query.refetch,
  };
}

export function useListAgentReviewsByAgent({
  agentId,
  params,
  enabled = true,
}: {
  agentId?: string;
  params?: Omit<ListAgentReviewsParams, "agent_id">;
  enabled?: boolean;
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
    agentReviewsTotal: query.data?.pagination?.total_items ?? 0,
    pagination: query.data?.pagination,
    isAgentReviewsLoading: query.isLoading,
    agentReviewsError: query.error,
    refetchAgentReviews: query.refetch,
  };
}

export function useCreateAgentReview() {
  const queryClient = useQueryClient();
  const { mutateAsync, mutate, isPending } = useMutation({
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
        protectedRoute: true,
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
    createAgentReview: mutate,
    isCreateAgentReviewPending: isPending,
  };
}

export function useUpdateAgentReview() {
  const queryClient = useQueryClient();
  const { mutateAsync, mutate, isPending } = useMutation({
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
        protectedRoute: true,
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
    updateAgentReview: mutate,
    isUpdateAgentReviewPending: isPending,
  };
}

export function useDeleteAgentReview() {
  const queryClient = useQueryClient();
  const { mutateAsync, mutate, isPending } = useMutation({
    mutationFn: async (reviewId: string) =>
      await deleteRequest<void>({
        url: `/agent-reviews/${reviewId}`,
        protectedRoute: true,
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
    deleteAgentReview: mutate,
    isDeleteAgentReviewPending: isPending,
  };
}
