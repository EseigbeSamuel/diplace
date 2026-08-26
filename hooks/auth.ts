import { clearAll, saveToLocalStore, showToast } from "@/lib";
import { getRequest, postRequest } from "@/services";
import {
  ChangePasswordPayload,
  CurrentUserResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import axios from "axios";

type VerificationType = "phone" | "email" | "nin" | "bvn" | "face";

type InitiateVerificationPayload = {
  verification_type: VerificationType;
  value?: string | null;
};

type InitiateVerificationResponse = {
  public_id: string;
  status: string;
  verification_type: VerificationType;
  detail?: string | null;
  data_to_confirm?: Record<string, unknown> | null;
  face_verification_params?: Record<string, unknown> | null;
};

type ResendVerificationResponse = {
  message?: string;
  detail?: string;
  success?: boolean;
};

const getApiErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return null;

  const responseData = error.response?.data;

  return (
    responseData?.detail ||
    responseData?.message ||
    responseData?.error ||
    error.message ||
    null
  );
};

const shouldResendVerificationEmail = (error: unknown) => {
  if (!axios.isAxiosError(error)) return false;

  const status = error.response?.status;
  const message = String(getApiErrorMessage(error) || "").toLowerCase();

  return (
    status === 403 ||
    message.includes("account is not active") ||
    message.includes("email is not verified")
  );
};

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ username, password }: LoginPayload) => {
      const body = new URLSearchParams();
      body.append("grant_type", "password");
      body.append("username", username);
      body.append("password", password);
      body.append("scope", "");
      body.append("client_id", "string");
      body.append("client_secret", "string");

      console.log(body)

      return postRequest<LoginResponse, string>({
        url: "/auth/login",
        payload: body.toString(),
        protectedRoute: false,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        notifyOnError: false,
      });
    },

    onSuccess: async (data) => {
      if (!data) return;

      // ✅ Save tokens first
      await saveToLocalStore("access_token", data.access_token);
      await saveToLocalStore("refresh_token", data.refresh_token);
      router.replace("/(tabs)")

      try {
        // ✅ Fetch user immediately
        const user = await queryClient.fetchQuery({
          queryKey: ["current-user"],
          queryFn: () =>
            getRequest<CurrentUserResponse>({
              url: "/users/me",
              protectedRoute: true,
            }),
        });

        // ✅ Navigation decision
        const isAlreadyVerified =
          user?.status === "verified" ||
          user?.status === "completed" ||
          user?.status === "approved" ||
          user?.status === "active";

        if (isAlreadyVerified || (user?.verifications && user.verifications.length > 0)) {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding/welcome");
        }
      } catch (error) {
        console.log("Failed to fetch user after login", error);
        router.replace("/(tabs)");
      }
    },

    onError: async (error, variables) => {
      if (shouldResendVerificationEmail(error)) {
        const email = variables.username.trim();

        try {
          const response = await postRequest<
            ResendVerificationResponse,
            Record<string, never>
          >({
            url: `/users/resend-verification-email/${encodeURIComponent(email)}`,
            payload: {},
            protectedRoute: false,
            notifyOnError: false,
          });

          showToast({
            type: "success",
            text1: "Verification Email Sent",
            text2:
              response?.message ||
              response?.detail ||
              `A verification email has been sent to ${email}.`,
          });
          return;
        } catch (resendError) {
          const resendMessage =
            getApiErrorMessage(resendError) ||
            "Unable to resend verification email. Please try again.";

          showToast({
            type: "error",
            text1: "Verification Email Failed",
            text2: String(resendMessage),
          });
          return;
        }
      }

      const message =
        getApiErrorMessage(error) ||
        "Login failed. Please check your credentials.";

      showToast({
        type: "error",
        text1: "Login Failed",
        text2: String(message),
      });
    },
  });

  return {
    loginMutation: mutate,
    loginMutationPending: isPending,
  };
}

export function useRegister() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await postRequest<RegisterResponse, RegisterPayload>({
        url: "/users/register",
        payload: payload,
        protectedRoute: false,
      });

      return response;
    },
    onSuccess: async (data) => {
      router.replace("/auth/verify-otp");
    },
    onError: () => { },
  });

  return {
    registerMutation: mutate,
    registerMutationPending: isPending,
  };
}

export function useVerifyOtp() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ token }: VerifyOtpPayload) => {
      const response = await getRequest<VerifyOtpResponse>({
        url: `/users/verify-email/${token}`,
        protectedRoute: false,
      });

      return response;
    },
    onSuccess: async (data) => {
      console.log("data", data);
      showToast({
        type: "success",
        text1: "Success",
        text2: "Email verified successfully, redirecting to login...",
      });
      setTimeout(() => router.replace("/auth/login"), 2000);
    },
    onError: (error) => {
      console.log("error", error);
    },
  });

  return {
    verifyOtpMutation: mutate,
    verifyOtpMutationPending: isPending,
  };
}

export { useChangePassword } from "./usePassword";

export function useInitiateVerification() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: InitiateVerificationPayload) => {
      return await postRequest<
        InitiateVerificationResponse,
        InitiateVerificationPayload
      >({
        url: "/verifications/initiate",
        payload,
        protectedRoute: true,
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to start verification.";
      showToast({
        type: "error",
        text1: "Verification Failed",
        text2: message,
      });
    },
  });

  return {
    initiateVerificationMutation: mutateAsync,
    initiateVerificationPending: isPending,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      return await postRequest<string, Record<string, never>>({
        url: "/auth/logout",
        payload: {},
        protectedRoute: true,
      });
    },
    onSuccess: async () => {
      await clearAll();
      queryClient.clear();
      router.replace("/auth/login");
    },
    onError: async () => {
      await clearAll();
      queryClient.clear();
      router.replace("/auth/login");
    },
  });

  return {
    logoutMutation: mutateAsync,
    logoutMutationPending: isPending,
  };
}
