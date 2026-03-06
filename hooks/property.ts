import { SpaceValue } from "@/store/useSpace";
import { deleteRequest, getRequest, postRequest, putRequest } from "@/services";
import {
  BookmarkItem,
  CostFrequency,
  CreatePropertyPayload,
  CreatePropertyResponse,
  ListPropertiesParams,
  ListPropertiesResponse,
  ListBookmarksResponse,
  ListPropertyReviewsResponse,
  PropertyDetailsResponse,
  PropertyListItem,
  PropertyFeesPayload,
  PropertyMediaPayload,
  ToggleBookmarkResponse,
  UpdatePropertyPayload,
  UploadFilesResponse,
} from "@/types";
import { MediaItem, SpaceType } from "@/types/add-space-types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

const PROPERTY_TYPE_MAP: Record<Exclude<SpaceType, null>, CreatePropertyPayload["property_type"]> = {
  apartment: "apartment",
  event: "event_centre",
  office: "office",
  shop: "shop",
};

const COST_FREQUENCY_MAP: Record<string, CostFrequency> = {
  "per hour": "per_hour",
  "per day": "per_day",
  "per week": "per_week",
  "per month": "per_month",
  "per annum": "per_annum",
  "per event": "per_event",
  "per night": "per_night",
  "per person": "per_person",
  "per unit": "per_unit",
  "per year": "per_year",
  "per weekend": "per_weekend",
  outright: "outright",
};

const FAKE_PROPERTY_MEDIA_URL =
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80";

const parseNumber = (value?: string): number => {
  if (!value) return 0;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const getExtFromUri = (uri: string): string => {
  const cleanUri = uri.split("?")[0] || "";
  const lastDot = cleanUri.lastIndexOf(".");
  if (lastDot === -1) return "";
  return cleanUri.slice(lastDot + 1).toLowerCase();
};

const getMimeFromExt = (ext: string, fallback: string): string => {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
    mp4: "video/mp4",
    mov: "video/quicktime",
    m4v: "video/x-m4v",
    pdf: "application/pdf",
  };
  return map[ext] || fallback;
};

const extractFees = (charges: SpaceValue["otherCharges"]): PropertyFeesPayload => {
  const fees: PropertyFeesPayload = {
    caution_fee: 0,
    agency_fee_percent: 0,
    legal_fee_percent: 0,
    platform_fee: 0,
  };

  (charges ?? []).forEach((charge) => {
    const key = charge.title.toLowerCase();
    const amount = parseNumber(charge.value);

    if (key.includes("caution")) fees.caution_fee = amount;
    if (key.includes("agent") || key.includes("agency")) fees.agency_fee_percent = amount;
    if (key.includes("legal")) fees.legal_fee_percent = amount;
    if (key.includes("platform")) fees.platform_fee = amount;
  });

  return fees;
};

type UploadAsset = {
  uri: string;
  type: string;
  name?: string;
};

const buildUploadFormData = (assets: UploadAsset[]) => {
  const formData = new FormData();

  assets.forEach((item, index) => {
    const ext = getExtFromUri(item.uri) || (item.type.startsWith("video") ? "mp4" : "jpg");
    const mime = item.type || getMimeFromExt(ext, "application/octet-stream");
    const name = item.name || `upload-${index}.${ext}`;

    formData.append("files", {
      uri: item.uri,
      name,
      type: mime,
    } as never);
  });

  return formData;
};

const uploadAssets = async (
  assets: UploadAsset[],
  label: string,
): Promise<string[]> => {
  if (!assets.length) return [];

  console.log(`CreateProperty: ${label} upload input`, assets);

  const uploadResponse = await postRequest<UploadFilesResponse, FormData>({
    url: "/uploads/",
    payload: buildUploadFormData(assets),
    protectedRoute: true,
  });

  console.log(`CreateProperty: ${label} upload response URLs`, uploadResponse);
  return uploadResponse;
};

const uploadMedia = async (media: MediaItem[]): Promise<PropertyMediaPayload[]> => {
  if (!media.length) return [];

  const uploadResponse = await uploadAssets(
    media.map((item, index) => {
      const ext = getExtFromUri(item.uri) || (item.type === "video" ? "mp4" : "jpg");
      return {
        uri: item.uri,
        type: getMimeFromExt(ext, item.type === "video" ? "video/mp4" : "image/jpeg"),
        name: `property-media-${index}.${ext}`,
      };
    }),
    "media",
  );

  return uploadResponse.map((url, index) => ({
    file_url: url,
    file_type: media[index]?.type ?? "image",
    description: "",
  }));
};

