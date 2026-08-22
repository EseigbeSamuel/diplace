import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { getFromLocalStore } from "@/lib";
import { postRequest } from "@/services";

/**
 * Call-related notification types emitted by the backend.
 * Adjust these strings to match whatever the server sends.
 */
const INCOMING_CALL_TYPES = [
  "incoming_call",
  "call_incoming",
  "call_started",
] as const;

// ─── Push token API types ─────────────────────────────────────────────────────
type DevicePlatform = "unknown" | "ios" | "android" | "web";

interface DeviceTokenPayload {
  token: string;
  platform: DevicePlatform;
}

interface DeviceTokenResponse {
  public_id: string;
  token: string;
  platform: string;
  is_active: boolean;
  last_seen_at: string;
}

/** Map React Native's Platform.OS to the backend's accepted enum values. */
function toPlatformEnum(): DevicePlatform {
  switch (Platform.OS) {
    case "ios":
      return "ios";
    case "android":
      return "android";
    case "web":
      return "web";
    default:
      return "unknown";
  }
}

// ─── Push token registration ──────────────────────────────────────────────────
async function registerForPushNotifications(): Promise<string | null> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("calls", {
        name: "Incoming Calls",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#22C55E",
        sound: "default",
      });
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  } catch (err) {
    console.warn("[useIncomingCall] Push registration error:", err);
    return null;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Sets up:
 * 1. Expo push-notification permission + token registration (synced to backend)
 * 2. Foreground notification handler (shows alert for non-call notifications)
 * 3. Notification response listener — when user taps an incoming-call notification
 *    or when it fires in the foreground, navigate to the call screen.
 */
export function useIncomingCall() {
  const router = useRouter();
  const notificationListenerRef = useRef<Notifications.EventSubscription | null>(null);
  const responseListenerRef = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Show alert only for non-call notifications when app is in foreground
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        const type =
          (notification.request.content.data?.notification_type as string) ?? "";
        const isCallNotification = INCOMING_CALL_TYPES.includes(type as any);

        return {
          shouldShowAlert: !isCallNotification,
          shouldPlaySound: !isCallNotification,
          shouldSetBadge: true,
          shouldShowBanner: !isCallNotification,
          shouldShowList: !isCallNotification,
        };
      },
    });

    // Register and sync token to backend
    registerForPushNotifications().then(async (token) => {
      if (!token) return;
      try {
        const accessToken = await getFromLocalStore("access_token");
        if (!accessToken) return;
        await postRequest<DeviceTokenResponse, DeviceTokenPayload>({
          url: "/user-notifications/device-tokens",
          payload: { token, platform: toPlatformEnum() },
          protectedRoute: true,
          notifyOnError: false,
        });
      } catch {
        // Non-fatal — continue without syncing the token
      }
    });

    // ── Foreground call notification handler ──
    notificationListenerRef.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification.request.content.data ?? {};
        const type = (data.notification_type as string) ?? "";

        if (!INCOMING_CALL_TYPES.includes(type as any)) return;

        // Navigate to call screen in incoming/ringing mode
        router.push({
          pathname: "/views/call",
          params: {
            conversationId: String(data.conversation_id ?? ""),
            callId: String(data.call_id ?? ""),
            callerName: String(data.caller_name ?? ""),
            callerAvatar: String(data.caller_avatar ?? ""),
            mode: "incoming",
          },
        });
      }
    );

    // ── Tapped call notification handler (app was backgrounded) ──
    responseListenerRef.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data ?? {};
        const type = (data.notification_type as string) ?? "";

        if (!INCOMING_CALL_TYPES.includes(type as any)) return;

        router.push({
          pathname: "/views/call",
          params: {
            conversationId: String(data.conversation_id ?? ""),
            callId: String(data.call_id ?? ""),
            callerName: String(data.caller_name ?? ""),
            callerAvatar: String(data.caller_avatar ?? ""),
            mode: "incoming",
          },
        });
      }
    );

    return () => {
      notificationListenerRef.current?.remove();
      responseListenerRef.current?.remove();
    };
  }, [router]);
}
