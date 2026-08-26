import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { useResetPassword } from "@/hooks";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

export default function CreatePassword() {
  const { colors } = useTheme();
  const searchParams = useLocalSearchParams<{ token?: string }>();
  const { resetPasswordMutation, isResetPasswordPending } = useResetPassword();

  const [formData, setFormData] = useState({
    token: searchParams.token || "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");

  const handleSubmit = () => {
    if (!formData.token.trim()) {
      setValidationError("Reset token is required.");
      return;
    }
    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setValidationError("");
    resetPasswordMutation({
      token: formData.token.trim(),
      new_password: formData.password,
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
            Create new password
          </Text>
          <Text
            style={{ fontSize: RFValue(16), color: colors.slate[600] }}
            className="font-normal"
          >
            Enter your reset token and new password.
          </Text>
        </View>

        <View className="gap-4">
          {!searchParams.token && (
            <TextField
              label="Reset Token / Code"
              value={formData.token}
              onChange={(text) => {
                setFormData({ ...formData, token: text.toString() });
                if (validationError) setValidationError("");
              }}
              placeholder="Paste your reset token"
              icon={require("../../assets/icons/password-lock.png")}
            />
          )}

          <TextField
            label="New Password"
            value={formData.password}
            onChange={(text) => {
              setFormData({ ...formData, password: text.toString() });
              if (validationError) setValidationError("");
            }}
            placeholder="New Password"
            icon={require("../../assets/icons/password-lock.png")}
            type="password"
          />

          <TextField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(text) => {
              setFormData({ ...formData, confirmPassword: text.toString() });
              if (validationError) setValidationError("");
            }}
            placeholder="Confirm Password"
            icon={require("../../assets/icons/password-lock.png")}
            type="password"
          />

          {!!validationError && (
            <Text
              style={{
                color: "#EF4444",
                fontSize: RFValue(13),
                marginTop: -4,
                paddingLeft: RFValue(4),
              }}
            >
              {validationError}
            </Text>
          )}

          <AppButton
            onPress={handleSubmit}
            title={isResetPasswordPending ? "Resetting password..." : "Reset Password"}
            fullwidth
            variant="primary"
            size="large"
            disabled={
              !formData.token ||
              !formData.confirmPassword ||
              !formData.password ||
              isResetPasswordPending
            }
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaViewContainer>
  );
}
