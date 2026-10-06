import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useSpaceStore } from "@/store/useSpace";

interface AmenitiesSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const AmenitiesSubstep: React.FC<AmenitiesSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { spaceForm, setValue } = useSpaceStore();

  const amenities = [
    "Wardrobe",
    "Shower",
    "POP ceiling",
    "Prepaid meter",
    "Estate security",
    "Air conditioned",
    "Standby generator",
    "Lighting fixtures",
    "Chairs & tables",
    "CCTV",
    "Kitchen cabinet",
    "Ceiling fan",
    "Elevator",
    "Smart locks",
    "Fire alarm",
    "Smoke detector",
    "Water heater",
    "Gym center",
    "Swimming pool",
  ];

  const toggleAmenity = (amenity: string) => {
    const current = spaceForm.value.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((item) => item !== amenity)
      : [...current, amenity];

    setValue({ amenities: updated });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <View style={styles.container} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title} className="font-semibold">
          What amenities are available in this space?
        </Text>

        {/* Amenities Grid */}
        <View style={styles.amenitiesGrid} className="flex-row flex-wrap">
          {amenities.map((amenity) => (
            <Pressable
              key={amenity}
              style={[
                styles.amenityChip,
                spaceForm.value.amenities?.includes(amenity) &&
                  styles.amenityChipSelected,
              ]}
              onPress={() => toggleAmenity(amenity)}
             className="border-[1px]">
              <Text
                style={[
                  styles.amenityText,
                  spaceForm.value.amenities?.includes(amenity) &&
                    styles.amenityTextSelected,
                ]}
               className="font-normal">
                {amenity}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Next"
          onPress={handleNext}
          size="large"
          fullwidth={true}
          disabled={
            !spaceForm.value.amenities || spaceForm.value.amenities.length === 0
          }
        />
      </View>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {backgroundColor: colors.background},
    scrollContent: {
      paddingTop: RFValue(32),
      paddingBottom: RFValue(20),
    },
    title: {fontSize: RFValue(20),
color: colors.slate[650],
lineHeight: RFValue(28),
marginBottom: RFValue(24)},
    amenitiesGrid: {gap: RFValue(12)},
    amenityChip: {paddingVertical: RFValue(12),
paddingHorizontal: RFValue(16),
backgroundColor: colors.slate[150],
borderRadius: RFValue(24),
borderColor: colors.slate[300]},
    amenityChipSelected: {
      backgroundColor: colors.slate[650],
      borderColor: colors.slate[650],
    },
    amenityText: {fontSize: RFValue(14),
color: colors.slate[650]},
    amenityTextSelected: {color: colors.background},
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default AmenitiesSubstep;
