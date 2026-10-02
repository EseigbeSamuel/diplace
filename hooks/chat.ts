import { showToast } from "@/lib";
import { getRequest, postRequest } from "@/services";
import {
    ConversationListResponse,
    ConversationParams,
    ConversationPayload,
    ConversationResponse,
    MessagePayload,
    MessageResponse,
    StartConversationResponse,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useGetConversations(params?: Partial<ConversationParams>) {
  const query = useQuery({
    queryKey: ["conversations", params],
    queryFn: async () => {
      const response = await getRequest<
        ConversationListResponse | ConversationResponse[]
      >({
        url: "/chats/conversations",
        params,
      });

      if (!Array.isArray(response)) return response;

      return {
        conversations: response,
        pagination: {
          total_items: response.length,
          skip: params?.skip ?? 0,
          limit: params?.limit ?? response.length,
          remaining_items: 0,
          more_available: false,
        },
      };
    },
  });

  return {
    conversations: query.data,
    isConversationsLoading: query.isLoading,
    conversationsError: query.error,
    refetchConversations: query.refetch,
  };
}

export function useGetConversationMessages({
  conversationId,
  enabled = true,
  params,
}: {
  conversationId?: string;
  enabled?: boolean;
  params?: { skip?: number; limit?: number };
}) {
  const query = useQuery({
    queryKey: ["conversation-messages", conversationId, params],
    enabled: enabled && !!conversationId,
    queryFn: async () =>
      await getRequest<MessageResponse[]>({
        url: `/chats/conversations/${conversationId}/messages`,
        params,
      }),
  });

  return {
    messages: query.data,
    isMessagesLoading: query.isLoading,
    messagesError: query.error,
    refetchMessages: query.refetch,
  };
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: ConversationPayload) => {
      return await postRequest<StartConversationResponse, ConversationPayload>({
        url: "/chats/conversations",
        payload,
        notifyOnError: false,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      showToast({
        type: "success",
        text1: "Success",
        text2: "Conversation started successfully.",
      });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unable to start conversation."
        : "Unable to start conversation.";

      showToast({
        type: "error",
        text1: "Start Conversation Failed",
        text2: String(message),
      });
    },
  });

  return {
    startConversationMutation: mutateAsync,
    isStartConversationPending: isPending,
  };
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: MessagePayload) => {
      return await postRequest<MessageResponse, MessagePayload>({
        url: "/chats/messages",
        payload,
        notifyOnError: false,
      });
    },
    onSuccess: async (_, payload) => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      await queryClient.invalidateQueries({
        queryKey: ["conversation-messages", payload.conversation_id],
      });
    },
    onError: (error) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unable to send message."
        : "Unable to send message.";

      showToast({
        type: "error",
        text1: "Send Message Failed",
        text2: String(message),
      });
    },
  });

  return {
    sendMessageMutation: mutateAsync,
    isSendMessagePending: isPending,
  };
}
