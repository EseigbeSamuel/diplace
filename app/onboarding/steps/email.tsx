import AppButton from "@/components/button";
import OTPInput from "@/components/otp";
import { useTheme } from "@/contexts/themeContext";
import {
  useCompleteVerification,
  useGetCurrentUser,
  useInitiateVerification,
  useResendVerificationOtp,
} from "@/hooks";
import { ColorScheme } from "@/utils";
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

type EmailVerificationProps = {
  onNext: () => void;
};

const OTP_LENGTH = 6;
const RESEND_SECONDS = 600;

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email || "your registered email";

  const visibleName = name.slice(0, 5);
  const hiddenLength = Math.max(name.length - visibleName.length, 4);
  return `${visibleName}${"*".repeat(hiddenLength)}@${domain}`;
};

const formatCountdown = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const EmailVerificationStep = ({ onNext }: EmailVerificationProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const { currentUser, isCurrentUserLoading } = useGetCurrentUser();
  const { initiateVerificationMutation, initiateVerificationPending } =
    useInitiateVerification();
  const { completeVerificationMutation, completeVerificationPending } =
    useCompleteVerification();
  const { resendVerificationOtpMutation, resendVerificationOtpPending } =
    useResendVerificationOtp();

  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const initiatedEmailRef = useRef<string | null>(null);
  const userEmail = currentUser?.email || "";
  const maskedEmail = maskEmail(userEmail);
  const isSending =
    isCurrentUserLoading ||
    initiateVerificationPending ||
    resendVerificationOtpPending;
  const isVerifying = completeVerificationPending;
  const isOtpComplete = otp.length === OTP_LENGTH;
  const resendDisabled = secondsLeft > 0 || isSending || isVerifying;

  const startTimer = () => {
    setSecondsLeft(RESEND_SECONDS);
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((currentSeconds) => Math.max(currentSeconds - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (!userEmail || initiatedEmailRef.current === userEmail) return;

    initiatedEmailRef.current = userEmail;
    const sendInitialOtp = async () => {
      try {
        const response = await initiateVerificationMutation({
          verification_type: "email",
          value: userEmail,
        });
        setVerificationId(response.public_id);
        startTimer();
      } catch {
        initiatedEmailRef.current = null;
      }
    };

    sendInitialOtp();
  }, [initiateVerificationMutation, userEmail]);

  const handleResendCode = async () => {
    if (resendDisabled || !userEmail) return;

    try {
      if (!verificationId) {
        const response = await initiateVerificationMutation({
          verification_type: "email",
          value: userEmail,
        });
        setVerificationId(response.public_id);
      } else {
        await resendVerificationOtpMutation({ verification_type: "email" });
      }

      setOtp("");
      startTimer();
    } catch {}
  };

  const handleVerifyEmail = async () => {
    if (otp.length !== OTP_LENGTH) {
      Alert.alert("Error", "Please enter the complete OTP code");
      return;
    }

    if (!verificationId) {
      Alert.alert(
        "OTP Not Ready",
        "We are still preparing your verification. Please try again.",
      );
      return;
    }

    try {
      await completeVerificationMutation({
        verification_id: verificationId,
        otp_code: otp,
      });
      onNext();
    } catch {
      setOtp("");
    }
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.contentContainer}>
        <View style={Styles.iconContainer}>
          <Image
            source={require("@/assets/icons/mail-outline-light.png")}
            style={Styles.emailIcon}
            resizeMode="contain"
          />
        </View>

        <View style={Styles.textContainer}>
          <Text style={Styles.headText}>Verify your email address</Text>
          <Text style={Styles.descriptionText}>
            Please input the OTP sent to your registered email address{" "}
            <Text style={Styles.emailText}>{maskedEmail}</Text>
          </Text>
          {isSending ? (
            <View style={Styles.sendingContainer}>
              <ActivityIndicator size="small" color={colors.slate[600]} />
              <Text style={Styles.sendingText}>Sending verification code...</Text>
            </View>
          ) : null}
        </View>

        <OTPInput
          length={OTP_LENGTH}
          onChangeCode={setOtp}
          onComplete={setOtp}
        />

        <View style={Styles.buttonContainer}>
          <AppButton
            title={isVerifying ? "Verifying..." : "Verify email"}
            onPress={handleVerifyEmail}
            fullwidth
            size="large"
            disabled={!isOtpComplete || isVerifying || isSending}
          />
        </View>

        <View style={Styles.resendContainer}>
          <Text style={Styles.resendText}>Didn&apos;t receive OTP? </Text>
          <TouchableOpacity onPress={handleResendCode} disabled={resendDisabled}>
            <Text
              style={[
                Styles.resendLink,
                resendDisabled && Styles.resendLinkDisabled,
              ]}
            >
              {initiateVerificationPending || resendVerificationOtpPending
                ? "Sending..."
                : "Resend code"}
            </Text>
          </TouchableOpacity>
          {secondsLeft > 0 ? (
            <Text style={Styles.resendText}> {formatCountdown(secondsLeft)}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default EmailVerificationStep;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      paddingTop: RFValue(40),
    },
    iconContainer: {
      marginBottom: RFValue(16),
    },
    emailIcon: {
      width: RFValue(40),
      height: RFValue(40),
      tintColor: colors.slate[650],
    },
    textContainer: {
      marginBottom: RFValue(40),
      gap: RFValue(8),
    },
    headText: {
      fontSize: RFValue(24),
      fontWeight: "600",
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    descriptionText: {
      fontSize: RFValue(14),
      lineHeight: RFValue(22),
      color: colors.slate[600],
    },
    emailText: {
      fontWeight: "600",
      color: colors.slate[650],
    },
    sendingContainer: {
      alignItems: "center",
      flexDirection: "row",
      gap: RFValue(8),
      marginTop: RFValue(8),
    },
    sendingText: {
      color: colors.slate[600],
      fontSize: RFValue(13),
    },
    resendContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: RFValue(32),
      justifyContent: "center",
    },
    resendText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    resendLink: {
      fontSize: RFValue(14),
      color: colors.info[200],
      fontWeight: "600",
    },
    resendLinkDisabled: {
      color: colors.slate[450],
    },
    buttonContainer: {
      marginVertical: RFValue(20),
    },
  });
