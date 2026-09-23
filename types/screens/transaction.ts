export interface Transaction {
  public_id: string;
  tx_ref: string;
  gateway_tx_ref: string | null;
  payment_gateway: string;
  amount: number;
  currency: string;
  purpose:
    | "inspection_fee"
    | "booking_rent"
    | "booking_deposit"
    | "booking_balance"
    | "service_charge"
    | "promotion_fee"
    | "subscription_fee";
  related_id: string;
  status:
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
  date_created?: string;
}

export interface TransactionHistoryResponse {
  items: Transaction[];
  pagination: {
    total_items: number;
    limit: number;
    skip: number;
    total_pages: number;
  };
}

export interface TransactionQueryParams {
  q?: string;
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  status?: string;
}
