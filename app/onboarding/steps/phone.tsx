import { CustomBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import OTPInput from "@/components/otp";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

type PhoneVerificationProps = {
  onNext: () => void;
};

const PhoneVerificationStep = ({ onNext }: PhoneVerificationProps) => {
  const { colors } = useTheme();
  const styles = styleSheet(colors);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [goNextAfterDismiss, setGoNextAfterDismiss] = useState(false);
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

  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

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
    if (otp.length !== 5) {
      Alert.alert("Error", "Please enter the complete OTP code");
      return;
    }

    // Simulate API verification
    if (otp.length === 5) {
      // Dismiss first, then move to next step in onDismiss to avoid stale sheet state.
      setGoNextAfterDismiss(true);
      verifyRef.current?.dismiss();
    } else {
      Alert.alert("Error", "Invalid OTP code. Please try again.");
      setOtp("");
      inputRefs.current[0]?.focus();
    }
  };

  const handleVerifySheetDismiss = () => {
    if (!goNextAfterDismiss) return;
    setGoNextAfterDismiss(false);
    onNext();
  };

  const isOtpComplete = otp.length === 5;

  // Phone Input Step

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      extraScrollHeight={20}
      enableAutomaticScroll={true}
      contentContainerStyle={{ flex: 1, paddingBottom: RFValue(20) }}
      // contentContainerClassName="flex-1 justify-center"
    >
      <View style={styles.contentContainer}>
        {/* Phone Icon */}
        <View style={styles.iconContainer}>
          <Image
            source={require("@/assets/icons/Call - Iconly Pro.png")}
            style={styles.phoneIcon}
            resizeMode="contain"
          />
        </View>

        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.headText}>Verify your phone number</Text>
          <Text style={styles.descriptionText}>
            We will send an OTP to your phone number to verify your account.
          </Text>
        </View>

        {/* Phone Number Input */}

        <TextField
          label="Phone No."
          value={phoneNumber}
          onChange={(text) => handlePhoneChange(text.toString())}
          type="phone"
          countryCode={countryCode}
          onCountryCodeChange={setCountryCode}
        />
      </View>
      <View style={styles.buttonContainer}>
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
          onDismiss: handleVerifySheetDismiss,
          enableContentPanningGesture: true,
          enableHandlePanningGesture: true,
          enablePanDownToClose: true,
        }}
      >
        <View style={styles.container}>
          {/* Content */}
          <View>
            {/* Title and Description */}
            <View style={styles.modalTextContainer}>
              <Text style={styles.headModalText}>Verify OTP</Text>
              <Text style={[styles.descriptionText, { textAlign: "center" }]}>
                Please input the code sent to your phone number.
              </Text>
            </View>

            {/* OTP Input */}
            <OTPInput length={5} onComplete={(code) => setOtp(code)} />

            {/* Verify Button */}
            <View style={styles.buttonContainer}>
              <AppButton
                title="Verify"
                onPress={handleVerifyOTP}
                fullwidth
                size="large"
                disabled={!isOtpComplete}
              />
            </View>
            {/* Resend Link */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn&apos;t receive OTP? </Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isResending}
              >
                <Text style={styles.resendLink}>
                  {isResending ? "Sending..." : "Resend code"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.resendText}> 9:55</Text>
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
      // justifyContent: "space-between",
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
      // marginTop: RFValue(20),
    },
  });
