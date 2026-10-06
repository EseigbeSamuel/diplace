import { useTheme } from "@/contexts/themeContext";
import {
  useEndCall,
  useGetCurrentUser,
  useJoinCall,
  useStartCall,
} from "@/hooks";
import { CallScreenMode, CallScreenState } from "@/types";
import Constants from "expo-constants";
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
const liveKit =
  Constants.appOwnership === "expo" ? null : require("@livekit/react-native");
const AudioSession = liveKit?.AudioSession;
const LiveKitRoom = liveKit?.LiveKitRoom as React.ComponentType<any> | undefined;
const useRoomContext = liveKit?.useRoomContext as (() => any) | undefined;

// Active Room Controls (inside LiveKitRoom)
function RoomControls({ onEnd, colors }: { onEnd: () => void; colors: any }) {
  const room = useRoomContext?.();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const toggleMute = useCallback(async () => {
    if (!room) return;
    const localParticipant = room.localParticipant;
    const newMuted = !isMuted;
    await localParticipant.setMicrophoneEnabled(!newMuted);
    setIsMuted(newMuted);
  }, [isMuted, room]);

  const toggleSpeaker = useCallback(async () => {
    const next = !isSpeaker;
    setIsSpeaker(next);
    if (Platform.OS === "ios") {
      await AudioSession?.setAppleAudioConfiguration({
        audioCategory: "playAndRecord",
        audioCategoryOptions: next ? ["defaultToSpeaker"] : [],
        audioMode: "voiceChat",
      });
    }
  }, [isSpeaker]);

  return (
    <View style={styles.controlRow} className="flex-row items-center justify-center gap-[24px]">
      {/* Mute */}
      <TouchableOpacity style={styles.controlBtn} onPress={toggleMute} className="bg-[rgba(120,120,120,0.12)] items-center justify-center">
        <Image
          source={
            isMuted
              ? require("@/assets/icons/Volume Up - Iconly Pro-1.png")
              : require("@/assets/icons/Volume Up - Iconly Pro.png")
          }
          style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
         className="object-contain w-[24px] h-[24px]"/>
      </TouchableOpacity>

      {/* End call */}
      <TouchableOpacity
        style={[styles.controlBtn, styles.endCallBtn]}
        onPress={onEnd}
       className="bg-[rgba(120,120,120,0.12)] items-center justify-center bg-[#EF4444]">
        <Image
          source={require("@/assets/icons/call-down-light.png")}
          style={styles.endCallIcon}
         className="object-contain tint-[#fff] w-[28px] h-[28px]"/>
      </TouchableOpacity>

      {/* Speaker */}
      <TouchableOpacity style={styles.controlBtn} onPress={toggleSpeaker} className="bg-[rgba(120,120,120,0.12)] items-center justify-center">
        <Image
          source={
            isSpeaker
              ? require("@/assets/icons/phone-keypad.png")
              : require("@/assets/icons/phone-keypad-light.png")
          }
          style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
         className="object-contain w-[24px] h-[24px]"/>
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
    <View style={[styles.timerBadge, { backgroundColor: colors.success[200] }]} className="self-center items-center flex-1 px-[16px] py-[6px] rounded-[100px] mx-[8px]">
      <Text  className="text-[#fff] font-bold text-[14px] tracking-[0.5px]">
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
       className="absolute border-[2px]"/>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            borderColor: colors.slate[400],
            transform: [{ scale: scale2 }],
            opacity: opacity2,
          },
        ]}
       className="absolute border-[2px]"/>
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
  const [callAttempt, setCallAttempt] = useState(0);

  const { startCallMutation, isStartCallPending } = useStartCall();
  const { joinCallMutation, isJoinCallPending } = useJoinCall();
  const { endCallMutation } = useEndCall();
  const { currentUser } = useGetCurrentUser();

  const ringTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeCallIdRef = useRef<string | undefined>(paramCallId);

  // Start audio session on mount
  useEffect(() => {
    AudioSession?.startAudioSession();
    return () => {
      AudioSession?.stopAudioSession();
    };
  }, []);

  // Outgoing: initiate call then fetch token
  useEffect(() => {
    if (!liveKit || callMode !== "outgoing" || !conversationId) return;

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
        activeCallIdRef.current = callItem.public_id;

        // Immediately get a token to join our own room
        const joinData = await joinCallMutation(callItem.public_id);
        if (cancelled) return;

        setLivekitToken(joinData.token);
        setLivekitUrl(joinData.server_url);

        // Give the other side 30s to answer
        ringTimeoutRef.current = setTimeout(async () => {
          if (cancelled) return;
          try {
            await endCallMutation(callItem.public_id);
          } catch {
            // Keep the local timeout state even if cleanup fails remotely.
          }
          activeCallIdRef.current = undefined;
          setCallState("not_answered");
        }, RING_TIMEOUT_MS);
      } catch {
        if (!cancelled) router.back();
      }
    };

    initiateCall();

    return () => {
      cancelled = true;
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
      const callId = activeCallIdRef.current;
      if (callId) {
        endCallMutation(callId).catch(() => undefined);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callAttempt, callMode, conversationId]);

  // Incoming: accept or decline
  const handleAcceptIncoming = useCallback(async () => {
    if (!liveKit) return;
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
    activeCallIdRef.current = undefined;
    setCallState("not_answered");
  }, [activeCallId, endCallMutation]);

  const handleLeaveCall = useCallback(async () => {
    await handleEndCall();
    router.back();
  }, [handleEndCall, router]);

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

  if (!liveKit) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]} className="flex-1 px-[16px] pb-[48px]">
        <View style={styles.avatarSection} className="items-center justify-center flex-1 gap-[14px]">
          <Text style={[styles.callerName, { color: colors.slate[650] }]} className="font-bold text-center text-[20px] mt-[8px]">
            Calls need a development build
          </Text>
          <Text style={[styles.callerStatus, { color: colors.slate[500] }]} className="font-normal text-center text-[14px]">
            Expo Go cannot load the native LiveKit calling module.
          </Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} className="p-[8px]">
            <Text style={{ color: colors.slate[650] }}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]} className="flex-1 px-[16px] pb-[48px]">
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <View style={styles.header} className="flex-row items-center justify-between mb-[8px]">
        <TouchableOpacity style={styles.backBtn} onPress={handleLeaveCall} className="p-[8px]">
          <Image
            source={
              isDarkMode
                ? require("@/assets/icons/arrow-left-light.png")
                : require("@/assets/icons/arrow-left-dark.png")
            }
            className="w-[25px] h-[20px]"
          />
        </TouchableOpacity>

        {callState === "accepted" ? (
          <CallTimer colors={colors} />
        ) : (
          <Text style={[styles.headerTitle, { color: colors.slate[650] }]} className="font-semibold text-center text-[16px] flex-1">
            {headerLabel}
          </Text>
        )}

        <View className="w-[25px]" />
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection} className="items-center justify-center flex-1 gap-[14px]">
        <View style={styles.avatarWrapper} className="items-center justify-center">
          <PulseRing active={isPulsing} colors={colors} />
          <Image source={displayAvatar} style={styles.avatar}  className="absolute"/>
        </View>
        <Text style={[styles.callerName, { color: colors.slate[650] }]} className="font-bold text-center text-[20px] mt-[8px]">
          {displayName}
        </Text>
        {statusLabel ? (
          <Text style={[styles.callerStatus, { color: colors.slate[500] }]} className="font-normal text-center text-[14px]">
            {statusLabel}
          </Text>
        ) : null}
      </View>

      {/* Controls */}
      <View style={styles.controlsArea} className="items-center pb-[16px]">
        {/*  Outgoing / Active call controls */}
        {(callState === "calling" || callState === "accepted") &&
        livekitToken &&
        livekitUrl && LiveKitRoom ? (
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
          <View style={styles.controlRow} className="flex-row items-center justify-center gap-[24px]">
            {/* Chat bubble placeholder */}
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={handleLeaveCall}
             className="bg-[rgba(120,120,120,0.12)] items-center justify-center">
              <Image
                source={require("@/assets/icons/Chat - Iconly Pro-1.png")}
                style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
               className="object-contain w-[24px] h-[24px]"/>
            </TouchableOpacity>

            {/* End call */}
            <TouchableOpacity
              style={[styles.controlBtn, styles.endCallBtn]}
              onPress={handleEndCall}
             className="bg-[rgba(120,120,120,0.12)] items-center justify-center bg-[#EF4444]">
              <Image
                source={require("@/assets/icons/call-down-light.png")}
                style={styles.endCallIcon}
               className="object-contain tint-[#fff] w-[28px] h-[28px]"/>
            </TouchableOpacity>

            {/* Mute placeholder */}
            <TouchableOpacity style={styles.controlBtn} className="bg-[rgba(120,120,120,0.12)] items-center justify-center">
              <Image
                source={require("@/assets/icons/Volume Up - Iconly Pro.png")}
                style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
               className="object-contain w-[24px] h-[24px]"/>
            </TouchableOpacity>
          </View>
        ) : null}

        {/*  Incoming (ringing) controls  */}
        {callState === "ringing" && (
          <View style={styles.controlRow} className="flex-row items-center justify-center gap-[24px]">
            {/* Chat (decline) */}
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={handleDeclineIncoming}
             className="bg-[rgba(120,120,120,0.12)] items-center justify-center">
              <Image
                source={require("@/assets/icons/Chat - Iconly Pro-1.png")}
                style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
               className="object-contain w-[24px] h-[24px]"/>
            </TouchableOpacity>

            {/* Accept call (green) */}
            <TouchableOpacity
              style={[styles.controlBtn, styles.acceptCallBtn]}
              onPress={handleAcceptIncoming}
              disabled={isJoinCallPending}
             className="bg-[rgba(120,120,120,0.12)] items-center justify-center bg-[#22C55E]">
              <Image
                source={require("@/assets/icons/call-up-light.png")}
                style={styles.endCallIcon}
               className="object-contain tint-[#fff] w-[28px] h-[28px]"/>
            </TouchableOpacity>

            {/* Decline (red) */}
            <TouchableOpacity
              style={[styles.controlBtn, styles.endCallBtn]}
              onPress={handleDeclineIncoming}
             className="bg-[rgba(120,120,120,0.12)] items-center justify-center bg-[#EF4444]">
              <Image
                source={require("@/assets/icons/call-down-light.png")}
                style={styles.endCallIcon}
               className="object-contain tint-[#fff] w-[28px] h-[28px]"/>
            </TouchableOpacity>
          </View>
        )}

        {/*  Not answered controls  */}
        {(callState === "not_answered" || callState === "ended") && (
          <View style={styles.notAnsweredRow} className="flex-row gap-[16px]">
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
             className="flex-row items-center border-[transparent] gap-[8px] px-[24px] py-[14px] rounded-[100px] border-[1px]">
              <Image
                source={require("@/assets/icons/Chat - Iconly Pro-1.png")}
                style={[styles.controlIcon, { tintColor: colors.slate[650] }]}
               className="object-contain w-[24px] h-[24px]"/>
              <Text
                style={[
                  styles.notAnsweredBtnText,
                  { color: colors.slate[650] },
                ]}
               className="font-semibold text-[15px]">
                Chat
              </Text>
            </TouchableOpacity>

            {/* Redial */}
            <TouchableOpacity
              style={[styles.notAnsweredBtn, { backgroundColor: "#22C55E" }]}
              onPress={() => {
                setCallState("calling");
                setActiveCallId(undefined);
                activeCallIdRef.current = undefined;
                setLivekitToken(undefined);
                setLivekitUrl(undefined);
                setCallAttempt((attempt) => attempt + 1);
              }}
              disabled={isStartCallPending}
             className="flex-row items-center border-[transparent] gap-[8px] px-[24px] py-[14px] rounded-[100px] border-[1px]">
              <Image
                source={require("@/assets/icons/call-up-light.png")}
                style={styles.endCallIcon}
               className="object-contain tint-[#fff] w-[28px] h-[28px]"/>
              <Text style={[styles.notAnsweredBtnText, { color: "#fff" }]} className="font-semibold text-[15px]">
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


    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 10 : 10,

  },
  header: {




  },
  backBtn: {

  },
  headerTitle: {




  },

  // Avatar
  avatarSection: {




  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,


  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,

  },
  pulseRing: {

    width: PULSE_SIZE,
    height: PULSE_SIZE,
    borderRadius: PULSE_SIZE / 2,

  },
  callerName: {




  },
  callerStatus: {



  },

  // Controls
  controlsArea: {


  },
  controlRow: {




  },
  controlBtn: {
    width: CONTROL_BTN_SIZE,
    height: CONTROL_BTN_SIZE,
    borderRadius: CONTROL_BTN_SIZE / 2,



  },
  controlIcon: {



  },
  endCallBtn: {
    width: END_CALL_BTN_SIZE,
    height: END_CALL_BTN_SIZE,
    borderRadius: END_CALL_BTN_SIZE / 2,

  },
  acceptCallBtn: {
    width: END_CALL_BTN_SIZE,
    height: END_CALL_BTN_SIZE,
    borderRadius: END_CALL_BTN_SIZE / 2,

  },
  endCallIcon: {




  },

  // Not answered
  notAnsweredRow: {


  },
  notAnsweredBtn: {








  },
  notAnsweredBtnText: {


  },

  // Timer badge
  timerBadge: {







  },
  timerText: {},
});
