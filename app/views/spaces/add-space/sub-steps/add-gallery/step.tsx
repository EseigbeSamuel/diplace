import React from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import AppButton from "@/components/button";

import { useTheme } from "@/contexts/themeContext";
import { createStyles } from "../../form";

interface StepOverviewProps {
  onNext: () => void;
  onSkip: () => void;
}

const VirtualTourOverview: React.FC<StepOverviewProps> = ({
  onNext,
  onSkip,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const images = [
    require("@/assets/images/owner-right.jpg"),
    require("@/assets/images/gallery-right.png"),
    require("@/assets/images/virtual-right.jpg"),
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
          <Text style={styles.stepTitle}>Take a virtual tour</Text>
          <Text style={styles.stepDescription}>
            Simulate a virtual tour of this property to give renter a real life
            feel of the space. Please follow the instructions to upload a
            virtual tour.
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

export default VirtualTourOverview;
