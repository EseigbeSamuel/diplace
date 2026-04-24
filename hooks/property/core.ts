import { showToast } from "@/lib";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "@/services";
import { SpaceValue } from "@/store/useSpace";
import {
  CreatePropertyPayload,
  CreatePropertyResponse,
  ListPropertiesParams,
  ListPropertiesResponse,
  PropertyDetailsResponse,
  PropertyListItem,
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
  buildUpdatePayload,
  getApiErrorMessage,
  normalizeListParams,
} from "./shared";

export function useCreateProperty() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      type,
      value,
    }: {
      type: SpaceType;
      value: SpaceValue;
    }) => {
      let payload: CreatePropertyPayload | undefined;
      try {
        payload = await buildCreatePayload(type, value);
        return await postRequest<CreatePropertyResponse, CreatePropertyPayload>({
          url: "/properties/",
          payload,
          notifyOnError: false,
        });
      } catch (error) {
        console.log("CreateProperty: attempted payload before failure", payload);
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
        text2: "Property created successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Create Property Failed",
        text2: getApiErrorMessage(error, "Unable to create property."),
      });
    },
  });

  return {
    createPropertyMutation: mutateAsync,
    createPropertyPending: isPending,
  };
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      propertyId,
      addressId,
      type,
      value,
    }: {
      propertyId: string;
      addressId: string;
      type: SpaceType;
      value: SpaceValue;
    }) => {
      let payload: UpdatePropertyPayload | undefined;
      try {
        payload = await buildUpdatePayload({ type, value, addressId });
        return await putRequest<CreatePropertyResponse, UpdatePropertyPayload>({
          url: `/properties/${propertyId}`,
          payload,
          notifyOnError: false,
        });
      } catch (error) {
        console.log("UpdateProperty: attempted payload before failure", payload);
        throw error;
      }
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      await queryClient.invalidateQueries({ queryKey: ["my-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["property-drafts"] });
      await queryClient.invalidateQueries({
        queryKey: ["property-details", response.public_id],
      });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Property updated successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Update Property Failed",
        text2: getApiErrorMessage(error, "Unable to update property."),
      });
    },
  });

  return {
    updatePropertyMutation: mutateAsync,
    updatePropertyPending: isPending,
  };
}

export function useListProperties({
  params,
  pageSize = 20,
  enabled = true,
}: {
  params?: ListPropertiesParams;
  pageSize?: number;
  enabled?: boolean;
}) {
  const query = useInfiniteQuery({
    queryKey: ["properties", params, pageSize],
    initialPageParam: 0,
    enabled,
    queryFn: async ({ pageParam }) => {
      const queryParams = normalizeListParams({
        ...params,
        skip: Number(pageParam) || 0,
        limit: pageSize,
      });

      return await getRequest<ListPropertiesResponse>({
        url: "/properties/",
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

export function useGetPropertyDetails({
  propertyId,
  enabled = true,
}: {
  propertyId?: string;
  enabled?: boolean;
}) {
  const query = useQuery({
    queryKey: ["property-details", propertyId],
    enabled: enabled && !!propertyId,
    queryFn: async () =>
      await getRequest<PropertyDetailsResponse>({
        url: `/properties/${propertyId}`,
      }),
  });

  return {
    propertyDetails: query.data,
    isPropertyDetailsLoading: query.isLoading,
    propertyDetailsError: query.error,
    refetchPropertyDetails: query.refetch,
  };
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ propertyId }: { propertyId: string }) =>
      await deleteRequest<void>({
        url: `/properties/${propertyId}`,
        notifyOnError: false,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      await queryClient.invalidateQueries({ queryKey: ["my-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["property-drafts"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Property removed successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Delete Property Failed",
        text2: getApiErrorMessage(error, "Unable to delete property."),
      });
    },
  });

  return {
    deletePropertyMutation: mutateAsync,
    deletePropertyPending: isPending,
  };
}

type UpdatePropertyStatusValue =
  | "draft"
  | "active"
  | "pending"
  | "sold"
  | "rented"
  | "inactive"
  | "archived";

interface UpdatePropertyStatusPayload {
  status: UpdatePropertyStatusValue;
  reason?: string;
}

export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      propertyId,
      status,
      reason,
    }: {
      propertyId: string;
      status: UpdatePropertyStatusValue;
      reason?: string;
    }) =>
      await patchRequest<CreatePropertyResponse, UpdatePropertyStatusPayload>({
        url: `/properties/${propertyId}/status`,
        payload: { status, reason },
        notifyOnError: false,
      }),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      await queryClient.invalidateQueries({ queryKey: ["my-drafts"] });
      await queryClient.invalidateQueries({ queryKey: ["property-drafts"] });
      await queryClient.invalidateQueries({
        queryKey: ["property-details", response.public_id],
      });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Property status updated successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Status Update Failed",
        text2: getApiErrorMessage(error, "Unable to update property status."),
      });
    },
  });

  return {
    updatePropertyStatusMutation: mutateAsync,
    updatePropertyStatusPending: isPending,
  };
}
