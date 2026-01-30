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
import TextField from "@/components/textfield";

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

              <TextField
                type="password"
                label="Current Password"
                value={currentPassword}
                onChange={(value) => setCurrentPassword(value.toString())}
                icon={require("@/assets/icons/Lock.png")}
              />

              {/* New Password */}

              <TextField
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(value) => setNewPassword(value.toString())}
                icon={require("@/assets/icons/Lock.png")}
                subText="Must be at least 8 characters"
              />

              {/* Confirm New Password */}

              <TextField
                type="password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(value) => setConfirmPassword(value.toString())}
                icon={require("@/assets/icons/Lock.png")}
                subText="Must match with the new password"
              />
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
          variant="primary"
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
      gap: RFValue(10),
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
      paddingVertical: RFValue(20),
    },
  });
