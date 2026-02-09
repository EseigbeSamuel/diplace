import { UserType } from "./user";

export interface SetUserTypePayload {
  user_type: UserType;
  email: string;
}
