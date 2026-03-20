import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useInitiateVerification } from "@/hooks";
import { ColorScheme } from "@/utils";
import Constants from "expo-constants";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useWindowDimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CameraView, useCameraPermissions } from "expo-camera";

type SelfieProps = {
  onNext: () => void;
  handleBack: () => void;
};

const SelfieVerificationStep = ({ onNext, handleBack }: SelfieProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const isExpoGo =
    Constants.appOwnership === "expo" ||
    Constants.executionEnvironment === "storeClient";

  if (isExpoGo) {
    return (
      <SafeAreaViewContainer>
        <View style={Styles.container}>
          <View style={Styles.contentContainer}>
            <Text style={Styles.headText}>Selfie Capture Unavailable</Text>
            <Text style={Styles.descriptionText}>
              Expo Go doesn&apos;t support the camera module used for face
              capture. Use a development build when you want to test the
              selfie flow, or continue for now.
            </Text>
          </View>

          <View style={Styles.buttonContainer}>
            <AppButton title="Continue" onPress={onNext} fullwidth size="large" />
          </View>
        </View>
      </SafeAreaViewContainer>
    );
  }

  if (Platform.OS === "android") {
    return <ExpoCameraContent onNext={onNext} handleBack={handleBack} />;
  }

  return <SelfieCameraContent onNext={onNext} handleBack={handleBack} />;
};

type CameraModules = {
  VisionCameraModule: any;
  FaceDetectorModule: any;
};

const SelfieCameraContent = ({ onNext, handleBack }: SelfieProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  let modules: CameraModules | null = null;

  try {
    modules = {
      VisionCameraModule: require("react-native-vision-camera"),
      FaceDetectorModule: require("react-native-vision-camera-face-detector"),
    };
  } catch {
    return (
      <SafeAreaViewContainer>
        <View style={Styles.container}>
          <View style={Styles.contentContainer}>
            <Text style={Styles.headText}>Selfie Capture Unavailable</Text>
            <Text style={Styles.descriptionText}>
              Camera modules aren&apos;t available in this build. Use a
              development build when you want to test the selfie flow, or
              continue for now.
            </Text>
          </View>

          <View style={Styles.buttonContainer}>
            <AppButton title="Continue" onPress={onNext} fullwidth size="large" />
          </View>
        </View>
      </SafeAreaViewContainer>
    );
  }

  return (
    <SelfieCameraModuleContent
      onNext={onNext}
      handleBack={handleBack}
      modules={modules}
    />
  );
};

