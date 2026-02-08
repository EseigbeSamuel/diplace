import { getRequest } from "@/services";
import { CurrentUserResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGetCurrentUser() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      return await getRequest<CurrentUserResponse>({
        url: "/users/me",
        protectedRoute: true,
      });
    },
  });

  return {
    currentUser: data,
    isCurrentUserLoading: isLoading,
    currentUserError: error,
    refetchCurrentUser: refetch,
  };
}
