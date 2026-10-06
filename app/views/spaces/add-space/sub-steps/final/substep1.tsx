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
    const parsed = numericValue ? parseInt(numericValue, 10) : 0;
    const capped = Math.min(parsed, 3000);
    setValue({ inspectionFee: capped });
  };

  const formatCurrency = (value: number) => {
    if (!value) return "";
    return value.toLocaleString();
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <View style={styles.container} className="flex-1">
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title} className="font-bold">
          What is the inspection fee to view this space physically?
        </Text>

        {/* Input Container */}
        <View style={styles.inputContainer} className="w-[100%px] flex-1 justify-center items-center">
          <View style={styles.inputWrapper} className="flex-row items-center justify-center">
            <Text style={styles.currencySymbol} className="font-bold">₦</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={colors.slate[400]}
              value={formatCurrency(spaceForm.value.inspectionFee || 0)}
              onChangeText={handleFeeChange}
              keyboardType="numeric"
              maxLength={10}
             className="font-bold text-center p-[0px]"/>
          </View>

          {/* Helper Text */}
          <Text style={styles.helperText} className="text-center">
            <Image
              source={require("@/assets/icons/Danger - Iconly Pro-1.png")}
              style={styles.cautionIcon}
            />
            This should Not exceed{" "}
            <Text style={styles.helperTextBold} className="font-semibold">₦3000</Text>
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
          disabled={(spaceForm.value.inspectionFee || 0) > 3000}
        />
      </View>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {backgroundColor: colors.background},
    scrollContent: {paddingVertical: RFValue(20)},
    title: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(20)},
    inputContainer: {marginBottom: RFValue(32)},
    inputWrapper: {marginBottom: RFValue(16),
backgroundColor: colors.slate[200],
paddingHorizontal: RFValue(16),
paddingVertical: RFValue(8)},
    currencySymbol: {fontSize: RFValue(40),
color: colors.slate[650],
marginRight: RFValue(8)},
    input: {fontSize: RFValue(40),
color: colors.slate[650],
minWidth: RFValue(100)},
    cautionIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.warning[200],
      marginRight: RFValue(10),
    },
    helperText: {fontSize: RFValue(13),
color: colors.slate[500]},
    helperTextBold: {color: colors.slate[650]},
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default InspectionFeeSubstep;

