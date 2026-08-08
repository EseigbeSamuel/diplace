export type BookingPropertyType =
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

export type BookingListingType = "normal" | "premium" | "sponsored";

export type BookingCostFrequency =
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

export type BookingStatus =
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

export interface BookingFees {
  caution_fee: number;
  agency_fee_percent: number;
  legal_fee_percent: number;
  platform_fee: number;
}

export interface BookingMedia {
  file_url: string;
  file_type: "image" | "video";
  description: string;
  public_id: string;
  date_created: string;
  date_modified: string;
  status: BookingStatus;
}

export interface BookingAddress {
  public_id?: string;
  status?: BookingStatus;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface BookingUser {
  public_id: string;
  status: BookingStatus;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  profile_picture: string | null;
}

export interface BookingRequestPayload {
  property_id: string;
  agreed_to_terms: boolean;
  details: {
    type: BookingPropertyType;
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

export interface BookingPaymentSchedule {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: BookingStatus;
  installment_type: "full" | string;
  amount: number;
  due_date: string;
  schedule_status: BookingStatus | string;
  paid_at: string | null;
}

export interface BookingProperty {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: BookingStatus;
  title: string;
  description: string;
  property_type: BookingPropertyType;
  listing_type: BookingListingType;
  price: number;
  cost_frequency: BookingCostFrequency;
  fees: BookingFees;
  amenities: string[];
  media: BookingMedia[];
  is_verified: boolean;
  verified_at: string | null;
  lister: BookingUser;
  address: BookingAddress;
  avg_rating: number;
  review_count: number;
}

export interface BookingResponse {
  public_id: string;
  status: BookingStatus;
  agreed_to_terms: boolean;
  details: Record<string, unknown>;
  user: BookingUser;
  property: BookingProperty;
  payment_schedules?: BookingPaymentSchedule[];
}

export interface BookingsListResponse {
  pagination: {
    total_items: number;
    limit: number;
    skip: number;
    total_pages: number;
  };
  items: BookingResponse[];
}

export interface BookingPaymentInitiatePayload {
  related_id: string;
  purpose: "inspection_fee" | "booking_fee" | "reservation_fee" | string;
  gateway: "flutterwave" | string;
  amount: number;
  currency: string;
}

export interface BookingPaymentInitiateResponse {
  payment_link: string;
  tx_ref: string;
  gateway: string;
}

export interface InspectionAvailability {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: BookingStatus;
  property_id: string;
  start_datetime: string;
  end_datetime: string;
  availability_type: "inspection" | string;
  price: number;
  is_available: boolean;
}

export interface InspectionAvailabilityResponse {
  pagination: {
    total_items: number;
    limit: number;
    skip: number;
    total_pages: number;
  };
  items: InspectionAvailability[];
}

export interface ScheduleInspectionPayload {
  availability_id: string;
  agreed_to_terms: boolean;
}

export interface InspectionResponse {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: BookingStatus;
  inspection_date: string;
  time_slot: string;
  agreed_to_terms: boolean;
  user: BookingUser;
  property: BookingProperty;
}
