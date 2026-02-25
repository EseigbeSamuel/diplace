export interface Transaction {
  id: string;
  amount: number;
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
  date_created: string;
}

export interface TransactionHistoryResponse {
  data: Transaction[];
  total: number;
  skip: number;
  limit: number;
}

export interface TransactionQueryParams {
  q?: string;
  skip?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  status?: string;
}
