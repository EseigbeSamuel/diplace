export type ChatStatus =
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

export interface ChatUser {
  public_id: string;
  status: ChatStatus;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  profile_picture: string | null;
}

export interface ConversationPayload {
  property_id?: string;
  booking_id?: string;
  inspection_booking_id?: string;
  message_content?: string;
  recipient_id?: string;
  participant_id?: string;
}

export interface ConversationResponse {
  public_id: string;
  status: ChatStatus;
  property_id: string;
  booking_id: string;
  inspection_booking_id: string;
  last_message_preview: string;
  last_message_at: string;
  participants: ChatUser[];
  unread_count: number;
}

export interface ConversationParams {
  conversation_id?: string;
  skip: number;
  limit: number;
  q?: string;
  status?: ChatStatus;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface ConversationListResponse {
  conversations: ConversationResponse[];
  pagination: {
    total_items: number;
    skip: number;
    limit: number;
    remaining_items: number;
    more_available: boolean;
  };
}

export interface MessagePayload {
  conversation_id: string;
  content: string;
}

export interface MessageResponse {
  public_id: string;
  status: ChatStatus;
  conversation_id: string;
  sender_id: string;
  content: string;
  sender: ChatUser;
  date_created?: string;
  created_at?: string;
}
