import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { useChangePassword } from "@/hooks";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

const ChangePassword = () => {
  const { colors } = useTheme();
  const passwordStyles = styles(colors);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const { changePasswordMutation, changePasswordMutationPending } =
    useChangePassword();

  const isNewPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(
    newPassword,
  );
  const doPasswordsMatch =
    newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid =
    !!currentPassword &&
    !!newPassword &&
    !!confirmPassword &&
    isNewPasswordValid &&
    doPasswordsMatch;

  const handleSaveChanges = () => {
    if (!isNewPasswordValid) {
      setValidationError(
        "Password must be at least 8 characters with uppercase, lowercase, and number.",
      );
      return;
    }

    if (!doPasswordsMatch) {
      setValidationError("Confirm password must match new password.");
      return;
    }

    setValidationError("");
    changePasswordMutation({
      old_password: currentPassword,
      new_password: newPassword,
    });
  };

  //   return (
  //     <SafeAreaViewContainer>
  //       <SectionHeader title="Change password" />
  //       <ScrollView showsVerticalScrollIndicator={false}>
  //         <View style={passwordStyles.container}>
  //           {/* Header */}
  //           <View style={passwordStyles.headerSection}>
  //             <Text style={passwordStyles.title}>Change password</Text>
  //             <Text style={passwordStyles.description}>
  //               Follow the steps to create new password
  //             </Text>
  //           </View>

  //           {/* Form */}
  //           <KeyboardAwareScrollView
  //             showsVerticalScrollIndicator={false}
  //             keyboardShouldPersistTaps="handled"
  //             contentContainerStyle={{ paddingBottom: 40 }}
  //           >
  //             <View style={passwordStyles.formSection}>
  //               {/* Current Password */}

  //               <TextField
  //                 type="password"
  //                 label="Current Password"
  //                 value={currentPassword}
  //                 onChange={(value) => {
  //                   setCurrentPassword(value.toString());
  //                   if (validationError) setValidationError("");
  //                 }}
  //                 icon={require("@/assets/icons/Lock.png")}
  //               />

  //               {/* New Password */}

  //               <TextField
  //                 type="password"
  //                 label="New Password"
  //                 value={newPassword}
  //                 onChange={(value) => {
  //                   setNewPassword(value.toString());
  //                   if (validationError) setValidationError("");
  //                 }}
  //                 icon={require("@/assets/icons/Lock.png")}
  //                 subText="Must be 8+ chars with uppercase, lowercase and number"
  //               />

  //               {/* Confirm New Password */}

  //               <TextField
  //                 type="password"
  //                 label="Confirm New Password"
  //                 value={confirmPassword}
  //                 onChange={(value) => {
  //                   setConfirmPassword(value.toString());
  //                   if (validationError) setValidationError("");
  //                 }}
  //                 icon={require("@/assets/icons/Lock.png")}
  //                 subText="Must match with the new password"
  //               />
  //               {!!validationError && (
  //                 <Text style={passwordStyles.errorText}>{validationError}</Text>
  //               )}
  //             </View>
  //           </KeyboardAwareScrollView>
  //         </View>
  //       </ScrollView>

  //       {/* Save Button - Fixed at bottom */}
  //       <View style={passwordStyles.buttonContainer}>
  //         <AppButton
  //           title={
  //             changePasswordMutationPending ? "Saving changes..." : "Save changes"
  //           }
  //           onPress={handleSaveChanges}
  //           size="large"
  //           variant="primary"
  //           disabled={!isFormValid || changePasswordMutationPending}
  //           fullwidth={true}
  //         />
  //       </View>
  //     </SafeAreaViewContainer>
  //   );
  // };
  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Change password" />

      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        extraScrollHeight={RFValue(20)}
        contentContainerStyle={passwordStyles.scrollContent}
      >
        <View  className="flex-1">
          {/* Header */}
          <View style={passwordStyles.headerSection}>
            <Text style={passwordStyles.title} className="font-bold">Change password</Text>

            <Text style={passwordStyles.description}>
              Follow the steps to create new password
            </Text>
          </View>

          {/* Form */}
          <View style={passwordStyles.formSection}>
            <TextField
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(value) => {
                setCurrentPassword(value.toString());
                if (validationError) setValidationError("");
              }}
              icon={require("@/assets/icons/Lock.png")}
            />

            <TextField
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(value) => {
                setNewPassword(value.toString());
                if (validationError) setValidationError("");
              }}
              icon={require("@/assets/icons/Lock.png")}
              subText="Must be 8+ chars with uppercase, lowercase and number"
            />

            <TextField
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value.toString());
                if (validationError) setValidationError("");
              }}
              icon={require("@/assets/icons/Lock.png")}
              subText="Must match with the new password"
            />

            {!!validationError && (
              <Text style={passwordStyles.errorText} className="text-[#EF4444]">{validationError}</Text>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Fixed button */}
      <View style={passwordStyles.buttonContainer}>
        <AppButton
          title={
            changePasswordMutationPending ? "Saving changes..." : "Save changes"
          }
          onPress={handleSaveChanges}
          size="large"
          variant="primary"
          disabled={!isFormValid || changePasswordMutationPending}
          fullwidth
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default ChangePassword;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {},
    headerSection: {
      paddingTop: RFValue(20),
      marginBottom: RFValue(32),
    },
    title: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(8)},
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
    inputContainer: {backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
paddingHorizontal: RFValue(16),
paddingVertical: RFValue(16),
gap: RFValue(12)},
    inputIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
    textInput: {fontSize: RFValue(15),
color: colors.slate[650]},
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
    errorText: {fontSize: RFValue(13),
paddingLeft: RFValue(4),
marginTop: RFValue(4)},
    buttonContainer: {
      paddingVertical: RFValue(20),
    },
    scrollContent: {paddingBottom: RFValue(40)},
  });
