import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ChangePassword = () => {
  const { colors } = useTheme();
  const passwordStyles = styles(colors);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isNewPasswordValid = newPassword.length >= 8;
  const doPasswordsMatch =
    newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid = currentPassword && isNewPasswordValid && doPasswordsMatch;

  const handleSaveChanges = () => {
    if (isFormValid) {
      // Handle password change logic
      console.log("Saving new password...");
    }
  };

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Change password" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={passwordStyles.container}>
          {/* Header */}
          <View style={passwordStyles.headerSection}>
            <Text style={passwordStyles.title}>Change password</Text>
            <Text style={passwordStyles.description}>
              Follow the steps to create new password
            </Text>
          </View>

          {/* Form */}
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <View style={passwordStyles.formSection}>
              {/* Current Password */}
              <View style={passwordStyles.inputGroup}>
                <View style={passwordStyles.inputContainer}>
                  <Image
                    source={require("@/assets/icons/Lock.png")}
                    style={passwordStyles.inputIcon}
                  />
                  <TextInput
                    style={passwordStyles.textInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Current Password"
                    placeholderTextColor={colors.slate[450]}
                    secureTextEntry={!showCurrentPassword}
                  />
                  <Pressable
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Image
                      source={
                        showCurrentPassword
                          ? require("@/assets/icons/password-show.png")
                          : require("@/assets/icons/password-hide.png")
                      }
                      style={passwordStyles.eyeIcon}
                    />
                  </Pressable>
                </View>
              </View>

              {/* New Password */}
              <View style={passwordStyles.inputGroup}>
                <View style={passwordStyles.inputContainer}>
                  <Image
                    source={require("@/assets/icons/Lock.png")}
                    style={passwordStyles.inputIcon}
                  />
                  <TextInput
                    style={passwordStyles.textInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    placeholderTextColor={colors.slate[450]}
                    secureTextEntry={!showNewPassword}
                  />
                  <Pressable
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Image
                      source={
                        showNewPassword
                          ? require("@/assets/icons/password-show.png")
                          : require("@/assets/icons/password-hide.png")
                      }
                      style={passwordStyles.eyeIcon}
                    />
                  </Pressable>
                </View>
                <Text style={passwordStyles.helperText}>
                  Must be at least 8 characters
                </Text>
              </View>

              {/* Confirm New Password */}
              <View style={passwordStyles.inputGroup}>
                <View style={passwordStyles.inputContainer}>
                  <Image
                    source={require("@/assets/icons/Lock.png")}
                    style={passwordStyles.inputIcon}
                  />
                  <TextInput
                    style={passwordStyles.textInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm New Password"
                    placeholderTextColor={colors.slate[450]}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Image
                      source={
                        showConfirmPassword
                          ? require("@/assets/icons/password-show.png")
                          : require("@/assets/icons/password-hide.png")
                      }
                      style={passwordStyles.eyeIcon}
                    />
                  </Pressable>
                </View>
                <Text style={passwordStyles.helperText}>
                  Must match with the new password
                </Text>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>

      {/* Save Button - Fixed at bottom */}
      <View style={passwordStyles.buttonContainer}>
        <AppButton
          title="Save changes"
          onPress={handleSaveChanges}
          size="large"
          variant={isFormValid ? "primary" : "secondary"}
          disabled={!isFormValid}
          fullwidth={true}
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default ChangePassword;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: RFValue(16),
    },
    headerSection: {
      paddingTop: RFValue(20),
      marginBottom: RFValue(32),
    },
    title: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    description: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      lineHeight: RFValue(20),
    },
    formSection: {
      gap: RFValue(24),
    },
    inputGroup: {
      gap: RFValue(8),
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(16),
      gap: RFValue(12),
    },
    inputIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
    textInput: {
      flex: 1,
      fontSize: RFValue(15),
      color: colors.slate[650],
      padding: 0,
    },
    eyeIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
    helperText: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      paddingLeft: RFValue(4),
    },
    buttonContainer: {
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(20),
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.slate[300],
    },
  });
