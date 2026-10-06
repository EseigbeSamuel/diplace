import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { VideoView, useVideoPlayer } from "expo-video";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { useSpaceStore } from "@/store/useSpace";
import { TourVideo } from "@/types/add-space-types";
import { ColorScheme } from "@/utils";

interface VirtualTourSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

type StopAction = "next" | "finish";

const MAX_RECORD_SECONDS = 60;

interface VideoPreviewProps {
  uri: string;
  style?: object;
  className?: string;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ uri, style, className }) => {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = true;
  });

  return (
    <VideoView
      player={player}
      style={style}
      className={className}
      nativeControls
      contentFit="cover"
    />
  );
};

const VirtualTourSubstep: React.FC<VirtualTourSubstepProps> = ({
  onNext,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, spaceForm } = useSpaceStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const cameraRef = useRef<CameraView>(null);
  const recordingPromiseRef = useRef<Promise<{ uri: string } | undefined> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cameraReadyRef = useRef(false);
  const recordingStartAttemptsRef = useRef(0);
  const pendingActionRef = useRef<StopAction>("finish");

  const [showInstructions, setShowInstructions] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [showRoomNameModal, setShowRoomNameModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isPreparingCamera, setIsPreparingCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(MAX_RECORD_SECONDS);
  const [roomName, setRoomName] = useState("");
  const [currentVideoUri, setCurrentVideoUri] = useState("");
  const [lastClipDuration, setLastClipDuration] = useState(0);
  const [isFinalizingClip, setIsFinalizingClip] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recordingStartTimeoutRef.current) {
        clearTimeout(recordingStartTimeoutRef.current);
      }
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const openCamera = () => {
    cameraReadyRef.current = false;
    recordingStartAttemptsRef.current = 0;
    setIsPreparingCamera(true);
    setShowCamera(true);
  };

  const handleCameraReady = () => {
    cameraReadyRef.current = true;
    setIsPreparingCamera(false);

    if (recordingStartTimeoutRef.current) {
      clearTimeout(recordingStartTimeoutRef.current);
    }

    recordingStartTimeoutRef.current = setTimeout(() => {
      void startRecording();
    }, 350);
  };

  const addClipToTour = (name: string) => {
    if (!currentVideoUri) {
      Alert.alert("No Recording", "No recorded clip found.");
      return false;
    }

    const clip: TourVideo = {
      uri: currentVideoUri,
      roomName: name.trim(),
      duration: lastClipDuration,
    };

    setValue({ tour: [...(spaceForm.value.tour ?? []), clip] });
    return true;
  };

  const startRecording = async () => {
    if (!cameraRef.current || !cameraReadyRef.current || isRecording) return;

    let shouldRetry = false;

    try {
      setIsPreparingCamera(false);
      setIsRecording(true);
      setRecordingTime(MAX_RECORD_SECONDS);
      setCurrentVideoUri("");
      setLastClipDuration(0);
      pendingActionRef.current = "finish";

      clearTimer();
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev <= 1) {
            clearTimer();
            handleStopRecording("finish");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const recordingPromise = cameraRef.current.recordAsync({
        maxDuration: MAX_RECORD_SECONDS,
      });
      recordingPromiseRef.current = recordingPromise;

      const video = await recordingPromise;
      const duration = MAX_RECORD_SECONDS - recordingTime;

      if (video?.uri) {
        setCurrentVideoUri(video.uri);
        setLastClipDuration(duration > 0 ? duration : MAX_RECORD_SECONDS);
      }
    } catch (error) {
      console.log("VirtualTour: record error", error);
      const isCameraStillPreparing =
        error instanceof Error && error.message.includes("CameraOutputNotReadyException");

      if (
        isCameraStillPreparing &&
        recordingStartAttemptsRef.current < 3
      ) {
        recordingStartAttemptsRef.current += 1;
        shouldRetry = true;
        clearTimer();
        setIsRecording(false);
        setIsPreparingCamera(true);
        recordingStartTimeoutRef.current = setTimeout(() => {
          void startRecording();
        }, 400);
        return;
      }

      Alert.alert("Recording Error", "Unable to record video. Please try again.");
    } finally {
      if (shouldRetry) return;

      setIsRecording(false);
      clearTimer();
      setShowCamera(false);
      setIsFinalizingClip(false);

      if (!currentVideoUri && recordingPromiseRef.current) {
        try {
          const video = await recordingPromiseRef.current;
          if (video?.uri) {
            setCurrentVideoUri(video.uri);
          }
        } catch {
          // ignore
        }
      }

      if (pendingActionRef.current === "next") {
        setShowRoomNameModal(true);
      } else {
        setShowFinishModal(true);
      }
    }
  };

  const handleStopRecording = async (action: StopAction) => {
    if (!cameraRef.current || !isRecording || isFinalizingClip) return;

    try {
      setIsFinalizingClip(true);
      pendingActionRef.current = action;
      await cameraRef.current.stopRecording();
    } catch (error) {
      setIsFinalizingClip(false);
      console.log("VirtualTour: stop error", error);
      Alert.alert("Stop Error", "Unable to stop recording properly.");
    }
  };

  const handleBeginTour = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Permission Required",
          "Camera permission is required for virtual tour.",
        );
        return;
      }
    }

    const audioPermission = microphonePermission?.granted
      ? microphonePermission
      : await requestMicrophonePermission();
    if (!audioPermission.granted) {
      Alert.alert(
        "Permission Required",
        "Audio permission is required for recording.",
      );
      return;
    }

    setShowInstructions(false);
    openCamera();
  };

  const handleProceedToNextRoom = () => {
    if (!roomName.trim()) {
      Alert.alert("Room Name Required", "Please provide a room name.");
      return;
    }

    const added = addClipToTour(roomName);
    if (!added) return;

    setRoomName("");
    setCurrentVideoUri("");
    setLastClipDuration(0);
    setShowRoomNameModal(false);
    openCamera();
  };

  const handleUploadTour = () => {
    if (!roomName.trim()) {
      Alert.alert("Room Name Required", "Please provide a room name.");
      return;
    }

    const added = addClipToTour(roomName);
    if (!added) return;

    setRoomName("");
    setCurrentVideoUri("");
    setShowFinishModal(false);
  };

  const handleRetakeCurrent = () => {
    setRoomName("");
    setCurrentVideoUri("");
    setLastClipDuration(0);
    setShowRoomNameModal(false);
    setShowFinishModal(false);
    openCamera();
  };

  const handleRetakeAll = () => {
    setValue({ tour: [] });
    setRoomName("");
    setCurrentVideoUri("");
    setLastClipDuration(0);
    setShowCamera(false);
    setShowFinishModal(false);
    setShowRoomNameModal(false);
    setShowInstructions(true);
  };

  const handleExitTour = async () => {
    clearTimer();
    pendingActionRef.current = "finish";

    if (cameraRef.current && isRecording) {
      try {
        await cameraRef.current.stopRecording();
      } catch {
        // ignore
      }
    }

    setIsRecording(false);
    cameraReadyRef.current = false;
    setShowCamera(false);
    setShowRoomNameModal(false);
    setShowFinishModal(false);
    setCurrentVideoUri("");
    setRoomName("");
    setLastClipDuration(0);
    setValue({ tour: [] });
    setShowInstructions(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const hasTour = (spaceForm.value.tour ?? []).length > 0;

  return (
    <View style={styles.container} className="flex-1">
      {showInstructions && (
        <View style={styles.instructionsContainer} className="flex-1">
          <Text style={styles.title} className="font-semibold">
            Please follow the instructions to take a 360 view.
          </Text>
          <View style={styles.instructionsList} className="flex-1">
            <Text style={styles.instructionItem}>
              1. Keep the space clean, bright, and clear.
            </Text>
            <Text style={styles.instructionItem}>
              2. Hold your phone steady at chest level.
            </Text>
            <Text style={styles.instructionItem}>
              3. Rotate slowly from one point to cover the room.
            </Text>
            <Text style={styles.instructionItem}>
              4. Record one room per clip (max 60 seconds).
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <AppButton
              title="Begin Virtual Tour"
              onPress={handleBeginTour}
              size="large"
              fullwidth={true}
              afterIcon={require("@/assets/icons/Video - Iconly Pro.png")}
            />
            <Pressable style={styles.skipButton} onPress={onNext} className="items-center">
              <Text style={styles.skipText} className="font-medium">Skip</Text>
            </Pressable>
          </View>
        </View>
      )}

      {hasTour &&
        !showInstructions &&
        !showCamera &&
        !showFinishModal &&
        !showRoomNameModal && (
          <View style={styles.uploadContainer} className="flex-1">
            <Text style={styles.uploadTitle} className="font-semibold">Virtual tour ready</Text>
            <Text style={styles.uploadDescription}>
              {(spaceForm.value.tour ?? []).length} room clip(s) added.
            </Text>

            <View style={styles.uploadStatusContainer}>
              <View style={styles.uploadStatusRow} className="flex-row items-center">
                <Image
                  source={require("@/assets/icons/Video - Iconly Pro.png")}
                  style={styles.previewIcon}
                />
                <Text style={styles.uploadText} className="font-medium">Uploaded locally</Text>
              </View>
            </View>

            <View style={styles.bottomButtons}>
              <AppButton title="Next" onPress={onNext} size="large" fullwidth />
              <Pressable style={styles.retakeButton} onPress={handleRetakeAll} className="flex-row items-center justify-center">
                <Image
                  source={require("@/assets/icons/return.png")}
                  style={styles.retakeIcon}
                />
                <Text style={styles.retakeText} className="font-medium">Retake All</Text>
              </Pressable>
            </View>
          </View>
        )}

      <Modal visible={showCamera} animationType="fade">
        <View  className="flex-1 bg-[#000000]">
          <CameraView
            ref={cameraRef}

            facing="back"
            mode="video"
            videoQuality="1080p"
            onCameraReady={handleCameraReady}
           className="flex-1 w-[100%px] h-[100%px]"/>
          <Pressable style={styles.exitButton} onPress={handleExitTour} className="absolute flex-row items-center bg-[rgba(0, 0, 0, 0.5)]">
            <Image
              source={require("@/assets/icons/close-contained.png")}
              style={styles.exitIcon}
             className="tint-[#FFFFFF]"/>
            <Text style={styles.exitText} className="text-[#FFFFFF] font-medium">Exit tour</Text>
          </Pressable>

          <View style={styles.cameraOverlay} pointerEvents="none" className="absolute left-[0px] right-[0px] items-center">
            <Text style={styles.cameraInstruction} className="text-[#FFFFFF] text-center">
              Rotate slowly and keep your phone steady.
            </Text>
            <View style={styles.timerContainer} className="flex-row items-center bg-[rgba(0,0,0,0.6)]">
              <View style={styles.recordingDot}  className="bg-[#EF4444]"/>
              <Text style={styles.timerText} className="text-[#FFFFFF] font-semibold">{formatTime(recordingTime)}</Text>
            </View>
          </View>

          {isPreparingCamera && (
            <View style={styles.preparingOverlay} pointerEvents="none" className="absolute top-[45%px] items-center self-center">
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.preparingText} className="text-[#FFFFFF]">Preparing camera...</Text>
            </View>
          )}

          <View style={styles.cameraBottomButtons} className="absolute">
            <AppButton
              title="Next Room"
              onPress={() => handleStopRecording("next")}
              disabled={!isRecording}
              afterIcon={require("@/assets/icons/chevron-right.png")}
              variant="secondary"
            />
            <AppButton
              title="Finish Tour"
              onPress={() => handleStopRecording("finish")}
              disabled={!isRecording}
              variant="primary"
            />
          </View>
        </View>
      </Modal>

      <Modal visible={showRoomNameModal} transparent animationType="fade">
        <View  className="flex-1 bg-[rgba(0,0,0,0.85)]">
          <View  className="flex-1">
            {currentVideoUri ? (
              <VideoPreview uri={currentVideoUri} className="w-full h-full" />
            ) : (
              <View  className="flex-1 items-center justify-center">
                <Text style={styles.noClipText} className="text-[#FFFFFF]">No clip captured.</Text>
              </View>
            )}

            <View style={styles.roomNameCard} className="absolute">
              <Text style={styles.roomNameTitle} className="font-bold">What room is this?</Text>
              <TextInput
                style={styles.roomNameInput}
                placeholder="Room Name"
                placeholderTextColor={colors.slate[500]}
                value={roomName}
                onChangeText={setRoomName}
               className="border-[1px]"/>
              <AppButton
                title="Proceed to Next Room"
                onPress={handleProceedToNextRoom}
                size="large"
                fullwidth
              />
              <Pressable style={styles.retakeLink} onPress={handleRetakeCurrent} className="items-center">
                <Text style={styles.retakeLinkText} className="font-medium">Retake This Clip</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showFinishModal} transparent animationType="fade">
        <View  className="flex-1 bg-[rgba(0,0,0,0.85)]">
          <View  className="flex-1">
            {currentVideoUri ? (
              <VideoPreview uri={currentVideoUri} className="w-full h-full" />
            ) : (
              <View  className="flex-1 items-center justify-center">
                <Text style={styles.noClipText} className="text-[#FFFFFF]">No clip captured.</Text>
              </View>
            )}

            <View style={styles.roomNameCard} className="absolute">
              <Text style={styles.roomNameTitle} className="font-bold">Finish Tour</Text>
              <Text style={styles.roomNameDescription}>
                Name this last room before finishing.
              </Text>
              <TextInput
                style={styles.roomNameInput}
                placeholder="Room Name"
                placeholderTextColor={colors.slate[500]}
                value={roomName}
                onChangeText={setRoomName}
               className="border-[1px]"/>
              <AppButton
                title="Save and Finish"
                onPress={handleUploadTour}
                size="large"
                fullwidth
              />
              <Pressable style={styles.retakeLink} onPress={handleRetakeCurrent} className="items-center">
                <Text style={styles.retakeLinkText} className="font-medium">Retake This Clip</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {backgroundColor: colors.background},
    instructionsContainer: {paddingTop: RFValue(32)},
    title: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(24)},
    instructionsList: {gap: RFValue(16)},
    instructionItem: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(21),
    },
    buttonGroup: {
      gap: RFValue(12),
      paddingVertical: RFValue(16),
    },
    skipButton: {paddingVertical: RFValue(12)},
    skipText: {fontSize: RFValue(15),
color: colors.slate[600]},
    uploadContainer: {paddingTop: RFValue(32)},
    uploadTitle: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(12)},
    uploadDescription: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      marginBottom: RFValue(24),
    },
    uploadStatusContainer: {
      padding: RFValue(16),
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
    },
    uploadStatusRow: {gap: RFValue(8)},
    uploadText: {fontSize: RFValue(14),
color: colors.slate[650]},
    cameraContainer: {},
    camera: {},
    exitButton: {top: RFValue(50),
right: RFValue(16),
paddingHorizontal: RFValue(12),
paddingVertical: RFValue(8),
borderRadius: RFValue(20),
gap: RFValue(6)},
    exitIcon: {width: RFValue(16),
height: RFValue(16)},
    exitText: {fontSize: RFValue(13)},
    cameraOverlay: {top: RFValue(120),
gap: RFValue(16),
paddingHorizontal: RFValue(20)},
    cameraInstruction: {fontSize: RFValue(14)},
    timerContainer: {paddingHorizontal: RFValue(12),
paddingVertical: RFValue(6),
borderRadius: RFValue(20),
gap: RFValue(8)},
    recordingDot: {width: RFValue(10),
height: RFValue(10),
borderRadius: RFValue(6)},
    timerText: {fontSize: RFValue(15)},
    preparingOverlay: {gap: RFValue(8)},
    preparingText: {fontSize: RFValue(13)},
    cameraBottomButtons: {bottom: RFValue(32),
left: RFValue(20),
right: RFValue(20),
gap: RFValue(10)},
    modalOverlay: {},
    cameraPreview: {},
    previewImage: {},
    noClipContainer: {},
    noClipText: {fontSize: RFValue(14)},
    roomNameCard: {bottom: RFValue(48),
left: RFValue(20),
right: RFValue(20),
backgroundColor: colors.background,
borderRadius: RFValue(16),
padding: RFValue(16),
gap: RFValue(12)},
    roomNameTitle: {fontSize: RFValue(19),
color: colors.slate[650]},
    roomNameDescription: {
      fontSize: RFValue(13),
      color: colors.slate[600],
    },
    roomNameInput: {borderColor: colors.slate[300],
borderRadius: RFValue(10),
paddingHorizontal: RFValue(12),
paddingVertical: RFValue(12),
color: colors.slate[650]},
    retakeLink: {paddingVertical: RFValue(4)},
    retakeLinkText: {fontSize: RFValue(14),
color: colors.slate[600]},
    bottomButtons: {
      marginTop: RFValue(20),
      gap: RFValue(12),
    },
    retakeButton: {gap: RFValue(8),
paddingVertical: RFValue(10)},
    retakeIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[600],
    },
    retakeText: {fontSize: RFValue(14),
color: colors.slate[600]},
    previewIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
  });

export default VirtualTourSubstep;
