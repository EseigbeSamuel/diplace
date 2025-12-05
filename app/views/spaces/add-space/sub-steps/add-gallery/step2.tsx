import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Audio, Video } from "expo-av";
import * as FileSystem from "expo-file-system";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { TourVideo } from "@/types/add-space-types";
import { useSpaceStore } from "@/store/useSpace";

interface VirtualTourSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const VirtualTourSubstep: React.FC<VirtualTourSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { spaceForm, setValue } = useSpaceStore();

  // States
  const [showInstructions, setShowInstructions] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [showRoomNameModal, setShowRoomNameModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(60);
  const [roomName, setRoomName] = useState("");
  const [currentVideoUri, setCurrentVideoUri] = useState("");
  // const [tours, setTours] = useState<TourVideo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Refs
  const cameraRef = useRef<CameraView>(null);
  const recordingRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  // Permissions
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showCamera) {
      const timer = setTimeout(() => {
        if (cameraRef.current) {
          startRecording();
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [showCamera]);

  useEffect(() => {
    if (showCamera) {
      setTimeout(() => {
        console.log("cameraRef:", cameraRef.current);
      }, 500);
    }
  }, [showCamera]);

  const handleBeginTour = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Permission Required",
          "Camera permission is needed for virtual tour"
        );
        return;
      }
    }

    // Request audio permission
    const audioPermission = await Audio.requestPermissionsAsync();
    if (!audioPermission.granted) {
      Alert.alert(
        "Permission Required",
        "Audio permission is needed for recording"
      );
      return;
    }

    setShowInstructions(false);
    setShowCamera(true);
  };

  const startRecording = async () => {
    if (!cameraRef.current) {
      console.log("Camera not ready yet");
      return;
    }

    try {
      setIsRecording(true);
      setRecordingTime(60);

      const recordingPromise = cameraRef.current.recordAsync({
        maxDuration: 60,
      });

      // Save this promise so stopRecording can wait for it
      recordingRef.current = recordingPromise;

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev <= 1) {
            if (isRecording) {
              stopRecording();
              setShowRoomNameModal(true);
            }
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // WAIT FOR RESULT
      // const video = await recordingPromise;

      // console.log("DONE:", video);
      // setCurrentVideoUri(video?.uri);
      // setIsRecording(false);
      // setShowCamera(false);
      // setShowRoomNameModal(true);
    } catch (e) {
      console.log("Recording error:", e);
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) {
      console.log("No active recording to stop");
      return;
    }

    try {
      await cameraRef.current.stopRecording();
      console.log("recording stopped");
    } catch (e) {
      console.log("Stop error:", e);
    }

    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const handleProceedToNextRoom = () => {
    if (!roomName.trim()) {
      Alert.alert("Room Name Required", "Please enter a name for this room");
      return;
    }

    // Save tour
    const newTour: TourVideo = {
      uri: currentVideoUri,
      roomName: roomName,
      duration: 60 - recordingTime,
    };

    setValue({ tour: [...(spaceForm.value.tour || []), newTour] });
    setRoomName("");
    setShowRoomNameModal(false);

    // Start recording next room
    setShowCamera(true);
    startRecording();
  };

  const handleRetake = () => {
    setRoomName("");
    setShowRoomNameModal(false);
    setShowCamera(true);
    startRecording();
  };

  const handleFinishTour = () => {
    setShowRoomNameModal(false);
    setShowFinishModal(true);
  };

  const handleUploadTour = async () => {
    if (!roomName.trim()) {
      Alert.alert("Room Name Required", "Please enter a name for this room");
      return;
    }

    setShowFinishModal(false);
    setShowCamera(false);

    // Save final tour
    const newTour: TourVideo = {
      uri: currentVideoUri,
      roomName: roomName,
      duration: 60 - recordingTime,
    };

    const allTours = [...(spaceForm.value.tour ?? []), newTour];
    setValue({ tour: allTours });
    setRoomName("");

    // Simulate upload
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleRetakeAll = () => {
    setValue({ tour: [] });
    setShowFinishModal(false);
    setShowInstructions(true);
  };

  const handleExitTour = () => {
    setShowCamera(false);
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
    setValue({ tour: [] });
    setShowInstructions(true);
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
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

  return (
    <View style={styles.container}>
      {/* Instructions Screen */}
      {showInstructions && !isUploading && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.title}>
            Please follow the instructions to take a 360° view.
          </Text>

          <View style={styles.instructionsList}>
            <Text style={styles.instructionItem}>
              1. Prepare the space — clean, well-lit, clutter-free.
            </Text>
            <Text style={styles.instructionItem}>
              2. Use portrait mode at chest level.
            </Text>
            <Text style={styles.instructionItem}>
              3. Start from the entrance, rotate slowly for 360° coverage.
            </Text>
            <Text style={styles.instructionItem}>
              4. Capture all rooms, including kitchens, bathrooms, any unique
              features.
            </Text>
            <Text style={styles.instructionItem}>
              5. Highlight key features (balcony, fittings, parking, etc.).
            </Text>
            <Text style={styles.instructionItem}>
              6. Keep videos smooth, stable, and under 60 seconds per room.
            </Text>
            <Text style={styles.instructionItem}>
              7. Review before uploading to ensure clarity and quality.
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <AppButton
              title="Begin Virtual Tour"
              onPress={handleBeginTour}
              size="large"
              fullwidth={true}
              afterIcon={require("@/assets/icons/Camera - Iconly Pro-1.png")}
            />
            <Pressable style={styles.skipButton} onPress={onNext}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Upload Progress Screen */}
      {isUploading && (
        <View style={styles.uploadContainer}>
          <Text style={styles.uploadTitle}>Take a virtual tour</Text>
          <Text style={styles.uploadDescription}>
            Simulate a virtual tour of this property to give renters a real life
            feel of the place. Please follow the instructions to upload a
            virtual tour.
          </Text>

          <View style={styles.uploadStatusContainer}>
            <View>
              <View style={styles.uploadStatusRow}>
                <Text style={styles.uploadStatusText}>Virtual Tour</Text>
              </View>
              <View style={styles.uploadProgressContainer}>
                <ActivityIndicator />
                <Text style={styles.uploadProgressText}>Uploading</Text>
              </View>
            </View>
            <Pressable style={styles.cancelButton} onPress={handleCancelUpload}>
              <Image
                source={require("@/assets/icons/X-close.png")}
                style={styles.cancelIcon}
              />
              <Text style={styles.cancelButton}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Uploaded Success Screen */}
      {spaceForm.value.tour &&
        spaceForm.value.tour.length > 0 &&
        !isUploading &&
        !showInstructions &&
        !showCamera && (
          <View style={styles.uploadContainer}>
            <Text style={styles.uploadTitle}>Take a virtual tour</Text>
            <Text style={styles.uploadDescription}>
              Simulate a virtual tour of this property to give renters a real
              life feel of the place. Please follow the instructions to upload a
              virtual tour.
            </Text>

            <View style={styles.uploadStatusContainer}>
              <View>
                <View style={styles.uploadStatusRow}>
                  <Text style={styles.uploadStatusText}>Virtual Tour</Text>
                </View>
                <Pressable style={styles.previewButton}>
                  <Image
                    source={require("@/assets/icons/Video - Iconly Pro.png")}
                    style={styles.previewIcon}
                  />
                  <Text style={styles.uploadText}>Uploaded</Text>
                </Pressable>
              </View>
              <Pressable style={styles.previewButton}>
                <Image
                  source={require("@/assets/icons/play-outline.png")}
                  style={styles.previewIcon}
                />
                <Text style={styles.previewText}>Preview</Text>
              </Pressable>
            </View>

            <View style={styles.bottomButtons}>
              <AppButton
                title="Next"
                onPress={onNext}
                size="large"
                fullwidth={true}
              />
              <Pressable style={styles.retakeButton} onPress={handleRetakeAll}>
                <Image
                  source={require("@/assets/icons/return.png")}
                  style={styles.retakeIcon}
                />
                <Text style={styles.retakeText}>Retake This?</Text>
              </Pressable>
            </View>
          </View>
        )}

      {/* Camera View Modal */}
      <Modal visible={showCamera} animationType="fade">
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1, width: "100%", height: "100%" }}
            videoQuality="1080p"
            facing="back"
            onCameraReady={startRecording}
            // enableZoomGesture
            enableTorch={false}
            // enableFocus={true}
            // enableRecording={true}
          >
            {/* Exit Button */}
            <Pressable style={styles.exitButton} onPress={handleExitTour}>
              <Image
                source={require("@/assets/icons/close-contained.png")}
                style={styles.exitIcon}
              />
              <Text style={styles.exitText}>Exit tour</Text>
            </Pressable>

            {/* Instructions Overlay */}
            <View style={styles.cameraOverlay}>
              <Text style={styles.cameraInstruction}>
                Keep your camera steady and rotate slowly for 360° view.
              </Text>

              {/* Timer */}
              <View style={styles.timerContainer}>
                <View style={styles.recordingDot} />
                <Text style={styles.timerText}>
                  {formatTime(recordingTime)}
                </Text>
              </View>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.cameraBottomButtons}>
              <Pressable
                style={styles.nextRoomButton}
                onPress={() => {
                  stopRecording();
                  setTimeout(() => setShowRoomNameModal(true), 500);
                }}
                disabled={!isRecording}
              >
                <Text style={styles.nextRoomText}>Next Room</Text>
                <Image source={require("@/assets/icons/chevron-right.png")} />
              </Pressable>

              <Pressable
                style={styles.finishTourButton}
                onPress={() => {
                  stopRecording();
                  setTimeout(() => setShowFinishModal(true), 500);
                }}
              >
                <Text style={styles.finishTourText}>Finish Tour</Text>
              </Pressable>
            </View>
          </CameraView>
        </View>
      </Modal>

      {/* Room Name Modal */}
      <Modal visible={showRoomNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.cameraPreview}>
            {currentVideoUri && (
              <Video
                source={{ uri: currentVideoUri }}
                style={styles.previewImage}
                // resizeMode="cover"
                shouldPlay={false}
                isLooping
              />
            )}

            {/* Overlay content */}
            <View style={styles.cameraOverlay}>
              <Text style={styles.cameraInstruction}>
                Keep your camera steady and rotate slowly for 360° view.
              </Text>

              <View style={styles.timerContainer}>
                <View style={styles.recordingDot} />
                <Text style={styles.timerText}>
                  {formatTime(60 - recordingTime)}
                </Text>
              </View>
            </View>

            {/* Room Name Card */}
            <View style={styles.roomNameCard}>
              <Text style={styles.roomNameTitle}>What Is This Room?</Text>
              <Text style={styles.roomNameDescription}>
                Give this room a title for easy identification (e.g Sitting
                room, bedroom, kitchen etc.)
              </Text>
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
                fullwidth={true}
              />
              <Pressable style={styles.retakeLink} onPress={handleRetake}>
                <Text style={styles.retakeLinkText}>Retake This?</Text>
              </Pressable>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.previewBottomButtons}>
              <Pressable
                style={styles.nextRoomButtonAlt}
                onPress={handleProceedToNextRoom}
              >
                <Text style={styles.nextRoomText}>Next Room</Text>
                <Image
                  source={require("@/assets/icons/arrow-right-light.png")}
                  style={styles.nextRoomArrow}
                />
              </Pressable>

              <Pressable
                style={styles.finishTourButton}
                onPress={handleFinishTour}
              >
                <Text style={styles.finishTourText}>Finish Tour</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Finish Modal */}
      <Modal visible={showFinishModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.cameraPreview}>
            {currentVideoUri && (
              <Video
                source={{ uri: currentVideoUri }}
                style={styles.previewImage}
                // resizeMode="cover"
                shouldPlay={false}
                isLooping
              />
            )}

            <View style={styles.cameraOverlay}>
              <Text style={styles.cameraInstruction}>
                Keep your camera steady and rotate slowly for 360° view.
              </Text>

              <View style={styles.timerContainer}>
                <View style={styles.recordingDot} />
                <Text style={styles.timerText}>
                  {formatTime(60 - recordingTime)}
                </Text>
              </View>
            </View>

            <View style={styles.roomNameCard}>
              <Text style={styles.roomNameTitle}>Finish Tour?</Text>
              <Text style={styles.roomNameDescription}>
                Give this room a title for easy identification (e.g Sitting
                room, bedroom, kitchen etc.)
              </Text>
              <TextInput
                style={styles.roomNameInput}
                placeholder="Room Name"
                placeholderTextColor={colors.slate[500]}
                value={roomName}
                onChangeText={setRoomName}
              />
              <AppButton
                title="Upload Tour"
                onPress={handleUploadTour}
                size="large"
                fullwidth={true}
              />
              <Pressable style={styles.retakeLink} onPress={handleRetake}>
                <Text style={styles.retakeLinkText}>Retake This?</Text>
              </Pressable>
            </View>

            <View style={styles.previewBottomButtons}>
              <Pressable
                style={styles.nextRoomButtonAlt}
                onPress={handleProceedToNextRoom}
              >
                <Text style={styles.nextRoomText}>Next Room</Text>
                <Image
                  source={require("@/assets/icons/arrow-right-light.png")}
                  style={styles.nextRoomArrow}
                />
              </Pressable>

              <Pressable
                style={styles.finishTourButton}
                onPress={handleUploadTour}
              >
                <Text style={styles.finishTourText}>Finish Tour</Text>
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
      lineHeight: RFValue(28),
      marginBottom: RFValue(24),
    },
    instructionsList: {
      flex: 1,
      gap: RFValue(16),
    },
    instructionItem: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(22),
    },
    buttonGroup: {
      paddingVertical: RFValue(20),
      gap: RFValue(12),
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
    cameraContainer: {
      flex: 1,
      backgroundColor: "#000",
    },
    camera: {
      flex: 1,
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
      textShadowColor: "rgba(0, 0, 0, 0.75)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    timerContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(8),
      borderRadius: RFValue(20),
      gap: RFValue(8),
    },
    recordingDot: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: "#EF4444",
    },
    timerText: {
      fontSize: RFValue(16),
      color: "#FFFFFF",
      fontWeight: "600",
    },
    cameraBottomButtons: {
      position: "absolute",
      bottom: RFValue(40),
      left: RFValue(20),
      right: RFValue(20),
      gap: RFValue(12),
    },
    nextRoomButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
      paddingVertical: RFValue(16),
      borderRadius: RFValue(12),
      gap: RFValue(8),
    },
    nextRoomButtonAlt: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
      paddingVertical: RFValue(16),
      borderRadius: RFValue(12),
      gap: RFValue(8),
    },
    nextRoomText: {
      fontSize: RFValue(16),
      color: colors.slate[650],
      fontWeight: "600",
    },
    nextRoomArrow: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    finishTourButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.slate[650],
      paddingVertical: RFValue(16),
      borderRadius: RFValue(12),
    },
    finishTourText: {
      fontSize: RFValue(16),
      color: "#FFFFFF",
      fontWeight: "600",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    cameraPreview: {
      flex: 1,
      position: "relative",
    },
    previewImage: {
      width: "100%",
      height: "100%",
    },
    roomNameCard: {
      position: "absolute",
      bottom: RFValue(200),
      left: RFValue(20),
      right: RFValue(20),
      backgroundColor: colors.background,
      borderRadius: RFValue(16),
      padding: RFValue(20),
      gap: RFValue(16),
    },
    roomNameTitle: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[650],
    },
    roomNameDescription: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      lineHeight: RFValue(18),
    },
    roomNameInput: {
      paddingVertical: RFValue(14),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.background,
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    retakeLink: {
      alignItems: "center",
      paddingVertical: RFValue(8),
    },
    retakeLinkText: {
      fontSize: RFValue(15),
      color: colors.slate[600],
      fontWeight: "500",
    },
    previewBottomButtons: {
      position: "absolute",
      bottom: RFValue(40),
      left: RFValue(20),
      right: RFValue(20),
      gap: RFValue(12),
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
      lineHeight: RFValue(20),
      marginBottom: RFValue(32),
    },
    uploadStatusContainer: {
      padding: RFValue(16),
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    uploadStatusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(12),
      marginBottom: RFValue(4),
    },
    uploadIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    uploadStatusText: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
    uploadProgressContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: RFValue(8),
    },
    uploadProgressText: {
      fontSize: RFValue(13),
      paddingLeft: 2,
      color: colors.slate[600],
    },
    cancelIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.error[200],
    },
    progressBar: {
      height: RFValue(6),
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(3),
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.info[200],
      borderRadius: RFValue(3),
    },
    cancelButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(2),
      color: colors.error[200],
    },
    previewButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
    },
    previewIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    previewText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
    },
    uploadText: {
      fontSize: RFValue(14),
      color: colors.slate[550],
      fontWeight: "500",
    },
    bottomButtons: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: RFValue(16),
      backgroundColor: colors.background,
      gap: RFValue(12),
    },
    retakeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: RFValue(12),
      gap: RFValue(8),
    },
    retakeIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[600],
    },
    retakeText: {
      fontSize: RFValue(15),
      color: colors.slate[600],
      fontWeight: "500",
    },
  });

export default VirtualTourSubstep;
