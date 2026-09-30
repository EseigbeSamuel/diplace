import { getRequest, postRequest } from "@/services";
import {
  BookmarkItem,
  ListBookmarksParams,
  ListBookmarksResponse,
  ReportPropertyPayload,
  ReportPropertyResponse,
  ToggleBookmarkResponse,
} from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { showToast } from "@/lib";
import axios from "axios";
import { normalizeListParams } from "./property/shared";

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
  params,
  enabled = true,
  limit = 100,
}: {
  params?: ListBookmarksParams;
  enabled?: boolean;
  limit?: number;
} = {}) {
  const queryParams = normalizeListParams({
    skip: 0,
    limit,
    sort_by: "date_created",
    sort_order: "desc",
    ...params,
  });

  const query = useQuery({
    queryKey: ["my-bookmarks", "list", queryParams],
    enabled,
    queryFn: async () => {
      return await getRequest<ListBookmarksResponse>({
        url: "/interaction/me/bookmarks",
        params: queryParams,
        protectedRoute: true,
      });
    },
  });

  const bookmarks: BookmarkItem[] = query.data?.items ?? [];
  const bookmarkedPropertyIds = bookmarks
    .map((item) => item.property?.public_id)
    .filter(Boolean);

  return {
    bookmarks,
    bookmarkedPropertyIds,
    pagination: query.data?.pagination,
    totalItems: query.data?.pagination?.total_items ?? bookmarks.length,
    isBookmarksLoading: query.isLoading,
    isBookmarksFetching: query.isFetching,
    bookmarksError: query.error,
    refetchBookmarks: query.refetch,
  };
}

export function useInfiniteMyBookmarks({
  params,
  pageSize = 20,
  enabled = true,
}: {
  params?: Omit<ListBookmarksParams, "skip" | "limit">;
  pageSize?: number;
  enabled?: boolean;
} = {}) {
  const query = useInfiniteQuery({
    queryKey: ["my-bookmarks", "infinite", params, pageSize],
    initialPageParam: 0,
    enabled,
    queryFn: async ({ pageParam }) => {
      const queryParams = normalizeListParams({
        ...params,
        skip: Number(pageParam) || 0,
        limit: pageSize,
        sort_by: params?.sort_by ?? "date_created",
        sort_order: params?.sort_order ?? "desc",
      });

      return await getRequest<ListBookmarksResponse>({
        url: "/interaction/me/bookmarks",
        params: queryParams,
        protectedRoute: true,
      });
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.pagination.skip + lastPage.pagination.limit;
      return nextSkip < lastPage.pagination.total_items ? nextSkip : undefined;
    },
  });

  const bookmarks: BookmarkItem[] =
    query.data?.pages.flatMap((page) => page.items) ?? [];
  const bookmarkedPropertyIds = bookmarks
    .map((item) => item.property?.public_id)
    .filter(Boolean);

  return {
    bookmarks,
    bookmarkedPropertyIds,
    totalItems: query.data?.pages[0]?.pagination.total_items ?? 0,
    isBookmarksLoading: query.isLoading,
    isBookmarksFetching: query.isFetching,
    isBookmarksFetchingNextPage: query.isFetchingNextPage,
    hasMoreBookmarks: query.hasNextPage,
    bookmarksError: query.error,
    fetchMoreBookmarks: query.fetchNextPage,
    refetchBookmarks: query.refetch,
  };
}

export function useTogglePropertyBookmark() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      propertyId,
      notify = true,
    }: {
      propertyId: string;
      notify?: boolean;
    }) => {
      return await postRequest<ToggleBookmarkResponse, Record<string, never>>({
        url: `/interaction/${propertyId}/bookmark`,
        payload: {},
        protectedRoute: true,
        notifyOnError: false,
      });
    },
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["my-bookmarks"] });
      if (variables.notify === false) return;
      const status = data?.bookmarked?.status;
      if (status === "added") {
        showToast({
          type: "success",
          text1: "Bookmark Added",
          text2: "Saved to your bookmarks.",
        });
      } else if (status === "removed") {
        showToast({
          type: "info",
          text1: "Bookmark Removed",
          text2: "Removed from your bookmarks.",
        });
      }
    },
    onError: (error) => {
      const message = getInteractionErrorMessage(
        error,
        "Unable to update bookmark.",
      );
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
