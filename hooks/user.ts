import { showToast } from "@/lib";
import { getRequest, patchRequest } from "@/services";
import { CurrentUserResponse, UserType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";


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

export interface UserSummaryItem {
  public_id: string;
  email: string;
  user_type: UserType;
  first_name: string | null;
  last_name: string | null;
  phone_number?: string | null;
  profile_picture?: string | null;
  avg_rating?: number;
  review_count?: number;
  is_verified?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export function useGetUsers({
  userType,
  enabled = true,
}: {
  userType?: UserType;
  enabled?: boolean;
} = {}) {
  return useQuery({
    queryKey: ["users-list", userType],
    enabled,
    queryFn: async () => {
      try {
        const params: Record<string, string | number | boolean> = { limit: 100 };
        if (userType) params.user_type = userType;
        const res = await getRequest<any>({
          url: "/users",
          params,
          protectedRoute: true,
        });
        if (Array.isArray(res)) return res as UserSummaryItem[];
        if (Array.isArray(res?.items)) return res.items as UserSummaryItem[];
        if (Array.isArray(res?.users)) return res.users as UserSummaryItem[];
        return [];
      } catch {
        return [];
      }
    },
  });
}

export function useFeaturedListers() {
  // 1. Fetch users of type agent and owner
  const agentsQuery = useGetUsers({ userType: "agent" });
  const ownersQuery = useGetUsers({ userType: "owner" });

  // 2. Fetch properties to aggregate lister spaces and details
  const propertiesQuery = useQuery({
    queryKey: ["featured-listers-properties"],
    queryFn: async () => {
      try {
        const res = await getRequest<any>({
          url: "/properties/",
          params: { limit: 100 },
          protectedRoute: false,
        });
        if (Array.isArray(res?.items)) return res.items;
        if (Array.isArray(res)) return res;
        return [];
      } catch {
        return [];
      }
    },
  });

  // 3. Fetch agent reviews to aggregate review stats
  const reviewsQuery = useQuery({
    queryKey: ["featured-listers-reviews"],
    queryFn: async () => {
      try {
        const res = await getRequest<any>({
          url: "/agent-reviews",
          params: { limit: 100 },
          protectedRoute: true,
        });
        if (Array.isArray(res?.items)) return res.items;
        if (Array.isArray(res)) return res;
        return [];
      } catch {
        return [];
      }
    },
  });

  const isLoading =
    agentsQuery.isLoading ||
    ownersQuery.isLoading ||
    propertiesQuery.isLoading;

  const featuredListers = useMemo(() => {
    const listerMap = new Map<
      string,
      {
        id: string;
        name: string;
        user_type: UserType;
        rating: number;
        ratingTotal: number;
        reviews: number;
        location: string;
        spaces: number;
        imageSource: { uri: string } | number;
        isVerified?: boolean;
      }
    >();

    // Seed from users list if available
    const directUsers: UserSummaryItem[] = [
      ...(agentsQuery.data || []),
      ...(ownersQuery.data || []),
    ];

    for (const u of directUsers) {
      if (!u.public_id) continue;
      const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email || "Lister";
      const loc = [u.address?.city, u.address?.state].filter(Boolean).join(", ") || "Nigeria";
      listerMap.set(u.public_id, {
        id: u.public_id,
        name: fullName,
        user_type: u.user_type || "agent",
        rating: Number(u.avg_rating) || 0,
        ratingTotal: (Number(u.avg_rating) || 0) * (Number(u.review_count) || 0),
        reviews: Number(u.review_count) || 0,
        location: loc,
        spaces: 0,
        imageSource: u.profile_picture
          ? { uri: u.profile_picture }
          : require("@/assets/images/user.png"),
        isVerified: !!u.is_verified,
      });
    }

    // Enrich / extract from properties list
    const properties = propertiesQuery.data || [];
    for (const prop of properties) {
      const lister = prop.lister;
      if (!lister || !lister.public_id) continue;

      const userType: UserType = prop.lister_type || lister.user_type || "agent";
      if (userType !== "agent" && userType !== "owner") continue;

      const fullName =
        [lister.first_name, lister.last_name].filter(Boolean).join(" ") ||
        lister.email ||
        "Lister";
      const loc =
        [prop.address?.city, prop.address?.state].filter(Boolean).join(", ") ||
        "Nigeria";

      const existing = listerMap.get(lister.public_id);
      if (existing) {
        existing.spaces += 1;
        if (prop.avg_rating && !existing.rating) {
          existing.rating = prop.avg_rating;
        }
        if (prop.review_count && !existing.reviews) {
          existing.reviews = prop.review_count;
        }
        if (lister.profile_picture && typeof existing.imageSource === "number") {
          existing.imageSource = { uri: lister.profile_picture };
        }
      } else {
        listerMap.set(lister.public_id, {
          id: lister.public_id,
          name: fullName,
          user_type: userType,
          rating: Number(prop.avg_rating) || 0,
          ratingTotal: (Number(prop.avg_rating) || 0) * (Number(prop.review_count) || 0),
          reviews: Number(prop.review_count) || 0,
          location: loc,
          spaces: 1,
          imageSource: lister.profile_picture
            ? { uri: lister.profile_picture }
            : require("@/assets/images/user.png"),
          isVerified: !!prop.is_verified,
        });
      }
    }

    // Enrich from agent reviews
    const reviews = reviewsQuery.data || [];
    for (const rev of reviews) {
      const agentId = rev.agent_id || rev.agent?.public_id;
      if (!agentId) continue;
      const existing = listerMap.get(agentId);
      if (existing && typeof rev.rating === "number") {
        existing.reviews += 1;
        existing.ratingTotal += rev.rating;
        existing.rating = Number((existing.ratingTotal / existing.reviews).toFixed(1));
      }
    }

    // Convert map to list
    let list = Array.from(listerMap.values()).map((item) => ({
      ...item,
      rating: item.rating > 0 ? Number(item.rating.toFixed(1)) : 5.0, // default friendly 5.0 if new
    }));

    // Filter by agent and owner only
    list = list.filter(
      (item) => item.user_type === "agent" || item.user_type === "owner",
    );

    // Sort by rating desc, then reviews desc, then spaces desc
    list.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (b.reviews !== a.reviews) return b.reviews - a.reviews;
      return b.spaces - a.spaces;
    });

    // Top twenty
    return list.slice(0, 20);
  }, [
    agentsQuery.data,
    ownersQuery.data,
    propertiesQuery.data,
    reviewsQuery.data,
  ]);

  const refetch = () => {
    agentsQuery.refetch();
    ownersQuery.refetch();
    propertiesQuery.refetch();
    reviewsQuery.refetch();
  };

  return {
    featuredListers,
    isLoading,
    refetch,
  };
}

