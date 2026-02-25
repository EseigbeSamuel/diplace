import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "@/components/button";
import { useCreateProperty } from "@/hooks";
import { useTheme } from "@/contexts/themeContext";
import { useSpaceStore } from "@/store/useSpace";
import { ColorScheme } from "@/utils";

interface PublishNowSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const PublishNowSubstep: React.FC<PublishNowSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { createPropertyMutation, createPropertyPending } = useCreateProperty();
  const { spaceForm } = useSpaceStore();

  const steps = [
    {
      id: 1,
      title: "Tell us about the space",
      description:
        "Share basic info about the space, like the type of space, location etc.",
      completed: true,
    },
    {
      id: 2,
      title: "Add gallery",
      description:
        "Add photos and videos: plus a virtual tour to make it stand out.",
      completed: true,
    },
    {
      id: 3,
      title: "Tell us about the owner",
      description:
        "Share landlord's info, like name and bank details, plus rental agreements if any.",
      completed: true,
    },
    {
      id: 4,
      title: "Finish and post",
      description:
        "Add the price for this space, preview details and then post space.",
      completed: true,
    },
  ];

  const handlePost = async () => {
    if (!agreedToTerms) {
      return;
    }

    try {
      await createPropertyMutation({
        type: spaceForm.type,
        value: spaceForm.value,
      });
      onNext();
    } catch (error) {
      console.log("create property error", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>Publish now</Text>

        {/* Steps List */}
        <View style={styles.stepsList}>
          {steps.map((step) => (
            <View key={step.id} style={styles.stepItem}>
              <View style={styles.stepContent}>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
                {step.completed && (
                  <View style={styles.checkmarkContainer}>
                    <Image
                      source={require("@/assets/icons/checkbox-circle-fill.png")}
                      style={styles.checkmarkIcon}
                    />
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Terms Checkbox */}
        <Pressable
          style={styles.termsContainer}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
        >
          <View
            style={[styles.checkbox, agreedToTerms && styles.checkboxSelected]}
          >
            {agreedToTerms && (
              <Image
                source={require("@/assets/icons/checkbox-checked.png")}
                style={styles.checkIcon}
              />
            )}
          </View>
          <Text style={styles.termsText}>
            I have read and agree to the{" "}
            <Text style={styles.termsLink}>Terms of service</Text>
          </Text>
        </Pressable>
      </ScrollView>

      {/* Post Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Post"
          onPress={handlePost}
          size="large"
          fullwidth={true}
          disabled={!agreedToTerms || createPropertyPending}
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
      marginBottom: RFValue(32),
    },
    stepsList: {
      marginBottom: RFValue(32),
      gap: RFValue(24),
    },
    stepItem: {
      borderBottomWidth: 0,
    },
    stepContent: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: RFValue(16),
    },
    stepTextContainer: {
      flex: 1,
    },
    stepTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(6),
    },
    stepDescription: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      lineHeight: RFValue(19),
    },
    checkmarkContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    checkmarkIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.success[300],
    },
    termsContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: RFValue(12),
      marginBottom: RFValue(24),
    },
    checkbox: {
      width: RFValue(18),
      height: RFValue(18),
      borderRadius: RFValue(4),
      borderWidth: 2,
      borderColor: colors.slate[400],
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      marginTop: RFValue(2),
    },
    checkboxSelected: {
      backgroundColor: colors.slate[650],
      borderColor: colors.slate[650],
    },
    checkIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[350],
    },
    termsText: {
      flex: 1,
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(20),
    },
    termsLink: {
      color: colors.info[200],
      textDecorationLine: "underline",
    },
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default PublishNowSubstep;
