import { getFromLocalStore } from "@/lib";
import { SpaceValue } from "@/store/useSpace";
import {
  CostFrequency,
  CreatePropertyDraftPayload,
  CreatePropertyPayload,
  PropertyFeesPayload,
  PropertyMediaPayload,
  UpdatePropertyPayload,
  UploadFilesResponse,
} from "@/types";
import { MediaItem, SpaceType } from "@/types/add-space-types";

export const API_BASE_URL = "https://diplace.api.elsoft.ng/api/v1";

const PROPERTY_TYPE_MAP: Record<
  Exclude<SpaceType, null>,
  CreatePropertyPayload["property_type"]
> = {
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

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const rawError = error as {
    message?: unknown;
    responseData?: { message?: unknown };
    response?: {
      data?: {
        message?: unknown;
        detail?: Array<{ msg?: unknown }>;
      };
    };
  };

  const backendMessage =
    rawError?.responseData?.message ??
    rawError?.response?.data?.message ??
    rawError?.response?.data?.detail?.[0]?.msg;

  if (typeof backendMessage === "string" && backendMessage.trim().length > 0) {
    return backendMessage;
  }

  if (
    typeof rawError?.message === "string" &&
    rawError.message.trim().length > 0 &&
    !/^Request failed with status code \d+$/i.test(rawError.message)
  ) {
    return rawError.message;
  }

  return fallback;
};

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

