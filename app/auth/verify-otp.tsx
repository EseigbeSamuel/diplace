// import AppButton from "@/components/button";
// import SafeAreaViewContainer from "@/components/safeareaview";
// import { useTheme } from "@/contexts/themeContext";
// import { useVerifyOtp } from "@/hooks";
// import { ColorScheme } from "@/utils";
// import { useRouter } from "expo-router";
// import React, { useRef, useState } from "react";
// // import { TextInputKeyPressEventData } from "react-native";
// import {
//   NativeSyntheticEvent,
//   TextInput as RNTextInput,
//   StyleSheet,
//   Text,
//   TextInputKeyPressEventData,
//   View,
// } from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { Surface, TextInput } from "react-native-paper";
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
//         filledOtp[i] = digit;
//       });

//       setOtp(filledOtp);

//       // Focus last filled input
//       const nextIndex = Math.min(newOtp.length - 1, 5);
//       otpRefs.current[nextIndex]?.focus();

//       return;
//     }

//     // Normal typing
//     const newOtp = [...otp];
//     newOtp[idx] = cleaned;
//     setOtp(newOtp);

//     // Move forward automatically
//     if (cleaned && idx < 5) {
//       otpRefs.current[idx + 1]?.focus();
//     }
//   };

//   const handleOtpKeyPress = (
//     e: NativeSyntheticEvent<TextInputKeyPressEventData>,
//     idx: number
//   ) => {
//     if (
//       e.nativeEvent.key === "Backspace" &&
//       !otp[idx] &&
//       idx > 0 &&
//       otpRefs.current[idx - 1]
//     ) {
//       otpRefs.current[idx - 1]?.focus();
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
//             <Surface key={idx} style={styles.otpInputSurface} elevation={0}>
//               <TextInput
//                 render={(props) => {
//                   return (
//                     <RNTextInput
//                       {...props}
//                       ref={(el) => {
//                         otpRefs.current[idx] = el;
//                       }}
//                       value={digit}
//                       onChangeText={(text) => handleOtpChange(text, idx)}
//                       onKeyPress={(e) => handleOtpKeyPress(e, idx)}
//                       style={[styles.input]}
//                       keyboardType="number-pad"
//                       maxLength={1}
//                       editable={true}
//                       accessibilityLabel={`Verification code digit ${
//                         idx + 1
//                       } of 6`}
//                       accessibilityRole="text"
//                     />
//                   );
//                 }}
//               />
//             </Surface>
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
//     otpInputContainer: {
//       flexDirection: "row",
//       justifyContent: "center",
//       gap: 8,
//       marginBottom: 16,
//       alignItems: "center",
//       width: "100%",
//       paddingHorizontal: 10,
//     },
//     otpInputSurface: {
//       borderRadius: 12,
//       backgroundColor: "#fff",
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

import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useVerifyOtp } from "@/hooks";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

export default function ForgotPassowrd() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(RNTextInput | null)[]>(Array(6).fill(null));
  const { colors } = useTheme();
  const styles = verifyOtpStyles(colors);

  const router = useRouter();

  const { verifyOtpMutation, verifyOtpMutationPending } = useVerifyOtp();

  const handleOtpChange = (text: string, idx: number) => {
    // Keep only numbers
    const cleaned = text.replace(/[^0-9]/g, "");

    // Handle paste (user pastes full OTP)
    if (cleaned.length > 1) {
      const newOtp = cleaned.slice(0, 6).split("");
      const filledOtp = [...otp];

      newOtp.forEach((digit, i) => {
        if (i < 6) {
          filledOtp[i] = digit;
        }
      });

      setOtp(filledOtp);

      // Focus last filled input or the next empty one
      const nextIndex = Math.min(newOtp.length, 5);
      setTimeout(() => {
        otpRefs.current[nextIndex]?.focus();
      }, 0);

      return;
    }

    // Normal typing - single digit
    const newOtp = [...otp];
    newOtp[idx] = cleaned;
    setOtp(newOtp);

    // Move forward automatically if digit was entered
    if (cleaned && idx < 5) {
      setTimeout(() => {
        otpRefs.current[idx + 1]?.focus();
      }, 0);
    }
  };

  const handleOtpKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    idx: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !otp[idx] && idx > 0) {
      // Move to previous input on backspace
      setTimeout(() => {
        otpRefs.current[idx - 1]?.focus();
      }, 0);
    }
  };

  return (
    <SafeAreaViewContainer className="justify-center flex-1 bg-white">
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        enableAutomaticScroll={true}
        contentContainerClassName="flex-1 justify-center"
      >
        <View className="gap-1 mb-6">
          <Text
            style={{ fontSize: RFValue(24), color: colors.slate[650] }}
            className="font-bold text-center"
          >
            Verify OTP
          </Text>
          <Text
            style={{ fontSize: RFValue(16), color: colors.slate[600] }}
            className="font-normal text-center"
          >
            Please input the code sent to your email / phone number.
          </Text>
        </View>

        <View className="gap-1" style={styles.container}>
          {otp.map((digit, idx) => (
            <View key={idx} style={styles.otpInputSurface}>
              <RNTextInput
                ref={(el) => {
                  otpRefs.current[idx] = el;
                }}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, idx)}
                onKeyPress={(e) => handleOtpKeyPress(e, idx)}
                style={styles.input}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                accessibilityLabel={`Verification code digit ${idx + 1} of 6`}
                accessibilityRole="text"
              />
            </View>
          ))}
        </View>
        <AppButton
          onPress={() => {
            const token = otp.join("");
            if (token.length !== 6) return;

            verifyOtpMutation({ token });
          }}
          title="Verify"
          fullwidth
          variant="primary"
          size="large"
          disabled={
            otp.some((digit) => digit === "") || verifyOtpMutationPending
          }
        />
      </KeyboardAwareScrollView>
    </SafeAreaViewContainer>
  );
}

const verifyOtpStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 20,
    },
    otpInputSurface: {
      borderRadius: 12,
      backgroundColor: "#fff",
      elevation: 0,
    },
    input: {
      width: RFValue(40),
      height: RFValue(46),
      borderRadius: RFValue(12),
      borderWidth: 1.5,
      borderColor: colors.slate[300],
      backgroundColor: colors.background,
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      textAlign: "center",
    },
  });
