import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppButton from "@/components/button";
import NumericField from "@/components/NumberField";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { SimpleSelector } from "@/components/selector";
import { useSpaceStore } from "@/store/useSpace";
import { SpaceType } from "@/types/add-space-types";

interface PropertyTypeSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const PropertyTypeSubstep: React.FC<PropertyTypeSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const { setValue, setType, spaceForm } = useSpaceStore();
  const styles = createStyles(colors);

  const propertyTypes = [
    { id: "apartment", label: "Apartment" },
    { id: "event", label: "Event Center" },
    { id: "shop", label: "Shop" },
    { id: "office", label: "Office" },
  ];

  const handleNext = () => {
    // Validate before moving forward
    if (Number(spaceForm.value.units) > 0 || spaceForm.type) {
      onNext();
    }
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
          <Text style={styles.title}>What type of property is this space?</Text>

          <View style={styles.optionsContainer}>
            {propertyTypes.map((type) => (
              <View key={type.id}>
                <SimpleSelector
                  title={type.label}
                  isChecked={spaceForm.type === type.id}
                  onChange={() => setType(type.id as SpaceType)}
                  key={type.id}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Units Available Section */}
        <View style={styles.section}>
          <Text style={styles.title}>How many units are available?</Text>
          <View style={styles.numericFieldWrapper}>
            <NumericField
              value={spaceForm.value.units || 0}
              onChange={(value) => setValue({ units: value })}
              shadowed={true}
            />
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
          disabled={spaceForm.value.units === 0 || !spaceForm.type}
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
    numericFieldWrapper: {
      marginTop: RFValue(8),
      alignSelf: "center",
    },
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default PropertyTypeSubstep;