const extractFees = (
  charges: SpaceValue["otherCharges"],
): PropertyFeesPayload => {
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
    if (key.includes("agent") || key.includes("agency"))
      fees.agency_fee_percent = amount;
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

const UPLOAD_BATCH_SIZE = 2;

const buildUploadFormData = (assets: UploadAsset[]) => {
  const formData = new FormData();

  assets.forEach((item, index) => {
    const ext =
      getExtFromUri(item.uri) ||
      (item.type.startsWith("video") ? "mp4" : "jpg");
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

  const collectedUrls: string[] = [];
  const token = await getFromLocalStore("access_token");

  if (!token) {
    throw new Error("Missing access token for upload.");
  }

  for (let index = 0; index < assets.length; index += UPLOAD_BATCH_SIZE) {
    const batch = assets.slice(index, index + UPLOAD_BATCH_SIZE);
    try {
      const response = await fetch(`${API_BASE_URL}/uploads/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: buildUploadFormData(batch),
      });

      const responseText = await response.text();
      if (!response.ok) {
        console.log(`CreateProperty: ${label} upload failed response`, {
          status: response.status,
          body: responseText,
        });
        throw new Error(
          `Upload failed with status ${response.status}: ${responseText || "No response body"}`,
        );
      }

      let batchResponse: UploadFilesResponse = [];
      try {
        batchResponse = JSON.parse(responseText) as UploadFilesResponse;
      } catch {
        throw new Error(`Invalid upload response: ${responseText}`);
      }

      collectedUrls.push(...batchResponse);
      console.log(
        `CreateProperty: ${label} batch ${index / UPLOAD_BATCH_SIZE + 1} response URLs`,
        batchResponse,
      );
    } catch (error) {
      console.log(
        `CreateProperty: ${label} batch ${index / UPLOAD_BATCH_SIZE + 1} failed`,
        {
          batchSize: batch.length,
          uris: batch.map((item) => item.uri),
        },
      );
      throw error;
    }
  }

  console.log(`CreateProperty: ${label} upload response URLs`, collectedUrls);
  return collectedUrls;
};

const uploadMedia = async (
  media: MediaItem[],
): Promise<PropertyMediaPayload[]> => {
  if (!media.length) return [];

  const uploadResponse = await uploadAssets(
    media.map((item, index) => {
      const ext =
        getExtFromUri(item.uri) || (item.type === "video" ? "mp4" : "jpg");
      return {
        uri: item.uri,
        type: getMimeFromExt(
          ext,
          item.type === "video" ? "video/mp4" : "image/jpeg",
        ),
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
): Promise<
  Array<{ file_url: string; room_name: string; duration: number }>
> => {
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

const buildPropertyPayload = async ({
  type,
  value,
  draft = false,
}: {
  type: SpaceType;
  value: SpaceValue;
  draft?: boolean;
}): Promise<CreatePropertyPayload | CreatePropertyDraftPayload> => {
  if (!draft && !type) {
    throw new Error("Property type is required.");
  }

  if (
    !draft &&
    (!value.description?.title || !value.description?.description)
  ) {
    throw new Error("Property title and description are required.");
  }

  if (!draft && !value.location) {
    throw new Error("Property location is required.");
  }

  if (!draft && !value.media?.length) {
    throw new Error("At least one property media file is required.");
  }

  const costFrequency =
    COST_FREQUENCY_MAP[value.rentalCost?.rentDuration?.toLowerCase() || ""];

  if (!draft && !costFrequency) {
    throw new Error("Cost frequency is required.");
  }

  const uploadedMedia = await uploadMedia(value.media ?? []);
  const uploadedRentalAgreement = await uploadRentalAgreement(
    value.rentalAgreement,
  );
  const uploadedTours = await uploadTours(value.tour);
  const selectedInspectionSlots = (value.inspectionTimeSlots ?? []).filter(
    (slot) => slot.selected,
  );

  const payload: CreatePropertyDraftPayload = {
    ...(value.description?.title ? { title: value.description.title } : {}),
    ...(value.description?.description
      ? { description: value.description.description }
      : {}),
    ...(type ? { property_type: PROPERTY_TYPE_MAP[type] } : {}),
    listing_type: "normal",
    price: parseNumber(value.rentalCost?.rentalCost),
    ...(costFrequency ? { cost_frequency: costFrequency } : {}),
    fees: extractFees(value.otherCharges),
    amenities: value.amenities ?? [],
    media: uploadedMedia,
    ...(value.location
      ? {
        address: {
          street: value.location.address,
          city: value.location.city,
          state: value.location.state,
          zip_code: value.location.postalCode,
          country: value.location.country,
          latitude: value.location.latitude,
          longitude: value.location.longitude,
        },
      }
      : {}),
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

  return payload as CreatePropertyPayload | CreatePropertyDraftPayload;
};

export const buildCreatePayload = async (
  type: SpaceType,
  value: SpaceValue,
): Promise<CreatePropertyPayload> => {
  return (await buildPropertyPayload({
    type,
    value,
    draft: false,
  })) as CreatePropertyPayload;
};

export const buildDraftPayload = async (
  type: SpaceType,
  value: SpaceValue,
): Promise<CreatePropertyDraftPayload> => {
  return (await buildPropertyPayload({
    type,
    value,
    draft: true,
  })) as CreatePropertyDraftPayload;
};

export const buildUpdatePayload = async ({
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

  const costFrequency =
    COST_FREQUENCY_MAP[value.rentalCost?.rentDuration?.toLowerCase() || ""];
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
    media: await uploadMedia(value.media ?? []),
    address_id: addressId,
    ...(value.location
      ? {
        address: {
          street: value.location.address,
          city: value.location.city,
          state: value.location.state,
          zip_code: value.location.postalCode,
          country: value.location.country,
          latitude: value.location.latitude,
          longitude: value.location.longitude,
        },
      }
      : {}),
    owner_mode: value.owner ?? null,
    owner_details: value.ownerDetails ?? null,
    owner_account_details: value.ownerAccountDetails ?? null,
    account_details: value.accountDetails ?? null,
    units: value.units ?? 0,
    event_space: value.eventSpace ?? null,
    capacity: value.capacity ?? null,
    inspection: {
      fee: value.inspectionFee ?? 0,
      time_slots: (value.inspectionTimeSlots ?? []).filter(
        (slot) => slot.selected,
      ),
    },
    metadata: {
      max_rent_payout: parseNumber(value.rentalCost?.maxRentPayout),
      other_charges: value.otherCharges ?? [],
    },
  };
};

export const normalizeListParams = (
  params?: Record<string, unknown>,
): Record<string, string | number | boolean> => {
  if (!params) return {};

  return Object.entries(params).reduce<
    Record<string, string | number | boolean>
  >((acc, [key, value]) => {
    if (value === undefined || value === null || value === "") return acc;
    acc[key] = value as string | number | boolean;
    return acc;
  }, {});
};
