import { ColorScheme } from "@/utils";
import { Dimensions, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Step1Overview from "./steps/step1";
import Step2Overview from "./steps/step2";
import Step3Overview from "./steps/step3";
import Step4Overview from "./steps/step4";
import { useRouter } from "expo-router";
import StepperWithHeader from "@/components/steps/stepper-header";
import PropertyTypeSubstep from "./sub-steps/about-space/sub-step1";
import EventTypeSubstep from "./sub-steps/about-space/substept2";
import LocationPickerSubstep from "./sub-steps/about-space/sub-step3";
import CapacitySubstep from "./sub-steps/about-space/substep4";
import SpaceDescriptionSubstep from "./sub-steps/about-space/substep5";
import AmenitiesSubstep from "./sub-steps/about-space/substep6";
import MediaUploadSubstep from "./sub-steps/add-gallery/step1";
import VirtualTourSubstep from "./sub-steps/add-gallery/step2";
import PropertyOwnerSubstep from "./sub-steps/owner/substeo1";
import ConfirmDetailsSubstep from "./sub-steps/owner/substep2";
import LandlordInfoSubstep from "./sub-steps/owner/substep4";
import { useSpaceStore } from "@/store/useSpace";
import EventCapacitySubstep from "./sub-steps/about-space/substept4part";
import VirtualTourOverview from "./sub-steps/add-gallery/step";
import RentalAgreementSubstep from "./sub-steps/owner/substep5";
import InspectionFeeSubstep from "./sub-steps/final/substep1";
import InspectionTimeSubstep from "./sub-steps/final/substep2";
import RentalCostSubstep from "./sub-steps/final/substep3";
import SpacePreviewScreen from "./sub-steps/final/substep6";
import LandlordAccountInfoSubstep from "./sub-steps/owner/substep6";
import ConfirmCostSubstep from "./sub-steps/final/substep5";
import PublishNowSubstep from "./sub-steps/final/substep7";
import OtherChargesSubstep from "./sub-steps/final/substep4";
import ConfirmOwnerEventDetailsSubstep from "./sub-steps/owner/substep2t";
import React from "react";

const { width } = Dimensions.get("window");

const AddSpaceForm: React.FC = () => {
  const router = useRouter();
  const { clearForm, spaceForm } = useSpaceStore();

  const steps = [
    {
      name: "Step 1",
      substeps: [
        Step1Overview,
        PropertyTypeSubstep,
        ...(spaceForm.type === "event" ? [EventTypeSubstep] : []),
        LocationPickerSubstep,
        spaceForm.type === "event" ? EventCapacitySubstep : CapacitySubstep,
        AmenitiesSubstep,
        SpaceDescriptionSubstep,
      ],
    },
    {
      name: "Step 2",
      substeps: [
        Step2Overview,
        MediaUploadSubstep,
        VirtualTourOverview,
        VirtualTourSubstep,
      ],
    },
    {
      name: "Step 3",
      substeps: [
        Step3Overview,
        PropertyOwnerSubstep,
        spaceForm.value.owner === "myself" && spaceForm.type === "event"
          ? ConfirmOwnerEventDetailsSubstep
          : ConfirmDetailsSubstep,
        ...(spaceForm.value.owner === "3rdparty" ? [LandlordInfoSubstep] : []),
        ...(spaceForm.value.owner === "3rdparty"
          ? [LandlordAccountInfoSubstep]
          : []),
        RentalAgreementSubstep,
      ],
    },
    {
      name: "Step 4",
      substeps: [
        Step4Overview,
        ...(spaceForm.type !== "event" ? [InspectionFeeSubstep] : []),
        ...(spaceForm.type !== "event" ? [InspectionTimeSubstep] : []),
        RentalCostSubstep,
        OtherChargesSubstep,
        ConfirmCostSubstep,
        SpacePreviewScreen,
        PublishNowSubstep,
      ],
    },
  ];

  const handleComplete = () => {
    console.log("All steps completed!");
    clearForm();
    router.push("/views/spaces/add-space/verifying");
  };

  return <StepperWithHeader steps={steps} onComplete={handleComplete} />;
};

export default AddSpaceForm;

export const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    imageStackContainer: {
      height: RFValue(280),
      marginTop: RFValue(24),
      marginBottom: RFValue(32),
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    backgroundImage: {
      position: "absolute",
      width: width * 0.5,
      height: RFValue(260),
      borderRadius: RFValue(24),
      overflow: "hidden",
    },
    leftImage: {
      left: RFValue(10),
      transform: [{ rotate: "-8deg" }],
      zIndex: 1,
      borderWidth: 8,
      borderColor: colors.slate[400],
    },
    rightImage: {
      right: RFValue(10),
      transform: [{ rotate: "8deg" }],
      zIndex: 1,
      borderWidth: 8,
      borderColor: colors.slate[400],
    },
    backgroundImageContent: {
      width: "100%",
      height: RFValue(250),
    },
    mainImageCard: {
      width: width * 0.65,
      height: RFValue(260),
      borderRadius: RFValue(24),
      overflow: "hidden",
      backgroundColor: colors.slate[200],
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 12,
      zIndex: 2,
      borderWidth: 8,
      borderColor: colors.slate[400],
    },
    mainImage: {
      width: "100%",
      height: "100%",
    },
    stepInfo: {
      paddingHorizontal: RFValue(4),
    },
    stepLabel: {
      fontSize: RFValue(14),
      fontWeight: "600",
      color: colors.slate[600],
      marginBottom: RFValue(8),
    },
    stepTitle: {
      fontSize: RFValue(24),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(12),
      lineHeight: RFValue(32),
    },
    stepDescription: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(22),
    },
    bottomButtons: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(20),
      backgroundColor: colors.background,
      gap: RFValue(26),
    },
    skipButton: {
      paddingHorizontal: RFValue(24),
      paddingVertical: RFValue(14),
    },
    skipText: {
      fontSize: RFValue(16),
      color: colors.slate[600],
      fontWeight: "500",
    },
    nextButtonWrapper: {
      flex: 1,
    },
  });
