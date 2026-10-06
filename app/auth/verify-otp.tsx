// import AppButton from "@/components/button";
// import SafeAreaViewContainer from "@/components/safeareaview";
// import { useTheme } from "@/contexts/themeContext";
// import { useVerifyOtp } from "@/hooks";
// import { ColorScheme } from "@/utils";
// import { useRouter } from "expo-router";
// import React, { useRef, useState } from "react";
// import {
//   NativeSyntheticEvent,
//   TextInput as RNTextInput,
//   StyleSheet,
//   Text,
//   TextInputKeyPressEventData,
//   View,
// } from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { RFValue } from "react-native-responsive-fontsize";

// export default function ForgotPassowrd() {
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const otpRefs = useRef<(RNTextInput | null)[]>(Array(6).fill(null));
//   const { colors } = useTheme();
//   const styles = verifyOtpStyles(colors);

//   const router = useRouter();

//   const { verifyOtpMutation, verifyOtpMutationPending } = useVerifyOtp();

//   const handleOtpChange = (text: string, idx: number) => {
//     // Keep only numbers
//     const cleaned = text.replace(/[^0-9]/g, "");

//     // Handle paste (user pastes full OTP)
//     if (cleaned.length > 1) {
//       const newOtp = cleaned.slice(0, 6).split("");
//       const filledOtp = [...otp];

//       newOtp.forEach((digit, i) => {
//         if (i < 6) {
//           filledOtp[i] = digit;
//         }
//       });

//       setOtp(filledOtp);

//       // Focus last filled input or the next empty one
//       const nextIndex = Math.min(newOtp.length, 5);
//       setTimeout(() => {
//         otpRefs.current[nextIndex]?.focus();
//       }, 0);

//       return;
//     }

//     // Normal typing - single digit
//     const newOtp = [...otp];
//     newOtp[idx] = cleaned;
//     setOtp(newOtp);

//     // Move forward automatically if digit was entered
//     if (cleaned && idx < 5) {
//       setTimeout(() => {
//         otpRefs.current[idx + 1]?.focus();
//       }, 0);
//     }
//   };

//   const handleOtpKeyPress = (
//     e: NativeSyntheticEvent<TextInputKeyPressEventData>,
//     idx: number,
//   ) => {
//     if (e.nativeEvent.key === "Backspace" && !otp[idx] && idx > 0) {
//       // Move to previous input on backspace
//       setTimeout(() => {
//         otpRefs.current[idx - 1]?.focus();
//       }, 0);
//     }
//   };

//   return (
//     <SafeAreaViewContainer className="justify-center flex-1 bg-white">
//       <KeyboardAwareScrollView
//         enableOnAndroid={true}
//         extraScrollHeight={20}
//         enableAutomaticScroll={true}
//         contentContainerClassName="flex-1 justify-center"
//       >
//         <View className="gap-1 mb-6">
//           <Text
//             style={{ fontSize: RFValue(24), color: colors.slate[650] }}
//             className="font-bold text-center"
//           >
//             Verify OTP
//           </Text>
//           <Text
//             style={{ fontSize: RFValue(16), color: colors.slate[600] }}
//             className="font-normal text-center"
//           >
//             Please input the code sent to your email / phone number.
//           </Text>
//         </View>

//         <View className="gap-1" style={styles.container}>
//           {otp.map((digit, idx) => (
//             <View key={idx} style={styles.otpInputSurface}>
//               <RNTextInput
//                 ref={(el) => {
//                   otpRefs.current[idx] = el;
//                 }}
//                 value={digit}
//                 onChangeText={(text) => handleOtpChange(text, idx)}
//                 onKeyPress={(e) => handleOtpKeyPress(e, idx)}
//                 style={styles.input}
//                 keyboardType="number-pad"
//                 maxLength={1}
//                 selectTextOnFocus
//                 accessibilityLabel={`Verification code digit ${idx + 1} of 6`}
//                 accessibilityRole="text"
//               />
//             </View>
//           ))}
//         </View>
//         <AppButton
//           onPress={() => {
//             const token = otp.join("");
//             if (token.length !== 6) return;

