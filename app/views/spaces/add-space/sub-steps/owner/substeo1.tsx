import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
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

const PropertyOwnerSubstep: React.FC<PropertyTypeSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, spaceForm } = useSpaceStore();

  const propertyTypes = [
    {
      id: "myself",
      label:
        spaceForm.type === "event"
          ? "My business / company"
          : "I own the space",
    },
    {
      id: "3rdparty",
      label:
        spaceForm.type === "event"
          ? "I am a third party agent of this space"
          : "I am the agent / property manager",
    },
  ];

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
        {/* Property Type Section */}
        <View style={styles.section}>
          <Text style={styles.title}>Who owns this space?</Text>

          <View style={styles.optionsContainer}>
            {propertyTypes.map((type) => (
              <View key={type.id}>
                <SimpleSelector
                  title={type.label}
                  isChecked={spaceForm.value.owner === type.id}
                  onChange={() =>
                    setValue({ owner: type.id as "myself" | "3rdparty" })
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

    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default PropertyOwnerSubstep;
