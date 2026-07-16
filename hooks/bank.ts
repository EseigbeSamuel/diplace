import { showToast } from "@/lib";
import { deleteRequest, getRequest, postRequest, putRequest } from "@/services";
import { BankDetails, BankPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetUserBanks({ enabled = true }: { enabled?: boolean } = {}) {
  const query = useQuery({
    queryKey: ["user-banks"],
    enabled,
    queryFn: async () => {
      return await getRequest<BankDetails[]>({
        url: "/bankRoute",
        protectedRoute: true,
      });
    },
  });

  return {
    banks: query.data ?? [],
    isBanksLoading: query.isLoading,
    isBanksFetching: query.isFetching,
    banksError: query.error,
    refetchBanks: query.refetch,
  };
}

export function useBankNameInquiry() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      bankCode,
      accountNumber,
    }: {
      bankCode: string;
      accountNumber: string;
    }) => {
      return await postRequest<BankDetails, Record<string, never>>({
        url: `/bankRoute/name-inquiry/${bankCode}/${accountNumber}`,
        payload: {},
        protectedRoute: true,
        notifyOnError: false,
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Unable to verify account.";
      showToast({
        type: "error",
        text1: "Name Enquiry Failed",
        text2: message,
      });
    },
  });

  return {
    bankNameInquiryMutation: mutateAsync,
    bankNameInquiryPending: isPending,
  };
}

export function useCreateBank() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: BankPayload) => {
      return await postRequest<BankDetails, BankPayload>({
        url: "/bankRoute",
        payload,
        protectedRoute: true,
        notifyOnError: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-banks"] });
      showToast({
        type: "success",
        text1: "Bank Added",
        text2: "Your bank details have been saved.",
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Unable to add bank details.";
      showToast({
        type: "error",
        text1: "Bank Save Failed",
        text2: message,
      });
    },
  });

  return {
    createBankMutation: mutateAsync,
    createBankPending: isPending,
  };
}

export function useUpdateBank() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      bankId,
      payload,
    }: {
      bankId: string;
      payload: BankPayload;
    }) => {
      return await putRequest<BankDetails, BankPayload>({
        url: `/bankRoute/${bankId}`,
        payload,
        protectedRoute: true,
        notifyOnError: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-banks"] });
      showToast({
        type: "success",
        text1: "Bank Updated",
        text2: "Your bank details have been updated.",
      });
    },
  });

  return {
    updateBankMutation: mutateAsync,
    updateBankPending: isPending,
  };
}

export function useDeleteBank() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ bankId }: { bankId: string }) => {
      return await deleteRequest<string>({
        url: `/bankRoute/${bankId}`,
        protectedRoute: true,
        notifyOnError: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-banks"] });
      showToast({
        type: "success",
        text1: "Bank Removed",
        text2: "Your bank details have been removed.",
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Unable to remove bank.";
      showToast({
        type: "error",
        text1: "Remove Failed",
        text2: message,
      });
    },
  });

  return {
    deleteBankMutation: mutateAsync,
    deleteBankPending: isPending,
  };
}
