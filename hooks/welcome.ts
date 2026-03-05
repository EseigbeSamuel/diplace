import { postRequest } from "@/services";
import { SetUserTypePayload } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useGetCurrentUser } from "./user";

export function useSetUserType() {
  const { currentUser } = useGetCurrentUser();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: SetUserTypePayload) => {
      if (!currentUser) return;
      const response = await postRequest<string, Record<string, unknown>>({
        url: `/users/set-user-type?email=${currentUser.email}&user_type=${payload.user_type}`,
        payload: {},
        protectedRoute: true,
      });

      return response;
    },
    onSuccess: async (data) => {
      console.log("set user type success", data);
      router.replace("/onboarding/steps");
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const detail = error?.response?.data?.detail;

      console.log("set user type error", { status, detail });

      if (status === 400 && detail === "User type already set.") {
        router.replace("/onboarding/steps");
        return;
      }

      if (status === 401 || status === 403) {
        router.replace("/auth/login");
        return;
      }

      // Non-auth failures should not kick user out; keep onboarding flow.
      router.replace("/onboarding/steps");
    },
  });

  return {
    setUserTypeMutation: mutate,
    setUserTypeMutationPending: isPending,
  };
}
