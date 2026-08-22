import { showToast } from "@/lib";
import { getRequest, postRequest } from "@/services";
import {
  CallItem,
  CallListResponse,
  CallStatusResponse,
  JoinCallResponse,
  StartCallPayload,
  StartCallResponse,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

/**
 * Start a new voice/video call in a conversation.
 * POST /calls
 * Returns the call item. The LiveKit token can be fetched separately via useJoinCall.
 */
export function useStartCall() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: StartCallPayload) => {
      return await postRequest<StartCallResponse, StartCallPayload>({
        url: "/calls",
        payload,
        protectedRoute: true,
        notifyOnError: true,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["calls"] });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unable to start call."
        : "Unable to start call.";
      showToast({ type: "error", text1: "Call Failed", text2: String(message) });
    },
  });

  return {
    startCallMutation: mutateAsync,
    isStartCallPending: isPending,
  };
}

/**
 * List past/in-progress walkthrough calls.
 * GET /calls
 */
export function useGetCalls({
  enabled = true,
  conversationId,
}: {
  enabled?: boolean;
  conversationId?: string;
} = {}) {
  const query = useQuery({
    queryKey: ["calls", { conversationId }],
    enabled,
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {};
      if (conversationId) params.conversation_id = conversationId;
      return await getRequest<CallListResponse>({
        url: "/calls",
        params,
        protectedRoute: true,
      });
    },
  });

  return {
    calls: query.data?.items ?? [],
    callsPagination: query.data?.pagination,
    isCallsLoading: query.isLoading,
    callsError: query.error,
    refetchCalls: query.refetch,
  };
}

/**
 * Get a LiveKit token to join an in-progress call.
 * POST /calls/{call_id}/join
 */
export function useJoinCall() {
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: async (callId: string) => {
      return await postRequest<JoinCallResponse, Record<string, never>>({
        url: `/calls/${callId}/join`,
        payload: {},
        protectedRoute: true,
        notifyOnError: true,
      });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unable to join call."
        : "Unable to join call.";
      showToast({ type: "error", text1: "Join Failed", text2: String(message) });
    },
  });

  return {
    joinCallMutation: mutateAsync,
    isJoinCallPending: isPending,
    joinCallData: data,
  };
}

/**
 * End a call for everyone.
 * POST /calls/{call_id}/end
 */
export function useEndCall() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (callId: string) => {
      return await postRequest<CallItem, Record<string, never>>({
        url: `/calls/${callId}/end`,
        payload: {},
        protectedRoute: true,
        notifyOnError: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["calls"] });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unable to end call."
        : "Unable to end call.";
      showToast({ type: "error", text1: "End Call Failed", text2: String(message) });
    },
  });

  return {
    endCallMutation: mutateAsync,
    isEndCallPending: isPending,
  };
}

/**
 * Get the status/details of a specific call.
 * GET /calls/{call_id}
 */
export function useGetCallStatus({
  callId,
  enabled = true,
}: {
  callId?: string;
  enabled?: boolean;
}) {
  const query = useQuery({
    queryKey: ["call-status", callId],
    enabled: enabled && !!callId,
    queryFn: async () => {
      return await getRequest<CallStatusResponse>({
        url: `/calls/${callId}`,
        protectedRoute: true,
      });
    },
    refetchInterval: (query) => {
      // Poll every 5s while call is active
      const data = query.state.data;
      if (!data) return false;
      return data.ended_at ? false : 5000;
    },
  });

  return {
    callStatus: query.data,
    isCallStatusLoading: query.isLoading,
    callStatusError: query.error,
    refetchCallStatus: query.refetch,
  };
}