//             verifyOtpMutation({ token });
//           }}
//           title="Verify"
//           fullwidth
//           variant="primary"
//           size="large"
//           disabled={
//             otp.some((digit) => digit === "") || verifyOtpMutationPending
//           }
//         />
//       </KeyboardAwareScrollView>
//     </SafeAreaViewContainer>
//   );
// }

// const verifyOtpStyles = (colors: ColorScheme) =>
//   StyleSheet.create({
//     container: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       marginVertical: 20,
//     },
//     otpInputSurface: {
//       borderRadius: 12,
//       backgroundColor: "#fff",
//       elevation: 0,
//     },
//     input: {
//       width: RFValue(40),
//       height: RFValue(46),
//       borderRadius: RFValue(12),
//       borderWidth: 1.5,
//       borderColor: colors.slate[300],
//       backgroundColor: colors.background,
//       fontSize: RFValue(20),
//       fontWeight: "600",
//       color: colors.slate[650],
//       textAlign: "center",
//     },
//   });
import { BottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(RESEND_SECONDS);

  const inputRef = useRef<TextInput>(null);

  const { colors } = useTheme();
  const styles = verifyOtpStyles(colors);
  const router = useRouter();

  // Handle input
  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setOtp(cleaned.slice(0, OTP_LENGTH));
  };

  const handleSubmit = () => {
    if (otp.length !== OTP_LENGTH) return;
    router.replace({
      pathname: "/auth/create-password",
      params: { token: otp },
    });
  };

  // Resend timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    if (timer > 0) return;

    // TODO: call resend API here
    setTimer(RESEND_SECONDS);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.slate[100] }}>
      <BottomSheet
        isVisible
        onClose={() => router.back()}
        snapPoints={[0.55, 0.9]}
      >
        <View className="gap-1 mb-6">
          <Text
            style={{ fontSize: RFValue(24), color: colors.slate[650] }}
            className="font-bold text-center"
          >
            Verify OTP
          </Text>

          <Text
            style={{ fontSize: RFValue(13), color: colors.slate[600] }}
            className="text-center"
          >
            Please input the code sent to your email / phone number.
          </Text>
        </View>

        {/* Hidden Input (handles typing + autofill) */}
        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={handleChange}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          autoFocus
          className="absolute opacity-[0]"
          textContentType="oneTimeCode" // iOS autofill
          autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"} // Android autofill
        />

        {/* OTP Boxes */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
        >
          <View style={styles.container} className="flex-row justify-between my-[20px]">
            {Array.from({ length: OTP_LENGTH }).map((_, i) => {
              const digit = otp[i] || "";
              const isFocused = otp.length === i;

              return (
                <View
                  key={i}
                  style={[
                    styles.box,
                    isFocused && { borderColor: colors.slate[650] },
                  ]}
                 className="border-[1.5px] justify-center items-center">
                  <Text style={styles.text} className="font-semibold">{digit}</Text>
                </View>
              );
            })}
          </View>
        </TouchableOpacity>

        {/* Resend */}
        <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              color: timer > 0 ? colors.slate[400] : colors.slate[650],
            }}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
          </Text>
        </TouchableOpacity>

        <AppButton
          onPress={handleSubmit}
          title="Verify"
          fullwidth
          variant="primary"
          size="large"
          disabled={otp.length !== OTP_LENGTH}
        />
      </BottomSheet>
    </View>
  );
}

const verifyOtpStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {



    },
    box: {
      width: RFValue(40),
      height: RFValue(46),
      borderRadius: RFValue(12),

      borderColor: colors.slate[300],


    },
    text: {
      fontSize: RFValue(20),

      color: colors.slate[650],
    },
  });
