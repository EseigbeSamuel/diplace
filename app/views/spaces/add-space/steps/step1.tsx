import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import AppButton from "@/components/button";

import { useTheme } from "@/contexts/themeContext";
import { createStyles } from "../form";

interface StepOverviewProps {
  onNext: () => void;
  onSkip: () => void;
}

// Step 1 Overview
const Step1Overview: React.FC<StepOverviewProps> = ({ onNext, onSkip }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const images = [
    require("@/assets/images/owner-left.jpg"),
    require("@/assets/images/owner-center.png"),
    require("@/assets/images/owner-right.jpg"),
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stacked Images */}
        <View style={styles.imageStackContainer}>
          {/* Left Background Image */}
          <View style={[styles.backgroundImage, styles.leftImage]}>
            <Image
              source={images[0]}
              style={styles.backgroundImageContent}
              resizeMode="cover"
            />
          </View>

          {/* Center Main Image */}
          <View style={styles.mainImageCard}>
            <Image
              source={images[1]}
              style={styles.mainImage}
              resizeMode="cover"
            />
          </View>

          {/* Right Background Image */}
          <View style={[styles.backgroundImage, styles.rightImage]}>
            <Image
              source={images[2]}
              style={styles.backgroundImageContent}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Step Info */}
        <View style={styles.stepInfo}>
          <Text style={styles.stepLabel}>Step 1</Text>
          <Text style={styles.stepTitle}>Tell us about the space</Text>
          <Text style={styles.stepDescription}>
            In this step, we will collect information like type of property,
            number of units available, the location of the space. Then you will
            tell us know the property size and amenities available in the space.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <Pressable onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
        <View style={styles.nextButtonWrapper}>
          <AppButton title="Next" onPress={onNext} size="medium" />
        </View>
      </View>
    </View>
  );
};

export default Step1Overview;
