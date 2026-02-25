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
import { CameraView, useCameraPermissions } from "expo-camera";
import { Audio, Video } from "expo-av";
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

const VirtualTourSubstep: React.FC<VirtualTourSubstepProps> = ({
  onNext,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, spaceForm } = useSpaceStore();
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView>(null);
  const recordingPromiseRef = useRef<Promise<{ uri: string } | undefined> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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
    if (!cameraRef.current || isRecording) return;

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
      Alert.alert("Recording Error", "Unable to record video. Please try again.");
    } finally {
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

    const audioPermission = await Audio.requestPermissionsAsync();
    if (!audioPermission.granted) {
      Alert.alert(
        "Permission Required",
        "Audio permission is required for recording.",
      );
      return;
    }

    setShowInstructions(false);
    setShowCamera(true);
    setIsPreparingCamera(true);
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
    setShowCamera(true);
    setIsPreparingCamera(true);
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
    setShowCamera(true);
    setIsPreparingCamera(true);
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
    <View style={styles.container}>
      {showInstructions && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.title}>
            Please follow the instructions to take a 360 view.
          </Text>
          <View style={styles.instructionsList}>
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
            <Pressable style={styles.skipButton} onPress={onNext}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>
        </View>
      )}

      {hasTour &&
        !showInstructions &&
        !showCamera &&
        !showFinishModal &&
        !showRoomNameModal && (
          <View style={styles.uploadContainer}>
            <Text style={styles.uploadTitle}>Virtual tour ready</Text>
            <Text style={styles.uploadDescription}>
              {(spaceForm.value.tour ?? []).length} room clip(s) added.
            </Text>

            <View style={styles.uploadStatusContainer}>
              <View style={styles.uploadStatusRow}>
                <Image
                  source={require("@/assets/icons/Video - Iconly Pro.png")}
                  style={styles.previewIcon}
                />
                <Text style={styles.uploadText}>Uploaded locally</Text>
              </View>
            </View>

            <View style={styles.bottomButtons}>
              <AppButton title="Next" onPress={onNext} size="large" fullwidth />
              <Pressable style={styles.retakeButton} onPress={handleRetakeAll}>
                <Image
                  source={require("@/assets/icons/return.png")}
                  style={styles.retakeIcon}
                />
                <Text style={styles.retakeText}>Retake All</Text>
              </Pressable>
            </View>
          </View>
        )}

      <Modal visible={showCamera} animationType="fade">
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            videoQuality="1080p"
            onCameraReady={startRecording}
          >
            <Pressable style={styles.exitButton} onPress={handleExitTour}>
              <Image
                source={require("@/assets/icons/close-contained.png")}
                style={styles.exitIcon}
              />
              <Text style={styles.exitText}>Exit tour</Text>
            </Pressable>

            <View style={styles.cameraOverlay}>
              <Text style={styles.cameraInstruction}>
                Rotate slowly and keep your phone steady.
              </Text>
              <View style={styles.timerContainer}>
                <View style={styles.recordingDot} />
                <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
              </View>
            </View>

            {isPreparingCamera && (
              <View style={styles.preparingOverlay}>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={styles.preparingText}>Preparing camera...</Text>
              </View>
            )}

            <View style={styles.cameraBottomButtons}>
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
          </CameraView>
        </View>
      </Modal>

      <Modal visible={showRoomNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.cameraPreview}>
            {currentVideoUri ? (
              <Video
                source={{ uri: currentVideoUri }}
                style={styles.previewImage}
                shouldPlay={false}
                isLooping
              />
            ) : (
              <View style={styles.noClipContainer}>
                <Text style={styles.noClipText}>No clip captured.</Text>
              </View>
            )}

            <View style={styles.roomNameCard}>
              <Text style={styles.roomNameTitle}>What room is this?</Text>
              <TextInput
                style={styles.roomNameInput}
                placeholder="Room Name"
                placeholderTextColor={colors.slate[500]}
                value={roomName}
                onChangeText={setRoomName}
              />
              <AppButton
                title="Proceed to Next Room"
                onPress={handleProceedToNextRoom}
                size="large"
                fullwidth
              />
              <Pressable style={styles.retakeLink} onPress={handleRetakeCurrent}>
                <Text style={styles.retakeLinkText}>Retake This Clip</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showFinishModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.cameraPreview}>
            {currentVideoUri ? (
              <Video
                source={{ uri: currentVideoUri }}
                style={styles.previewImage}
                shouldPlay={false}
                isLooping
              />
            ) : (
              <View style={styles.noClipContainer}>
                <Text style={styles.noClipText}>No clip captured.</Text>
              </View>
            )}

            <View style={styles.roomNameCard}>
              <Text style={styles.roomNameTitle}>Finish Tour</Text>
              <Text style={styles.roomNameDescription}>
                Name this last room before finishing.
              </Text>
              <TextInput
                style={styles.roomNameInput}
                placeholder="Room Name"
                placeholderTextColor={colors.slate[500]}
                value={roomName}
                onChangeText={setRoomName}
              />
              <AppButton
                title="Save and Finish"
                onPress={handleUploadTour}
                size="large"
                fullwidth
              />
              <Pressable style={styles.retakeLink} onPress={handleRetakeCurrent}>
                <Text style={styles.retakeLinkText}>Retake This Clip</Text>
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
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    instructionsContainer: {
      flex: 1,
      paddingTop: RFValue(32),
    },
    title: {
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(24),
    },
    instructionsList: {
      gap: RFValue(16),
      flex: 1,
    },
    instructionItem: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(21),
    },
    buttonGroup: {
      gap: RFValue(12),
      paddingVertical: RFValue(16),
    },
    skipButton: {
      alignItems: "center",
      paddingVertical: RFValue(12),
    },
    skipText: {
      fontSize: RFValue(15),
      color: colors.slate[600],
      fontWeight: "500",
    },
    uploadContainer: {
      flex: 1,
      paddingTop: RFValue(32),
    },
    uploadTitle: {
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(12),
    },
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
    uploadStatusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(8),
    },
    uploadText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
    },
    cameraContainer: {
      flex: 1,
      backgroundColor: "#000000",
    },
    camera: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    exitButton: {
      position: "absolute",
      top: RFValue(50),
      right: RFValue(16),
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(8),
      borderRadius: RFValue(20),
      gap: RFValue(6),
    },
    exitIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: "#FFFFFF",
    },
    exitText: {
      fontSize: RFValue(13),
      color: "#FFFFFF",
      fontWeight: "500",
    },
    cameraOverlay: {
      position: "absolute",
      top: RFValue(120),
      left: 0,
      right: 0,
      alignItems: "center",
      gap: RFValue(16),
      paddingHorizontal: RFValue(20),
    },
    cameraInstruction: {
      fontSize: RFValue(14),
      color: "#FFFFFF",
      textAlign: "center",
    },
    timerContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(6),
      borderRadius: RFValue(20),
      gap: RFValue(8),
    },
    recordingDot: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(6),
      backgroundColor: "#EF4444",
    },
    timerText: {
      fontSize: RFValue(15),
      color: "#FFFFFF",
      fontWeight: "600",
    },
    preparingOverlay: {
      position: "absolute",
      alignSelf: "center",
      top: "45%",
      alignItems: "center",
      gap: RFValue(8),
    },
    preparingText: {
      color: "#FFFFFF",
      fontSize: RFValue(13),
    },
    cameraBottomButtons: {
      position: "absolute",
      bottom: RFValue(32),
      left: RFValue(20),
      right: RFValue(20),
      gap: RFValue(10),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.85)",
    },
    cameraPreview: {
      flex: 1,
    },
    previewImage: {
      width: "100%",
      height: "100%",
    },
    noClipContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    noClipText: {
      color: "#FFFFFF",
      fontSize: RFValue(14),
    },
    roomNameCard: {
      position: "absolute",
      bottom: RFValue(48),
      left: RFValue(20),
      right: RFValue(20),
      backgroundColor: colors.background,
      borderRadius: RFValue(16),
      padding: RFValue(16),
      gap: RFValue(12),
    },
    roomNameTitle: {
      fontSize: RFValue(19),
      fontWeight: "700",
      color: colors.slate[650],
    },
    roomNameDescription: {
      fontSize: RFValue(13),
      color: colors.slate[600],
    },
    roomNameInput: {
      borderWidth: 1,
      borderColor: colors.slate[300],
      borderRadius: RFValue(10),
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(12),
      color: colors.slate[650],
    },
    retakeLink: {
      alignItems: "center",
      paddingVertical: RFValue(4),
    },
    retakeLinkText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      fontWeight: "500",
    },
    bottomButtons: {
      marginTop: RFValue(20),
      gap: RFValue(12),
    },
    retakeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: RFValue(8),
      paddingVertical: RFValue(10),
    },
    retakeIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[600],
    },
    retakeText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      fontWeight: "500",
    },
    previewIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
  });

export default VirtualTourSubstep;
