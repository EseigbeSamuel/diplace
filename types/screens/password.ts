export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message?: string;
  detail?: string;
  success?: boolean;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  message?: string;
  detail?: string;
  success?: boolean;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message?: string;
  detail?: string;
  success?: boolean;
}
