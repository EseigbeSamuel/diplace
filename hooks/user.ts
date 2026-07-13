import { showToast } from "@/lib";
import { getRequest, patchRequest } from "@/services";
import { CurrentUserResponse, UserType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface ProfileUpdatePayload {
  email?: string;
  user_type?: UserType;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  password?: string;
  profile_picture?: string | null;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
}

export function useGetCurrentUser() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      return await getRequest<CurrentUserResponse>({
        url: "/users/me",
        protectedRoute: true,
      });
    },
    enabled: true,
  });

  return {
    currentUser: data,
    isCurrentUserLoading: isLoading,
    currentUserError: error,
    refetchCurrentUser: refetch,
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: ProfileUpdatePayload) => {
      return await patchRequest<CurrentUserResponse, ProfileUpdatePayload>({
        url: "/profile",
        payload,
        protectedRoute: true,
        notifyOnError: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      showToast({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile changes have been saved.",
      });
    },
    onError: (error) => {
      const rawError = error as {
        message?: unknown;
        response?: {
          data?: {
            detail?: unknown;
            message?: unknown;
            error?: unknown;
          };
        };
      };
      const detail = rawError.response?.data?.detail;
      const message =
        typeof rawError.response?.data?.message === "string"
          ? rawError.response.data.message
          : typeof rawError.response?.data?.error === "string"
            ? rawError.response.data.error
            : Array.isArray(detail) && typeof detail[0]?.msg === "string"
              ? detail[0].msg
              : typeof detail === "string"
                ? detail
                : typeof rawError.message === "string"
                  ? rawError.message
                  : "Unable to update profile.";

      showToast({
        type: "error",
        text1: "Update Failed",
        text2: message,
      });
    },
  });

  return {
    updateProfileMutation: mutateAsync,
    updateProfilePending: isPending,
  };
}
