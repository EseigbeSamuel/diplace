import { saveToLocalStore } from "@/lib";
import { getRequest, postRequest } from "@/services";
import {
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
import Toast from "react-native-toast-message";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ username, password }: LoginPayload) => {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      return postRequest<LoginResponse, FormData>({
        url: "/auth/login",
        payload: formData,
        protectedRoute: false,
      });
    },

    onSuccess: async (data) => {
      if (!data) return;

      // ✅ Save tokens first
      await saveToLocalStore("access_token", data.access_token);
      await saveToLocalStore("refresh_token", data.refresh_token);

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
        } else {
          router.replace("/(tabs)");
        }
      } catch (error) {
        console.log("Failed to fetch user after login", error);
      }
    },

    onError: (error) => {
      console.log("login error", error);
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
    onError: () => {},
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
      Toast.show({
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
