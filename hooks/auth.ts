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
        if (!user?.verifications || user.verifications.length === 0) {
          router.replace("/onboarding/welcome");
          // router.replace("/(tabs)");
        } else {
          router.replace("/(tabs)");
        }
      } catch (error) {
        console.log("Failed to fetch user after login", error);
        router.replace("/(tabs)");
      }
    },

    onError: (error) => {
      // console.log("login error", error);
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

export function useChangePassword() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      return await postRequest<string, ChangePasswordPayload>({
        url: "/password/change",
        payload,
        protectedRoute: true,
      });
    },
    onSuccess: async (data) => {
      showToast({
        type: "success",
        text1: "Success",
        text2: typeof data === "string" ? data : "Password changed successfully.",
      });
      router.back();
    },
    onError: () => { },
  });

  return {
    changePasswordMutation: mutate,
    changePasswordMutationPending: isPending,
  };
}

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
