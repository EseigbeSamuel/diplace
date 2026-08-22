import { useTheme } from "@/contexts/themeContext";
import {
  useEndCall,
  useGetCurrentUser,
  useJoinCall,
  useStartCall,
} from "@/hooks";
import { CallScreenMode, CallScreenState } from "@/types";
import {
  AudioSession,
  LiveKitRoom,
  useRoomContext,
} from "@livekit/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Constants
const RING_TIMEOUT_MS = 30_000; // 30s before "not answered"

// Active Room Controls (inside LiveKitRoom)
function RoomControls({ onEnd, colors }: { onEnd: () => void; colors: any }) {
  const room = useRoomContext();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const toggleMute = useCallback(async () => {
    const localParticipant = room.localParticipant;
    const newMuted = !isMuted;
    await localParticipant.setMicrophoneEnabled(!newMuted);
    setIsMuted(newMuted);
  }, [isMuted, room.localParticipant]);

  const toggleSpeaker = useCallback(async () => {
    const next = !isSpeaker;
    setIsSpeaker(next);
    if (Platform.OS === "ios") {
      await AudioSession.setAppleAudioConfiguration({
        audioCategory: "playAndRecord",
        audioCategoryOptions: next ? ["defaultToSpeaker"] : [],
        audioMode: "voiceChat",
      });
    }
  }, [isSpeaker]);

  return (
    <View style={styles.controlRow}>
      {/* Mute */}
      <TouchableOpacity style={styles.controlBtn} onPress={toggleMute}>
        <Image
          source={
            isMuted
              ? require("@/assets/icons/Volume Up - Iconly Pro-1.png")
              : require("@/assets/icons/Volume Up - Iconly Pro.png")
          }
          style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
        />
      </TouchableOpacity>

      {/* End call */}
      <TouchableOpacity
        style={[styles.controlBtn, styles.endCallBtn]}
        onPress={onEnd}
      >
        <Image
          source={require("@/assets/icons/call-down-light.png")}
          style={styles.endCallIcon}
        />
      </TouchableOpacity>

      {/* Speaker */}
      <TouchableOpacity style={styles.controlBtn} onPress={toggleSpeaker}>
        <Image
          source={
            isSpeaker
              ? require("@/assets/icons/phone-keypad.png")
              : require("@/assets/icons/phone-keypad-light.png")
          }
          style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
        />
      </TouchableOpacity>
    </View>
  );
}

// Call Timer
function CallTimer({ colors }: { colors: any }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <View style={[styles.timerBadge, { backgroundColor: colors.success[200] }]}>
      <Text style={styles.timerText}>
        {/* caller name injected by parent via props */}
        {mm}:{ss}
      </Text>
    </View>
  );
}

// Pulse animation component
function PulseRing({ active, colors }: { active: boolean; colors: any }) {
  const scale1 = useRef(new Animated.Value(1)).current;
  const scale2 = useRef(new Animated.Value(1)).current;
  const opacity1 = useRef(new Animated.Value(0.5)).current;
  const opacity2 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (!active) return;

    const pulse = (
      scaleVal: Animated.Value,
      opacityVal: Animated.Value,
      delay: number,
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleVal, {
              toValue: 1.4,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityVal, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleVal, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacityVal, {
              toValue: 0.4,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );
    };

    const anim1 = pulse(scale1, opacity1, 0);
    const anim2 = pulse(scale2, opacity2, 400);

    anim1.start();
    anim2.start();

    return () => {
      anim1.stop();
      anim2.stop();
    };
  }, [active, scale1, scale2, opacity1, opacity2]);

  if (!active) return null;

  return (
    <>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            borderColor: colors.slate[400],
            transform: [{ scale: scale1 }],
            opacity: opacity1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseRing,
          {
            borderColor: colors.slate[400],
            transform: [{ scale: scale2 }],
            opacity: opacity2,
          },
        ]}
      />
    </>
  );
}

