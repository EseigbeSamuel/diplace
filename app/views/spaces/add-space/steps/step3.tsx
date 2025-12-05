import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import AppButton from "@/components/button";

import { useTheme } from "@/contexts/themeContext";
import { createStyles } from "../form";

interface StepOverviewProps {
  onSkip: () => void;
  onNext: () => void;
}

const Step3Overview: React.FC<StepOverviewProps> = ({ onNext, onSkip }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const images = [
    require("@/assets/images/gallery-right.png"),
    require("@/assets/images/virtual-right.jpg"),
    require("@/assets/images/landlord-right.jpg"),
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

        <View style={styles.stepInfo}>
          <Text style={styles.stepLabel}>Step 3</Text>
          <Text style={styles.stepTitle}>Tell us about the owner</Text>
          <Text style={styles.stepDescription}>
            In this step, we will collect information about the owner of the
            space like their contact and bank details. Plus you will upload any
            rental agreement if available.
          </Text>
        </View>
      </ScrollView>

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

export default Step3Overview;
