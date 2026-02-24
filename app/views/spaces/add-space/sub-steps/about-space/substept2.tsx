import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { SimpleSelector } from "@/components/selector";
import { useSpaceStore } from "@/store/useSpace";

interface PropertyTypeSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const EventTypeSubstep: React.FC<PropertyTypeSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, spaceForm } = useSpaceStore();

  const propertyTypes = [
    { id: "indoor", label: "Indoor" },
    { id: "outdoor", label: "Open air / Outdoor" },
  ];

  const handleNext = () => {
    if (!spaceForm.value.eventSpace) return;
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
        {/* Property Type Section */}
        <View style={styles.section}>
          <Text style={styles.title}>What kind of event space is it?</Text>

          <View style={styles.optionsContainer}>
            {propertyTypes.map((type) => (
              <View key={type.id}>
                <SimpleSelector
                  title={type.label}
                  isChecked={spaceForm.value.eventSpace === type.id}
                  onChange={() =>
                    setValue({ eventSpace: type.id as "indoor" | "outdoor" })
                  }
                />
              </View>
            ))}
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
          disabled={!spaceForm.value.eventSpace}
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
      paddingHorizontal: RFValue(4),
      paddingTop: RFValue(32),
    },
    section: {
      marginBottom: RFValue(40),
    },
    title: {
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      lineHeight: RFValue(28),
      marginBottom: RFValue(20),
    },
    optionsContainer: {
      gap: RFValue(12),
    },
    numericFieldWrapper: {
      marginTop: RFValue(8),
      alignSelf: "center",
    },
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default EventTypeSubstep;
