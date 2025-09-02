import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

export default function Login() {
  const { colors } = useTheme();

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
            Log in
          </Text>
          <Text
            style={{ fontSize: RFValue(16), color: colors.slate[600] }}
            className="font-normal"
          >
            Welcome back. Log in to get started.
          </Text>
        </View>

        <View className="gap-4">
          <TextField
            label="Email / Phone No."
            value={formData.email}
            onChange={(text) =>
              setFormData({ ...formData, email: text.toString() })
            }
            placeholder="Email / Phone No."
            icon={require("../../assets/icons/mail-outline-light.png")}
          />
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
          <View className="flex-row justify-end">
            <Link href="/auth/forgot-password" className="text-sm font-medium">
              Forgot Password?
            </Link>
          </View>
          <AppButton
            onPress={() => {
              if (formData.email.toLocaleLowerCase() === "emmanuel") {
                router.replace("/(onboarding)/welcome");
              } else {
                router.replace("/(tabs)");
              }
            }}
            title="Log in"
            fullwidth
            variant="primary"
            size="large"
            disabled={!formData.email || !formData.password}
          />
        </View>

        <View className="flex-row justify-center mt-8">
          <Text className="text-sm font-medium">Or continue with</Text>
        </View>

        <View className="justify-center gap-4 mt-4">
          <AppButton
            onPress={() => {}}
            title="Google"
            fullwidth
            variant="tertiary"
            beforeIcon={require("../../assets/icons/google.png")}
            size="large"
          />
          <AppButton
            onPress={() => {}}
            title="Apple"
            fullwidth
            variant="tertiary"
            beforeIcon={require("../../assets/icons/apple.png")}
            size="large"
          />
        </View>
        <View className="flex-row justify-center mt-8">
          <Text className="text-base font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[#3B82F6]">
              Create Account
            </Link>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaViewContainer>
  );
}
