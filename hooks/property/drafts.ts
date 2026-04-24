import { showToast } from "@/lib";
import { deleteRequest, getRequest, postRequest, putRequest } from "@/services";
import { SpaceValue } from "@/store/useSpace";
import {
  CreatePropertyDraftPayload,
  CreatePropertyResponse,
  GetPropertyDraftResponse,
  ListPropertiesParams,
  ListPropertiesResponse,
  ListPropertyDraftsResponse,
  PropertyDraftItem,
  PropertyListItem,
  SavePropertyDraftPayload,
  SavePropertyDraftResponse,
  UpdatePropertyPayload,
} from "@/types";
import { SpaceType } from "@/types/add-space-types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  buildCreatePayload,
  buildDraftPayload,
  buildUpdatePayload,
  getApiErrorMessage,
  normalizeListParams,
} from "./shared";

export function useCreatePropertyDraft() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      type,
      value,
    }: {
      type: SpaceType;
      value: SpaceValue;
    }) => {
      let payload: CreatePropertyDraftPayload | undefined;
      try {
        payload = await buildDraftPayload(type, value);
        return await postRequest<
          CreatePropertyResponse,
          CreatePropertyDraftPayload
        >({
          url: "/properties/drafts",
          payload,
          notifyOnError: false,
        });
      } catch (error) {
        console.log("CreatePropertyDraft: attempted payload before failure", payload);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      await queryClient.invalidateQueries({ queryKey: ["my-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["property-drafts"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Draft saved successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Save Draft Failed",
        text2: getApiErrorMessage(error, "Unable to save draft."),
      });
    },
  });

  return {
    createPropertyDraftMutation: mutateAsync,
    createPropertyDraftPending: isPending,
  };
}

export function useListMyDrafts({
  params,
  pageSize = 20,
  enabled = true,
}: {
  params?: ListPropertiesParams;
  pageSize?: number;
  enabled?: boolean;
}) {
  const query = useInfiniteQuery({
    queryKey: ["my-drafts", params, pageSize],
    initialPageParam: 0,
    enabled,
    queryFn: async ({ pageParam }) => {
      const queryParams = normalizeListParams({
        ...params,
        skip: Number(pageParam) || 0,
        limit: pageSize,
      });

      return await getRequest<ListPropertiesResponse>({
        url: "/properties/me/drafts",
        params: queryParams,
      });
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.pagination.skip + lastPage.pagination.limit;
      return nextSkip < lastPage.pagination.total_items ? nextSkip : undefined;
    },
  });

  const properties: PropertyListItem[] =
    query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    properties,
    totalItems: query.data?.pages[0]?.pagination.total_items ?? 0,
    isPropertiesLoading: query.isLoading,
    isPropertiesFetching: query.isFetching,
    isPropertiesFetchingNextPage: query.isFetchingNextPage,
    hasMoreProperties: query.hasNextPage,
    propertiesError: query.error,
    fetchMoreProperties: query.fetchNextPage,
    refetchProperties: query.refetch,
  };
}

export function useListPropertyDrafts({
  params,
  pageSize = 20,
  enabled = true,
}: {
  params?: ListPropertiesParams;
  pageSize?: number;
  enabled?: boolean;
}) {
  const query = useInfiniteQuery({
    queryKey: ["property-drafts", params, pageSize],
    initialPageParam: 0,
    enabled,
    queryFn: async ({ pageParam }) => {
      const queryParams = normalizeListParams({
        ...params,
        skip: Number(pageParam) || 0,
        limit: pageSize,
      });

      return await getRequest<ListPropertyDraftsResponse>({
        url: "/properties/drafts",
        params: queryParams,
        protectedRoute: true,
      });
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.pagination.skip + lastPage.pagination.limit;
      return nextSkip < lastPage.pagination.total_items ? nextSkip : undefined;
    },
  });

  const drafts: PropertyDraftItem[] =
    query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    drafts,
    totalDrafts: query.data?.pages[0]?.pagination.total_items ?? 0,
    isDraftsLoading: query.isLoading,
    isDraftsFetching: query.isFetching,
    isDraftsFetchingNextPage: query.isFetchingNextPage,
    hasMoreDrafts: query.hasNextPage,
    draftsError: query.error,
    fetchMoreDrafts: query.fetchNextPage,
    refetchDrafts: query.refetch,
  };
}