// Main Call Screen
const Call = () => {
  const { colors, isDarkMode } = useTheme();
  const router = useRouter();

  const {
    conversationId,
    callId: paramCallId,
    callerName,
    callerAvatar,
    mode,
  } = useLocalSearchParams<{
    conversationId: string;
    callId?: string;
    callerName?: string;
    callerAvatar?: string;
    mode?: CallScreenMode;
  }>();

  const callMode: CallScreenMode =
    mode === "incoming" ? "incoming" : "outgoing";

  const [callState, setCallState] = useState<CallScreenState>(
    callMode === "incoming" ? "ringing" : "calling",
  );
  const [activeCallId, setActiveCallId] = useState<string | undefined>(
    paramCallId,
  );
  const [livekitToken, setLivekitToken] = useState<string | undefined>();
  const [livekitUrl, setLivekitUrl] = useState<string | undefined>();

  const { startCallMutation, isStartCallPending } = useStartCall();
  const { joinCallMutation, isJoinCallPending } = useJoinCall();
  const { endCallMutation } = useEndCall();
  const { currentUser } = useGetCurrentUser();

  const ringTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start audio session on mount
  useEffect(() => {
    AudioSession.startAudioSession();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  // Outgoing: initiate call then fetch token
  useEffect(() => {
    if (callMode !== "outgoing" || !conversationId) return;

    let cancelled = false;

    const initiateCall = async () => {
      try {
        const callItem = await startCallMutation({
          conversation_id: conversationId,
          call_type: "audio",
          record: false,
        });

        if (cancelled) return;
        setActiveCallId(callItem.public_id);

        // Immediately get a token to join our own room
        const joinData = await joinCallMutation(callItem.public_id);
        if (cancelled) return;

        setLivekitToken(joinData.token);
        setLivekitUrl(joinData.server_url);

        // Give the other side 30s to answer
        ringTimeoutRef.current = setTimeout(() => {
          if (!cancelled) setCallState("not_answered");
        }, RING_TIMEOUT_MS);
      } catch {
        if (!cancelled) router.back();
      }
    };

    initiateCall();

    return () => {
      cancelled = true;
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callMode, conversationId]);

  // Incoming: accept or decline
  const handleAcceptIncoming = useCallback(async () => {
    if (!activeCallId) return;
    try {
      const joinData = await joinCallMutation(activeCallId);
      setLivekitToken(joinData.token);
      setLivekitUrl(joinData.server_url);
      setCallState("accepted");
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
    } catch {
      // leave as ringing
    }
  }, [activeCallId, joinCallMutation]);

  const handleDeclineIncoming = useCallback(async () => {
    if (activeCallId) {
      try {
        await endCallMutation(activeCallId);
      } catch {
        // ignore
      }
    }
    router.back();
  }, [activeCallId, endCallMutation, router]);

  //  End call (active or calling)
  const handleEndCall = useCallback(async () => {
    if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
    if (activeCallId) {
      try {
        await endCallMutation(activeCallId);
      } catch {
        // ignore
      }
    }
    setCallState("not_answered");
  }, [activeCallId, endCallMutation]);

  //  LiveKit connected callback
  const handleRoomConnected = useCallback(() => {
    if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
    setCallState("accepted");
  }, []);

  const handleRoomDisconnected = useCallback(() => {
    setCallState("ended");
    setTimeout(() => router.back(), 1200);
  }, [router]);

  //  Display helpers
  const displayName = callerName ?? "Unknown";
  const displayAvatar = callerAvatar
    ? { uri: callerAvatar }
    : require("@/assets/icons/user-icon.png");

  const statusLabel =
    callState === "calling"
      ? "Ringing..."
      : callState === "ringing"
        ? "Calling..."
        : callState === "accepted"
          ? ""
          : callState === "not_answered"
            ? "Not answered..."
            : "";

  const headerLabel =
    callState === "ringing"
      ? "Incoming call"
      : callState === "accepted"
        ? displayName
        : `Calling ${displayName}`;

  const isPulsing = callState === "calling" || callState === "ringing";

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Image
            source={
              isDarkMode
                ? require("@/assets/icons/arrow-left-light.png")
                : require("@/assets/icons/arrow-left-dark.png")
            }
            style={{ width: 25, height: 20 }}
          />
        </TouchableOpacity>

        {callState === "accepted" ? (
          <CallTimer colors={colors} />
        ) : (
          <Text style={[styles.headerTitle, { color: colors.slate[650] }]}>
            {headerLabel}
          </Text>
        )}

        <View style={{ width: 25 }} />
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrapper}>
          <PulseRing active={isPulsing} colors={colors} />
          <Image source={displayAvatar} style={styles.avatar} />
        </View>
        <Text style={[styles.callerName, { color: colors.slate[650] }]}>
          {displayName}
        </Text>
        {statusLabel ? (
          <Text style={[styles.callerStatus, { color: colors.slate[500] }]}>
            {statusLabel}
          </Text>
        ) : null}
      </View>

      {/* Controls */}
      <View style={styles.controlsArea}>
        {/*  Outgoing / Active call controls */}
        {(callState === "calling" || callState === "accepted") &&
        livekitToken &&
        livekitUrl ? (
          <LiveKitRoom
            serverUrl={livekitUrl}
            token={livekitToken}
            audio
            video={false}
            onConnected={handleRoomConnected}
            onDisconnected={handleRoomDisconnected}
          >
            <RoomControls onEnd={handleEndCall} colors={colors} />
          </LiveKitRoom>
        ) : callState === "calling" ? (
          // Still waiting for token / connecting
          <View style={styles.controlRow}>
            {/* Chat bubble placeholder */}
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => router.back()}
            >
              <Image
                source={require("@/assets/icons/Chat - Iconly Pro-1.png")}
                style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
              />
            </TouchableOpacity>

            {/* End call */}
            <TouchableOpacity
              style={[styles.controlBtn, styles.endCallBtn]}
              onPress={handleEndCall}
            >
              <Image
                source={require("@/assets/icons/call-down-light.png")}
                style={styles.endCallIcon}
              />
            </TouchableOpacity>

            {/* Mute placeholder */}
            <TouchableOpacity style={styles.controlBtn}>
              <Image
                source={require("@/assets/icons/Volume Up - Iconly Pro.png")}
                style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {/*  Incoming (ringing) controls  */}
        {callState === "ringing" && (
          <View style={styles.controlRow}>
            {/* Chat (decline) */}
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={handleDeclineIncoming}
            >
              <Image
                source={require("@/assets/icons/Chat - Iconly Pro-1.png")}
                style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
              />
            </TouchableOpacity>

            {/* Accept call (green) */}
            <TouchableOpacity
              style={[styles.controlBtn, styles.acceptCallBtn]}
              onPress={handleAcceptIncoming}
              disabled={isJoinCallPending}
            >
              <Image
                source={require("@/assets/icons/call-up-light.png")}
                style={styles.endCallIcon}
              />
            </TouchableOpacity>

            {/* Decline (red) */}
            <TouchableOpacity
              style={[styles.controlBtn, styles.endCallBtn]}
              onPress={handleDeclineIncoming}
            >
              <Image
                source={require("@/assets/icons/call-down-light.png")}
                style={styles.endCallIcon}
              />
            </TouchableOpacity>
          </View>
        )}

        {/*  Not answered controls  */}
        {(callState === "not_answered" || callState === "ended") && (
          <View style={styles.notAnsweredRow}>
            {/* Chat */}
            <TouchableOpacity
              style={[
                styles.notAnsweredBtn,
                {
                  backgroundColor: colors.slate[200],
                  borderColor: colors.slate[300],
                },
              ]}
              onPress={() => router.back()}
            >
              <Image
                source={require("@/assets/icons/Chat - Iconly Pro-1.png")}
                style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
              />
              <Text
                style={[
                  styles.notAnsweredBtnText,
                  { color: colors.slate[650] },
                ]}
              >
                Chat
              </Text>
            </TouchableOpacity>

            {/* Redial */}
            <TouchableOpacity
              style={[styles.notAnsweredBtn, { backgroundColor: "#22C55E" }]}
              onPress={() => {
                // Reset state and try again
                setCallState("calling");
                setActiveCallId(undefined);
                setLivekitToken(undefined);
                setLivekitUrl(undefined);
              }}
              disabled={isStartCallPending}
            >
              <Image
                source={require("@/assets/icons/call-up-light.png")}
                style={styles.endCallIcon}
              />
              <Text style={[styles.notAnsweredBtnText, { color: "#fff" }]}>
                Redial
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Call;

//  Styles
const AVATAR_SIZE = 120;
const CONTROL_BTN_SIZE = 58;
const END_CALL_BTN_SIZE = 68;
const PULSE_SIZE = AVATAR_SIZE + 32;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 10 : 10,
    paddingBottom: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },

  // Avatar
  avatarSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    position: "absolute",
  },
  pulseRing: {
    position: "absolute",
    width: PULSE_SIZE,
    height: PULSE_SIZE,
    borderRadius: PULSE_SIZE / 2,
    borderWidth: 2,
  },
  callerName: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  callerStatus: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },

  // Controls
  controlsArea: {
    paddingBottom: 16,
    alignItems: "center",
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  controlBtn: {
    width: CONTROL_BTN_SIZE,
    height: CONTROL_BTN_SIZE,
    borderRadius: CONTROL_BTN_SIZE / 2,
    backgroundColor: "rgba(120,120,120,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  controlIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  endCallBtn: {
    width: END_CALL_BTN_SIZE,
    height: END_CALL_BTN_SIZE,
    borderRadius: END_CALL_BTN_SIZE / 2,
    backgroundColor: "#EF4444",
  },
  acceptCallBtn: {
    width: END_CALL_BTN_SIZE,
    height: END_CALL_BTN_SIZE,
    borderRadius: END_CALL_BTN_SIZE / 2,
    backgroundColor: "#22C55E",
  },
  endCallIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    tintColor: "#fff",
  },

  // Not answered
  notAnsweredRow: {
    flexDirection: "row",
    gap: 16,
  },
  notAnsweredBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "transparent",
  },
  notAnsweredBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },

  // Timer badge
  timerBadge: {
    flex: 1,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
    alignItems: "center",
    marginHorizontal: 8,
  },
  timerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
