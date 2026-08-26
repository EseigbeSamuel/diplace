import { showToast } from "@/lib";
import { postRequest } from "@/services";
import {
  ChangePasswordPayload,
  ChangePasswordResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import axios from "axios";

const getApiErrorMessage = (error: unknown, fallback: string = "Something went wrong"): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }
  const detail = error.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((d: any) => d?.msg || String(d)).join("\n");
  }
  if (typeof detail === "string") return detail;
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallback
  );
};

export function useForgotPassword() {
  const router = useRouter();

  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      return await postRequest<ForgotPasswordResponse, ForgotPasswordPayload>({
        url: "/password/forgot",
        payload,
        protectedRoute: false,
        notifyOnError: false,
      });
    },
    onSuccess: (data) => {
      showToast({
        type: "success",
        text1: "Success",
        text2:
          typeof data === "string"
            ? data
            : data?.message || "Password reset instructions sent to your email.",
      });
      router.push("/auth/create-password");
    },
    onError: (err) => {
      showToast({
        type: "error",
        text1: "Error",
        text2: getApiErrorMessage(err, "Unable to request password reset."),
      });
    },
  });

  return {
    forgotPasswordMutation: mutate,
    forgotPasswordMutationAsync: mutateAsync,
    isForgotPasswordPending: isPending,
    forgotPasswordError: error,
  };
}

export function useResetPassword() {
  const router = useRouter();

  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      return await postRequest<ResetPasswordResponse, ResetPasswordPayload>({
        url: "/password/reset",
        payload,
        protectedRoute: false,
        notifyOnError: false,
      });
    },
    onSuccess: (data) => {
      showToast({
        type: "success",
        text1: "Success",
        text2:
          typeof data === "string"
            ? data
            : data?.message || "Password reset successfully. You can now log in.",
      });
      router.replace("/auth/login");
    },
    onError: (err) => {
      showToast({
        type: "error",
        text1: "Error",
        text2: getApiErrorMessage(err, "Unable to reset password."),
      });
    },
  });

  return {
    resetPasswordMutation: mutate,
    resetPasswordMutationAsync: mutateAsync,
    isResetPasswordPending: isPending,
    resetPasswordError: error,
  };
}

export function useChangePassword() {
  const router = useRouter();

  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      return await postRequest<ChangePasswordResponse, ChangePasswordPayload>({
        url: "/password/change",
        payload,
        protectedRoute: true,
        notifyOnError: false,
      });
    },
    onSuccess: (data) => {
      showToast({
        type: "success",
        text1: "Success",
        text2:
          typeof data === "string"
            ? data
            : data?.message || "Password changed successfully.",
      });
      router.back();
    },
    onError: (err) => {
      showToast({
        type: "error",
        text1: "Error",
        text2: getApiErrorMessage(err, "Unable to change password."),
      });
    },
  });

  return {
    changePasswordMutation: mutate,
    changePasswordMutationAsync: mutateAsync,
    changePasswordMutationPending: isPending,
    isChangePasswordPending: isPending,
    changePasswordError: error,
  };
}
