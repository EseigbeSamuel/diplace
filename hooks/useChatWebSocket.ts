import { getFromLocalStore } from "@/lib";
import { useCallback, useEffect, useRef, useState } from "react";

const HTTP_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://diplace.api.elsoft.ng/api/v1";
const WS_BASE_URL = HTTP_BASE_URL.replace(/^http/, "ws");
const RECONNECT_DELAY_MS = 3000;

// ─── Server → Client types ───────────────────────────────────────────────────

export interface WsNewMessagePayload {
  public_id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  date_created: string;
  reply_to_message_id?: string | null;
}

export interface WsErrorPayload {
  message: string;
}

export type WsServerFrame =
  | { type: "new_message"; payload: WsNewMessagePayload }
  | { type: "error"; payload: WsErrorPayload };

// ─── Client → Server types ───────────────────────────────────────────────────

export interface WsSendMessagePayload {
  conversation_id: string;
  content: string;
  reply_to_message_id?: string;
}

export interface WsMarkReadPayload {
  conversation_id: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseChatWebSocketOptions {
  conversationId?: string;
  /** Called for each "new_message" frame from the server */
  onNewMessage?: (payload: WsNewMessagePayload) => void;
  /** Called for each "error" frame from the server */
  onError?: (payload: WsErrorPayload) => void;
  enabled?: boolean;
}

export function useChatWebSocket({
  conversationId,
  onNewMessage,
  onError,
  enabled = true,
}: UseChatWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  // Keep callbacks in refs so reconnect closures always see fresh values
  const onNewMessageRef = useRef(onNewMessage);
  onNewMessageRef.current = onNewMessage;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    if (!enabled || !mountedRef.current) return;

    const token = await getFromLocalStore("access_token");
    if (!token) return;

    // Tear down stale socket without triggering its onclose reconnect
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnecting(true);

    // Single shared endpoint — conversation_id goes in message frames, not the URL
    const url = `${WS_BASE_URL}/chats/ws/chat?token=${token}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!mountedRef.current) return;
      setIsConnected(true);
      setIsConnecting(false);
    };

    ws.onmessage = (event) => {
      if (!mountedRef.current) return;
      try {
        const frame: WsServerFrame = JSON.parse(event.data as string);

        if (frame.type === "new_message") {
          onNewMessageRef.current?.(frame.payload);
        } else if (frame.type === "error") {
          console.warn("[WS] Server error:", frame.payload.message);
          onErrorRef.current?.(frame.payload);
        }
      } catch {
        // Ignore non-JSON frames (ping/pong etc.)
      }
    };

    ws.onerror = () => {
      if (!mountedRef.current) return;
      setIsConnected(false);
      setIsConnecting(false);
    };

    ws.onclose = () => {
      if (!mountedRef.current) return;
      setIsConnected(false);
      setIsConnecting(false);
      // Auto-reconnect
      reconnectTimerRef.current = setTimeout(() => {
        if (mountedRef.current) connect();
      }, RECONNECT_DELAY_MS);
    };
  }, [enabled]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  /** Send a chat message. Returns true if sent via WS, false if socket not ready. */
  const sendWsMessage = useCallback(
    (payload: WsSendMessagePayload): boolean => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "send_message", payload }));
        return true;
      }
      return false;
    },
    [],
  );

  /** Mark a conversation as read. No-op if socket is not open. */
  const markConversationRead = useCallback(
    (payload: WsMarkReadPayload): void => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "mark_read", payload }));
      }
    },
    [],
  );

  return {
    isConnected,
    isConnecting,
    sendWsMessage,
    markConversationRead,
  };
}
