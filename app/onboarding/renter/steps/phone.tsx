import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

type Props = {
  onNext: () => void;
};

const OTP_LENGTH = 5;

const Phone = ({ onNext }: Props) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState({ num: "" });
  const [otp, setOtp] = useState("");
  const hiddenInputRef = useRef<TextInput | null>(null);

  const [selectedCountry, setSelectedCountry] = useState({
    callingCode: "234",
    cca2: "NG",
  });

  // resend timer
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isResendingAllowed, setIsResendingAllowed] = useState(false);

  // Focus hidden input when OTP step shows
  useEffect(() => {
    if (step === "otp") {
      // small delay to ensure layout is ready
      const t = setTimeout(() => hiddenInputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [step]);

  // countdown for resend
  useEffect(() => {
    if (step !== "otp") return;
    setSecondsLeft(60);
    setIsResendingAllowed(false);
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          setIsResendingAllowed(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // handle OTP text changes from hidden input
  const handleHiddenInputChange = (text: string) => {
    // keep only digits and cut to length
    const cleaned = text.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtp(cleaned);

    if (cleaned.length === OTP_LENGTH) {
      // small delay so last digit UI appears before submit
      setTimeout(() => {
        handleVerifyOtp(cleaned);
      }, 150);
      Keyboard.dismiss();
    }
  };

  const handleVerifyPhone = () => {
    if (phone.num.trim().length < 1) return;
    // TODO: call send OTP API here
    setStep("otp");
  };

  const handleVerifyOtp = (code?: string) => {
    const codeToVerify = code ?? otp;
    if (codeToVerify.length !== OTP_LENGTH) return;
    // TODO: verify OTP API
    // on success:
    onNext();
  };

  const handleResend = () => {
    if (!isResendingAllowed) return;
    // TODO: call resend OTP API
    setOtp("");
    setSecondsLeft(60);
    setIsResendingAllowed(false);
    hiddenInputRef.current?.focus();
  };

  const renderOtpBoxes = () => {
    const digits = otp.split("");
    return Array.from({ length: OTP_LENGTH }).map((_, i) => {
      const char = digits[i] ?? "";
      return (
        <TouchableOpacity
          key={i}
          activeOpacity={0.9}
          onPress={() => hiddenInputRef.current?.focus()}
          className="w-12 h-14 border rounded-lg  items-center justify-center"
          style={{
            borderColor: char ? colors.slate?.[600] ?? "#111" : "#D1D5DB",
            borderWidth: 1.5,
          }}
        >
          <Text className="text-xl font-semibold" style={Styles.text}>
            {char}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaViewContainer>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={20}
        enableAutomaticScroll
        contentContainerClassName="flex-1 justify-center"
      >
        {step === "phone" && (
          <View className="flex-col justify-between h-full">
            <View className="gap-5">
              <Image source={require("@/assets/icons/Call - Iconly Pro.png")} />

              <View>
                <Text style={Styles.headText} className="font-semibold">
                  Verify your phone number
                </Text>
                <Text style={Styles.text}>
                  We will send an OTP to your phone number to verify your
                  account.
                </Text>
              </View>

              <TextField
                value={phone.num}
                label="Phone No."
                onChange={(text) =>
                  setPhone({ ...phone, num: text.toString() })
                }
                keyboardType="numeric"
                placeholder="Phone No."
                icon={require("@/assets/icons/Call - Iconly Pro-1.png")}
              />
            </View>

            <View className="w-full">
              <AppButton
                title="Continue"
                onPress={handleVerifyPhone}
                fullwidth
                disabled={phone.num.length < 1}
              />
            </View>
          </View>
        )}

        {step === "otp" && (
          <View className="flex-col justify-between h-full">
            <View className="gap-5">
              <View className="items-center">
                <Text
                  className="text-2xl font-semibold"
                  style={{ color: colors.slate?.[650] }}
                >
                  Enter OTP
                </Text>
                <Text
                  className="text-base mt-2"
                  style={{ color: colors.slate?.[600] }}
                >
                  We sent a {OTP_LENGTH}-digit code to your phone number.
                </Text>
              </View>

              {/* Hidden input captures all digits (best UX) */}
              <TextInput
                ref={hiddenInputRef}
                value={otp}
                onChangeText={handleHiddenInputChange}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                returnKeyType="done"
                className="absolute opacity-0"
                importantForAutofill="yes"
                autoFocus={true}
              />

              {/* Visible boxes */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => hiddenInputRef.current?.focus()}
                className="flex-row justify-between mt-2"
              >
                {renderOtpBoxes()}
              </TouchableOpacity>

              {/* resend + timer */}
              <View className="flex-row justify-center items-center mt-3">
                <Text
                  className="text-sm"
                  style={{ color: colors.slate?.[600] }}
                >
                  Didn't receive code?{" "}
                </Text>
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={!isResendingAllowed}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isResendingAllowed ? "text-blue-600" : ""
                    }`}
                    style={!isResendingAllowed ? Styles.text : undefined}
                  >
                    {isResendingAllowed
                      ? "Resend"
                      : `Resend in ${secondsLeft}s`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="w-full">
              <AppButton
                title="Verify OTP"
                onPress={() => handleVerifyOtp()}
                fullwidth
                disabled={otp.length < OTP_LENGTH}
              />
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaViewContainer>
  );
};

export default Phone;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    headText: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    container: {
      backgroundColor: colors.background,
    },
    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
  });
