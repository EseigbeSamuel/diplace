import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import SpacePreviewScreen from "@/app/views/spaces/add-space/sub-steps/final/substep6";
import { useSpaceStore } from "@/store/useSpace";
import { SpaceType } from "@/types/add-space-types";
import React from "react";
import { Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const PreviewSpaces = () => {
  const { previewProperty, setType, setValue } = useSpaceStore();
  const hydratedRef = React.useRef<string | null>(null);

  const mapPropertyTypeToSpaceType = (propertyType: string): SpaceType => {
    if (propertyType === "apartment") return "apartment";
    if (propertyType === "shop") return "shop";
    if (propertyType === "office") return "office";
    if (propertyType === "event_centre" || propertyType === "hall") return "event";
    return "apartment";
  };

  React.useEffect(() => {
    if (!previewProperty) return;
    if (hydratedRef.current === previewProperty.public_id) return;

    setType(mapPropertyTypeToSpaceType(previewProperty.property_type));
    setValue({
      units: 1,
      description: {
        title: previewProperty.title,
        description: previewProperty.description,
      },
      amenities: previewProperty.amenities ?? [],
      eventSpace:
        previewProperty.event_space === "indoor" ||
        previewProperty.event_space === "outdoor"
          ? previewProperty.event_space
          : undefined,
      capacity: previewProperty.capacity
        ? {
            ...previewProperty.capacity,
            caps: String(previewProperty.capacity.caps),
          }
        : undefined,
      rentalAgreement: previewProperty.rental_agreement
        ? {
            uri: previewProperty.rental_agreement.file_url,
            name: previewProperty.rental_agreement.name,
            size: previewProperty.rental_agreement.size,
          }
        : null,
      media: (previewProperty.media ?? []).map((item, index) => ({
        id: item.public_id || `${index}`,
        uri: item.file_url,
        type: item.file_type === "video" ? "video" : "image",
      })),
      location: {
        address: previewProperty.address?.street ?? "",
        city: previewProperty.address?.city ?? "",
        state: previewProperty.address?.state ?? "",
        postalCode: previewProperty.address?.zip_code ?? "",
        country: previewProperty.address?.country ?? "",
        latitude: previewProperty.address?.latitude ?? 0,
        longitude: previewProperty.address?.longitude ?? 0,
      },
      rentalCost: {
        rentalCost: String(previewProperty.price ?? ""),
        rentDuration: previewProperty.cost_frequency?.replace(/_/g, " ") ?? "",
      },
      otherCharges: [
        {
          id: "1",
          title: "Platform fee",
          description: "DiPlace service charge.",
          value: `NGN ${previewProperty.fees?.platform_fee ?? 0}`,
          editable: false,
        },
        {
          id: "2",
          title: "Agent fee",
          description: "Your rental commission.",
          value: `${previewProperty.fees?.agency_fee_percent ?? 0}%`,
          editable: true,
        },
        {
          id: "3",
          title: "Caution fee",
          description: "Refundable deposit.",
          value: `NGN ${previewProperty.fees?.caution_fee ?? 0}`,
          editable: true,
        },
        {
          id: "4",
          title: "Service charge",
          description: "Legal fee charge.",
          value: `NGN ${previewProperty.fees?.legal_fee_percent ?? 0}`,
          editable: true,
        },
      ],
    });

    hydratedRef.current = previewProperty.public_id;
  }, [previewProperty, setType, setValue]);

  if (!previewProperty) {
    return (
      <SafeAreaViewContainer>
        <SectionHeader title="Preview Space" />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: RFValue(20),
          }}
        >
          <Text
            style={{
              fontSize: RFValue(18),
              lineHeight: RFValue(24),
              fontFamily: "InstrumentSansSemiBold",
            }}
          >
            Preview data unavailable.
          </Text>
        </View>
      </SafeAreaViewContainer>
    );
  }

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Preview Space" />
      <SpacePreviewScreen mode="owner_preview" />
    </SafeAreaViewContainer>
  );
};

export default PreviewSpaces;
