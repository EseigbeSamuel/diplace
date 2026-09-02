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

export type Status =
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

export interface InspectionUser {
  public_id: string;
  status: Status;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string;
}
export interface InspectionMedia {
  file_url: string;
  file_type: "image" | "video";
  description: string;
  public_id: string;
  date_created: string;
  date_modified: string;
  status: Status;
}
export interface InspectionFees {
  caution_fee: number;
  agency_fee_percent: number;
  legal_fee_percent: number;
  platform_fee: number;
}

export interface InspectionAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
}
export interface InspectionProperty {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: Status;
  title: string;
  description: string;
  property_type: PropertyType;
  listing_type: ListingType;
  price: number;
  cost_frequency: CostFrequency;
  fees: InspectionFees;
}

export interface InspectionPayload {
  availability_id: string;
  agreed_to_terms: boolean;
}

export interface CreateInspectionResponse {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: Status;
  inspection_date: string;
  time_slot: string;
  agreed_to_terms: boolean;
  user: InspectionUser;
  description: string;
  property: InspectionProperty;
  amenities: string;
  media: InspectionMedia;
  is_verified: boolean;
  verified_at: string | null;
  address: InspectionAddress;
  lister: InspectionUser;
}
export interface InspectionQueryParams {
  q?: string;
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  status?: string;
}
export interface InspectionHistoryResponse {
  pagination: {
    total_items: number;
    limit: number;
    skip: number;
    total_pages: number;
  };
  items: CreateInspectionResponse[];
}
