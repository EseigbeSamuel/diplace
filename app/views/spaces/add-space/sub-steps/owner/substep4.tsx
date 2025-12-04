import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useSpaceStore } from "@/store/useSpace";

interface LandlordDetailsFormProps {
  onNext: () => void;
  onPrev: () => void;
}

const LandlordDetailsForm: React.FC<LandlordDetailsFormProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, setType, spaceForm } = useSpaceStore();

  const handleNext = () => {
    if (
      !spaceForm.value.ownerDetails?.fullName ||
      !spaceForm.value.ownerDetails?.phoneNumber
    ) {
      return;
    }
    onNext();
  };

  const isFormValid =
    spaceForm.value.ownerDetails?.fullName &&
    spaceForm.value.ownerDetails?.phoneNumber &&
    spaceForm.value.ownerDetails.fullName.trim().length > 0 &&
    spaceForm.value.ownerDetails.phoneNumber.trim().length > 0;

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>
          Tell us about the {spaceForm.type === "event" ? "owner" : "landlord"}
        </Text>

        {/* Full Name Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder=""
            placeholderTextColor={colors.slate[500]}
            value={spaceForm.value.ownerDetails?.fullName || ""}
            onChangeText={(text) => {
              setValue({
                ownerDetails: {
                  ...spaceForm.value.ownerDetails,
                  fullName: text,
                },
              });
            }}
          />
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Phone No.</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeSelector}>
              <Image
                source={require("@/assets/icons/nigeria.png")}
                style={styles.flagIcon}
              />
              <Text style={styles.countryCodeText}>+234</Text>
              <Image
                source={require("@/assets/icons/chevrondown-bold.png")}
                style={styles.chevronDownIcon}
              />
            </View>
            <View style={styles.phoneNumberInput}>
              <TextInput
                style={styles.phoneInputField}
                placeholder="Phone No."
                placeholderTextColor={colors.slate[500]}
                value={spaceForm.value.ownerDetails?.phoneNumber || ""}
                onChangeText={(text) => {
                  setValue({
                    ownerDetails: {
                      ...spaceForm.value.ownerDetails,
                      phoneNumber: text,
                    },
                  });
                }}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Next"
          onPress={handleNext}
          size="large"
          fullwidth={true}
          disabled={!isFormValid}
        />
      </View>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingTop: RFValue(32),
      paddingBottom: RFValue(20),
    },
    title: {
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      lineHeight: RFValue(28),
      marginBottom: RFValue(32),
    },
    inputSection: {
      marginBottom: RFValue(24),
    },
    inputLabel: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    textInput: {
      width: "100%",
      paddingVertical: RFValue(14),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.background,
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    phoneInputContainer: {
      flexDirection: "row",
      gap: RFValue(8),
      borderWidth: 1,
      borderColor: colors.slate[300],
      borderRadius: RFValue(12),
      overflow: "hidden",
    },
    countryCodeSelector: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: RFValue(14),
      paddingHorizontal: RFValue(12),
      backgroundColor: colors.slate[150],
      gap: RFValue(6),
      borderRightWidth: 1,
      borderRightColor: colors.slate[300],
    },
    flagIcon: {
      width: RFValue(20),
      height: RFValue(20),
    },
    countryCodeText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
    },
    chevronDownIcon: {
      width: RFValue(8),
      height: RFValue(8),
      tintColor: colors.slate[600],
    },
    phoneNumberInput: {
      flex: 1,
    },
    phoneInputField: {
      paddingVertical: RFValue(14),
      paddingHorizontal: RFValue(16),
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default LandlordDetailsForm;
