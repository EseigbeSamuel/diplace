import AppButton from "@/components/button";
import OTPInput from "@/components/otp-input";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

export default function ForgotPassowrd() {
  const { colors } = useTheme();

  const router = useRouter();

  const [formData, setFormData] = useState({
    otp: "",
  });

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

        <View className="gap-4">
          <OTPInput
            length={6}
            onChange={(otp) => setFormData({ ...formData, otp })}
          />

          <AppButton
            onPress={() => router.navigate("/auth/create-password")}
            title="Verify"
            fullwidth
            variant="primary"
            size="large"
            disabled={formData.otp.length !== 6}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaViewContainer>
  );
}
