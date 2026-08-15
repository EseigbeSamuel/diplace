import { getRequest, postRequest } from "@/services";
import {
  BookmarkItem,
  ListBookmarksResponse,
  ReportPropertyPayload,
  ReportPropertyResponse,
  ToggleBookmarkResponse,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib";
import axios from "axios";

const getInteractionErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join("\n");
  }

  return detail || error.response?.data?.message || error.message || fallback;
};

export function useMyBookmarks({
  enabled = true,
  limit = 100,
}: {
  enabled?: boolean;
  limit?: number;
} = {}) {
  const query = useQuery({
    queryKey: ["my-bookmarks", limit],
    enabled,
    queryFn: async () => {
      return await getRequest<ListBookmarksResponse>({
        url: "/interaction/me/bookmarks",
        params: {
          skip: 0,
          limit,
          sort_by: "date_created",
          sort_order: "desc",
        },
        protectedRoute: true,
      });
    },
  });

  const bookmarks: BookmarkItem[] = query.data?.items ?? [];
  const bookmarkedPropertyIds = bookmarks.map((item) => item.property.public_id);

  return {
    bookmarks,
    bookmarkedPropertyIds,
    isBookmarksLoading: query.isLoading,
    isBookmarksFetching: query.isFetching,
    bookmarksError: query.error,
    refetchBookmarks: query.refetch,
  };
}

export function useTogglePropertyBookmark() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ propertyId }: { propertyId: string }) => {
      return await postRequest<ToggleBookmarkResponse, Record<string, never>>({
        url: `/interaction/${propertyId}/bookmark`,
        payload: {},
        protectedRoute: true,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-bookmarks"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Unable to update bookmark.";
      showToast({
        type: "error",
        text1: "Bookmark Failed",
        text2: message,
      });
    },
  });

  return {
    togglePropertyBookmarkMutation: mutateAsync,
    togglePropertyBookmarkPending: isPending,
  };
}

export function useReportProperty() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      propertyId,
      payload,
    }: {
      propertyId: string;
      payload: ReportPropertyPayload;
    }) => {
      return await postRequest<ReportPropertyResponse, ReportPropertyPayload>({
        url: `/interaction/${propertyId}/report`,
        payload,
        protectedRoute: true,
        notifyOnError: false,
      });
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["property-reports", variables.propertyId],
      });
      showToast({
        type: "success",
        text1: "Report Submitted",
        text2: "Thanks. We will review this listing.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Report Failed",
        text2: getInteractionErrorMessage(
          error,
          "Unable to submit report. Please try again.",
        ),
      });
    },
  });

  return {
    reportPropertyMutation: mutateAsync,
    reportPropertyPending: isPending,
  };
}
