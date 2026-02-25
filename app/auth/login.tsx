import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useGetCurrentUser, useLogin } from "@/hooks";
import { ColorScheme } from "@/utils";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useTheme();
  const router = useRouter();
  const styles = loginStyles(colors);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { loginMutation, loginMutationPending } = useLogin();

  return (
    <SafeAreaViewContainer className="justify-center flex-1 bg-white">
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        enableAutomaticScroll={true}
        contentContainerStyle={{ flex: 1, justifyContent: "center" }}
      >
        <View className="gap-1 mb-6">
          <Text
            style={{
              fontSize: RFValue(24),
              color: colors.slate[650],
              fontFamily: "InstrumentSansBold",
            }}
          >
            Log in
          </Text>
          <Text
            style={{
              fontSize: RFValue(16),
              color: colors.slate[600],
              fontFamily: "InstrumentSansRegular",
            }}
          >
            Welcome back. Log in to get started.
          </Text>
        </View>

        <View className="gap-4">
          <TextInput
            mode="outlined"
            label="Email / Phone No."
            value={formData.username}
            onChangeText={(text) =>
              setFormData({ ...formData, username: text.toString() })
            }
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            left={
              <TextInput.Icon
                icon={() => (
                  <Image
                    source={require("../../assets/icons/mail-outline-light.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                )}
              />
            }
            outlineStyle={styles.outlineStyle}
            style={styles.textInput}
          />

          <TextInput
            mode="outlined"
            label="Password"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text.toString() })
            }
            secureTextEntry={!showPassword}
            left={
              <TextInput.Icon
                icon={() => (
                  <Image
                    source={require("../../assets/icons/password-lock.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                )}
              />
            }
            right={
              <TextInput.Icon
                accessibilityLabel="Show password"
                accessibilityRole="button"
                onPress={() => setShowPassword((prev) => !prev)}
                icon={() => (
                  <Image
                    source={require("../../assets/icons/password-hide.png")}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                )}
              />
            }
            outlineStyle={styles.outlineStyle}
            style={styles.textInput}
          />
          <View className="flex-row justify-end">
            <Link href="/auth/forgot-password" className="text-sm font-medium">
              Forgot Password?
            </Link>
          </View>
          <AppButton
            onPress={() => {
              loginMutation({
                username: formData.username,
                password: formData.password,
              });
            }}
            title="Log in"
            fullwidth
            variant="primary"
            size="large"
            disabled={
              !formData.username || !formData.password || loginMutationPending
            }
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

const loginStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    textInput: {
      backgroundColor: colors.slate[150],
      borderColor: colors.slate[650],
    },
    textInputLabel: {
      color: colors.slate[650],
    },
    textInputPlaceholder: {
      color: colors.slate[400],
    },
    textInputIcon: {
      tintColor: colors.slate[650],
    },
    outlineStyle: {
      borderRadius: 8,
      borderColor: colors.slate[650],
    },
  });
