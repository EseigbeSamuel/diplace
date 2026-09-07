// ─── Lightweight list-level types (used by active / history / today lists) ───

export interface ActivityProperty {
  public_id: string;
  title: string;
  location: string;
  price: number;
  cost_frequency: string;
  thumbnail: string;
}

export interface ActivityActor {
  public_id: string;
  status: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string;
}

export interface ActiveActivityItem {
  category: string;
  booking_id: string;
  inspection_id: string;
  is_new: boolean;
  due_date: string;
  property: ActivityProperty;
  actor: ActivityActor;
}

export interface ActiveActivitiesResponse {
  scheduled?: ActiveActivityItem[];
  reserved?: ActiveActivityItem[];
  booked?: ActiveActivityItem[];
  inspected?: ActiveActivityItem[];
}

export interface HistoryActivityItem {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: string;
  action: string;
  badge: string;
  title: string;
  description: string;
  occurred_at: string;
  booking_id: string;
  inspection_id: string;
  actor: ActivityActor;
  property: ActivityProperty;
}

export interface HistoryActivitiesResponseItem {
  label: string;
  items: HistoryActivityItem[];
}

export type HistoryActivitiesResponse = HistoryActivitiesResponseItem[];

export interface TodayActivityItem {
  activity_type: string;
  activity_date: string;
  time_label: string;
  booking_id: string;
  inspection_id: string;
  actor: ActivityActor;
  property: ActivityProperty;
}

export type TodayActivitiesResponse = TodayActivityItem[];

// ─── Detail-level types (used by inspection/{id} and booking/{id} endpoints) ──

/** Full user object returned inside detail responses */
export interface ActivityDetailUser {
  public_id: string;
  status: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string;
}

export interface ActivityPropertyFees {
  caution_fee: number;
  agency_fee_percent: number;
  legal_fee_percent: number;
  platform_fee: number;
}

export interface ActivityPropertyCapacity {
  caps: number;
  bathrooms: number;
  kitchens: number;
  rooms: number;
  roomSize: string;
  changingRooms: number;
}

export interface ActivityPropertyMedia {
  file_url: string;
  file_type: string;
  description: string;
  media_role: string;
  public_id: string;
  date_created: string;
  date_modified: string;
  status: string;
}

export interface ActivityPropertyAddress {
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

/** Full property object returned inside detail responses */
export interface ActivityPropertyDetail {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: string;
  title: string;
  description: string;
  property_type: string;
  listing_type: string;
  price: number;
  cost_frequency: string;
  fees: ActivityPropertyFees;
  amenities: string[];
  event_space: string;
  capacity: ActivityPropertyCapacity;
  media: ActivityPropertyMedia[];
  is_verified: boolean;
  verified_at: string;
  lister: ActivityDetailUser;
  address: ActivityPropertyAddress;
  avg_rating: number;
  review_count: number;
}

/** Response from GET /bookings/activity/inspections/{inspection_id} */
export interface InspectionDetailResponse {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: string;
  inspection_date: string;
  time_slot: string;
  agreed_to_terms: boolean;
  user: ActivityDetailUser;
  property: ActivityPropertyDetail;
}

/** A single payment schedule entry */
export interface PaymentSchedule {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: string;
  installment_type: string;
  amount: number;
  due_date: string;
  schedule_status: string;
  paid_at: string;
}

/** Response from GET /bookings/activity/bookings/{booking_id} */
export interface BookingDetailResponse {
  public_id: string;
  status: string;
  agreed_to_terms: boolean;
  details: Record<string, unknown>;
  user: ActivityDetailUser;
  property: ActivityPropertyDetail;
  payment_schedules: PaymentSchedule[];
}
