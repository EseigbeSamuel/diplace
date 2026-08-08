import { showToast } from "@/lib";
import { postRequest } from "@/services";
import {
  BookingPaymentInitiatePayload,
  BookingPaymentInitiateResponse,
} from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useInitiateBookingPayment() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: BookingPaymentInitiatePayload) => {
      return await postRequest<
        BookingPaymentInitiateResponse,
        BookingPaymentInitiatePayload
      >({
        url: "/bookings/payments/initiate",
        payload,
        notifyOnError: false,
      });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unable to initiate payment."
        : "Unable to initiate payment.";

      showToast({
        type: "error",
        text1: "Payment Failed",
        text2: String(message),
      });
    },
  });

  return {
    initiateBookingPaymentMutation: mutateAsync,
    isInitiateBookingPaymentPending: isPending,
  };
}
