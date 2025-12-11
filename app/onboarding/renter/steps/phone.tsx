import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { CustomBottomSheet } from "@/components/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

type PhoneVerificationProps = {
  onNext: () => void;
};

const PhoneVerificationStep = ({ onNext }: PhoneVerificationProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  const [step, setStep] = useState<"input" | "verify">("input");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const verifyRef = useRef<BottomSheetModal>(null);

  // Handle phone number input
  const handlePhoneChange = (text: string) => {
    // Only allow numbers and limit to 10 digits
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
    }
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      verifyRef.current?.present();
    }, 1000);
  };

  // Handle OTP change
  const handleOtpChange = (value: string, index: number) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Resend OTP
  const handleResendCode = async () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      Alert.alert("Success", "OTP code has been resent to your phone");
    }, 1500);
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 5) {
      Alert.alert("Error", "Please enter the complete OTP code");
      return;
    }

    // Simulate API verification
    if (otpCode === "12345") {
      verifyRef.current?.close();
      onNext();
    } else {
      Alert.alert("Error", "Invalid OTP code. Please try again.");
      setOtp(["", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  // Phone Input Step

  return (
    <View style={Styles.container}>
      {/* Content */}
      <View style={Styles.contentContainer}>
        {/* Phone Icon */}
        <View style={Styles.iconContainer}>
          <Image
            source={require("@/assets/icons/Call - Iconly Pro.png")}
            style={Styles.phoneIcon}
            resizeMode="contain"
          />
        </View>

        {/* Title and Description */}
        <View style={Styles.textContainer}>
          <Text style={Styles.headText}>Verify your phone number</Text>
          <Text style={Styles.descriptionText}>
            We will send an OTP to your phone number to verify your account.
          </Text>
        </View>

        {/* Phone Number Input */}
        <View style={Styles.phoneInputContainer}>
          <Text style={Styles.inputLabel}>Phone No.</Text>
          <View style={Styles.phoneInputWrapper}>
            {/* Country Code Selector */}
            <TouchableOpacity style={Styles.countryCodeButton}>
              <Image
                source={require("@/assets/icons/nigeria.png")}
                style={Styles.flagIcon}
                resizeMode="contain"
              />
              <Text style={Styles.countryCodeText}>{countryCode}</Text>
              <Image
                source={require("@/assets/icons/chevrondown-bold.png")}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Phone Number Input */}
            <TextInput
              style={Styles.phoneInput}
              placeholder="810-2934980"
              placeholderTextColor={colors.slate[400]}
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              maxLength={10}
            />

            {/* Clear Button */}
            {phoneNumber.length > 0 && (
              <TouchableOpacity
                style={Styles.clearButton}
                onPress={() => setPhoneNumber("")}
              >
                <Image
                  source={require("@/assets/icons/close-contained.png")}
                  style={Styles.clearIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Verify Button */}
      <View style={Styles.buttonContainer}>
        <AppButton
          title="Verify phone number"
          onPress={handleSendOTP}
          fullwidth
          size="large"
          disabled={phoneNumber.length < 10}
        />
      </View>
      <CustomBottomSheet
        bottomSheetProps={{
          ref: verifyRef,
          snapPoints,
          index: 2,
          enableContentPanningGesture: true,
          enableHandlePanningGesture: true,
          enablePanDownToClose: true,
        }}
      >
        <View style={Styles.container}>
          {/* Content */}
          <View>
            {/* Title and Description */}
            <View style={Styles.modalTextContainer}>
              <Text style={Styles.headModalText}>Verify OTP</Text>
              <Text style={[Styles.descriptionText, { textAlign: "center" }]}>
                Please input the code sent to your phone number.
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

            {/* Verify Button */}
            <View style={Styles.buttonContainer}>
              <AppButton
                title="Verify"
                onPress={handleVerifyOTP}
                fullwidth
                size="large"
                disabled={!isOtpComplete}
              />
            </View>
            {/* Resend Link */}
            <View style={Styles.resendContainer}>
              <Text style={Styles.resendText}>Didn't receive OTP? </Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isResending}
              >
                <Text style={Styles.resendLink}>
                  {isResending ? "Sending..." : "Resend code"}
                </Text>
              </TouchableOpacity>
              <Text style={Styles.resendText}> 9:55</Text>
            </View>
          </View>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default PhoneVerificationStep;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
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
    phoneInputContainer: {
      width: "100%",
      gap: RFValue(12),
    },
    inputLabel: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    phoneInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.slate[100],
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(4),
      gap: RFValue(8),
    },
    countryCodeButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
      paddingVertical: RFValue(8),
      paddingRight: RFValue(8),
      borderRightWidth: 1,
      borderRightColor: colors.slate[300],
    },
    flagIcon: {
      width: RFValue(24),
      height: RFValue(24),
    },
    countryCodeText: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
    },
    arrowIcon: {
      width: RFValue(12),
      height: RFValue(12),
      tintColor: colors.slate[600],
    },
    phoneInput: {
      flex: 1,
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
      paddingVertical: RFValue(12),
    },
    clearButton: {
      padding: RFValue(4),
    },
    clearIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
    otpContainer: {
      flexDirection: "row",
      gap: RFValue(12),
      marginBottom: RFValue(10),
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
      marginTop: RFValue(16),
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
    buttonContainer: {
      marginTop: RFValue(20),
    },
  });
