import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { useForgotPassword } from "@/hooks";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

export default function ForgotPassword() {
  const { colors } = useTheme();
  const { forgotPasswordMutation, isForgotPasswordPending } = useForgotPassword();

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSubmit = () => {
    if (!formData.email.trim()) return;
    forgotPasswordMutation({
      email: formData.email.trim(),
    });
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
            className="font-bold"
          >
            Forgot Password
          </Text>
          <Text
            style={{ fontSize: RFValue(16), color: colors.slate[600] }}
            className="font-normal"
          >
            Follow the steps to create new password.
          </Text>
        </View>

        <View className="gap-4">
          <TextField
            label="Email Address"
            value={formData.email}
            onChange={(text) =>
              setFormData({ ...formData, email: text.toString() })
            }
            placeholder="Enter your email"
            icon={require("../../assets/icons/mail-outline-light.png")}
            type="email"
          />

          <AppButton
            onPress={handleSubmit}
            title={isForgotPasswordPending ? "Sending link..." : "Send Reset Link"}
            fullwidth
            variant="primary"
            size="large"
            disabled={!formData.email || isForgotPasswordPending}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaViewContainer>
  );
}