const SelfieCameraModuleContent = ({
  onNext,
  handleBack,
  modules,
}: SelfieProps & { modules: CameraModules }) => {
  const {
    Camera: VisionCamera,
    useCameraDevice,
    useCameraPermission,
  } = modules.VisionCameraModule;
  const { Camera: FaceDetectorCamera } = modules.FaceDetectorModule;
  const { colors } = useTheme();
  const Styles = styles(colors);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("front");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [faceGuideLayout, setFaceGuideLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [autoCaptureStatus, setAutoCaptureStatus] = useState<string>(
    "Align your face within the circle",
  );
  const [isAutoCaptureReady, setIsAutoCaptureReady] = useState(false);
  const allowManualCapture = __DEV__;
  const cameraRef = useRef<any>(null);
  const autoCaptureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCapturingRef = useRef(false);
  const { initiateVerificationMutation, initiateVerificationPending } =
    useInitiateVerification();

  // Request camera permission
  const requestCameraPermission = async () => {
    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        "Permission Required",
        "Camera access is needed to take your selfie."
      );
    }
  };

  // Take photo
  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady || isCapturingRef.current) return;
    try {
      isCapturingRef.current = true;
      const photo = await cameraRef.current.takePhoto({
        flash: "off",
      });
      if (photo?.path) {
        setCapturedPhoto(`file://${photo.path}`);
      }
    } finally {
      isCapturingRef.current = false;
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedPhoto(null);
    setAutoCaptureStatus("Align your face within the circle");
    setIsAutoCaptureReady(false);
  };

  // Handle continue
  const handleContinue = async () => {
    if (capturedPhoto) {
      await initiateVerificationMutation({
        verification_type: "face",
        value: "selfie",
      });
      onNext();
    }
  };

  const clearAutoCaptureTimer = () => {
    if (autoCaptureTimerRef.current) {
      clearTimeout(autoCaptureTimerRef.current);
      autoCaptureTimerRef.current = null;
    }
  };

  const handleFacesDetected = (faces: any[]) => {
    if (!faces?.length || capturedPhoto) {
      clearAutoCaptureTimer();
      setAutoCaptureStatus(
        allowManualCapture
          ? "Auto-capture unavailable, use the button"
          : "Align your face within the circle",
      );
      setIsAutoCaptureReady(false);
      return;
    }

    const face = faces[0];
    const bounds = face.bounds;
    const smiling = face.smilingProbability;
    const leftEyeOpen = face.leftEyeOpenProbability;
    const rightEyeOpen = face.rightEyeOpenProbability;

    if (!faceGuideLayout || !bounds) {
      setAutoCaptureStatus("Hold still...");
      setIsAutoCaptureReady(false);
      return;
    }

    const faceCenterX = bounds.x + bounds.width / 2;
    const faceCenterY = bounds.y + bounds.height / 2;

    const guideCenterX = faceGuideLayout.x + faceGuideLayout.width / 2;
    const guideCenterY = faceGuideLayout.y + faceGuideLayout.height / 2;

    const withinX =
      Math.abs(faceCenterX - guideCenterX) <
      faceGuideLayout.width * 0.22;
    const withinY =
      Math.abs(faceCenterY - guideCenterY) <
      faceGuideLayout.height * 0.22;

    const faceWidthOk =
      bounds.width > faceGuideLayout.width * 0.55 &&
      bounds.width < faceGuideLayout.width * 0.95;
    const faceHeightOk =
      bounds.height > faceGuideLayout.height * 0.55 &&
      bounds.height < faceGuideLayout.height * 0.95;

    const eyesOpenOk =
      typeof leftEyeOpen === "number" && typeof rightEyeOpen === "number"
        ? leftEyeOpen >= 0.6 && rightEyeOpen >= 0.6
        : true;
    const isSmiling = typeof smiling === "number" ? smiling >= 0.6 : true;

    if (withinX && withinY && faceWidthOk && faceHeightOk && eyesOpenOk && isSmiling) {
      setAutoCaptureStatus("Perfect! Hold still...");
      setIsAutoCaptureReady(true);

      if (!autoCaptureTimerRef.current) {
        autoCaptureTimerRef.current = setTimeout(() => {
          autoCaptureTimerRef.current = null;
          takePicture();
        }, 650);
      }
      return;
    }

    clearAutoCaptureTimer();
    setIsAutoCaptureReady(false);

    if (!withinX || !withinY) {
      setAutoCaptureStatus("Center your face in the circle");
      return;
    }

    if (!faceWidthOk || !faceHeightOk) {
      setAutoCaptureStatus("Move closer to the camera");
      return;
    }

    if (!eyesOpenOk) {
      setAutoCaptureStatus("Please open your eyes");
      return;
    }

    if (!isSmiling) {
      setAutoCaptureStatus("Please smile at the screen");
      return;
    }

    setAutoCaptureStatus("Hold still...");
  };

  // If permission denied
  if (!hasPermission) {
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

  if (!device) {
    return (
      <SafeAreaViewContainer>
        <View style={Styles.container}>
          <View style={Styles.contentContainer}>
            <Text style={Styles.headText}>Camera Unavailable</Text>
            <Text style={Styles.descriptionText}>
              We couldn&apos;t access your front camera. Please try again.
            </Text>
          </View>
        </View>
      </SafeAreaViewContainer>
    );
  }

  // If photo captured, show preview
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
              disabled={initiateVerificationPending}
            >
              <Text style={Styles.retakeText}>Retake</Text>
            </TouchableOpacity>

            <View style={Styles.continueButtonWrapper}>
              <AppButton
                title="Continue"
                onPress={handleContinue}
                size="large"
                disabled={initiateVerificationPending}
              />
            </View>
          </View>
          {initiateVerificationPending && (
            <View style={Styles.pendingOverlay}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={Styles.pendingText}>Starting verification...</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Camera view
  return (
    <View style={Styles.cameraContainer}>
      <View className="w-[70%]  justify-between px-3  top-32 z-50 fixed items-center flex-row">
        <View>
          <TouchableOpacity
            onPress={handleBack}
            className="p-4 bg-gray-100/50 rounded-full w-[50px] "
          >
            <Image
              source={require("@/assets/icons/arrow-left-dark.png")}
              className="w-6 h-6"
              style={{ tintColor: "#ffffff" }}
            />
          </TouchableOpacity>
        </View>
        <Text className="text-xl text-white">Take a selfie</Text>
      </View>
      <FaceDetectorCamera
        ref={cameraRef}
        style={Styles.camera}
        device={device}
        isActive={!capturedPhoto}
        photo
        onInitialized={() => setCameraReady(true)}
        faceDetectionCallback={(faces: any[]) => handleFacesDetected(faces)}
        faceDetectionOptions={{
          performanceMode: "fast",
          landmarkMode: "none",
          contourMode: "none",
          classificationMode: "all",
          trackingEnabled: true,
          cameraFacing: "front",
          autoMode: true,
          windowWidth: screenWidth,
          windowHeight: screenHeight,
        }}
      >
        <View style={Styles.cameraOverlay}>
          {/* Top instruction */}

          {/* Face oval guide */}
          <View style={Styles.faceGuideContainer}>
            <View
              style={[
                Styles.faceOval,
                isAutoCaptureReady && Styles.faceOvalReady,
              ]}
              onLayout={(event) => {
                const { x, y, width, height } = event.nativeEvent.layout;
                setFaceGuideLayout({ x, y, width, height });
              }}
            />
            <View style={Styles.statusChip}>
              <Text style={Styles.statusText}>{autoCaptureStatus}</Text>
            </View>
          </View>

          {/* Bottom controls */}
          <View style={Styles.bottomControls}>
            <TouchableOpacity
              style={Styles.captureButton}
              onPress={takePicture}
              disabled={!cameraReady || isCapturingRef.current}
            >
              <View style={Styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </FaceDetectorCamera>
    </View>
  );
};

const ExpoCameraContent = ({ onNext, handleBack }: SelfieProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const [permission, requestPermission] = useCameraPermissions();
  const hasPermission = permission?.granted ?? false;
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const { initiateVerificationMutation, initiateVerificationPending } =
    useInitiateVerification();

  const requestCameraPermission = async () => {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert(
        "Permission Required",
        "Camera access is needed to take your selfie.",
      );
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || !cameraReady) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
      });
      if (photo?.uri) {
        setCapturedPhoto(photo.uri);
      }
    } catch (error) {
      Alert.alert("Camera Error", "We couldn't capture the selfie. Try again.");
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const handleContinue = async () => {
    if (capturedPhoto) {
      await initiateVerificationMutation({
        verification_type: "face",
        value: "selfie",
      });
      onNext();
    }
  };

  if (!hasPermission) {
    return (
      <SafeAreaViewContainer>
        <View style={Styles.container}>
          <View style={Styles.contentContainer}>
            <Text style={Styles.headText}>Camera Access Required</Text>
            <Text style={Styles.descriptionText}>
              Please allow camera access to take your selfie.
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
              disabled={initiateVerificationPending}
            >
              <Text style={Styles.retakeText}>Retake</Text>
            </TouchableOpacity>

            <View style={Styles.continueButtonWrapper}>
              <AppButton
                title="Continue"
                onPress={handleContinue}
                size="large"
                disabled={initiateVerificationPending}
              />
            </View>
          </View>
          {initiateVerificationPending && (
            <View style={Styles.pendingOverlay}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={Styles.pendingText}>Starting verification...</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={Styles.cameraContainer}>
      <View className="w-[70%]  justify-between px-3  top-32 z-50 fixed items-center flex-row">
        <View>
          <TouchableOpacity
            onPress={handleBack}
            className="p-4 bg-gray-100/50 rounded-full w-[50px] "
          >
            <Image
              source={require("@/assets/icons/arrow-left-dark.png")}
              className="w-6 h-6"
              style={{ tintColor: "#ffffff" }}
            />
          </TouchableOpacity>
        </View>
        <Text className="text-xl text-white">Take a selfie</Text>
      </View>

      <CameraView
        ref={cameraRef}
        style={Styles.camera}
        facing="front"
        mode="picture"
        mirror
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={Styles.cameraOverlay}>
          <View style={Styles.faceGuideContainer}>
            <View style={Styles.faceOval} />
            <View style={Styles.statusChip}>
              <Text style={Styles.statusText}>
                Center your face and tap capture
              </Text>
            </View>
          </View>

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
      position: "absolute",
      top: -50,
      bottom: 0,
      left: 0,
      right: 0,
      flex: 1,
      inset: 0,
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
    faceOvalReady: {
      borderColor: "#22c55e",
      opacity: 1,
    },
    statusChip: {
      position: "absolute",
      bottom: RFValue(-44),
      alignSelf: "center",
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(8),
      borderRadius: RFValue(16),
    },
    statusText: {
      color: "#FFFFFF",
      fontSize: RFValue(12),
      fontWeight: "600",
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
    pendingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      gap: RFValue(8),
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    pendingText: {
      color: "#FFFFFF",
      fontSize: RFValue(14),
      fontWeight: "600",
    },
  });
