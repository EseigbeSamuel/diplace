export type PropertyType =
  | "apartment"
  | "shop"
  | "office"
  | "hall"
  | "event_centre"
  | "hotel"
  | "guest_house"
  | "guest_houses"
  | "hostel"
  | "lodge"
  | "duplex"
  | "bungalow"
  | "townhouse"
  | "self_contained"
  | "villa"
  | "land"
  | "farm"
  | "garden"
  | "shortlet";

export type ListingType = "normal" | "premium" | "sponsored";

export type CostFrequency =
  | "per_hour"
  | "per_day"
  | "per_week"
  | "per_month"
  | "per_annum"
  | "per_event"
  | "per_night"
  | "per_person"
  | "per_unit"
  | "per_year"
  | "per_weekend"
  | "outright";

export interface PropertyFeesPayload {
  caution_fee: number;
  agency_fee_percent: number;
  legal_fee_percent: number;
  platform_fee: number;
}

export interface PropertyMediaPayload {
  file_url: string;
  file_type: "image" | "video";
  description: string;
}

export interface PropertyAddressPayload {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CreatePropertyPayload {
  title: string;
  description: string;
  property_type: PropertyType;
  listing_type: ListingType;
  price: number;
  cost_frequency: CostFrequency;
  fees: PropertyFeesPayload;
  amenities: string[];
  media: PropertyMediaPayload[];
  address: PropertyAddressPayload;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CreatePropertyResponse {
  public_id: string;
  status: string;
  title: string;
  description: string;
  property_type: PropertyType;
  listing_type: ListingType;
  price: number;
  cost_frequency: CostFrequency;
  fees: PropertyFeesPayload;
  amenities: string[];
  media: Array<
    PropertyMediaPayload & {
      public_id: string;
      status: string;
      date_created: string;
      date_modified: string;
    }
  >;
  is_verified: boolean;
  verified_at: string | null;
}

export type UploadFilesResponse = string[];
