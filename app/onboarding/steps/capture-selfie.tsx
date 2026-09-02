import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useInitiateVerification } from "@/hooks";
import { uploadAssets } from "@/services/upload";
import { ColorScheme } from "@/utils";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type SelfieProps = {
  onNext: () => void;
  handleBack: () => void;
};

const AUTO_CAPTURE_SECONDS = 3;

const SelfieVerificationStep = ({ onNext, handleBack }: SelfieProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const [permission, requestPermission] = useCameraPermissions();
  const hasPermission = permission?.granted ?? false;
  const cameraRef = useRef<CameraView | null>(null);
  const captureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_CAPTURE_SECONDS);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { initiateVerificationMutation, initiateVerificationPending } =
    useInitiateVerification();

  const clearCaptureTimer = () => {
    if (captureTimerRef.current) {
      clearTimeout(captureTimerRef.current);
      captureTimerRef.current = null;
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady || isCapturing || capturedPhoto) {
      return;
    }

    try {
      setIsCapturing(true);
      clearCaptureTimer();
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
      });

      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
      }
    } catch {
      Alert.alert("Camera Error", "We couldn't capture the selfie. Try again.");
      setCountdown(AUTO_CAPTURE_SECONDS);
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    if (!hasPermission || !cameraReady || capturedPhoto || isCapturing) {
      clearCaptureTimer();
      return;
    }

    if (countdown <= 0) {
      takePicture();
      return;
    }

    captureTimerRef.current = setTimeout(() => {
      setCountdown((currentCountdown) => currentCountdown - 1);
    }, 1000);

    return clearCaptureTimer;
  }, [hasPermission, cameraReady, capturedPhoto, isCapturing, countdown]);

  const requestCameraPermission = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        "Permission Required",
        "Camera access is needed to take your selfie.",
      );
    }
  };

  const retakePhoto = () => {
    clearCaptureTimer();
    setCapturedPhoto(null);
    setCountdown(AUTO_CAPTURE_SECONDS);
  };

  const handleContinue = async () => {
    if (!capturedPhoto) return;

    try {
      setIsUploading(true);
      const [selfieUrl] = await uploadAssets(
        [
          {
            uri: capturedPhoto,
            type: "image/jpeg",
            name: `selfie-${Date.now()}.jpg`,
          },
        ],
        "selfie-verification",
      );

      if (!selfieUrl) {
        Alert.alert("Upload Failed", "We couldn't upload your selfie. Try again.");
        return;
      }

      await initiateVerificationMutation({
        verification_type: "face",
        value: selfieUrl,
      });
      onNext();
    } catch {
      Alert.alert("Upload Failed", "We couldn't upload your selfie. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!hasPermission) {
    return (
      <SafeAreaViewContainer>
        <View style={Styles.permissionContainer}>
          <View style={Styles.contentContainer}>
            <Image
              source={require("@/assets/icons/Camera - Iconly Pro.png")}
              style={Styles.permissionIcon}
              resizeMode="contain"
            />
            <Text style={Styles.headText}>Camera Access Required</Text>
            <Text style={Styles.descriptionText}>
              Please allow camera access so we can take your verification
              selfie.
            </Text>
          </View>

          <View style={Styles.buttonContainer}>
            <AppButton
              title="Allow Camera"
              onPress={requestCameraPermission}
              fullwidth
              size="large"
            />
          </View>
        </View>
      </SafeAreaViewContainer>
    );
  }

  if (capturedPhoto) {
    return (
      <View style={Styles.container}>
        <View style={Styles.previewContainer}>
          <Image
            source={{ uri: capturedPhoto }}
            style={Styles.previewImage}
            resizeMode="cover"
          />
          <View style={Styles.previewOverlay}>
            <Text style={Styles.previewText}>
              Perfect! Let&apos;s use this selfie.
            </Text>
          </View>
        </View>

        <View style={Styles.buttonContainer}>
          <View style={Styles.buttonRow}>
            <TouchableOpacity
              style={Styles.retakeButton}
              onPress={retakePhoto}
              disabled={initiateVerificationPending || isUploading}
            >
              <Text style={Styles.retakeText}>Retake</Text>
            </TouchableOpacity>

            <View style={Styles.continueButtonWrapper}>
              <AppButton
                title="Continue"
                onPress={handleContinue}
                size="large"
                disabled={initiateVerificationPending || isUploading}
              />
            </View>
          </View>
          {(initiateVerificationPending || isUploading) && (
            <View style={Styles.pendingOverlay}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={Styles.pendingText}>
                {isUploading ? "Uploading selfie..." : "Starting verification..."}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={Styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={Styles.camera}
        facing="front"
        mode="picture"
        mirror
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={Styles.cameraOverlay}>
          <View style={Styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              style={Styles.backButton}
              disabled={isCapturing}
            >
              <Image
                source={require("@/assets/icons/arrow-left-dark.png")}
                style={Styles.backIcon}
              />
            </TouchableOpacity>
            <Text style={Styles.headerTitle}>Take a selfie</Text>
            <View style={Styles.headerSpacer} />
          </View>

          <View style={Styles.faceGuideContainer}>
            <View style={[Styles.faceOval, isCapturing && Styles.faceOvalReady]}>
              <Text style={Styles.countdownText}>
                {isCapturing ? "" : countdown}
              </Text>
            </View>
            <View style={Styles.statusChip}>
              <Text style={Styles.statusText}>
                {isCapturing
                  ? "Capturing..."
                  : cameraReady
                    ? "Center your face. Auto-capturing soon."
                    : "Preparing camera..."}
              </Text>
            </View>
          </View>

          <View style={Styles.bottomControls}>
            <TouchableOpacity
              style={Styles.captureButton}
              onPress={takePicture}
              disabled={!cameraReady || isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator color="#111827" />
              ) : (
                <View style={Styles.captureButtonInner} />
              )}
            </TouchableOpacity>
            <Text style={Styles.manualText}>Tap button if auto-capture misses</Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default SelfieVerificationStep;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingBottom: RFValue(20),
    },
    permissionContainer: {
      flex: 1,
      justifyContent: "space-between",
      paddingBottom: RFValue(20),
    },
    contentContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: RFValue(16),
      paddingHorizontal: RFValue(20),
    },
    permissionIcon: {
      height: RFValue(76),
      tintColor: colors.slate[650],
      width: RFValue(76),
    },
    headText: {
      color: colors.slate[650],
      fontSize: RFValue(24),
      fontWeight: "600",
      lineHeight: RFValue(32),
      textAlign: "center",
    },
    descriptionText: {
      color: colors.slate[600],
      fontSize: RFValue(14),
      lineHeight: RFValue(22),
      textAlign: "center",
    },
    buttonContainer: {
      paddingHorizontal: RFValue(20),
      marginTop: RFValue(20),
    },
    buttonRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: RFValue(12),
    },
    retakeButton: {
      paddingHorizontal: RFValue(24),
      paddingVertical: RFValue(14),
    },
    retakeText: {
      color: colors.slate[600],
      fontSize: RFValue(16),
      fontWeight: "500",
    },
    continueButtonWrapper: {
      flex: 1,
    },
    cameraContainer: {
      bottom: 0,
      left: 0,
      position: "absolute",
      right: 0,
      top: -50,
    },
    camera: {
      flex: 1,
    },
    cameraOverlay: {
      backgroundColor: "transparent",
      flex: 1,
      justifyContent: "space-between",
    },
    header: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: RFValue(16),
      paddingTop: RFValue(90),
      zIndex: 2,
    },
    backButton: {
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      borderRadius: RFValue(25),
      height: RFValue(50),
      justifyContent: "center",
      width: RFValue(50),
    },
    backIcon: {
      height: RFValue(24),
      tintColor: "#FFFFFF",
      width: RFValue(24),
    },
    headerTitle: {
      color: "#FFFFFF",
      fontSize: RFValue(18),
      fontWeight: "700",
    },
    headerSpacer: {
      width: RFValue(50),
    },
    faceGuideContainer: {
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
    },
    faceOval: {
      alignItems: "center",
      borderColor: "#FFFFFF",
      borderRadius: RFValue(125),
      borderStyle: "dashed",
      borderWidth: 3,
      height: RFValue(320),
      justifyContent: "center",
      opacity: 0.9,
      width: RFValue(250),
    },
    faceOvalReady: {
      borderColor: "#22c55e",
      opacity: 1,
    },
    countdownText: {
      color: "#FFFFFF",
      fontSize: RFValue(54),
      fontWeight: "800",
      textShadowColor: "rgba(0, 0, 0, 0.45)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: RFValue(8),
    },
    statusChip: {
      alignSelf: "center",
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      borderRadius: RFValue(18),
      marginTop: RFValue(16),
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(8),
    },
    statusText: {
      color: "#FFFFFF",
      fontSize: RFValue(12),
      fontWeight: "600",
      textAlign: "center",
    },
    bottomControls: {
      alignItems: "center",
      gap: RFValue(10),
      paddingBottom: RFValue(44),
    },
    captureButton: {
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderColor: "#FFFFFF",
      borderRadius: RFValue(40),
      borderWidth: 4,
      height: RFValue(80),
      justifyContent: "center",
      width: RFValue(80),
    },
    captureButtonInner: {
      backgroundColor: "#FFFFFF",
      borderRadius: RFValue(32.5),
      height: RFValue(65),
      width: RFValue(65),
    },
    manualText: {
      color: "#FFFFFF",
      fontSize: RFValue(12),
      fontWeight: "500",
    },
    previewContainer: {
      flex: 1,
      position: "relative",
    },
    previewImage: {
      height: "100%",
      width: "100%",
    },
    previewOverlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      bottom: 0,
      left: 0,
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(20),
      position: "absolute",
      right: 0,
    },
    previewText: {
      color: "#FFFFFF",
      fontSize: RFValue(16),
      fontWeight: "600",
      textAlign: "center",
    },
    pendingOverlay: {
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      bottom: 0,
      gap: RFValue(8),
      justifyContent: "center",
      left: 0,
      position: "absolute",
      right: 0,
      top: 0,
    },
    pendingText: {
      color: "#FFFFFF",
      fontSize: RFValue(14),
      fontWeight: "600",
    },
  });
