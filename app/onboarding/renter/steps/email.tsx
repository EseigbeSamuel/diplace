import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";

type EmailVerificationProps = {
  onNext: () => void;
};

const EmailVerificationStep = ({ onNext }: EmailVerificationProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  // Mock email - replace with actual user email from store
  const userEmail = "user***********@gmail.com";

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      Alert.alert("Success", "OTP code has been resent to your email");
    }, 1500);
  };

  const handleVerifyEmail = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 5) {
      Alert.alert("Error", "Please enter the complete OTP code");
      return;
    }

    // Simulate API verification
    // Replace with actual API call
    if (otpCode === "12345") {
      onNext();
    } else {
      Alert.alert("Error", "Invalid OTP code. Please try again.");
      setOtp(["", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <View style={Styles.container}>
      {/* Content */}
      <View style={Styles.contentContainer}>
        {/* Email Icon */}
        <View style={Styles.iconContainer}>
          <Image
            source={require("@/assets/icons/mail-outline-light.png")}
            style={Styles.emailIcon}
            resizeMode="contain"
          />
        </View>

        {/* Title and Description */}
        <View style={Styles.textContainer}>
          <Text style={Styles.headText}>Verify your email address</Text>
          <Text style={Styles.descriptionText}>
            Please input the OTP sent to your registered email address{" "}
            <Text style={Styles.emailText}>{userEmail}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View style={Styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[Styles.otpInput, digit && Styles.otpInputFilled]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <View style={Styles.buttonContainer}>
          <AppButton
            title="Verify email"
            onPress={handleVerifyEmail}
            fullwidth
            size="large"
            disabled={!isOtpComplete}
          />
        </View>
        {/* Resend Link */}
        <View style={Styles.resendContainer}>
          <Text style={Styles.resendText}>Didn't receive OTP? </Text>
          <TouchableOpacity onPress={handleResendCode} disabled={isResending}>
            <Text style={Styles.resendLink}>
              {isResending ? "Sending..." : "Resend code"}
            </Text>
          </TouchableOpacity>
          <Text style={Styles.resendText}> 8:58</Text>
        </View>
      </View>

      {/* Verify Button */}
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
    otpContainer: {
      flexDirection: "row",
      gap: RFValue(12),
      marginBottom: RFValue(12),
      justifyContent: "center",
    },
    otpInput: {
      width: RFValue(50),
      height: RFValue(50),
      borderRadius: RFValue(12),
      borderWidth: 1.5,
      borderColor: colors.slate[300],
      backgroundColor: colors.background,
      fontSize: RFValue(24),
      fontWeight: "600",
      color: colors.slate[650],
      textAlign: "center",
    },
    otpInputFilled: {
      borderColor: colors.slate[650],
      backgroundColor: colors.slate[100],
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
    avatarContainer: {
      marginTop: RFValue(20),
    },
    avatar: {
      width: RFValue(80),
      height: RFValue(80),
      borderRadius: RFValue(40),
    },
    buttonContainer: {
      marginVertical: RFValue(20),
    },
  });