const uploadRentalAgreement = async (
  rentalAgreement: SpaceValue["rentalAgreement"],
): Promise<string | null> => {
  if (!rentalAgreement?.uri) return null;

  const ext = getExtFromUri(rentalAgreement.uri) || "pdf";
  const urls = await uploadAssets(
    [
      {
        uri: rentalAgreement.uri,
        type: getMimeFromExt(ext, "application/pdf"),
        name: rentalAgreement.name || `rental-agreement.${ext}`,
      },
    ],
    "rental-agreement",
  );

  return urls[0] || null;
};

const uploadTours = async (
  tours: SpaceValue["tour"],
): Promise<Array<{ file_url: string; room_name: string; duration: number }>> => {
  const preparedTours = (tours ?? []).filter((tour) => !!tour.uri);
  if (!preparedTours.length) return [];

  const urls = await uploadAssets(
    preparedTours.map((tour, index) => {
      const ext = getExtFromUri(tour.uri) || "mp4";
      return {
        uri: tour.uri,
        type: getMimeFromExt(ext, "video/mp4"),
        name: `${tour.roomName || "room"}-${index}.${ext}`,
      };
    }),
    "virtual-tour",
  );

  return urls.map((url, index) => ({
    file_url: url,
    room_name: preparedTours[index]?.roomName || `Room ${index + 1}`,
    duration: preparedTours[index]?.duration || 0,
  }));
};

const buildCreatePayload = async (
  type: SpaceType,
  value: SpaceValue,
): Promise<CreatePropertyPayload> => {
  if (!type) {
    throw new Error("Property type is required.");
  }

  if (!value.description?.title || !value.description?.description) {
    throw new Error("Property title and description are required.");
  }

  if (!value.location) {
    throw new Error("Property location is required.");
  }

  if (!value.media?.length) {
    throw new Error("At least one property media file is required.");
  }

  const costFrequency = COST_FREQUENCY_MAP[value.rentalCost?.rentDuration?.toLowerCase() || ""];

  if (!costFrequency) {
    throw new Error("Cost frequency is required.");
  }

  // const uploadedMedia = await uploadMedia(value.media ?? []);
  // TEMP: uploads endpoint is unstable, so media uses a static public fallback URL.
  const uploadedRentalAgreement = await uploadRentalAgreement(
    value.rentalAgreement,
  );
  const uploadedTours = await uploadTours(value.tour);
  const selectedInspectionSlots = (value.inspectionTimeSlots ?? []).filter(
    (slot) => slot.selected,
  );

  return {
    title: value.description.title,
    description: value.description.description,
    property_type: PROPERTY_TYPE_MAP[type],
    listing_type: "normal",
    price: parseNumber(value.rentalCost?.rentalCost),
    cost_frequency: costFrequency,
    fees: extractFees(value.otherCharges),
    amenities: value.amenities ?? [],
    // media: uploadedMedia,
    media: (value.media ?? []).map((item, index) => ({
      file_url: FAKE_PROPERTY_MEDIA_URL,
      file_type: item.type === "video" ? "video" : "image",
      description: `temp-media-${index + 1}`,
    })),
    address: {
      street: value.location.address,
      city: value.location.city,
      state: value.location.state,
      zip_code: value.location.postalCode,
      country: value.location.country,
      latitude: value.location.latitude,
      longitude: value.location.longitude,
    },
    owner_mode: value.owner ?? null,
    owner_details: value.ownerDetails ?? null,
    owner_account_details: value.ownerAccountDetails ?? null,
    account_details: value.accountDetails ?? null,
    units: value.units ?? 0,
    event_space: value.eventSpace ?? null,
    capacity: value.capacity ?? null,
    inspection: {
      fee: value.inspectionFee ?? 0,
      time_slots: selectedInspectionSlots,
    },
    rental_agreement: uploadedRentalAgreement
      ? {
        file_url: uploadedRentalAgreement,
        name: value.rentalAgreement?.name ?? null,
        size: value.rentalAgreement?.size ?? null,
      }
      : null,
    virtual_tour: uploadedTours,
    metadata: {
      max_rent_payout: parseNumber(value.rentalCost?.maxRentPayout),
      other_charges: value.otherCharges ?? [],
    },
  };
};

