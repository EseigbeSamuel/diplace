import AppButton from "@/components/button";
import { HAS_GOOGLE_MAPS_API_KEY } from "@/constants/google";
import { useTheme } from "@/contexts/themeContext";
import { useGetCurrentUser } from "@/hooks";
import { showToast } from "@/lib";
import { useSpaceStore } from "@/store/useSpace";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");

interface SpacePreviewScreenProps {
  onNext?: () => void;
  mode?: "create" | "owner_preview";
}

const SpacePreviewScreen: React.FC<SpacePreviewScreenProps> = ({
  onNext,
  mode = "create",
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { spaceForm } = useSpaceStore();
  const { currentUser } = useGetCurrentUser();
  const router = useRouter();
  const [enlargeMapVisible, setEnlargeMapVisible] = useState(false);
  const [showLocationSheet, setShowLocationSheet] = useState(false);

  // Mock data - replace with actual data from spaceForm
  const spaceData = {
    location: {
      address: "Road 2, Tony Estate, Rumuewhere, Port Harcourt",
      coordinates: { latitude: 4.8156, longitude: 7.0498 },
    },
    gallery: [
      require("@/assets/images/SpacesNearbyImage1.png"),
      require("@/assets/images/SpacesNearbyImage2.png"),
      require("@/assets/images/featuredSpaceImage1.png"),
    ],
  };

  const costBreakdown = [
    {
      id: "0",
      title: `Space rent (${spaceForm.value.rentalCost?.rentDuration})`,
      description: "",
      value: spaceForm.value.rentalCost?.rentalCost || "",
      editable: true,
    },
  ].concat(spaceForm.value.otherCharges || []);

  const totalPackage = costBreakdown.reduce((sum, item) => {
    const amount = Number(item.value.toString().replace(/[^0-9]/g, "")) || 0;
    return sum + amount;
  }, 0);
  const formatCurrency = (amount?: number | string) => {
    const numeric =
      typeof amount === "number"
        ? amount
        : Number((amount || "0").toString().replace(/[^0-9]/g, ""));
    return `₦${numeric.toLocaleString("en-NG")}`;
  };

  const handleBack = () => {
    router.back();
  };

  const handleComplete = () => {
    const hasLocation =
      !!spaceForm.value.location?.address?.trim() &&
      typeof spaceForm.value.location?.latitude === "number" &&
      typeof spaceForm.value.location?.longitude === "number";
    const hasMedia = (spaceForm.value.media ?? []).length > 0;

    if (!hasLocation) {
      showToast({
        type: "error",
        text1: "Location required",
        text2: "Add and confirm a location before continuing.",
      });
      return;
    }

    if (!hasMedia) {
      showToast({
        type: "error",
        text1: "Media required",
        text2: "Upload at least one media file before continuing.",
      });
      return;
    }

    if (onNext) {
      onNext();
    }
  };
  const showCompleteButton = mode === "create";

  // "apartment" | "event" | "shop" | "office"

  const formatType = (type: string | null) => {
    switch (type) {
      case "apartment":
        return "Apartment";
      case "event":
        return "Event center";
      case "shop":
        return "Shop";
      case "office":
        return "Office";
      default:
        return "Apartment";
    }
  };

  const toProperCase = (t?: string | null) =>
    t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : "";
  const isOwnSpace = spaceForm.value.owner === "myself";
  const currentUserName =
    currentUser?.full_name?.trim() ||
    `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`.trim();
  const previewContact = {
    name:
      (isOwnSpace ? currentUserName : spaceForm.value.ownerDetails?.fullName) ||
      "N/A",
    phone:
      (isOwnSpace
        ? currentUser?.phone_number
        : spaceForm.value.ownerDetails?.phoneNumber) || "N/A",
    account: isOwnSpace
      ? spaceForm.value.accountDetails
      : spaceForm.value.ownerAccountDetails,
  };

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Preview Title */}
        <Text style={styles.previewTitle} className="font-bold">Preview</Text>

        {/* Main Image */}
        <View style={styles.imageContainer}>
          {spaceForm.value.media && spaceForm.value.media.length > 0 ? (
            <Image
              source={{ uri: spaceForm.value.media[0]?.uri }}
              style={styles.mainImage}
              resizeMode="cover"
             className="w-[90%px] h-[100%px]"/>
          ) : (
            <Image
              source={spaceData.gallery[0]}
              style={styles.mainImage}
              resizeMode="cover"
             className="w-[90%px] h-[100%px]"/>
          )}
        </View>

        {/* Property Info Card */}
        <View style={styles.propertyCard}>
          <View style={styles.propertyHeader} className="flex-row items-center">
            <View style={styles.typeContainer} className="flex-row items-center">
              <Image
                source={
                  spaceForm.type === "event"
                    ? require("@/assets/icons/event-outline.png")
                    : require("@/assets/icons/home-outline.png")
                }
                resizeMode="contain"
              />
              <Text style={styles.typeText} className="font-medium">{formatType(spaceForm.type)}</Text>
            </View>
            <View style={styles.availableBadge} className="bg-[#D1FAE5]">
              <Text style={styles.availableText} className="font-medium text-[#16A34A]">
                {spaceForm.value.units || 1} unit available
              </Text>
            </View>
          </View>

          <Text style={styles.propertyTitle} className="font-bold">
            {spaceForm.value.description?.title ||
              "2 Bedroom in-suite apartment"}
          </Text>

          <View style={styles.locationRow} className="flex-row items-center">
            <Image
              source={require("@/assets/icons/location-1.png")}
              style={styles.locationIcon}
              resizeMode="contain"
            />
            <Text style={styles.addressText} className="flex-1">
              {spaceForm.value?.location?.address ||
                "Road 2, Tony Estate, Rumuewhere, Port Harcourt"}
            </Text>
          </View>

          <Text style={styles.priceText} className="font-bold">
            {formatCurrency(spaceForm.value.rentalCost?.rentalCost)}
            <Text style={styles.priceUnit} className="font-normal">
              /{spaceForm.value.rentalCost?.rentDuration}
            </Text>
          </Text>

          {/* Property Features */}
          <View style={styles.featuresRow} className="flex-row justify-content-[space-around] border-t">
            <View style={styles.featureItem} className="items-center">
              <Image
                source={
                  spaceForm.type === "event"
                    ? require("@/assets/icons/location-1.png")
                    : require("@/assets/icons/bed-outline.png")
                }
                style={styles.featureIcon}
                resizeMode="contain"
              />
              <Text style={styles.featureText} className="font-medium">
                {spaceForm.type === "event"
                  ? toProperCase(spaceForm.value.eventSpace)
                  : spaceForm.value.capacity?.rooms}{" "}
                {spaceForm.type !== "event" ? "Bedrooms" : ""}
              </Text>
            </View>

            <View style={styles.featureItem} className="items-center">
              <Image
                source={
                  spaceForm.type === "event"
                    ? require("@/assets/icons/electricity.png")
                    : require("@/assets/icons/bath.png")
                }
                style={styles.featureIcon}
                resizeMode="contain"
              />
              <Text style={styles.featureText} className="font-medium">
                {spaceForm.type === "event"
                  ? "Generator"
                  : `${spaceForm.value.capacity?.bathrooms} Baths`}
              </Text>
            </View>

            <View style={styles.featureItem} className="items-center">
              <Image
                source={require("@/assets/icons/size.png")}
                style={styles.featureIcon}
                resizeMode="contain"
              />
              <Text style={styles.featureText} className="font-medium">
                {spaceForm.type === "event"
                  ? spaceForm.value.capacity?.caps
                  : spaceForm.value.capacity?.roomSize}
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section} className="border-t">
          <Text style={styles.sectionTitle} className="font-semibold">About this space</Text>
          <Text style={styles.aboutText}>
            {spaceForm.value.description?.description}
          </Text>
        </View>

        {/* Amenities Section */}
        <View>
          <Text style={styles.sectionTitle} className="font-semibold">Amenities</Text>
          {spaceForm.value.amenities?.map((amenity, index) => (
            <View key={index} style={styles.amenityRow} className="flex-row items-start">
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.amenityText} className="flex-1">{amenity}</Text>
            </View>
          ))}
        </View>

        {/* Location Section */}
        <View style={styles.section} className="border-t">
          <Text style={styles.sectionTitle} className="font-semibold">Location</Text>
          <Text style={styles.locationAddress}>
            {spaceData.location.address}
          </Text>

          {/* Map Placeholder */}
          <View style={styles.mapContainer} className="w-[100%px] overflow-hidden relative">
            {HAS_GOOGLE_MAPS_API_KEY ? (
              <MapView
                className="flex-1"
                initialRegion={{
                  latitude: spaceForm.value.location?.latitude ?? 4.8156,
                  longitude: spaceForm.value.location?.longitude ?? 7.0498,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: spaceForm.value.location?.latitude ?? 4.8156,
                    longitude: spaceForm.value.location?.longitude ?? 7.0498,
                  }}
                />
              </MapView>
            ) : (
              <View style={styles.mapFallback} className="flex-1 items-center justify-center">
                <Text style={styles.mapFallbackText} className="text-center">
                  Map disabled. Add Google API key to enable.
                </Text>
              </View>
            )}

            {/* Floating Street View button */}
            <TouchableOpacity
              style={styles.streetViewButton}
              onPress={() =>
                router.push({
                  pathname: "/views/streetview",
                  params: {
                    lat: spaceForm.value.location?.latitude,
                    lng: spaceForm.value.location?.longitude,
                  },
                })
              }
             className="absolute flex-row items-center">
              <Image
                source={require("@/assets/icons/Streetview-solid.png")}
                style={styles.streetViewIcon}
                resizeMode="contain"
               className="tint-[#FFFFFF]"/>
              <Text style={styles.streetViewText} className="font-medium text-[#FFFFFF]">Street view</Text>
            </TouchableOpacity>

            {/* Fullscreen button */}
            <TouchableOpacity
              style={styles.fullscreenButton}
              onPress={() => {
                setEnlargeMapVisible(true);
                setShowLocationSheet(true);
              }}
             className="absolute">
              <Image
                source={require("@/assets/icons/expand.png")}
                style={styles.expandViewIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gallery Section */}
        <View style={styles.section} className="border-t">
          <Text style={styles.sectionTitle} className="font-semibold">Gallery</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryGrid}
          >
            {spaceForm.value.media && (
              <View style={styles.galleryGrid} className="flex-row">
                {spaceForm.value.media.map((image, index) => (
                  <View key={index} style={styles.galleryItem}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                     className="w-[100%px] h-[100%px]"/>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Virtual Tour */}
          <View style={styles.virtualTourRow} className="flex-row items-center justify-between">
            <View  className="flex-1">
              <Text style={styles.virtualTourLabel} className="font-semibold">Virtual Tour</Text>
              <Text style={styles.uploadStatus}>
                {spaceForm.value.tour && spaceForm.value.tour.length > 0
                  ? "Uploaded"
                  : "Not uploaded"}
              </Text>
            </View>
            <TouchableOpacity style={styles.previewButton} className="flex-row items-center">
              <Image
                source={require("@/assets/icons/play-outline.png")}
                style={styles.playIcon}
                resizeMode="contain"
              />
              <Text style={styles.previewButtonText} className="font-medium">Preview</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Landlord's Details Section */}
        <View style={styles.section} className="border-t">
          <Text style={styles.sectionTitle} className="font-semibold">
            {spaceForm.type === "event" ? "Owner's" : "Landlord's"} Details
          </Text>

          <View style={styles.landlordInfo}>
            <Text style={styles.landlordName} className="font-semibold">{previewContact.name}</Text>

            <TouchableOpacity style={styles.landlordRow} className="flex-row items-center">
              <Image
                source={require("@/assets/icons/calling.png")}
                style={styles.landlordIcon}
                resizeMode="contain"
              />
              <Text style={styles.landlordText}>{previewContact.phone}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.landlordRow} className="flex-row items-center">
              <Image
                source={require("@/assets/icons/bank-light.png")}
                style={styles.landlordIcon}
                resizeMode="contain"
              />
              <Text style={styles.landlordText}>
                {previewContact.account?.accountName || "N/A"} |{" "}
                {previewContact.account?.accountNumber || "N/A"} |{" "}
                {previewContact.account?.bank || "N/A"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tenancy Agreement */}
          <View style={styles.agreementRow} className="flex-row items-center justify-between">
            <View  className="flex-1">
              <Text style={styles.agreementLabel} className="font-semibold">Tenancy Agreement</Text>
              <View style={styles.agreementStatus} className="flex-row items-center">
                <Image
                  source={require("@/assets/icons/paper.png")}
                  style={styles.fileIconSmall}
                  resizeMode="contain"
                />
                <Text style={styles.agreementSize}>
                  Uploaded. {spaceForm.value.rentalAgreement?.size} kb
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.agreementPreviewButton} className="flex-row items-center">
              <Text style={styles.agreementPreviewText} className="font-medium">Preview</Text>
              <Image
                source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
                style={styles.arrowUpIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Inspection Schedule Section */}
        {spaceForm.type !== "event" && (
          <View style={styles.section} className="border-t">
            <Text style={styles.sectionTitle} className="font-semibold">Inspection Schedule</Text>

            <View style={styles.inspectionContainer}>
              <View style={styles.inspectionFeeContainer} className="border-b">
                <Text style={styles.inspectionFeeLabel}>Inspection fee:</Text>
                <View style={styles.inspectionFeeRow} className="flex-row items-center">
                  <Image
                    source={require("@/assets/icons/money-bag.png")}
                    style={styles.coinEmoji}
                    resizeMode="contain"
                  />
                  <Text style={styles.inspectionFeeAmount} className="font-bold">
                    {formatCurrency(spaceForm.value.inspectionFee || 0)}
                  </Text>
                </View>
              </View>

              <View style={styles.inspectionTimesContainer}>
                <Text style={styles.inspectionTimesLabel}>
                  Inspection times:
                </Text>
                {spaceForm.value.inspectionTimeSlots?.map((time, index) => (
                  <View key={index} style={styles.inspectionTimeRow} className="flex-row items-center">
                    <Image
                      source={require("@/assets/icons/Time.png")}
                      style={styles.clockIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.inspectionSlot} className="flex-1">{time.label}</Text>
                    <Text style={styles.inspectionTime} className="font-semibold">
                      {time.startTime} - {time.endTime}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Cost Breakdown Section */}
        <View style={styles.section} className="border-t">
          <Text style={styles.sectionTitle} className="font-semibold">Cost Breakdown</Text>

          <View style={styles.costBreakdownContainer}>
            {costBreakdown.map((item, index) => (
              <View key={index} style={styles.costRow} className="flex-row justify-between items-center">
                <Text style={styles.costLabel}>{item.title}</Text>
                <Text style={styles.costAmount} className="font-semibold">
                  {formatCurrency(item.value)}
                </Text>
              </View>
            ))}

            <View style={styles.totalRow} className="flex-row justify-between items-center border-t">
              <Text style={styles.totalLabel} className="font-semibold">Total Payable</Text>
              <Text style={styles.totalAmount} className="font-bold">
                {formatCurrency(totalPackage)}
              </Text>
            </View>
          </View>
        </View>

        {/* Complete Button */}
        {showCompleteButton && (
          <View style={styles.completeButtonContainer}>
            <AppButton
              title="Looks Good!"
              onPress={handleComplete}
              size="large"
              fullwidth={true}
            />
          </View>
        )}
      </ScrollView>

      {/* ENLARGED MAP MODAL */}
      <Modal
        visible={enlargeMapVisible}
        animationType="slide"
        onRequestClose={() => {
          setShowLocationSheet(false);
          setEnlargeMapVisible(false);
        }}
      >
        <View  className="w-[100%px] h-[100%px] overflow-hidden relative">
          {/* The Map */}
          {HAS_GOOGLE_MAPS_API_KEY ? (
            <MapView
              className="flex-1"
              initialRegion={{
                latitude: spaceForm.value.location?.latitude ?? 4.8156,
                longitude: spaceForm.value.location?.longitude ?? 7.0498,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: spaceForm.value.location?.latitude ?? 4.8156,
                  longitude: spaceForm.value.location?.longitude ?? 7.0498,
                }}
              />
            </MapView>
          ) : (
            <View style={styles.mapFallback} className="flex-1 items-center justify-center">
              <Text style={styles.mapFallbackText} className="text-center">
                Map disabled. Add Google API key to enable.
              </Text>
            </View>
          )}

          {/* Street View Button */}
          <TouchableOpacity
            style={styles.fullStreetViewButton}
            onPress={() =>
              router.push({
                pathname: "/views/streetview",
                params: {
                  lat: spaceForm.value.location?.latitude,
                  lng: spaceForm.value.location?.longitude,
                },
              })
            }
           className="absolute flex-row items-center">
            <Image
              source={require("@/assets/icons/Streetview-solid.png")}
              style={styles.streetViewIcon}
             className="tint-[#FFFFFF]"/>
            <Text style={styles.streetViewText} className="font-medium text-[#FFFFFF]">Street view</Text>
          </TouchableOpacity>

          {/* Collapse button */}
          <TouchableOpacity
            style={[styles.fullscreenButton]}
            onPress={() => {
              setShowLocationSheet(false);
              setEnlargeMapVisible(false);
            }}
           className="absolute">
            <Image
              source={require("@/assets/icons/collapse.png")}
              style={styles.expandViewIcon}
            />
          </TouchableOpacity>

          {/* Custom Bottom Sheet Inside Modal */}
          {showLocationSheet && (
            <Pressable

              onPress={() => setShowLocationSheet(false)}
             className="absolute bottom-[0px] left-[0px] right-[0px] justify-end">
              <Pressable style={styles.bottomSheetContainer} className="bg-[#FFFFFF] min-h-[15%px] shadow-color-[#000] shadow-opacity-[0.1px] shadow-radius-[8px] elevation-[10px]">
                <View style={styles.bottomSheetHandle}  className="self-center"/>
                <View style={styles.bottomSheetContent}>
                  <Text style={styles.bottomSheetTitle} className="font-semibold">Location</Text>
                  <Text style={styles.bottomSheetAddress}>
                    {spaceForm.value?.location?.address ||
                      "Road 2, Tony Estate, Rumuewhere, Port Harcourt"}
                  </Text>
                </View>
              </Pressable>
            </Pressable>
          )}
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    scrollContent: {
      paddingVertical: RFValue(20),
    },
    previewTitle: {fontSize: RFValue(24),
color: colors.slate[650],
marginBottom: RFValue(24)},
    imageContainer: {
      width: width,
      height: RFValue(220),
      marginBottom: RFValue(20),
    },
    mainImage: {borderRadius: RFValue(12)},
    propertyCard: {
      marginBottom: RFValue(24),
    },
    propertyHeader: {gap: RFValue(10),
marginBottom: RFValue(12)},
    typeContainer: {gap: RFValue(6),
paddingVertical: RFValue(4),
backgroundColor: colors.slate[200],
paddingHorizontal: RFValue(8),
borderRadius: RFValue(12)},
    homeIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[650],
    },
    typeText: {fontSize: RFValue(14),
color: colors.slate[650]},
    availableBadge: {paddingHorizontal: RFValue(10),
paddingVertical: RFValue(4),
borderRadius: RFValue(12)},
    availableText: {fontSize: RFValue(12)},
    propertyTitle: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(8)},
    locationRow: {gap: RFValue(6),
marginBottom: RFValue(16)},
    locationIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[600],
    },
    addressText: {fontSize: RFValue(14),
color: colors.slate[600]},
    priceText: {fontSize: RFValue(22),
color: colors.slate[650],
marginBottom: RFValue(20)},
    priceUnit: {fontSize: RFValue(16),
color: colors.slate[600]},
    featuresRow: {paddingTop: RFValue(20),
borderTopColor: colors.slate[350]},
    featureItem: {gap: RFValue(8)},
    featureIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[600],
    },
    featureText: {fontSize: RFValue(13),
color: colors.slate[600]},
    section: {paddingVertical: RFValue(16),
borderTopColor: colors.slate[350]},
    sectionTitle: {fontSize: RFValue(18),
color: colors.slate[650],
marginBottom: RFValue(16)},
    aboutText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(22),
    },
    amenityRow: {marginBottom: RFValue(8)},
    bullet: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      marginRight: RFValue(8),
      marginTop: RFValue(2),
    },
    amenityText: {fontSize: RFValue(14),
color: colors.slate[650]},
    locationAddress: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      marginBottom: RFValue(16),
    },
    mapContainer: {height: RFValue(250),
borderRadius: RFValue(12)},
    mapFallback: {backgroundColor: colors.slate[150],
paddingHorizontal: RFValue(16)},
    mapFallbackText: {fontSize: RFValue(14),
color: colors.slate[600]},
    fullMapContainer: {},
    mapImage: {},
    streetViewButton: {bottom: RFValue(12),
right: RFValue(12),
backgroundColor: colors.slate[550],
paddingHorizontal: RFValue(12),
paddingVertical: RFValue(8),
borderRadius: RFValue(20),
gap: RFValue(6)},
    fullStreetViewButton: {bottom: RFValue(150),
right: RFValue(12),
backgroundColor: colors.slate[550],
paddingHorizontal: RFValue(12),
paddingVertical: RFValue(8),
borderRadius: RFValue(20),
gap: RFValue(6)},
    fullscreenButton: {top: RFValue(12),
right: RFValue(12),
backgroundColor: colors.slate[100],
paddingHorizontal: RFValue(12),
paddingVertical: RFValue(12),
borderRadius: RFValue(30)},
    expandViewIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[650],
    },
    streetViewIcon: {width: RFValue(14),
height: RFValue(14)},
    streetViewText: {fontSize: RFValue(12)},
    galleryGrid: {gap: RFValue(12),
marginBottom: RFValue(16)},
    bottomModalContainer: {},
    infoButton: {top: RFValue(12),
left: RFValue(12),
backgroundColor: colors.slate[100],
paddingHorizontal: RFValue(12),
paddingVertical: RFValue(12),
borderRadius: RFValue(30)},
    infoIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[650],
    },
    bottomSheetOverlay: {},
    bottomSheetContainer: {borderTopLeftRadius: RFValue(20),
borderTopRightRadius: RFValue(20),
shadowOffset: {
        width: 0,
        height: -4,
      }},
    bottomSheetHandle: {width: RFValue(40),
height: RFValue(4),
backgroundColor: colors.slate[300],
borderRadius: RFValue(2),
marginTop: RFValue(12)},
    bottomSheetContent: {
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(16),
    },
    bottomSheetTitle: {fontSize: RFValue(18),
color: colors.slate[650],
marginBottom: RFValue(12)},
    bottomSheetAddress: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(22),
    },
    galleryItem: {
      height: RFValue(120),
      borderRadius: RFValue(25),
      width: RFValue(80),
    },
    galleryImage: {borderRadius: RFValue(12)},
    virtualTourRow: {paddingVertical: RFValue(16),
paddingHorizontal: RFValue(16),
backgroundColor: colors.slate[200],
borderRadius: RFValue(12)},
    virtualTourInfo: {},
    virtualTourLabel: {fontSize: RFValue(15),
color: colors.slate[650],
marginBottom: RFValue(4)},
    uploadStatus: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    previewButton: {gap: RFValue(6),
paddingHorizontal: RFValue(12),
paddingVertical: RFValue(8)},
    playIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[650],
    },
    previewButtonText: {fontSize: RFValue(14),
color: colors.slate[650]},
    landlordInfo: {
      marginBottom: RFValue(8),
      paddingHorizontal: RFValue(8),
    },
    landlordName: {fontSize: RFValue(16),
color: colors.slate[650],
marginBottom: RFValue(12)},
    landlordRow: {gap: RFValue(8),
marginBottom: RFValue(12)},
    landlordIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[600],
    },
    landlordText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    agreementRow: {paddingVertical: RFValue(16),
paddingHorizontal: RFValue(16),
backgroundColor: colors.slate[200],
borderRadius: RFValue(12)},
    agreementInfo: {},
    agreementLabel: {fontSize: RFValue(15),
color: colors.slate[650],
marginBottom: RFValue(6)},
    agreementStatus: {gap: RFValue(6)},
    fileIconSmall: {
      width: RFValue(12),
      height: RFValue(12),
      tintColor: colors.slate[500],
    },
    agreementSize: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    agreementPreviewButton: {gap: RFValue(6),
paddingHorizontal: RFValue(12),
paddingVertical: RFValue(8)},
    agreementPreviewText: {fontSize: RFValue(14),
color: colors.slate[650]},
    arrowUpIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[650],
    },
    inspectionFeeContainer: {borderRadius: RFValue(12),
borderBottomColor: colors.slate[300],
paddingBottom: RFValue(16),
marginBottom: RFValue(16)},
    inspectionContainer: {
      backgroundColor: colors.slate[200],
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(16),
    },
    inspectionFeeLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      marginBottom: RFValue(8),
    },
    inspectionFeeRow: {gap: RFValue(8)},
    coinEmoji: {
      height: RFValue(24),
      width: RFValue(24),
    },
    inspectionFeeAmount: {fontSize: RFValue(18),
color: colors.slate[650]},
    inspectionTimesContainer: {
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
    },
    inspectionTimesLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      marginBottom: RFValue(16),
    },
    inspectionTimeRow: {marginBottom: RFValue(12),
gap: RFValue(8)},
    clockIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[600],
    },
    inspectionSlot: {fontSize: RFValue(14),
color: colors.slate[650]},
    inspectionTime: {fontSize: RFValue(14),
color: colors.slate[650]},
    costBreakdownContainer: {
      backgroundColor: colors.slate[100],
      paddingVertical: RFValue(16),
      borderRadius: RFValue(12),
    },
    costRow: {marginBottom: RFValue(16)},
    costLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    costAmount: {fontSize: RFValue(14),
color: colors.slate[650]},
    totalRow: {paddingTop: RFValue(16),
borderTopColor: colors.slate[300]},
    totalLabel: {fontSize: RFValue(16),
color: colors.slate[650]},
    totalAmount: {fontSize: RFValue(18),
color: colors.slate[650]},
    completeButtonContainer: {
      marginTop: RFValue(8),
    },
  });

export default SpacePreviewScreen;
