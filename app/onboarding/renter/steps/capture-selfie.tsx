import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import {
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
};

const SelfieVerificationStep = ({ onNext }: SelfieProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Request camera permission
  const requestCameraPermission = async () => {
    const status = await requestPermission();
    if (!status.granted) {
      Alert.alert(
        "Permission Required",
        "Camera access is needed to take your selfie."
      );
    }
  };

  // Take photo
  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      setCapturedPhoto(photo.uri);
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  // Handle continue
  const handleContinue = () => {
    if (capturedPhoto) {
      // Save the photo URI to your store/state if needed
      onNext();
    }
  };

  // If permission denied
  if (!hasPermission?.granted) {
    return (
      <SafeAreaViewContainer>
        <View style={Styles.container}>
          <View style={Styles.contentContainer}>
            <Text style={Styles.headText}>Camera Access Denied</Text>
            <Text style={Styles.descriptionText}>
              Please enable camera permissions in your device settings to
              continue.
            </Text>
          </View>

          <View style={Styles.buttonContainer}>
            <AppButton
              title="Try Again"
              onPress={requestCameraPermission}
              fullwidth
              size="large"
            />
          </View>
        </View>
      </SafeAreaViewContainer>
    );
  }

  // If photo captured, show preview
  if (capturedPhoto) {
    return (
      <SafeAreaViewContainer>
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
              >
                <Text style={Styles.retakeText}>Retake</Text>
              </TouchableOpacity>

              <View style={Styles.continueButtonWrapper}>
                <AppButton
                  title="Continue"
                  onPress={handleContinue}
                  size="large"
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaViewContainer>
    );
  }

  // Camera view
  return (
    <View style={Styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={Styles.camera}
        facing="front"
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={Styles.cameraOverlay}>
          {/* Top instruction */}

          {/* Face oval guide */}
          <View style={Styles.faceGuideContainer}>
            <View style={Styles.faceOval} />
          </View>

          {/* Bottom controls */}
          <View style={Styles.bottomControls}>
            <TouchableOpacity
              style={Styles.captureButton}
              onPress={takePicture}
              disabled={!cameraReady}
            >
              <View style={Styles.captureButtonInner} />
            </TouchableOpacity>
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
    contentContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: RFValue(32),
      paddingHorizontal: RFValue(20),
    },
    iconContainer: {
      marginBottom: RFValue(8),
    },
    icon3d: {
      width: RFValue(120),
      height: RFValue(120),
    },
    textContainer: {
      alignItems: "center",
      gap: RFValue(12),
    },
    headText: {
      fontSize: RFValue(24),
      fontWeight: "600",
      lineHeight: RFValue(32),
      color: colors.slate[650],
      textAlign: "center",
    },
    descriptionText: {
      fontSize: RFValue(14),
      lineHeight: RFValue(22),
      color: colors.slate[600],
      textAlign: "center",
    },
    buttonContainer: {
      paddingHorizontal: RFValue(20),
      marginTop: RFValue(20),
    },
    buttonRow: {
      flexDirection: "row",
      gap: RFValue(12),
      alignItems: "center",
    },
    retakeButton: {
      paddingVertical: RFValue(14),
      paddingHorizontal: RFValue(24),
    },
    retakeText: {
      fontSize: RFValue(16),
      fontWeight: "500",
      color: colors.slate[600],
    },
    continueButtonWrapper: {
      flex: 1,
    },
    cameraContainer: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    cameraOverlay: {
      flex: 1,
      backgroundColor: "transparent",
      justifyContent: "space-between",
    },
    topInstruction: {
      paddingTop: RFValue(60),
      paddingHorizontal: RFValue(20),
      alignItems: "center",
    },
    instructionText: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(12),
      borderRadius: RFValue(20),
    },
    faceGuideContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    faceOval: {
      width: RFValue(250),
      height: RFValue(320),
      borderRadius: RFValue(125),
      borderWidth: 3,
      borderColor: "#FFFFFF",
      borderStyle: "dashed",
      opacity: 0.8,
    },
    bottomControls: {
      paddingBottom: RFValue(40),
      alignItems: "center",
    },
    captureButton: {
      width: RFValue(80),
      height: RFValue(80),
      borderRadius: RFValue(40),
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 4,
      borderColor: "#FFFFFF",
    },
    captureButtonInner: {
      width: RFValue(65),
      height: RFValue(65),
      borderRadius: RFValue(32.5),
      backgroundColor: "#FFFFFF",
    },
    previewContainer: {
      flex: 1,
      position: "relative",
    },
    previewImage: {
      width: "100%",
      height: "100%",
    },
    previewOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      paddingVertical: RFValue(20),
      paddingHorizontal: RFValue(20),
    },
    previewText: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
    },
  });
