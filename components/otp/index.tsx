import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TextInput, View, Platform } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface OTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
}

export default function OTPInput({ length = 6, onComplete }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const { colors } = useTheme();
  const styles = styleSheet(colors);

  // Check if OTP is complete and call onComplete
  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length === length && onComplete) {
      onComplete(otpString);
    }
  }, [otp, length, onComplete]);

  const handleChange = (text: string, index: number) => {
    // Remove any non-digit characters
    const cleanText = text.replace(/[^0-9]/g, "");

    if (cleanText.length === 0) {
      // Handle deletion
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Handle paste or multiple characters
    if (cleanText.length > 1) {
      const newOtp = [...otp];
      const digits = cleanText.split("").slice(0, length - index);

      digits.forEach((digit, i) => {
        if (index + i < length) {
          newOtp[index + i] = digit;
        }
      });

      setOtp(newOtp);

      // Focus next empty box or last box
      const nextEmptyIndex = newOtp.findIndex(
        (val, i) => i > index && val === ""
      );
      const focusIndex =
        nextEmptyIndex !== -1
          ? nextEmptyIndex
          : Math.min(index + digits.length, length - 1);

      // Blur current then focus next
      inputRefs.current[index]?.blur();
      setTimeout(() => {
        inputRefs.current[focusIndex]?.focus();
      }, 10);
      return;
    }

    // Handle single digit
    const newOtp = [...otp];
    newOtp[index] = cleanText[0];
    setOtp(newOtp);

    // Move to next input - CRITICAL: blur current first, then focus next
    if (index < length - 1) {
      inputRefs.current[index]?.blur();
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    } else {
      // Last input, blur to close keyboard or keep focus
      inputRefs.current[index]?.blur();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        // Move to previous box if current is empty
        inputRefs.current[index]?.blur();
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 10);
      } else {
        // Clear current box
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    // Select all text when focused for easier replacement
    if (Platform.OS === "ios") {
      setTimeout(() => {
        inputRefs.current[index]?.setNativeProps({
          selection: { start: 0, end: 1 },
        });
      }, 0);
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          style={[
            styles.otpInput,
            digit && styles.otpInputFilled,
            focusedIndex === index && styles.otpInputFocused,
          ]}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => handleFocus(index)}
          keyboardType="number-pad"
          maxLength={1}
          returnKeyType="next"
          autoFocus={index === 0}
          selectTextOnFocus
          caretHidden={false}
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
    otpInputFocused: {
      borderColor: colors.slate[650],
      borderWidth: 2,
    },
  });
