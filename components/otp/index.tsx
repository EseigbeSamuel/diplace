import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface OTPInputProps {
  length?: number;
  onChangeCode?: (code: string) => void;
  onComplete?: (code: string) => void;
  resetKey?: number | string;
}

export default function OTPInput({
  length = 6,
  onChangeCode,
  onComplete,
  resetKey,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const { colors } = useTheme();
  const styles = styleSheet(colors);

  useEffect(() => {
    setOtp(Array(length).fill(""));
    onChangeCode?.("");
    inputRefs.current[0]?.focus();
  }, [length, onChangeCode, resetKey]);

  const handleOtpChange = (value: string, index: number) => {
    // If user pressed backspace on Android: value becomes ""
    if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      onChangeCode?.(newOtp.join(""));

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    // Accept only one digit
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    const nextCode = newOtp.join("");
    onChangeCode?.(nextCode);

    // Move to next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Trigger onComplete if filled
    if (index === length - 1 && onComplete) {
      onComplete(nextCode);
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          style={[styles.otpInput, digit && styles.otpInputFilled]}
          value={digit}
          onChangeText={(text) => handleOtpChange(text, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

const styleSheet = (colors: ColorScheme) =>
  StyleSheet.create({
    otpContainer: {
      flexDirection: "row",
      gap: RFValue(12),
      marginBottom: RFValue(10),
      justifyContent: "center",
    },
    otpInput: {
      width: RFValue(50),
      height: RFValue(56),
      borderRadius: RFValue(12),
      borderWidth: 1.5,
      borderColor: colors.slate[300],
      backgroundColor: colors.background,
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      textAlign: "center",
    },
    otpInputFilled: {
      borderColor: colors.slate[650],
      backgroundColor: colors.slate[100],
    },
  });
