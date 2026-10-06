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
        <View style={Styles.permissionContainer} className="flex-1 justify-between">
          <View style={Styles.contentContainer} className="flex-1 items-center justify-center">
            <Image
              source={require("@/assets/icons/Camera - Iconly Pro.png")}
              style={Styles.permissionIcon}
              resizeMode="contain"
            />
            <Text style={Styles.headText} className="font-semibold text-center">Camera Access Required</Text>
            <Text style={Styles.descriptionText} className="text-center">
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
      <View style={Styles.container} className="flex-1 justify-between">
        <View  className="flex-1 relative">
          <Image
            source={{ uri: capturedPhoto }}

            resizeMode="cover"
           className="h-[100%px] w-[100%px]"/>
          <View style={Styles.previewOverlay} className="bg-[rgba(0, 0, 0, 0.6)] bottom-[0px] left-[0px] absolute right-[0px]">
            <Text style={Styles.previewText} className="text-[#FFFFFF] font-semibold text-center">
              Perfect! Let&apos;s use this selfie.
            </Text>
          </View>
        </View>

        <View style={Styles.buttonContainer}>
          <View style={Styles.buttonRow} className="items-center flex-row">
            <TouchableOpacity
              style={Styles.retakeButton}
              onPress={retakePhoto}
              disabled={initiateVerificationPending || isUploading}
            >
              <Text style={Styles.retakeText} className="font-medium">Retake</Text>
            </TouchableOpacity>

            <View  className="flex-1">
              <AppButton
                title="Continue"
                onPress={handleContinue}
                size="large"
                disabled={initiateVerificationPending || isUploading}
              />
            </View>
          </View>
          {(initiateVerificationPending || isUploading) && (
            <View style={Styles.pendingOverlay} className="items-center bg-[rgba(0, 0, 0, 0.4)] bottom-[0px] justify-center left-[0px] absolute right-[0px] top-[0px]">
              <ActivityIndicator color="#FFFFFF" />
              <Text style={Styles.pendingText} className="text-[#FFFFFF] font-semibold">
                {isUploading ? "Uploading selfie..." : "Starting verification..."}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={Styles.cameraContainer} className="bottom-[0px] left-[0px] absolute right-[0px]">
      <CameraView
        ref={cameraRef}

        facing="front"
        mode="picture"
        mirror
        onCameraReady={() => setCameraReady(true)}
       className="flex-1">
        <View  className="bg-[transparent] flex-1 justify-between">
          <View style={Styles.header} className="items-center flex-row justify-between z-[2]">
            <TouchableOpacity
              onPress={handleBack}
              style={Styles.backButton}
              disabled={isCapturing}
             className="items-center bg-[rgba(255, 255, 255, 0.25)] justify-center">
              <Image
                source={require("@/assets/icons/arrow-left-dark.png")}
                style={Styles.backIcon}
               className="tint-[#FFFFFF]"/>
            </TouchableOpacity>
            <Text style={Styles.headerTitle} className="text-[#FFFFFF] font-bold">Take a selfie</Text>
            <View style={Styles.headerSpacer} />
          </View>

          <View  className="items-center flex-1 justify-center">
            <View style={[Styles.faceOval, isCapturing && Styles.faceOvalReady]} className="items-center border-[#FFFFFF] border-[3px] justify-center opacity-[0.9] border-style-[dashed]">
              <Text style={Styles.countdownText} className="text-[#FFFFFF] font-[800] text-shadow-color-[rgba(0,_0,_0,_0.45)]">
                {isCapturing ? "" : countdown}
              </Text>
            </View>
            <View style={Styles.statusChip} className="bg-[rgba(0, 0, 0, 0.55)] self-center">
              <Text style={Styles.statusText} className="text-[#FFFFFF] font-semibold text-center">
                {isCapturing
                  ? "Capturing..."
                  : cameraReady
                    ? "Center your face. Auto-capturing soon."
                    : "Preparing camera..."}
              </Text>
            </View>
          </View>

          <View style={Styles.bottomControls} className="items-center">
            <TouchableOpacity
              style={Styles.captureButton}
              onPress={takePicture}
              disabled={!cameraReady || isCapturing}
             className="items-center bg-[rgba(255, 255, 255, 0.3)] border-[#FFFFFF] border-[4px] justify-center">
              {isCapturing ? (
                <ActivityIndicator color="#111827" />
              ) : (
                <View style={Styles.captureButtonInner}  className="bg-[#FFFFFF]"/>
              )}
            </TouchableOpacity>
            <Text style={Styles.manualText} className="text-[#FFFFFF] font-medium">Tap button if auto-capture misses</Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

export default SelfieVerificationStep;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {paddingBottom: RFValue(20)},
    permissionContainer: {paddingBottom: RFValue(20)},
    contentContainer: {gap: RFValue(16),
paddingHorizontal: RFValue(20)},
    permissionIcon: {
      height: RFValue(76),
      tintColor: colors.slate[650],
      width: RFValue(76),
    },
    headText: {color: colors.slate[650],
fontSize: RFValue(24),
lineHeight: RFValue(32)},
    descriptionText: {color: colors.slate[600],
fontSize: RFValue(14),
lineHeight: RFValue(22)},
    buttonContainer: {
      paddingHorizontal: RFValue(20),
      marginTop: RFValue(20),
    },
    buttonRow: {gap: RFValue(12)},
    retakeButton: {
      paddingHorizontal: RFValue(24),
      paddingVertical: RFValue(14),
    },
    retakeText: {color: colors.slate[600],
fontSize: RFValue(16)},
    continueButtonWrapper: {},
    cameraContainer: {top: -50},
    camera: {},
    cameraOverlay: {},
    header: {paddingHorizontal: RFValue(16),
paddingTop: RFValue(90)},
    backButton: {borderRadius: RFValue(25),
height: RFValue(50),
width: RFValue(50)},
    backIcon: {height: RFValue(24),
width: RFValue(24)},
    headerTitle: {fontSize: RFValue(18)},
    headerSpacer: {
      width: RFValue(50),
    },
    faceGuideContainer: {},
    faceOval: {borderRadius: RFValue(125),
height: RFValue(320),
width: RFValue(250)},
    faceOvalReady: {},
    countdownText: {fontSize: RFValue(54),
textShadowOffset: { width: 0, height: 2 },
textShadowRadius: RFValue(8)},
    statusChip: {borderRadius: RFValue(18),
marginTop: RFValue(16),
paddingHorizontal: RFValue(16),
paddingVertical: RFValue(8)},
    statusText: {fontSize: RFValue(12)},
    bottomControls: {gap: RFValue(10),
paddingBottom: RFValue(44)},
    captureButton: {borderRadius: RFValue(40),
height: RFValue(80),
width: RFValue(80)},
    captureButtonInner: {borderRadius: RFValue(32.5),
height: RFValue(65),
width: RFValue(65)},
    manualText: {fontSize: RFValue(12)},
    previewContainer: {},
    previewImage: {},
    previewOverlay: {paddingHorizontal: RFValue(20),
paddingVertical: RFValue(20)},
    previewText: {fontSize: RFValue(16)},
    pendingOverlay: {gap: RFValue(8)},
    pendingText: {fontSize: RFValue(14)},
  });
