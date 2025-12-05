import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppButton from "@/components/button";
import NumericField from "@/components/NumberField";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useSpaceStore } from "@/store/useSpace";

interface CapacitySubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const CapacitySubstep: React.FC<CapacitySubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const { setValue, spaceForm } = useSpaceStore();
  const styles = createStyles(colors);

  const handleNext = () => {
    // Validate if needed
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
        <Text style={styles.title}>Let's know the capacity of the space.</Text>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Rooms */}
          <View style={styles.fieldRow}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>How many rooms are there?</Text>
            </View>
            <View style={styles.inputContainer}>
              <NumericField
                onChange={(value) =>
                  setValue({
                    capacity: { ...spaceForm.value.capacity, rooms: value },
                  })
                }
                value={spaceForm.value.capacity?.rooms || 0}
              />
            </View>
          </View>

          {/* Bathrooms */}
          <View style={styles.fieldRow}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>How many bathrooms are there?</Text>
            </View>
            <View style={styles.inputContainer}>
              <NumericField
                onChange={(value) =>
                  setValue({
                    capacity: { ...spaceForm.value.capacity, bathrooms: value },
                  })
                }
                value={spaceForm.value.capacity?.bathrooms || 0}
              />
            </View>
          </View>

          {/* Kitchens */}
          <View style={styles.fieldRow}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>How many kitchens are there?</Text>
            </View>
            <View style={styles.inputContainer}>
              <NumericField
                onChange={(value) =>
                  setValue({
                    capacity: { ...spaceForm.value.capacity, kitchens: value },
                  })
                }
                value={spaceForm.value.capacity?.kitchens || 0}
              />
            </View>
          </View>

          {/* Room Size */}
          <View style={styles.fieldRow}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>What is the size of the room?</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="12ft x 2ft"
                placeholderTextColor={colors.slate[500]}
                onChangeText={(text) =>
                  setValue({
                    capacity: {
                      ...spaceForm.value.capacity,
                      roomSize: text,
                    },
                  })
                }
                value={spaceForm.value.capacity?.roomSize || ""}
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
          disabled={
            spaceForm.value.capacity?.rooms === 0 ||
            spaceForm.value.capacity?.bathrooms === 0 ||
            spaceForm.value.capacity?.kitchens === 0 ||
            !spaceForm.value.capacity?.roomSize
          }
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
    formContainer: {
      gap: RFValue(24),
    },
    fieldRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: RFValue(16),
    },
    labelContainer: {
      flex: 1,
    },
    label: {
      fontSize: RFValue(15),
      color: colors.slate[600],
      lineHeight: RFValue(22),
    },
    inputContainer: {
      width: RFValue(120),
    },
    textInput: {
      width: "100%",
      paddingVertical: RFValue(12),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.background,
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      fontSize: RFValue(15),
      color: colors.slate[650],
      textAlign: "center",
    },
    buttonContainer: {
      paddingHorizontal: RFValue(4),
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default CapacitySubstep;
