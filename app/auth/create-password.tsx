import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

export default function Login() {
  const { colors } = useTheme();

  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
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
            className="font-bold"
          >
            Create new password
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
            label="Password"
            value={formData.password}
            onChange={(text) =>
              setFormData({ ...formData, password: text.toString() })
            }
            placeholder="Password"
            icon={require("../../assets/icons/password-lock.png")}
            type="password"
          />
          <TextField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(text) =>
              setFormData({ ...formData, confirmPassword: text.toString() })
            }
            placeholder="Password"
            icon={require("../../assets/icons/password-lock.png")}
            type="password"
          />

          <AppButton
            onPress={() => router.navigate("/auth/login")}
            title="Proceed to Log in"
            fullwidth
            variant="primary"
            size="large"
            disabled={!formData.confirmPassword || !formData.password}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaViewContainer>
  );
}
