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
import { useCreateProperty, useUpdateProperty } from "@/hooks";
import { useTheme } from "@/contexts/themeContext";
import { useSpaceStore } from "@/store/useSpace";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";

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
  const { updatePropertyMutation, updatePropertyPending } = useUpdateProperty();
  const { spaceForm, editContext, clearForm, editingDraft } = useSpaceStore();
  const isEditMode = !!editContext?.propertyId;
  const isDraftEdit = isEditMode && editingDraft?.status === "draft";

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
      if (isEditMode && !isDraftEdit) {
        await updatePropertyMutation({
          propertyId: editContext.propertyId,
          addressId: editContext.addressId,
          type: spaceForm.type,
          value: spaceForm.value,
        });
        clearForm();
        router.replace("/(tabs)/spaces");
        return;
      }

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
    <View style={styles.container} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title} className="font-semibold">Publish now</Text>

        {/* Steps List */}
        <View style={styles.stepsList}>
          {steps.map((step) => (
            <View key={step.id}  className="border-bottom-[0px]">
              <View style={styles.stepContent} className="flex-row items-start justify-between">
                <View  className="flex-1">
                  <Text style={styles.stepTitle} className="font-semibold">{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
                {step.completed && (
                  <View  className="items-center justify-center">
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
         className="flex-row items-start">
          <View
            style={[styles.checkbox, agreedToTerms && styles.checkboxSelected]}
           className="border-[2px] items-center justify-center">
            {agreedToTerms && (
              <Image
                source={require("@/assets/icons/checkbox-checked.png")}
                style={styles.checkIcon}
              />
            )}
          </View>
          <Text style={styles.termsText} className="flex-1">
            I have read and agree to the{" "}
            <Text style={styles.termsLink} className="underline">Terms of service</Text>
          </Text>
        </Pressable>
      </ScrollView>

      {/* Post Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Looks Good!"
          onPress={handlePost}
          size="large"
          fullwidth={true}
          disabled={
            !agreedToTerms ||
            createPropertyPending ||
            updatePropertyPending
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
marginBottom: RFValue(32)},
    stepsList: {
      marginBottom: RFValue(32),
      gap: RFValue(24),
    },
    stepItem: {},
    stepContent: {gap: RFValue(16)},
    stepTextContainer: {},
    stepTitle: {fontSize: RFValue(16),
color: colors.slate[650],
marginBottom: RFValue(6)},
    stepDescription: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      lineHeight: RFValue(19),
    },
    checkmarkContainer: {},
    checkmarkIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.success[300],
    },
    termsContainer: {gap: RFValue(12),
marginBottom: RFValue(24)},
    checkbox: {width: RFValue(18),
height: RFValue(18),
borderRadius: RFValue(4),
borderColor: colors.slate[400],
backgroundColor: colors.background,
marginTop: RFValue(2)},
    checkboxSelected: {
      backgroundColor: colors.slate[650],
      borderColor: colors.slate[650],
    },
    checkIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[350],
    },
    termsText: {fontSize: RFValue(14),
color: colors.slate[600],
lineHeight: RFValue(20)},
    termsLink: {color: colors.info[200]},
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default PublishNowSubstep;