const buildUpdatePayload = async ({
  type,
  value,
  addressId,
}: {
  type: SpaceType;
  value: SpaceValue;
  addressId: string;
}): Promise<UpdatePropertyPayload> => {
  if (!type) {
    throw new Error("Property type is required.");
  }

  if (!value.description?.title || !value.description?.description) {
    throw new Error("Property title and description are required.");
  }

  const costFrequency = COST_FREQUENCY_MAP[value.rentalCost?.rentDuration?.toLowerCase() || ""];
  if (!costFrequency) {
    throw new Error("Cost frequency is required.");
  }

  return {
    title: value.description.title,
    description: value.description.description,
    property_type: PROPERTY_TYPE_MAP[type],
    listing_type: "normal",
    price: parseNumber(value.rentalCost?.rentalCost),
    cost_frequency: costFrequency,
    fees: extractFees(value.otherCharges),
    amenities: value.amenities ?? [],
    // media: await uploadMedia(value.media ?? []),
    // TEMP: uploads endpoint is unstable, so media uses a static public fallback URL.
    media: (value.media ?? []).map((item, index) => ({
      file_url: FAKE_PROPERTY_MEDIA_URL,
      file_type: item.type === "video" ? "video" : "image",
      description: `temp-media-${index + 1}`,
    })),
    address_id: addressId,
    owner_mode: value.owner ?? null,
    owner_details: value.ownerDetails ?? null,
    owner_account_details: value.ownerAccountDetails ?? null,
    account_details: value.accountDetails ?? null,
    units: value.units ?? 0,
    event_space: value.eventSpace ?? null,
    capacity: value.capacity ?? null,
    inspection: {
      fee: value.inspectionFee ?? 0,
      time_slots: (value.inspectionTimeSlots ?? []).filter((slot) => slot.selected),
    },
    metadata: {
      max_rent_payout: parseNumber(value.rentalCost?.maxRentPayout),
      other_charges: value.otherCharges ?? [],
    },
  };
};

export function useCreateProperty() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      type,
      value,
    }: {
      type: SpaceType;
      value: SpaceValue;
    }) => {
      console.log("CreateProperty: input form values", { type, value });
      let payload: CreatePropertyPayload | undefined;

      try {
        payload = await buildCreatePayload(type, value);
        console.log("CreateProperty: payload", payload);

        const response = await postRequest<
          CreatePropertyResponse,
          CreatePropertyPayload
        >({
          url: "/properties/",
          payload,
          protectedRoute: true,
        });

        console.log("CreateProperty: response", response);
        return response;
      } catch (error) {
        console.log("CreateProperty: attempted payload before failure", payload);
        throw error;
      }
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Property created successfully.",
      });
    },
    onError: (error, variables) => {
      console.log("CreateProperty: error", error);
      console.log("CreateProperty: failed input variables", variables);
      const message =
        error instanceof Error ? error.message : "Unable to create property.";
      Toast.show({
        type: "error",
        text1: "Create Property Failed",
        text2: message,
      });
    },
  });

  return {
    createPropertyMutation: mutateAsync,
    createPropertyPending: isPending,
  };
}

export function useUpdateProperty() {
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
      console.log("UpdateProperty: input form values", {
        propertyId,
        addressId,
        type,
        value,
      });

      let payload: UpdatePropertyPayload | undefined;
      try {
        payload = await buildUpdatePayload({ type, value, addressId });
        console.log("UpdateProperty: payload", payload);

        const response = await putRequest<CreatePropertyResponse, UpdatePropertyPayload>({
          url: `/properties/${propertyId}`,
          payload,
          protectedRoute: true,
        });

        console.log("UpdateProperty: response", response);
        return response;
      } catch (error) {
        console.log("UpdateProperty: attempted payload before failure", payload);
        throw error;
      }
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Property updated successfully.",
      });
    },
    onError: (error, variables) => {
      console.log("UpdateProperty: error", error);
      console.log("UpdateProperty: failed input variables", variables);
      const message =
        error instanceof Error ? error.message : "Unable to update property.";
      Toast.show({
        type: "error",
        text1: "Update Property Failed",
        text2: message,
      });
    },
  });

  return {
    updatePropertyMutation: mutateAsync,
    updatePropertyPending: isPending,
  };
}

const normalizeListParams = (
  params?: ListPropertiesParams,
): Record<string, string | number | boolean> => {
  if (!params) return {};

  return Object.entries(params).reduce<Record<string, string | number | boolean>>(
    (acc, [key, value]) => {
      if (value === undefined || value === null || value === "") return acc;
      acc[key] = value as string | number | boolean;
      return acc;
    },
    {},
  );
};

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
        protectedRoute: true,
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
    queryFn: async () => {
      return await getRequest<PropertyDetailsResponse>({
        url: `/properties/${propertyId}`,
        protectedRoute: true,
      });
    },
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
    mutationFn: async ({ propertyId }: { propertyId: string }) => {
      return await deleteRequest<void>({
        url: `/properties/${propertyId}`,
        protectedRoute: true,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Property removed successfully.",
      });
    },
    onError: (error) => {
      console.log("DeleteProperty: error", error);
      const message =
        error instanceof Error ? error.message : "Unable to delete property.";
      Toast.show({
        type: "error",
        text1: "Delete Property Failed",
        text2: message,
      });
    },
  });

  return {
    deletePropertyMutation: mutateAsync,
    deletePropertyPending: isPending,
  };
}

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
      Toast.show({
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
