export type CallStatus =
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

export type CallType = "video" | "audio";

export type RecordingStatus = "none" | "in_progress" | "completed" | "failed";

export interface CallInitiator {
  public_id: string;
  status: CallStatus;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string;
}

export interface CallItem {
  public_id: string;
  status: CallStatus;
  conversation_id: string;
  initiated_by: string;
  property_id: string;
  host_id: string;
  room_name: string;
  call_type: CallType;
  started_at: string;
  ended_at: string | null;
  initiator: CallInitiator;
  record_requested: boolean;
  recording_status: RecordingStatus;
  recording_url: string | null;
}

export interface CallPagination {
  total_items: number;
  limit: number;
  skip: number;
  total_pages: number;
}

export interface CallListResponse {
  pagination: CallPagination;
  items: CallItem[];
}

export interface StartCallPayload {
  conversation_id: string;
  call_type: CallType;
  record: boolean;
}

export type StartCallResponse = CallItem;

export interface JoinCallResponse {
  token: string;
  room_name: string;
  server_url: string;
}

export interface CallStatusResponse extends CallItem {}

// Local UI state for the call screen
export type CallScreenMode = "outgoing" | "incoming";
export type CallScreenState = "calling" | "ringing" | "accepted" | "not_answered" | "ended";
