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

export type PropertyStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "verified"
  | "unverified"
  | "completed"
  | "available"
  | "cancelled"
  | "booked"
  | "active"
  | "inactive"
  | "deleted";

export interface PropertyListUser {
  public_id: string;
  status: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  profile_picture: string | null;
}

export interface PropertyListAddress {
  public_id: string;
  status: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface PropertyListItem {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: PropertyStatus;
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
  lister: PropertyListUser;
  address: PropertyListAddress;
}

export interface ListPropertiesResponse {
  pagination: {
    total_items: number;
    limit: number;
    skip: number;
    total_pages: number;
  };
  items: PropertyListItem[];
}

export type PropertyDetailsResponse = PropertyListItem;

export interface BookmarkItem {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: PropertyStatus;
  property: PropertyListItem;
}

export interface ListBookmarksResponse {
  pagination: {
    total_items: number;
    limit: number;
    skip: number;
    total_pages: number;
  };
  items: BookmarkItem[];
}

export interface ToggleBookmarkResponse {
  bookmarked: {
    status: "added" | "removed";
  };
}

export interface ListPropertiesParams {
  start_date?: string;
  end_date?: string;
  state?: string;
  city?: string;
  country?: string;
  zip_code?: string;
  q?: string;
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  status?: PropertyStatus;
  property_id?: string;
  property_type?: PropertyType;
  listing_type?: ListingType;
  min_price?: number;
  max_price?: number;
  is_verified?: boolean;
  lister_id?: string;
  cost_frequency?: CostFrequency;
  amenities_contain?: string;
  latitude?: number;
  longitude?: number;
  distance_km?: number;
}

export interface UpdatePropertyPayload {
  title: string;
  description: string;
  property_type: PropertyType;
  listing_type: ListingType;
  price: number;
  cost_frequency: CostFrequency;
  fees: PropertyFeesPayload;
  amenities: string[];
  media: PropertyMediaPayload[];
  address_id: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}
