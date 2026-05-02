import { showToast } from "@/lib";
import { getRequest, postRequest } from "@/services";
import { BookingRequestPayload, BookingResponse } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: BookingRequestPayload) => {
      return await postRequest<BookingResponse, BookingRequestPayload>({
        url: "/bookings",
        payload,
        notifyOnError: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Booking created successfully.",
      });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unable to create booking."
        : "Unable to create booking.";

      showToast({
        type: "error",
        text1: "Create Booking Failed",
        text2: String(message),
      });
    },
  });

  return {
    createBookingMutation: mutateAsync,
    isCreateBookingPending: isPending,
  };
}

export function useGetBookingDetails({
  bookingId,
  enabled = true,
}: {
  bookingId?: string;
  enabled?: boolean;
}) {
  const query = useQuery({
    queryKey: ["booking-details", bookingId],
    enabled: enabled && !!bookingId,
    queryFn: async () =>
      await getRequest<BookingResponse>({
        url: `/bookings/${bookingId}`,
      }),
  });

  return {
    bookingDetails: query.data,
    isBookingDetailsLoading: query.isLoading,
    bookingDetailsError: query.error,
    refetchBookingDetails: query.refetch,
  };
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (bookingId: string) => {
      return await postRequest<BookingResponse, Record<string, never>>({
        url: `/bookings/${bookingId}/cancel`,
        payload: {},
        notifyOnError: false,
      });
    },
    onSuccess: async (_, bookingId) => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await queryClient.invalidateQueries({
        queryKey: ["booking-details", bookingId],
      });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Booking cancelled successfully.",
      });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unable to cancel booking."
        : "Unable to cancel booking.";

      showToast({
        type: "error",
        text1: "Cancel Booking Failed",
        text2: String(message),
      });
    },
  });

  return {
    cancelBookingMutation: mutateAsync,
    isCancelBookingPending: isPending,
  };
}
