export interface CurrentUserResponse {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: Status;
  email: string;
  user_type: UserType;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: {
    public_id: string;
    status: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  is_active: boolean;
  profile_picture: string;
  agent_type: "individual" | "business";
  agent: {
    public_id: string;
    status: string;
    user_id: string;
  };
  owner: {
    public_id: string;
    status: string;
    user_id: string;
  };
  renter: {
    public_id: string;
    status: string;
    user_id: string;
  };
  admin: {
    public_id: string;
    status: string;
    user_id: string;
  };
  verifications: VerificationItem[];
  full_name: string;
}

export type UserType = "agent" | "owner" | "renter" | "admin";
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

export interface VerificationItem {
  verification_id: string;
  verification_type: string;
  status:
    | "not_started"
    | "pending"
    | "verified"
    | "failed"
    | "awaiting_confirmation";
  verified_at: string;
  identifier_used: string;
  last_updated: string;
}

export interface FeaturedListerItem {
  id: string;
  name: string;
  user_type: UserType;
  rating: number;
  reviews: number;
  location: string;
  spaces: number;
  imageSource: { uri: string } | number;
  isVerified?: boolean;
}

