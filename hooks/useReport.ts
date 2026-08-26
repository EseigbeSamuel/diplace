import { showToast } from "@/lib";
import { getRequest, postRequest } from "@/services";
import {
  CreateReportPayload,
  CreateReportReasonPayload,
  ListReportsResponse,
  ReportItem,
  ReportReasonItem,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const getReportErrorMessage = (error: unknown, fallback: string = "Something went wrong"): string => {
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

export function useReportReasons({ enabled = true }: { enabled?: boolean } = {}) {
  const query = useQuery({
    queryKey: ["report-reasons"],
    enabled,
    queryFn: async () =>
      await getRequest<ReportReasonItem[]>({
        url: "/reports/reasons",
        protectedRoute: true,
      }),
  });

  return {
    reasons: query.data ?? [],
    isReasonsLoading: query.isLoading,
    reasonsError: query.error,
    refetchReasons: query.refetch,
  };
}

export function useAddReportReason() {
  const queryClient = useQueryClient();
  const { mutateAsync, mutate, isPending } = useMutation({
    mutationFn: async (payload: CreateReportReasonPayload) =>
      await postRequest<ReportReasonItem, CreateReportReasonPayload>({
        url: "/reports/reasons",
        payload,
        protectedRoute: true,
        notifyOnError: false,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["report-reasons"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Report reason created successfully.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Error",
        text2: getReportErrorMessage(error, "Unable to create report reason."),
      });
    },
  });

  return {
    addReportReasonMutation: mutateAsync,
    addReportReason: mutate,
    isAddReportReasonPending: isPending,
  };
}

export function useReportAgent() {
  const queryClient = useQueryClient();
  const { mutateAsync, mutate, isPending } = useMutation({
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string;
      payload: CreateReportPayload;
    }) =>
      await postRequest<ReportItem, CreateReportPayload>({
        url: `/reports/agents/${userId}`,
        payload,
        protectedRoute: true,
        notifyOnError: false,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-reports"] });
      showToast({
        type: "success",
        text1: "Report Submitted",
        text2: "Thank you for letting us know. Our team will review this report.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Report Failed",
        text2: getReportErrorMessage(error, "Unable to submit report for this agent."),
      });
    },
  });

  return {
    reportAgentMutation: mutateAsync,
    reportAgent: mutate,
    isReportAgentPending: isPending,
  };
}

export function useReportRenter() {
  const queryClient = useQueryClient();
  const { mutateAsync, mutate, isPending } = useMutation({
    mutationFn: async ({
      userId,
      payload,
    }: {
      userId: string;
      payload: CreateReportPayload;
    }) =>
      await postRequest<ReportItem, CreateReportPayload>({
        url: `/reports/renters/${userId}`,
        payload,
        protectedRoute: true,
        notifyOnError: false,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-reports"] });
      showToast({
        type: "success",
        text1: "Report Submitted",
        text2: "Thank you for letting us know. Our team will review this report.",
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        text1: "Report Failed",
        text2: getReportErrorMessage(error, "Unable to submit report for this renter."),
      });
    },
  });

  return {
    reportRenterMutation: mutateAsync,
    reportRenter: mutate,
    isReportRenterPending: isPending,
  };
}

export function useListUserReports({
  enabled = true,
  params,
}: {
  enabled?: boolean;
  params?: { skip?: number; limit?: number };
} = {}) {
  const query = useQuery({
    queryKey: ["user-reports", params],
    enabled,
    queryFn: async () =>
      await getRequest<ListReportsResponse | ReportItem[]>({
        url: "/reports/users",
        params: params as Record<string, string | number | boolean>,
        protectedRoute: true,
      }),
  });

  const items = Array.isArray(query.data)
    ? query.data
    : query.data?.items ?? [];

  return {
    reports: items,
    isReportsLoading: query.isLoading,
    reportsError: query.error,
    refetchReports: query.refetch,
  };
}
