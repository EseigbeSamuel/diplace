export interface ReportReasonItem {
  public_id: string;
  label: string;
  applies_to_agent: boolean;
  applies_to_renter: boolean;
}

export interface CreateReportReasonPayload {
  label: string;
  applies_to_agent: boolean;
  applies_to_renter: boolean;
}

export interface CreateReportPayload {
  reason_id: string;
  details: string;
}

export interface ReportUserSummary {
  public_id: string;
  status: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_picture?: string;
}

export interface ReportItem {
  public_id: string;
  date_created: string;
  date_modified: string;
  status: string;
  reason_id: string;
  details: string;
  is_resolved: boolean;
  reporter?: ReportUserSummary;
  reported_user?: ReportUserSummary;
  reason?: ReportReasonItem;
}

export interface ListReportsResponse {
  pagination?: {
    total_items: number;
    limit: number;
    skip: number;
    total_pages: number;
  };
  items: ReportItem[];
}
