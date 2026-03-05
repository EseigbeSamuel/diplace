import { ColorScheme } from "@/utils";
import { Dimensions, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Step1Overview from "./steps/step1";
import Step2Overview from "./steps/step2";
import Step3Overview from "./steps/step3";
import Step4Overview from "./steps/step4";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { ActivityIndicator, Text, View } from "react-native";
import { PropertyDetailsResponse } from "@/types";
import { SpaceType } from "@/types/add-space-types";
import { useTheme } from "@/contexts/themeContext";
import AppButton from "@/components/button";
import { useQueryClient } from "@tanstack/react-query";

const { width } = Dimensions.get("window");

const AddSpaceForm: React.FC = () => {
  const router = useRouter();
  const { property_id } = useLocalSearchParams<{ property_id?: string }>();
  const editingPropertyId = Array.isArray(property_id) ? property_id[0] : property_id;
  const {
    clearForm,
    setType,
    setValue,
    setEditingDraft,
    setEditContext,
    editingDraft,
    spaceForm,
  } = useSpaceStore();
  const hydratedPropertyIdRef = React.useRef<string | null>(null);
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const cachedDraft = React.useMemo(() => {
    if (!editingPropertyId) return null;

    const queries = queryClient.getQueriesData<{
      pages?: Array<{ items?: PropertyDetailsResponse[] }>;
    }>({
      queryKey: ["properties"],
    });

    for (const [, data] of queries) {
      const pages = data?.pages ?? [];
      for (const page of pages) {
        const found = page.items?.find((item) => item.public_id === editingPropertyId);
        if (found) return found;
      }
    }

    return null;
  }, [editingPropertyId, queryClient]);
  // NOTE: TEMPORARY SWITCH
  // GET /properties/{property_id} is returning backend errors for now.
  // We hydrate edit form from the property payload already returned by GET /properties/.
  // Revert path: re-enable useGetPropertyDetails(property_id) and replace `editingDraft` below.
  const propertyDetails = editingDraft ?? cachedDraft;
  // No async fetch in fallback mode, so this should never stay in loading state.
  const isPropertyDetailsLoading = false;
  const propertyDetailsError = !!editingPropertyId && !propertyDetails;

  const mapPropertyTypeToSpaceType = (
    propertyType: PropertyDetailsResponse["property_type"],
  ): SpaceType => {
    if (propertyType === "apartment") return "apartment";
    if (propertyType === "shop") return "shop";
    if (propertyType === "office") return "office";
    if (propertyType === "event_centre" || propertyType === "hall") return "event";
    return "apartment";
  };

  React.useEffect(() => {
    if (!editingPropertyId || !propertyDetails) return;
    if (hydratedPropertyIdRef.current === editingPropertyId) return;

    const mappedType = mapPropertyTypeToSpaceType(propertyDetails.property_type);
    const mappedMedia = (propertyDetails.media ?? []).map((item, index) => ({
      id: item.public_id || `${index}`,
      uri: item.file_url,
      type: item.file_type === "video" ? "video" : "image",
    }));

    const charges = [
      {
        id: "1",
        title: "Platform fee",
        description: "DiPlace service charge.",
        value: `NGN ${propertyDetails.fees?.platform_fee ?? 0}`,
        editable: false,
      },
      {
        id: "2",
        title: "Agent fee",
        description: "Your rental commission.",
        value: `${propertyDetails.fees?.agency_fee_percent ?? 0}%`,
        editable: true,
      },
      {
        id: "3",
        title: "Caution fee",
        description: "Refundable deposit.",
        value: `NGN ${propertyDetails.fees?.caution_fee ?? 0}`,
        editable: true,
      },
      {
        id: "4",
        title: "Service charge",
        description: "Legal fee charge.",
        value: `NGN ${propertyDetails.fees?.legal_fee_percent ?? 0}`,
        editable: true,
      },
    ];

    clearForm();
    setType(mappedType);
    setEditContext({
      propertyId: propertyDetails.public_id,
      addressId: propertyDetails.address.public_id,
    });
    setValue({
      units: 1,
      description: {
        title: propertyDetails.title,
        description: propertyDetails.description,
      },
      amenities: propertyDetails.amenities ?? [],
      media: mappedMedia,
      location: {
        address: propertyDetails.address?.street ?? "",
        city: propertyDetails.address?.city ?? "",
        state: propertyDetails.address?.state ?? "",
        postalCode: propertyDetails.address?.zip_code ?? "",
        country: propertyDetails.address?.country ?? "",
        latitude: propertyDetails.address?.latitude ?? 0,
        longitude: propertyDetails.address?.longitude ?? 0,
      },
      rentalCost: {
        rentalCost: String(propertyDetails.price ?? ""),
        rentDuration: propertyDetails.cost_frequency?.replace(/_/g, " ") ?? "",
      },
      otherCharges: charges,
    });

    hydratedPropertyIdRef.current = editingPropertyId;
    setEditingDraft(null);
  }, [
    editingPropertyId,
    propertyDetails,
    clearForm,
    setType,
    setValue,
    setEditingDraft,
    setEditContext,
  ]);

  React.useEffect(() => {
    if (!editingPropertyId) {
      setEditContext(null);
    }
  }, [editingPropertyId, setEditContext]);

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

  if (editingPropertyId && isPropertyDetailsLoading) {
    return (
      <View style={formStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.slate[650]} />
        <Text style={[formStyles.loadingText, { color: colors.slate[650] }]}>
          Loading Draft...
        </Text>
      </View>
    );
  }

  if (editingPropertyId && propertyDetailsError) {
    return (
      <View style={formStyles.loadingContainer}>
        <Text style={[formStyles.loadingText, { color: colors.slate[650] }]}>
          Failed to load draft data.
        </Text>
        <View style={{ width: RFValue(140), marginTop: RFValue(8) }}>
          <AppButton title="Go Back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <StepperWithHeader
      steps={steps}
      onComplete={handleComplete}
      initialStepIndex={0}
      initialSubstepIndex={editingPropertyId ? 1 : 0}
    />
  );
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

const formStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: RFValue(20),
    gap: RFValue(12),
  },
  loadingText: {
    fontSize: RFValue(20),
    lineHeight: RFValue(26),
    fontFamily: "InstrumentSansSemiBold",
    textAlign: "center",
  },
});