export function useGetPropertyDraft({
  draftId,
  enabled = true,
}: {
  draftId?: string;
  enabled?: boolean;
}) {
  const query = useQuery({
    queryKey: ["property-draft", draftId],
    enabled: enabled && !!draftId,
    queryFn: async () =>
      await getRequest<GetPropertyDraftResponse>({
        url: `/properties/drafts/${draftId}`,
        protectedRoute: true,
      }),
  });

  return {
    draft: query.data,
    isDraftLoading: query.isLoading,
    draftError: query.error,
    refetchDraft: query.refetch,
  };
}

export function useSavePropertyDraft() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      type,
      value,
    }: {
      type: SpaceType;
      value: SpaceValue;
    }) => {
      let payload: SavePropertyDraftPayload | undefined;
      try {
        payload = await buildCreatePayload(type, value);
        return await postRequest<SavePropertyDraftResponse, SavePropertyDraftPayload>(
          {
            url: "/properties/drafts",
            payload,
            protectedRoute: true,
            notifyOnError: false,
          },
        );
      } catch (error) {
        console.log(
          "SavePropertyDraft: attempted payload before failure",
          payload,
        );
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["property-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Draft saved successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Save Draft Failed",
        text2: getApiErrorMessage(error, "Unable to save draft."),
      });
    },
  });

  return {
    savePropertyDraftMutation: mutateAsync,
    savePropertyDraftPending: isPending,
  };
}

export function useUpdatePropertyDraft() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      draftId,
      addressId,
      type,
      value,
    }: {
      draftId: string;
      addressId: string;
      type: SpaceType;
      value: SpaceValue;
    }) => {
      let payload: UpdatePropertyPayload | undefined;
      try {
        payload = await buildUpdatePayload({ type, value, addressId });
        return await putRequest<SavePropertyDraftResponse, UpdatePropertyPayload>({
          url: `/properties/drafts/${draftId}`,
          payload,
          protectedRoute: true,
          notifyOnError: false,
        });
      } catch (error) {
        console.log(
          "UpdatePropertyDraft: attempted payload before failure",
          payload,
        );
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["property-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Draft updated successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Update Draft Failed",
        text2: getApiErrorMessage(error, "Unable to update draft."),
      });
    },
  });

  return {
    updatePropertyDraftMutation: mutateAsync,
    updatePropertyDraftPending: isPending,
  };
}

export function useDeletePropertyDraft() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ draftId }: { draftId: string }) =>
      await deleteRequest<void>({
        url: `/properties/drafts/${draftId}`,
        protectedRoute: true,
        notifyOnError: false,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["property-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Draft deleted successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Delete Draft Failed",
        text2: getApiErrorMessage(error, "Unable to delete draft."),
      });
    },
  });

  return {
    deletePropertyDraftMutation: mutateAsync,
    deletePropertyDraftPending: isPending,
  };
}

export function usePublishPropertyDraft() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ draftId }: { draftId: string }) =>
      await postRequest<CreatePropertyResponse, Record<string, never>>({
        url: `/properties/drafts/${draftId}/publish`,
        payload: {},
        protectedRoute: true,
        notifyOnError: false,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["property-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Draft published successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Publish Draft Failed",
        text2: getApiErrorMessage(error, "Unable to publish draft."),
      });
    },
  });

  return {
    publishPropertyDraftMutation: mutateAsync,
    publishPropertyDraftPending: isPending,
  };
}
