import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import AppButton from "@/components/button";

import { useTheme } from "@/contexts/themeContext";
import { createStyles } from "../form";

interface StepOverviewProps {
  onNext: () => void;
  onSkip: () => void;
}

const Step2Overview: React.FC<StepOverviewProps> = ({ onNext, onSkip }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const images = [
    require("@/assets/images/owner-center.png"),
    require("@/assets/images/owner-right.jpg"),
    require("@/assets/images/gallery-right.png"),
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
          <Text style={styles.stepLabel}>Step 2</Text>
          <Text style={styles.stepTitle}>Add gallery</Text>
          <Text style={styles.stepDescription}>
            In this step, we will collect visual representations of the space.
            Upload photos and videos of the property plus add a virtual tour to
            elevate user experience.
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

export default Step2Overview;
