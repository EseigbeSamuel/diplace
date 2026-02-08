import { postRequest } from "@/services";
import { SetUserTypePayload } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useGetCurrentUser } from "./user";

const data = {
  address: null,
  admin: null,
  agent: null,
  agent_type: null,
  date_created: "2026-02-07T15:27:56.831259Z",
  date_modified: "2026-02-08T21:06:58.773434Z",
  email: "vepawaw446@hopesx.com",
  first_name: null,
  full_name: null,
  is_active: true,
  last_name: null,
  owner: null,
  phone_number: "0813846424084",
  profile_picture: null,
  public_id: "3844a242-b91f-4c5e-ae9e-bb6c3cd4610e",
  renter: {
    public_id: "052c8346-5353-4eb5-bb0e-f887defb6d45",
    status: "pending",
    user_id: "3844a242-b91f-4c5e-ae9e-bb6c3cd4610e",
  },
  status: "active",
  user_type: "renter",
  verifications: [],
};

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
      console.log("data", data);
    },
    onError: (error) => {
      console.log("error", error);
      if (error) {
        if (currentUser?.user_type === "renter") {
          router.replace("/onboarding/renter/renter");
        } else if (currentUser?.user_type === "agent") {
          router.replace("/onboarding/agent/agent");
        } else {
          router.replace("/auth/login");
        }
      }
    },
  });

  return {
    setUserTypeMutation: mutate,
    setUserTypeMutationPending: isPending,
  };
}
