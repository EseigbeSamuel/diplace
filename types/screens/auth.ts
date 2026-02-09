// Login Payload and Response
export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  access_exp: string;
  refresh_exp: string;
  payload: {
    uid: string;
    email: string;
  };
  scope: string;
}

export interface RegisterPayload {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  email: string;
  user_type: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  full_name: string;
}

// Verify OTP Payload and Response
export interface VerifyOtpPayload {
  token: string;
}

export interface VerifyOtpResponse {
  message: string;
}
