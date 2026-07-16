export interface BankDetails {
  bank_name: string;
  account_number: string;
  account_name: string;
  account_type: string;
  public_id: string;
  date_created: string;
}

export interface BankPayload {
  bank_name: string;
  account_number: string;
  account_name: string;
  account_type: string;
}
