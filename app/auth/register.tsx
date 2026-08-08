import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useRegister } from "@/hooks";
import { ColorScheme } from "@/utils";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { colors, isDarkMode } = useTheme();
  const styles = registerStyles(colors);
  const { registerMutation, registerMutationPending } = useRegister();

  const router = useRouter();

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
            Create account
          </Text>
          <Text
            style={{ fontSize: RFValue(16), color: colors.slate[600] }}
            className="font-normal"
          >
            Please complete the form to create your account.
          </Text>
        </View>

        <View className="gap-4">
          <TextInput
            mode="outlined"
            label="Email"
            value={formData.email}
            onChangeText={(text) =>
              setFormData({ ...formData, email: text.toString() })
            }
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            textColor={colors.slate[650]}
            placeholderTextColor={colors.slate[450]}
            outlineColor={colors.slate[300]}
            activeOutlineColor={colors.slate[650]}
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
            label="Phone No."
            value={formData.phone}
            onChangeText={(text) =>
              setFormData({ ...formData, phone: text.toString() })
            }
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            autoCapitalize="none"
            autoCorrect={false}
            textColor={colors.slate[650]}
            placeholderTextColor={colors.slate[450]}
            outlineColor={colors.slate[300]}
            activeOutlineColor={colors.slate[650]}
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
            textColor={colors.slate[650]}
            placeholderTextColor={colors.slate[450]}
            outlineColor={colors.slate[300]}
            activeOutlineColor={colors.slate[650]}
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
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                accessibilityRole="button"
                onPress={() => setShowPassword((prev) => !prev)}
                icon={() => (
                  <Image
                    source={
                      showPassword
                        ? isDarkMode
                          ? require("../../assets/icons/eye-open-light.png")
                          : require("../../assets/icons/eye-open-dark.png")
                        : isDarkMode
                        ? require("../../assets/icons/eye-closed-light.png")
                        : require("../../assets/icons/eye-closed-dark.png")
                    }
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
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text.toString() })
            }
            secureTextEntry={!showConfirmPassword}
            textColor={colors.slate[650]}
            placeholderTextColor={colors.slate[450]}
            outlineColor={colors.slate[300]}
            activeOutlineColor={colors.slate[650]}
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
                accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
                accessibilityRole="button"
                onPress={() => setShowConfirmPassword((prev) => !prev)}
                icon={() => (
                  <Image
                    source={
                      showConfirmPassword
                        ? isDarkMode
                          ? require("../../assets/icons/eye-open-light.png")
                          : require("../../assets/icons/eye-open-dark.png")
                        : isDarkMode
                        ? require("../../assets/icons/eye-closed-light.png")
                        : require("../../assets/icons/eye-closed-dark.png")
                    }
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                )}
              />
            }
            outlineStyle={styles.outlineStyle}
            style={styles.textInput}
          />

          <AppButton
            onPress={() => {
              registerMutation({
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
              });
            }}
            title="Create Account"
            fullwidth
            variant="primary"
            size="large"
            disabled={
              !formData.email ||
              !formData.password ||
              !formData.confirmPassword ||
              !formData.phone ||
              registerMutationPending
            }
          />
        </View>

        <View className="flex-row justify-center mt-8">
          <Text
            style={[{ color: colors.slate[650] }]}
            className="text-sm font-medium"
          >
            Or continue with
          </Text>
        </View>

        <View className="justify-center gap-2 mt-2">
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
          <Text
            style={[{ color: colors.slate[650] }]}
            className="text-base font-medium flex gap-2"
          >
            I already have an account?{" "}
            <Link href="/auth/login" className="text-[#3B82F6]">
              Log in
            </Link>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaViewContainer>
  );
}

const registerStyles = (colors: ColorScheme) =>
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
