import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useSpaceStore } from "@/store/useSpace";

interface InspectionFeeSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const InspectionFeeSubstep: React.FC<InspectionFeeSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, spaceForm } = useSpaceStore();

  const handleFeeChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setValue({ inspectionFee: numericValue ? parseInt(numericValue) : 0 });
  };

  const formatCurrency = (value: number) => {
    if (!value) return "";
    return value.toLocaleString();
  };

  const handleNext = () => {
    onNext();
  };

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
          What is the inspection fee to view this space physically?
        </Text>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>₦</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={colors.slate[400]}
              value={formatCurrency(spaceForm.value.inspectionFee || 0)}
              onChangeText={handleFeeChange}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Helper Text */}
          <Text style={styles.helperText}>
            <Image
              source={require("@/assets/icons/Danger - Iconly Pro-1.png")}
              style={styles.cautionIcon}
            />
            This should Not exceed{" "}
            <Text style={styles.helperTextBold}>₦3000</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Next"
          onPress={handleNext}
          size="large"
          fullwidth={true}
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
      paddingVertical: RFValue(20),
      alignItems: "center",
      flexGrow: 1,
    },
    title: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(20),
    },
    inputContainer: {
      width: "100%",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: RFValue(32),
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: RFValue(16),
      backgroundColor: colors.slate[200],
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(8),
    },
    currencySymbol: {
      fontSize: RFValue(40),
      fontWeight: "700",
      color: colors.slate[650],
      marginRight: RFValue(8),
    },
    input: {
      fontSize: RFValue(40),
      fontWeight: "700",
      color: colors.slate[650],
      minWidth: RFValue(100),
      textAlign: "center",
      padding: 0,
    },
    cautionIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.warning[200],
      marginRight: RFValue(10),
    },
    helperText: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      textAlign: "center",
    },
    helperTextBold: {
      fontWeight: "600",
      color: colors.slate[650],
    },
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default InspectionFeeSubstep;
