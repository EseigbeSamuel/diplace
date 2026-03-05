import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useSpaceStore } from "@/store/useSpace";
import { useGetCurrentUser } from "@/hooks";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { CustomBottomSheet } from "@/components/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const { width } = Dimensions.get("window");
const HAS_GOOGLE_KEY = !!process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

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
        <Text style={styles.previewTitle}>Preview</Text>

        {/* Main Image */}
        <View style={styles.imageContainer}>
          {spaceForm.value.media && spaceForm.value.media.length > 0 ? (
            <Image
              source={{ uri: spaceForm.value.media[0]?.uri }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={spaceData.gallery[0]}
              style={styles.mainImage}
              resizeMode="cover"
            />
          )}
        </View>

        {/* Property Info Card */}
        <View style={styles.propertyCard}>
          <View style={styles.propertyHeader}>
            <View style={styles.typeContainer}>
              <Image
                source={
                  spaceForm.type === "event"
                    ? require("@/assets/icons/event-outline.png")
                    : require("@/assets/icons/home-outline.png")
                }
                resizeMode="contain"
              />
              <Text style={styles.typeText}>{formatType(spaceForm.type)}</Text>
            </View>
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>
                {spaceForm.value.units || 1} unit available
              </Text>
            </View>
          </View>

          <Text style={styles.propertyTitle}>
            {spaceForm.value.description?.title ||
              "2 Bedroom in-suite apartment"}
          </Text>

          <View style={styles.locationRow}>
            <Image
              source={require("@/assets/icons/location-1.png")}
              style={styles.locationIcon}
              resizeMode="contain"
            />
            <Text style={styles.addressText}>
              {spaceForm.value?.location?.address ||
                "Road 2, Tony Estate, Rumuewhere, Port Harcourt"}
            </Text>
          </View>

          <Text style={styles.priceText}>
            {formatCurrency(spaceForm.value.rentalCost?.rentalCost)}
            <Text style={styles.priceUnit}>
              /{spaceForm.value.rentalCost?.rentDuration}
            </Text>
          </Text>

          {/* Property Features */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Image
                source={
                  spaceForm.type === "event"
                    ? require("@/assets/icons/location-1.png")
                    : require("@/assets/icons/bed-outline.png")
                }
                style={styles.featureIcon}
                resizeMode="contain"
              />
              <Text style={styles.featureText}>
                {spaceForm.type === "event"
                  ? toProperCase(spaceForm.value.eventSpace)
                  : spaceForm.value.capacity?.rooms}{" "}
                {spaceForm.type !== "event" ? "Bedrooms" : ""}
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Image
                source={
                  spaceForm.type === "event"
                    ? require("@/assets/icons/electricity.png")
                    : require("@/assets/icons/bath.png")
                }
                style={styles.featureIcon}
                resizeMode="contain"
              />
              <Text style={styles.featureText}>
                {spaceForm.type === "event"
                  ? "Generator"
                  : `${spaceForm.value.capacity?.bathrooms} Baths`}
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Image
                source={require("@/assets/icons/size.png")}
                style={styles.featureIcon}
                resizeMode="contain"
              />
              <Text style={styles.featureText}>
                {spaceForm.type === "event"
                  ? spaceForm.value.capacity?.caps
                  : spaceForm.value.capacity?.roomSize}
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this space</Text>
          <Text style={styles.aboutText}>
            {spaceForm.value.description?.description}
          </Text>
        </View>

        {/* Amenities Section */}
        <View>
          <Text style={styles.sectionTitle}>Amenities</Text>
          {spaceForm.value.amenities?.map((amenity, index) => (
            <View key={index} style={styles.amenityRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.locationAddress}>
            {spaceData.location.address}
          </Text>

          {/* Map Placeholder */}
          <View style={styles.mapContainer}>
            {HAS_GOOGLE_KEY ? (
              <MapView
                style={{ flex: 1 }}
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
              <View style={styles.mapFallback}>
                <Text style={styles.mapFallbackText}>
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
            >
              <Image
                source={require("@/assets/icons/Streetview-solid.png")}
                style={styles.streetViewIcon}
                resizeMode="contain"
              />
              <Text style={styles.streetViewText}>Street view</Text>
            </TouchableOpacity>

            {/* Fullscreen button */}
            <TouchableOpacity
              style={styles.fullscreenButton}
              onPress={() => {
                setEnlargeMapVisible(true);
                setShowLocationSheet(true);
              }}
            >
              <Image
                source={require("@/assets/icons/expand.png")}
                style={styles.expandViewIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gallery Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryGrid}
          >
            {spaceForm.value.media && (
              <View style={styles.galleryGrid}>
                {spaceForm.value.media.map((image, index) => (
                  <View key={index} style={styles.galleryItem}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Virtual Tour */}
          <View style={styles.virtualTourRow}>
            <View style={styles.virtualTourInfo}>
              <Text style={styles.virtualTourLabel}>Virtual Tour</Text>
              <Text style={styles.uploadStatus}>
                {spaceForm.value.tour && spaceForm.value.tour.length > 0
                  ? "Uploaded"
                  : "Not uploaded"}
              </Text>
            </View>
            <TouchableOpacity style={styles.previewButton}>
              <Image
                source={require("@/assets/icons/play-outline.png")}
                style={styles.playIcon}
                resizeMode="contain"
              />
              <Text style={styles.previewButtonText}>Preview</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Landlord's Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {spaceForm.type === "event" ? "Owner's" : "Landlord's"} Details
          </Text>

          <View style={styles.landlordInfo}>
            <Text style={styles.landlordName}>
              {previewContact.name}
            </Text>

            <TouchableOpacity style={styles.landlordRow}>
              <Image
                source={require("@/assets/icons/calling.png")}
                style={styles.landlordIcon}
                resizeMode="contain"
              />
              <Text style={styles.landlordText}>
                {previewContact.phone}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.landlordRow}>
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
          <View style={styles.agreementRow}>
            <View style={styles.agreementInfo}>
              <Text style={styles.agreementLabel}>Tenancy Agreement</Text>
              <View style={styles.agreementStatus}>
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
            <TouchableOpacity style={styles.agreementPreviewButton}>
              <Text style={styles.agreementPreviewText}>Preview</Text>
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inspection Schedule</Text>

            <View style={styles.inspectionContainer}>
              <View style={styles.inspectionFeeContainer}>
                <Text style={styles.inspectionFeeLabel}>Inspection fee:</Text>
                <View style={styles.inspectionFeeRow}>
                  <Image
                    source={require("@/assets/icons/money-bag.png")}
                    style={styles.coinEmoji}
                    resizeMode="contain"
                  />
                  <Text style={styles.inspectionFeeAmount}>
                    {formatCurrency(spaceForm.value.inspectionFee || 0)}
                  </Text>
                </View>
              </View>

              <View style={styles.inspectionTimesContainer}>
                <Text style={styles.inspectionTimesLabel}>
                  Inspection times:
                </Text>
                {spaceForm.value.inspectionTimeSlots?.map((time, index) => (
                  <View key={index} style={styles.inspectionTimeRow}>
                    <Image
                      source={require("@/assets/icons/Time.png")}
                      style={styles.clockIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.inspectionSlot}>{time.label}</Text>
                    <Text style={styles.inspectionTime}>
                      {time.startTime} - {time.endTime}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Cost Breakdown Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cost Breakdown</Text>

          <View style={styles.costBreakdownContainer}>
            {costBreakdown.map((item, index) => (
              <View key={index} style={styles.costRow}>
                <Text style={styles.costLabel}>{item.title}</Text>
                <Text style={styles.costAmount}>{formatCurrency(item.value)}</Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalAmount}>{formatCurrency(totalPackage)}</Text>
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
        <View style={styles.fullMapContainer}>
          {/* The Map */}
          {HAS_GOOGLE_KEY ? (
            <MapView
              style={{ flex: 1 }}
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
            <View style={styles.mapFallback}>
              <Text style={styles.mapFallbackText}>
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
          >
            <Image
              source={require("@/assets/icons/Streetview-solid.png")}
              style={styles.streetViewIcon}
            />
            <Text style={styles.streetViewText}>Street view</Text>
          </TouchableOpacity>

          {/* Collapse button */}
          <TouchableOpacity
            style={[styles.fullscreenButton]}
            onPress={() => {
              setShowLocationSheet(false);
              setEnlargeMapVisible(false);
            }}
          >
            <Image
              source={require("@/assets/icons/collapse.png")}
              style={styles.expandViewIcon}
            />
          </TouchableOpacity>

          {/* Custom Bottom Sheet Inside Modal */}
          {showLocationSheet && (
            <Pressable
              style={styles.bottomSheetOverlay}
              onPress={() => setShowLocationSheet(false)}
            >
              <Pressable style={styles.bottomSheetContainer}>
                <View style={styles.bottomSheetHandle} />
                <View style={styles.bottomSheetContent}>
                  <Text style={styles.bottomSheetTitle}>Location</Text>
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
    previewTitle: {
      fontSize: RFValue(24),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(24),
    },
    imageContainer: {
      width: width,
      height: RFValue(220),
      marginBottom: RFValue(20),
    },
    mainImage: {
      width: "90%",
      height: "100%",
      borderRadius: RFValue(12),
    },
    propertyCard: {
      marginBottom: RFValue(24),
    },
    propertyHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(10),
      marginBottom: RFValue(12),
    },
    typeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
      paddingVertical: RFValue(4),
      backgroundColor: colors.slate[200],
      paddingHorizontal: RFValue(8),
      borderRadius: RFValue(12),
    },
    homeIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[650],
    },
    typeText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    availableBadge: {
      backgroundColor: "#D1FAE5",
      paddingHorizontal: RFValue(10),
      paddingVertical: RFValue(4),
      borderRadius: RFValue(12),
    },
    availableText: {
      fontSize: RFValue(12),
      fontWeight: "500",
      color: "#16A34A",
    },
    propertyTitle: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
      marginBottom: RFValue(16),
    },
    locationIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[600],
    },
    addressText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      flex: 1,
    },
    priceText: {
      fontSize: RFValue(22),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(20),
    },
    priceUnit: {
      fontSize: RFValue(16),
      fontWeight: "400",
      color: colors.slate[600],
    },
    featuresRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: RFValue(20),
      borderTopWidth: 1,
      borderTopColor: colors.slate[350],
    },
    featureItem: {
      alignItems: "center",
      gap: RFValue(8),
    },
    featureIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[600],
    },
    featureText: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      fontWeight: "500",
    },
    section: {
      paddingVertical: RFValue(16),
      borderTopColor: colors.slate[350],
      borderTopWidth: 1,
    },
    sectionTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(16),
    },
    aboutText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(22),
    },
    amenityRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: RFValue(8),
    },
    bullet: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      marginRight: RFValue(8),
      marginTop: RFValue(2),
    },
    amenityText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      flex: 1,
    },
    locationAddress: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      marginBottom: RFValue(16),
    },
    mapContainer: {
      width: "100%",
      height: RFValue(250),
      borderRadius: RFValue(12),
      overflow: "hidden",
      position: "relative",
    },
    mapFallback: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.slate[150],
      paddingHorizontal: RFValue(16),
    },
    mapFallbackText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      textAlign: "center",
    },
    fullMapContainer: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      position: "relative",
    },
    mapImage: {
      width: "100%",
      height: "100%",
    },
    streetViewButton: {
      position: "absolute",
      bottom: RFValue(12),
      right: RFValue(12),
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.slate[550],
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(8),
      borderRadius: RFValue(20),
      gap: RFValue(6),
    },
    fullStreetViewButton: {
      position: "absolute",
      bottom: RFValue(150),
      right: RFValue(12),
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.slate[550],
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(8),
      borderRadius: RFValue(20),
      gap: RFValue(6),
    },
    fullscreenButton: {
      position: "absolute",
      top: RFValue(12),
      right: RFValue(12),
      backgroundColor: colors.slate[100],
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(12),
      borderRadius: RFValue(30),
    },
    expandViewIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[650],
    },
    streetViewIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: "#FFFFFF",
    },
    streetViewText: {
      fontSize: RFValue(12),
      fontWeight: "500",
      color: "#FFFFFF",
    },
    galleryGrid: {
      flexDirection: "row",
      gap: RFValue(12),
      marginBottom: RFValue(16),
    },
    bottomModalContainer: {
      zIndex: 20,
      flex: 1,
    },
    infoButton: {
      position: "absolute",
      top: RFValue(12),
      left: RFValue(12),
      backgroundColor: colors.slate[100],
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(12),
      borderRadius: RFValue(30),
    },
    infoIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[650],
    },
    bottomSheetOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "flex-end",
    },
    bottomSheetContainer: {
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: RFValue(20),
      borderTopRightRadius: RFValue(20),
      minHeight: "15%",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 10,
    },
    bottomSheetHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginTop: RFValue(12),
    },
    bottomSheetContent: {
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(16),
    },
    bottomSheetTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(12),
    },
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
    galleryImage: {
      width: "100%",
      borderRadius: RFValue(12),
      height: "100%",
    },
    virtualTourRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
    },
    virtualTourInfo: {
      flex: 1,
    },
    virtualTourLabel: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(4),
    },
    uploadStatus: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    previewButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(8),
    },
    playIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[650],
    },
    previewButtonText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    landlordInfo: {
      marginBottom: RFValue(8),
      paddingHorizontal: RFValue(8),
    },
    landlordName: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(12),
    },
    landlordRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(8),
      marginBottom: RFValue(12),
    },
    landlordIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[600],
    },
    landlordText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    agreementRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
    },
    agreementInfo: {
      flex: 1,
    },
    agreementLabel: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(6),
    },
    agreementStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
    },
    fileIconSmall: {
      width: RFValue(12),
      height: RFValue(12),
      tintColor: colors.slate[500],
    },
    agreementSize: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    agreementPreviewButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(8),
    },
    agreementPreviewText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    arrowUpIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[650],
    },
    inspectionFeeContainer: {
      borderRadius: RFValue(12),
      borderBottomColor: colors.slate[300],
      borderBottomWidth: 1,
      paddingBottom: RFValue(16),
      marginBottom: RFValue(16),
    },
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
    inspectionFeeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(8),
    },
    coinEmoji: {
      height: RFValue(24),
      width: RFValue(24),
    },
    inspectionFeeAmount: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
    },
    inspectionTimesContainer: {
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
    },
    inspectionTimesLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      marginBottom: RFValue(16),
    },
    inspectionTimeRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: RFValue(12),
      gap: RFValue(8),
    },
    clockIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[600],
    },
    inspectionSlot: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      flex: 1,
    },
    inspectionTime: {
      fontSize: RFValue(14),
      fontWeight: "600",
      color: colors.slate[650],
    },
    costBreakdownContainer: {
      backgroundColor: colors.slate[100],
      paddingVertical: RFValue(16),
      borderRadius: RFValue(12),
    },
    costRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: RFValue(16),
    },
    costLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    costAmount: {
      fontSize: RFValue(14),
      fontWeight: "600",
      color: colors.slate[650],
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: RFValue(16),
      borderTopWidth: 1,
      borderTopColor: colors.slate[300],
    },
    totalLabel: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    totalAmount: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
    },
    completeButtonContainer: {
      marginTop: RFValue(8),
    },
  });

export default SpacePreviewScreen;

