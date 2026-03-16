import { getRequest, postRequest } from "@/services";
import {
  BookmarkItem,
  ListBookmarksResponse,
  ToggleBookmarkResponse,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib";

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
