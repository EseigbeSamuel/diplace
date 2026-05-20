export type ActivityPropertyType =
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

export type ActivityListingType = "normal" | "premium" | "sponsored";

export type ActivityCostFrequency =
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

export type ActivityStatus =
  | "draft"
  | "sold"
  | "rented"
  | "archived"
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

export interface ActivityFees {
  caution_fee: number;
  agency_fee_percent: number;
  legal_fee_percent: number;
  platform_fee: number;
}

export interface ActivityMedia {
  file_url: string;
  file_type: "image" | "video";
  description: string;
  public_id: string;
  date_created: string;
  date_modified: string;
  status: ActivityStatus;
}

export interface ActivityAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
}
export interface ActivityUser {
  public_id: string;
  status: ActivityStatus;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  profile_picture: string | null;
}

export interface ActivityRequestPayload {
  property_id: string;
  agreed_to_terms: boolean;
  details: {
    type: ActivityPropertyType;
    full_name: string;
    occupation: string;
    email: string;
    phone: string;
    rent_duration: number;
    move_in_date: string;
    adults: number;
    children: number;
    other_details: string;
  };
}

export interface ActivityResponse {
  public_id: string;
  status: ActivityStatus;
  agreed_to_terms: boolean;
  details: {
    additionalProp1: {};
  };
  user: ActivityUser;
  property: {
    public_id: string;
    date_created: Date;
    date_modified: Date;
    status: ActivityStatus;
    title: string;
    description: string;
    property_type: ActivityPropertyType;
    listing_type: ActivityListingType;
    price: number;
    cost_frequency: ActivityCostFrequency;
    fees: ActivityFees;
    amenities: string[];
    media: ActivityMedia[];
    is_verified: boolean;
    verified_at: string;
    lister: ActivityUser;
    address: ActivityAddress;
    avg_rating: number;
    review_count: number;
  };
}
