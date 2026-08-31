import { CustomBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import OTPInput from "@/components/otp";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import {
  useCompleteVerification,
  useGetCurrentUser,
  useInitiateVerification,
  useResendVerificationOtp,
} from "@/hooks";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

type PhoneVerificationProps = {
  onNext: () => void;
};

const OTP_LENGTH = 6;
const RESEND_SECONDS = 600;

const formatCountdown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const PhoneVerificationStep = ({ onNext }: PhoneVerificationProps) => {
  const { colors } = useTheme();
  const styles = styleSheet(colors);
  const { currentUser } = useGetCurrentUser();
  const { initiateVerificationMutation, initiateVerificationPending } =
    useInitiateVerification();
  const { completeVerificationMutation, completeVerificationPending } =
    useCompleteVerification();
  const { resendVerificationOtpMutation, resendVerificationOtpPending } =
    useResendVerificationOtp();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [otp, setOtp] = useState("");
  const [otpResetKey, setOtpResetKey] = useState(0);
  const [verificationId, setVerificationId] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [goNextAfterDismiss, setGoNextAfterDismiss] = useState(false);
  const verifyRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["35%", "50%", "75%", "90%"], []);
  const isSending = initiateVerificationPending || resendVerificationOtpPending;
  const isVerifying = completeVerificationPending;
  const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/^0+/, "")}`;
  const isOtpComplete = otp.length === OTP_LENGTH;
  const resendDisabled = secondsLeft > 0 || isSending || isVerifying;

  useEffect(() => {
    if (phoneNumber || !currentUser?.phone_number) return;

    const digits = currentUser.phone_number.replace(/\D/g, "");
    if (digits.startsWith("234")) {
      setCountryCode("+234");
      setPhoneNumber(digits.slice(3).replace(/^0+/, "").slice(0, 10));
      return;
    }

    setPhoneNumber(digits.slice(-10));
  }, [currentUser?.phone_number, phoneNumber]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const startTimer = () => {
    setSecondsLeft(RESEND_SECONDS);
  };

  const resetOtp = () => {
    setOtp("");
    setOtpResetKey((currentKey) => currentKey + 1);
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text.replace(/\D/g, "").slice(0, 10));
    setVerificationId("");
    resetOtp();
  };

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    try {
      const response = await initiateVerificationMutation({
        verification_type: "phone",
        value: fullPhoneNumber,
      });
      setVerificationId(response.public_id);
      resetOtp();
      startTimer();
      verifyRef.current?.present();
    } catch {}
  };

  const handleResendCode = async () => {
    if (resendDisabled) return;

    try {
      if (!verificationId) {
        const response = await initiateVerificationMutation({
          verification_type: "phone",
          value: fullPhoneNumber,
        });
        setVerificationId(response.public_id);
      } else {
        await resendVerificationOtpMutation({ verification_type: "phone" });
      }

      resetOtp();
      startTimer();
    } catch {}
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== OTP_LENGTH) {
      Alert.alert("Error", "Please enter the complete OTP code");
      return;
    }

    if (!verificationId) {
      Alert.alert(
        "OTP Not Ready",
        "Please request a verification code before confirming.",
      );
      return;
    }

    try {
      await completeVerificationMutation({
        verification_id: verificationId,
        otp_code: otp,
      });
      setGoNextAfterDismiss(true);
      verifyRef.current?.dismiss();
    } catch {
      resetOtp();
    }
  };

  const handleVerifySheetDismiss = () => {
    if (!goNextAfterDismiss) return;
    setGoNextAfterDismiss(false);
    onNext();
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={20}
      enableAutomaticScroll
      contentContainerStyle={{ flex: 1, paddingBottom: RFValue(20) }}
    >
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/icons/Call - Iconly Pro.png")}
            style={styles.phoneIcon}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.headText}>Verify your phone number</Text>
          <Text style={styles.descriptionText}>
            We will send an OTP to your phone number to verify your account.
          </Text>
        </View>

        <TextField
          label="Phone No."
          value={phoneNumber}
          onChange={(text) => handlePhoneChange(text.toString())}
          type="phone"
          countryCode={countryCode}
          onCountryCodeChange={setCountryCode}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.buttonContainer}>
        <AppButton
          title={isSending ? "Sending OTP..." : "Verify phone number"}
          onPress={handleSendOTP}
          fullwidth
          size="large"
          disabled={phoneNumber.length < 10 || isSending}
        />
      </View>

      <CustomBottomSheet
        bottomSheetProps={{
          ref: verifyRef,
          snapPoints,
          index: 1,
          onDismiss: handleVerifySheetDismiss,
          enableContentPanningGesture: true,
          enableHandlePanningGesture: true,
          enablePanDownToClose: true,
        }}
      >
        <View style={styles.container}>
          <View>
            <View style={styles.modalTextContainer}>
              <Text style={styles.headModalText}>Verify OTP</Text>
              <Text style={[styles.descriptionText, { textAlign: "center" }]}>
                Please input the code sent to {fullPhoneNumber}.
              </Text>
              {isSending ? (
                <View style={styles.sendingContainer}>
                  <ActivityIndicator size="small" color={colors.slate[600]} />
                  <Text style={styles.sendingText}>Sending code...</Text>
                </View>
              ) : null}
            </View>

            <OTPInput
              length={OTP_LENGTH}
              onChangeCode={setOtp}
              onComplete={setOtp}
              resetKey={otpResetKey}
            />

            <View style={styles.buttonContainer}>
              <AppButton
                title={isVerifying ? "Verifying..." : "Verify"}
                onPress={handleVerifyOTP}
                fullwidth
                size="large"
                disabled={!isOtpComplete || isSending || isVerifying}
              />
            </View>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn&apos;t receive OTP? </Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={resendDisabled}
              >
                <Text
                  style={[
                    styles.resendLink,
                    resendDisabled && styles.resendLinkDisabled,
                  ]}
                >
                  {isSending ? "Sending..." : "Resend code"}
                </Text>
              </TouchableOpacity>
              {secondsLeft > 0 ? (
                <Text style={styles.resendText}>
                  {" "}
                  {formatCountdown(secondsLeft)}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </CustomBottomSheet>
    </KeyboardAwareScrollView>
  );
};

export default PhoneVerificationStep;

const styleSheet = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: RFValue(20),
    },
    contentContainer: {
      flex: 1,
      paddingTop: RFValue(40),
    },
    iconContainer: {
      marginBottom: RFValue(20),
    },
    phoneIcon: {
      width: RFValue(40),
      height: RFValue(40),
      tintColor: colors.slate[650],
    },
    textContainer: {
      marginBottom: RFValue(40),
      gap: RFValue(8),
    },
    modalTextContainer: {
      marginBottom: RFValue(20),
      gap: RFValue(8),
    },
    headText: {
      fontSize: RFValue(24),
      fontWeight: "600",
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    headModalText: {
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
    },
    sendingContainer: {
      alignItems: "center",
      flexDirection: "row",
      gap: RFValue(8),
      justifyContent: "center",
      marginTop: RFValue(8),
    },
    sendingText: {
      color: colors.slate[600],
      fontSize: RFValue(13),
    },
    resendContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: RFValue(16),
      justifyContent: "center",
    },
    resendText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    resendLink: {
      fontSize: RFValue(14),
      color: "#3B82F6",
      fontWeight: "600",
    },
    resendLinkDisabled: {
      color: colors.slate[450],
    },
    buttonContainer: {
      marginTop: RFValue(12),
    },
  });
