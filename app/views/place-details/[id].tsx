import BookmarkButton from "@/components/bookmark";
import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { SimpleSelector } from "@/components/selector";
import { useTheme } from "@/contexts/themeContext";
import {
  useGetPropertyAvailability,
  useGetPropertyDetails,
  useListPropertyReviews,
  useReportProperty,
  useScheduleInspection,
} from "@/hooks";
import { useSpaceStore } from "@/store/useSpace";
import { ColorScheme } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import MapView, { Marker } from "react-native-maps";
import { RFValue } from "react-native-responsive-fontsize";
import type { ReportPropertyReason } from "@/types";

type timeslot = {
  id: string;
  label: string;
  price?: number;
};

const timeslotDB: timeslot[] = [
  { id: "morning", label: "10AM - 12PM (Morning slot)" },
  { id: "afternoon", label: "1PM - 3PM (Afternoon slot)" },
  { id: "evening", label: "4PM - 6PM (Evening slot)" },
];

const { width } = Dimensions.get("window");
const HAS_GOOGLE_KEY = !!process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const REPORT_REASON_MAP: Record<string, ReportPropertyReason> = {
  "Wrong & incorrect information": "inaccurate_information",
  "Fake / Scam listing": "fraudulent_listing",
  "Already rented out": "inaccurate_information",
  "Misleading photos and videos": "inappropriate_content",
  "Property is duplicated in the app": "inaccurate_information",
  "Inaccessible address": "inaccurate_information",
  Others: "other",
};

const Placedetails = () => {
  const { colors, isDarkMode } = useTheme();
  const { spaceForm } = useSpaceStore();
  const styles = createStyles(colors);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const propertyId = Array.isArray(id) ? id[0] : id;

  const [selectedTime, setSelectedTime] = useState<timeslot | null>(null);
  const [enlargeMapVisible, setEnlargeMapVisible] = useState(false);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportReasons, setSelectedReportReasons] = useState<string[]>(
    [],
  );
  const [othersText, setOthersText] = useState("");

  const reportReasons = [
    "Wrong & incorrect information",
    "Fake / Scam listing",
    "Already rented out",
    "Misleading photos and videos",
    "Property is duplicated in the app",
    "Inaccessible address",
    "Others",
  ];

  const router = useRouter();
  const galleryScrollRef = useRef<ScrollView>(null);
  const {
    propertyDetails: property,
    isPropertyDetailsLoading,
    propertyDetailsError,
  } = useGetPropertyDetails({
    propertyId,
    enabled: !!propertyId,
  });
  const { propertyReviewsTotal } = useListPropertyReviews({
    propertyId: propertyId,
    enabled: !!propertyId,
  });
  const { propertyAvailability } = useGetPropertyAvailability({
    propertyId,
    enabled: !!propertyId,
    params: { status: "available", limit: 100, sort_order: "asc" },
  });
  const { scheduleInspectionMutation, isScheduleInspectionPending } =
    useScheduleInspection();
  const { reportPropertyMutation, reportPropertyPending } = useReportProperty();

  const galleryData = useMemo(() => {
    if (property?.media?.length) {
      return property.media.map((item) => ({ uri: item.file_url }));
    }
    if (spaceForm.value.media && spaceForm.value.media.length > 0) {
      return spaceForm.value.media.map((item) => ({ uri: item.uri }));
    }
    return [{ uri: require("@/assets/images/diplace.jpg") }];
  }, [property, spaceForm.value.media]);

  const displayAddress =
    [
      property?.address?.street,
      property?.address?.city,
      property?.address?.state,
      property?.address?.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    spaceForm.value?.location?.address ||
    "Road 2, Tony Estate, Rumuewhere, Port Harcourt";

  const displayLatitude =
    property?.address?.latitude ?? spaceForm.value.location?.latitude ?? 4.8156;
  const displayLongitude =
    property?.address?.longitude ??
    spaceForm.value.location?.longitude ??
    7.0498;

  const displayTitle =
    property?.title ||
    spaceForm.value.description?.title ||
    "2 Bedroom in-suite apartment";
  const displayPrice =
    property?.price ?? spaceForm.value.rentalCost?.rentalCost ?? "60000";
  const displayDuration =
    property?.cost_frequency?.replace(/^per_/, "").replace(/_/g, " ") ||
    spaceForm.value.rentalCost?.rentDuration ||
    "annum";

  const listedByName =
    [property?.lister?.first_name, property?.lister?.last_name]
      .filter(Boolean)
      .join(" ") || "User";
  const listedByAvatar = property?.lister?.profile_picture || null;
  const postedAtLabel = (() => {
    if (!property?.date_created) return "Posted recently";
    const now = Date.now();
    const then = new Date(property.date_created).getTime();
    const diffMs = Math.max(0, now - then);
    const dayMs = 24 * 60 * 60 * 1000;
    const days = Math.floor(diffMs / dayMs);

    if (days < 1) return "Posted today";
    if (days < 30) return `Posted ${days} day${days === 1 ? "" : "s"} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `Posted ${months} month${months === 1 ? "" : "s"} ago`;
    }
    const years = Math.floor(months / 12);
    return `Posted ${years} year${years === 1 ? "" : "s"} ago`;
  })();

  const aboutText =
    property?.description ||
    "Atraz Palace is a premium 500 capacity event space perfect for weddings, conferences, parties, and special occasions. With elegant interiors, ample parking, and flexible seating arrangements, it offers a seamless experience for both hosts and guests. The hall is fully air-conditioned, generator-powered, and located in a secure, accessible area.";

  const amenities = property?.amenities?.length ? property.amenities : [];

  const costBreakdown = property
    ? [
        {
          id: "0",
          title: `Space rent (${displayDuration})`,
          description: "",
          value: `NGN ${new Intl.NumberFormat("en-NG").format(property.price || 0)}`,
          editable: false,
        },
        {
          id: "1",
          title: "Platform fee",
          description: "",
          value: `NGN ${new Intl.NumberFormat("en-NG").format(property.fees?.platform_fee || 0)}`,
          editable: false,
        },
        {
          id: "2",
          title: "Agency fee",
          description: "",
          value: `${property.fees?.agency_fee_percent || 0}%`,
          editable: false,
        },
        {
          id: "3",
          title: "Caution fee",
          description: "",
          value: `NGN ${new Intl.NumberFormat("en-NG").format(property.fees?.caution_fee || 0)}`,
          editable: false,
        },
        {
          id: "4",
          title: "Legal fee",
          description: "",
          value: `${property.fees?.legal_fee_percent || 0}%`,
          editable: false,
        },
      ]
    : [
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

  const formatMoneyParam = (value: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(value)}`;

  const formatAvailabilityTime = (start: string, end: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
    };
    const startLabel = new Date(start).toLocaleTimeString("en-NG", options);
    const endLabel = new Date(end).toLocaleTimeString("en-NG", options);
    return `${startLabel} - ${endLabel}`;
  };

  const toggleReportReason = (reason: string) => {
    setSelectedReportReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason],
    );
  };

  const resetReportForm = () => {
    setShowReportModal(false);
    setSelectedReportReasons([]);
    setOthersText("");
  };

  const handleSubmitReport = async () => {
    const activePropertyId = property?.public_id || propertyId;
    if (!activePropertyId || selectedReportReasons.length === 0) return;

    const primaryReason = selectedReportReasons[0];
    const otherDetails = othersText.trim();
    const details = [
      `Selected reasons: ${selectedReportReasons.join(", ")}`,
      otherDetails ? `Additional details: ${otherDetails}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await reportPropertyMutation({
        propertyId: activePropertyId,
        payload: {
          reason: REPORT_REASON_MAP[primaryReason] || "other",
          details,
        },
      });

      resetReportForm();
    } catch {
      // Error toast is handled by the report mutation.
    }
  };

  const inspectionTimeSlots = useMemo(() => {
    const slots = propertyAvailability
      .filter((slot) => {
        const slotDate = slot.start_datetime.slice(0, 10);
        return (
          slot.is_available && (!selectedDate || slotDate === selectedDate)
        );
      })
      .map((slot) => ({
        id: slot.public_id,
        label: formatAvailabilityTime(slot.start_datetime, slot.end_datetime),
        price: slot.price,
      }));

    return slots.length || propertyId ? slots : timeslotDB;
  }, [propertyAvailability, propertyId, selectedDate]);

  const bookingRouteParams = {
    propertyId: property?.public_id || propertyId || "",
    propertyType: property?.property_type || spaceForm.type || "apartment",
    propertyName: displayTitle,
    propertyLocation: displayAddress,
    propertyPrice: formatMoneyParam(Number(displayPrice) || 0),
    propertyImage:
      property?.media?.[0]?.file_url || (spaceForm.value.media?.[0]?.uri ?? ""),
    rentAmount: formatMoneyParam(Number(property?.price) || 0),
    cautionFee: formatMoneyParam(Number(property?.fees?.caution_fee) || 0),
    platformFee: formatMoneyParam(Number(property?.fees?.platform_fee) || 0),
    totalAmount: formatMoneyParam(totalPackage),
    amountValue: String(totalPackage),
    rentDays: "1",
  };

  const handleScheduleInspection = async () => {
    if (!selectedTime?.id) return;

    const inspection = await scheduleInspectionMutation({
      availability_id: selectedTime.id,
      agreed_to_terms: true,
    });

    setShowInspectionModal(false);
    router.push({
      pathname: "/views/booking/payment",
      params: {
        type: "inspection",
        amount: formatMoneyParam(selectedTime.price ?? 0),
        amountValue: String(selectedTime.price ?? 0),
        relatedId: inspection.public_id,
        purpose: "inspection_fee",
      },
    });
  };

  const formatReadableDate = (
    dateString: string | Date | null | undefined,
  ): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const toProperCase = (t?: string | null) =>
    t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : "";

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

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentImageIndex(index);
  };

  if (propertyId && isPropertyDetailsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.slate[650]} />
        <Text style={[styles.loadingText, { color: colors.slate[650] }]}>
          Loading property...
        </Text>
      </View>
    );
  }

  if (propertyId && (propertyDetailsError || !property)) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: colors.slate[650] }]}>
          Failed to load property details.
        </Text>
        <View style={{ width: RFValue(140), marginTop: RFValue(8) }}>
          <AppButton title="Go Back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <SectionHeader
        title=""
        rightIconSource={require("@/assets/icons/more-2-line.png")}
        onRightIconPress={() => setShowOptionsMenu(true)}
      />
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Image */}
          <View style={styles.imageContainer}>
            {spaceForm.value.media && spaceForm.value.media.length > 0 ? (
              <Image
                source={{ uri: spaceForm.value.media[0]?.uri }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            ) : (
              <View>
                <Image
                  source={require("@/assets/images/diplace.jpg")}
                  style={styles.mainImage}
                  resizeMode="cover"
                />
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setShowGalleryModal(true)}
                  >
                    <Text style={styles.actionButtonText}>GALLERY</Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      router.push({
                        pathname: "/views/streetview",
                        params: {
                          lat: displayLatitude,
                          lng: displayLongitude,
                        },
                      })
                    }
                  >
                    <Text style={styles.actionButtonText}>STREET VIEW</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Bookmark Icon */}
            <TouchableOpacity style={styles.bookmarkButton}>
              <BookmarkButton id={propertyId} />
            </TouchableOpacity>
          </View>

          {/* Gallery and Street View Buttons - Below Image */}

          {/* Property Info Card */}
          <View style={styles.propertyCard}>
            <View style={styles.propertyTitleRow}>
              <View style={styles.propertyTitleContainer}>
                <Text style={styles.propertyTitle}>{displayTitle}</Text>
                <View style={styles.locationRow}>
                  <Image
                    source={require("@/assets/icons/location.png")}
                    style={styles.locationIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.addressText}>{displayAddress}</Text>
                </View>
              </View>
              <View style={styles.badgeContainer}>
                <Text style={styles.priceText}>₦{displayPrice}</Text>

                <Text style={styles.priceUnit}>/{displayDuration}</Text>
              </View>
            </View>

            <View className="px-3 py-2 border-t border-b border-gray-300">
              <Text
                style={{ color: colors.slate[600] }}
                className="py-2 italic text-center"
              >
                ⚠️ Heads up! The price you see is for the space only. Agent fees
                and other charges may apply.
              </Text>
            </View>

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
                    : spaceForm.value.capacity?.rooms || "2"}{" "}
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
                    : `${spaceForm.value.capacity?.bathrooms || "2"} Baths`}
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
                    : spaceForm.value.capacity?.roomSize || "10 by 12ft"}
                </Text>
              </View>
            </View>
          </View>

          {/* Listed by Section */}
          <View
            className="flex flex-row items-center justify-between py-3"
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Listed by</Text>
            <Text style={{ color: colors.slate[500] }} className="">
              {postedAtLabel}
            </Text>
          </View>
          <View className="flex flex-row gap-2 py-3 border-b border-gray-300">
            <View
              style={{ height: RFValue(48), width: RFValue(48) }}
              className="rounded-full overflow-hidden bg-gray-300"
            >
              <Image
                source={
                  listedByAvatar
                    ? { uri: listedByAvatar }
                    : require("@/assets/images/user.png")
                }
                style={{ height: "100%", width: "100%" }}
                resizeMode="cover"
              />
            </View>
            <View className="w-[50%]">
              <Text
                style={{ color: colors.slate[650], fontSize: RFValue(16) }}
                className="font-medium"
              >
                {listedByName}{" "}
                {property?.is_verified ? (
                  <Image
                    source={require("@/assets/icons/badge-check-green.png")}
                  />
                ) : null}
              </Text>
              <Pressable
                className="flex flex-row gap-2"
                onPress={() =>
                  router.push({
                    pathname: "/views/reviews/reviews",
                    params: {
                      property_id: property?.public_id,
                      lister_id: property?.lister?.public_id,
                    },
                  })
                }
              >
                <Text style={{ color: colors.slate[650] }}>⭐ 4.5 </Text>
                <Text style={{ color: colors.info[200] }}>
                  ({propertyReviewsTotal}{" "}
                  {propertyReviewsTotal === 1 ? "review" : "reviews"})
                </Text>
              </Pressable>
              {propertyReviewsTotal === 0 ? (
                <Text
                  style={{ color: colors.slate[500], fontSize: RFValue(12) }}
                >
                  No reviews yet
                </Text>
              ) : null}
            </View>
            <View className="flex flex-row gap-3">
              <TouchableOpacity className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <Image
                  source={require("@/assets/icons/chat-active.png")}
                  className="w-5 h-5"
                />
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <Image
                  source={require("@/assets/icons/calling.png")}
                  className="w-5 h-5"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this space</Text>
            <Text style={styles.aboutText}>{aboutText}</Text>
          </View>

          {/* Amenities Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            {amenities?.map((amenity, index) => (
              <View key={index} style={styles.amenityRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationAddress}>{displayAddress}</Text>

            <View style={styles.mapContainer}>
              {HAS_GOOGLE_KEY ? (
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: displayLatitude,
                    longitude: displayLongitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: displayLatitude,
                      longitude: displayLongitude,
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

              <TouchableOpacity
                style={styles.streetViewButton}
                onPress={() =>
                  router.push({
                    pathname: "/views/streetview",
                    params: {
                      lat: displayLatitude,
                      lng: displayLongitude,
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

          {/* Cost Breakdown Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cost Breakdown</Text>

            <View style={styles.costBreakdownContainer}>
              {costBreakdown.map((item, index) => (
                <View key={index} style={styles.costRow}>
                  <Text style={styles.costLabel}>{item.title}</Text>
                  <Text style={styles.costAmount}>{item.value}</Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <Text style={styles.totalAmount}>₦{totalPackage}</Text>
              </View>
            </View>
            <Pressable
              className="flex flex-row items-center gap-1 py-4"
              onPress={() => setShowReportModal(true)}
            >
              <Image
                source={require("@/assets/icons/flag-red.png")}
                className="w-6 h-6"
              />
              <Text style={{ color: colors.error[200] }}>Report listing</Text>
            </Pressable>
          </View>

          {/* Complete Button */}
          <View style={styles.completeButtonContainer}>
            <AppButton
              title="Book Now"
              onPress={() => setShowInspectionModal(true)}
              size="large"
              fullwidth={true}
            />
            <AppButton
              title="Virtual Tour"
              onPress={() => {}}
              size="large"
              variant="secondary"
              beforeIcon={require("@/assets/icons/Video - Iconly Pro.png")}
            />
          </View>
        </ScrollView>

        {/* Gallery Modal */}
        <Modal
          visible={showGalleryModal}
          animationType="slide"
          onRequestClose={() => setShowGalleryModal(false)}
        >
          <SafeAreaViewContainer>
            <View style={styles.galleryModalContainer}>
              {/* Header */}
              <View style={styles.galleryModalHeader}>
                <Pressable onPress={() => setShowGalleryModal(false)}>
                  <Image
                    source={require("@/assets/icons/arrow-left-light.png")}
                    style={styles.backIcon}
                  />
                </Pressable>
                <View style={styles.galleryTitleContainer}>
                  <Text style={styles.galleryModalTitle}>Gallery</Text>
                  <Text style={styles.galleryPhotoCount}>
                    {galleryData.length} Photos
                  </Text>
                </View>
                <View style={styles.galleryHeaderIcons}>
                  <TouchableOpacity>
                    <Image
                      source={require("@/assets/icons/share.png")}
                      style={styles.headerIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image
                      source={require("@/assets/icons/bookmark-active-dark.png")}
                      style={styles.headerIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Main Gallery Slider */}
              <ScrollView
                ref={galleryScrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.gallerySlider}
              >
                {galleryData.map((image, index) => (
                  <Image
                    key={index}
                    source={image}
                    style={styles.gallerySlideImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {/* Dots Indicator */}
              <View style={styles.dotsContainer}>
                {galleryData.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentImageIndex === index && styles.dotActive,
                    ]}
                  />
                ))}
              </View>

              {/* Thumbnails */}
              <View style={styles.thumbnailsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.thumbnailsScroll}
                >
                  {galleryData.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setCurrentImageIndex(index);
                        galleryScrollRef.current?.scrollTo({
                          x: width * index,
                          animated: true,
                        });
                      }}
                      style={[
                        styles.thumbnail,
                        currentImageIndex === index && styles.thumbnailActive,
                      ]}
                    >
                      <Image
                        source={image}
                        style={styles.thumbnailImage}
                        resizeMode="cover"
                      />
                      {index === 3 && (
                        <View style={styles.thumbnailOverlay}>
                          <Text style={styles.thumbnailOverlayText}>+7</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Take Virtual Tour Button */}
              <View style={styles.virtualTourContainer}>
                <AppButton
                  title="Take Virtual Tour"
                  onPress={() => {}}
                  variant="secondary"
                />
              </View>
            </View>
          </SafeAreaViewContainer>
        </Modal>

        {/* Options Dropdown Menu */}
        <Modal
          visible={showOptionsMenu}
          transparent
          animationType="fade"
          onRequestClose={() => setShowOptionsMenu(false)}
        >
          <Pressable
            style={styles.optionsMenuOverlay}
            onPress={() => setShowOptionsMenu(false)}
          >
            <Pressable
              style={styles.optionsMenuContainer}
              onPress={(e) => e.stopPropagation()}
            >
              <TouchableOpacity
                style={styles.optionsMenuItem}
                onPress={() => {}}
              >
                <BookmarkButton id={propertyId} showLabel />
              </TouchableOpacity>

              <View style={styles.optionsMenuDivider} />

              <TouchableOpacity
                style={styles.optionsMenuItem}
                onPress={() => {
                  setShowOptionsMenu(false);
                  // trigger share logic here
                }}
              >
                <Image
                  source={require("@/assets/icons/share.png")}
                  style={styles.optionsMenuIcon}
                />
                <Text style={styles.optionsMenuText}>Share</Text>
              </TouchableOpacity>

              <View style={styles.optionsMenuDivider} />

              <TouchableOpacity
                style={styles.optionsMenuItem}
                onPress={() => {
                  setShowOptionsMenu(false);
                  setShowReportModal(true);
                }}
              >
                <Image
                  source={require("@/assets/icons/flag-red.png")}
                  style={styles.optionsMenuIcon}
                />
                <Text
                  style={[styles.optionsMenuText, { color: colors.error[200] }]}
                >
                  Report listing
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Report Property Modal - Bottom Sheet */}
        <Modal
          visible={showReportModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowReportModal(false)}
        >
          <Pressable
            style={styles.reportModalOverlay}
            onPress={() => setShowReportModal(false)}
          >
            <Pressable
              style={styles.reportBottomSheet}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHandle} />

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.reportModalBody}>
                  <Text style={styles.reportModalTitle}>
                    Report this property
                  </Text>
                  <Text style={styles.reportModalSubtitle}>
                    Let us know what the case is with this listing.
                  </Text>

                  <View style={styles.reportReasonsList}>
                    {reportReasons.map((reason) => {
                      const isSelected = selectedReportReasons.includes(reason);
                      const isOthers = reason === "Others";
                      return (
                        <React.Fragment key={reason}>
                          <SimpleSelector
                            isChecked={isSelected}
                            onChange={() => toggleReportReason(reason)}
                            title={reason}
                          />
                          {isOthers && isSelected && (
                            <View style={styles.othersInputContainer}>
                              <TextInput
                                style={styles.othersInput}
                                placeholder="Type here..."
                                placeholderTextColor={colors.slate[450]}
                                value={othersText}
                                onChangeText={setOthersText}
                              />
                              {othersText.length > 0 && (
                                <TouchableOpacity
                                  onPress={() => setOthersText("")}
                                >
                                  <Image
                                    source={require("@/assets/icons/close-contained.png")}
                                    style={styles.othersInputClearIcon}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </View>

                  <View style={styles.reportSubmitContainer}>
                    <AppButton
                      title={reportPropertyPending ? "Submitting..." : "Submit"}
                      disabled={
                        reportPropertyPending ||
                        selectedReportReasons.length === 0 ||
                        (selectedReportReasons.includes("Others") &&
                          othersText.trim().length === 0)
                      }
                      fullwidth={true}
                      onPress={handleSubmitReport}
                    />
                  </View>
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Inspection Modal - Bottom Sheet */}
        <Modal
          visible={showInspectionModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowInspectionModal(false)}
        >
          <Pressable
            style={styles.inspectionModalOverlay}
            onPress={() => setShowInspectionModal(false)}
          >
            <Pressable
              style={styles.inspectionBottomSheet}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <View style={styles.modalHandle} />

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.inspectionModalBody}>
                  <Text style={styles.inspectionModalTitle}>
                    Schedule an inspection
                  </Text>
                  <Text style={styles.inspectionModalSubtitle}>
                    Pick a convenient time to inspect this space in person. A
                    small inspection fee may apply, payable before confirmation.
                  </Text>

                  {/* <Text style={styles.inputLabel}>Select inspection date</Text> */}
                  <TouchableOpacity
                    style={styles.inspectionInput}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text
                      style={[
                        styles.inspectionInputText,
                        !selectedDate && styles.inspectionInputPlaceholder,
                      ]}
                    >
                      {selectedDate
                        ? formatReadableDate(selectedDate)
                        : "Select inspection date"}
                    </Text>
                    <Image
                      source={require("@/assets/icons/calendar.png")}
                      style={styles.inspectionInputIcon}
                    />
                  </TouchableOpacity>

                  {/* <Text style={styles.inputLabel}>Choose time slot</Text> */}
                  <TouchableOpacity
                    style={styles.inspectionInput}
                    onPress={() => setShowTimeSlotModal(true)}
                  >
                    <Text
                      style={[
                        styles.inspectionInputText,
                        !selectedTime && styles.inspectionInputPlaceholder,
                      ]}
                    >
                      {selectedTime ? selectedTime.label : "Select time"}
                    </Text>
                    <Image
                      source={require("@/assets/icons/chevron-right.png")}
                      // style={styles.chevronIcon}
                    />
                  </TouchableOpacity>

                  <View style={styles.inspectionFeeRow}>
                    <Text style={styles.inspectionFeeLabel}>
                      Inspection fee:
                    </Text>
                    <Text style={styles.inspectionFeeAmount}>₦1,000</Text>
                  </View>

                  {/* Security Note */}
                  <View style={styles.inspectionNote}>
                    <Text style={styles.inspectionNoteText}>
                      🔐 Fee is held by DiPlace and only released after a
                      successful inspection. Refunded if canceled or not
                      completed.
                    </Text>
                  </View>

                  {/* Buttons */}
                  <View style={styles.inspectionButtons}>
                    <AppButton
                      title={
                        isScheduleInspectionPending
                          ? "Scheduling..."
                          : "Schedule Inspection"
                      }
                      onPress={handleScheduleInspection}
                      disabled={
                        !selectedTime ||
                        !selectedDate ||
                        isScheduleInspectionPending
                      }
                    />
                    <AppButton
                      title="Skip & Proceed to Book Now"
                      onPress={() => {
                        setShowInspectionModal(false);
                        router.push({
                          pathname: "/views/booking/renters-info",
                          params: bookingRouteParams,
                        });
                      }}
                      variant="tertiary"
                    />
                  </View>
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Date Picker Modal */}
        <Modal visible={showDatePicker} transparent animationType="fade">
          <View className="items-center justify-center flex-1 bg-black/30">
            <View
              style={{ backgroundColor: colors.background }}
              className="w-[88%] rounded-3xl p-5"
            >
              <Text
                style={{ color: colors.slate[600] }}
                className="mb-2 text-sm"
              >
                Select date
              </Text>

              <Text
                style={{ color: colors.slate[650] }}
                className="mb-4 text-2xl font-semibold"
              >
                {selectedDate
                  ? formatReadableDate(selectedDate)
                  : formatReadableDate(new Date())}
              </Text>

              <View className="h-[1px] bg-gray-200 dark:bg-gray-700 mb-4" />

              <Calendar
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                  setSelectedTime(null);
                }}
                markingType={"custom"}
                markedDates={
                  selectedDate
                    ? {
                        [selectedDate]: {
                          customStyles: {
                            container: {
                              borderWidth: 2,
                              borderColor: "#000",
                              borderRadius: 999,
                            },
                            text: {
                              color: "#000",
                              fontWeight: "600",
                            },
                          },
                        },
                      }
                    : {}
                }
                theme={{
                  backgroundColor: isDarkMode ? "#181818" : "#FCFCFC",
                  calendarBackground: isDarkMode ? "#181818" : "#FCFCFC",
                  textSectionTitleColor: "#9ca3af",
                  monthTextColor: isDarkMode ? "#ffffff" : "#000000",
                  textMonthFontWeight: "600",
                  textMonthFontSize: 16,
                  dayTextColor: isDarkMode ? "#e5e7eb" : "#000000",
                  textDayFontSize: 15,
                  arrowColor: "#000",
                  todayTextColor: "#000",
                }}
                style={{ borderRadius: 20, paddingBottom: 10 }}
              />

              <View className="flex-row justify-end mt-3">
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text className="mr-6 text-base text-gray-600 dark:text-gray-300">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setShowDatePicker(false);
                  }}
                >
                  <Text className="text-base font-semibold text-blue-600 dark:text-blue-400">
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Time Slot Modal */}
        <Modal
          visible={showTimeSlotModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTimeSlotModal(false)}
        >
          <Pressable
            style={styles.timeSlotModalOverlay}
            onPress={() => setShowTimeSlotModal(false)}
          >
            <Pressable
              style={styles.timeSlotBottomSheet}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHandle} />

              <Text style={styles.timeSlotModalTitle}>Choose time slot</Text>
              <Text style={styles.timeSlotModalSubtitle}>
                Pick a convenient time for you from the agent's available time
                slot.
              </Text>

              <View style={styles.timeSlotList}>
                {inspectionTimeSlots.map((item: timeslot) => {
                  const isSelected = selectedTime?.id === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.timeSlotItem}
                      onPress={() => {
                        setSelectedTime(item);
                        setShowTimeSlotModal(false);
                      }}
                    >
                      <View
                        style={[
                          styles.timeSlotRadio,
                          isSelected && styles.timeSlotRadioSelected,
                        ]}
                      >
                        {isSelected && (
                          <View style={styles.timeSlotRadioInner} />
                        )}
                      </View>
                      <Text style={styles.timeSlotItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Pressable>
          </Pressable>
        </Modal>

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
            {HAS_GOOGLE_KEY ? (
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: displayLatitude,
                  longitude: displayLongitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: displayLatitude,
                    longitude: displayLongitude,
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

            <TouchableOpacity
              style={styles.fullStreetViewButton}
              onPress={() =>
                router.push({
                  pathname: "/views/streetview",
                  params: {
                    lat: displayLatitude,
                    lng: displayLongitude,
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
                      {displayAddress}
                    </Text>
                  </View>
                </Pressable>
              </Pressable>
            )}
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Placedetails;

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    scrollContent: {
      paddingVertical: RFValue(20),
    },
    mainContainer: {
      flex: 1,
      paddingBottom: RFValue(50),
      paddingTop: RFValue(24),
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingHorizontal: RFValue(16),
    },
    imageContainer: {
      width: "100%",
      height: RFValue(250),
      marginBottom: RFValue(12),
      position: "relative",
    },
    mainImage: {
      width: "100%",
      height: "100%",
      borderRadius: RFValue(12),
    },
    bookmarkButton: {
      position: "absolute",
      top: RFValue(12),
      right: RFValue(12),
      width: RFValue(36),
      height: RFValue(36),
      borderRadius: RFValue(18),
      backgroundColor: "FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    divider: {
      width: 2,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      marginVertical: RFValue(8),
    },
    bookmarkIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    actionButtons: {
      flexDirection: "row",
      gap: RFValue(8),
      marginBottom: RFValue(20),
      position: "absolute",
      bottom: -RFValue(20),
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      color: "#FFFFFF",
      borderBottomEndRadius: RFValue(12),
      borderBottomStartRadius: RFValue(12),
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: RFValue(12),

      gap: RFValue(8),
    },
    actionButtonIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    actionButtonText: {
      fontSize: RFValue(13),
      fontWeight: "600",
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    propertyCard: {
      marginBottom: RFValue(24),
    },
    propertyTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: RFValue(8),
    },
    propertyTitle: {
      fontSize: RFValue(16),
      fontWeight: "700",
      color: colors.slate[650],
      flex: 1,
      marginRight: RFValue(12),
    },
    propertyTitleContainer: {
      flex: 1,
      marginRight: RFValue(12),
    },
    badgeContainer: {
      flexDirection: "column",
      alignItems: "flex-end",
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
      marginBottom: RFValue(8),
    },
    locationIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    addressText: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      flex: 1,
    },
    priceText: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
    },
    priceUnit: {
      fontSize: RFValue(14),
      fontWeight: "400",
      color: colors.slate[650],
      marginBottom: RFValue(12),
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
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(12),
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
    costBreakdownContainer: {
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
    // Options dropdown menu
    optionsMenuOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.15)",
      alignItems: "flex-end",
      paddingTop: RFValue(56),
      paddingRight: RFValue(16),
    },
    optionsMenuContainer: {
      backgroundColor: colors.background,
      borderRadius: RFValue(14),
      width: RFValue(180),
      paddingVertical: RFValue(4),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 8,
    },
    optionsMenuItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(10),
      paddingVertical: RFValue(12),
      paddingHorizontal: RFValue(14),
    },
    optionsMenuIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    optionsMenuText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    optionsMenuDivider: {
      height: 1,
      backgroundColor: colors.slate[300],
      marginHorizontal: RFValue(14),
    },

    // Report property modal - Bottom Sheet
    reportModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    reportBottomSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(32),
      maxHeight: "85%",
    },
    reportModalBody: {
      gap: RFValue(10),
      paddingBottom: RFValue(8),
    },
    reportModalTitle: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
      textAlign: "center",
      marginBottom: RFValue(4),
    },
    reportModalSubtitle: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      textAlign: "center",
      marginBottom: RFValue(12),
    },
    reportReasonsList: {
      gap: RFValue(12),
    },
    reportReasonItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: RFValue(16),
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      gap: RFValue(12),
    },
    reportReasonText: {
      flex: 1,
      fontSize: RFValue(14),
      color: colors.slate[650],
    },
    reportSubmitContainer: {
      paddingTop: RFValue(20),
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
      display: "flex",
      gap: RFValue(8),
    },
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    // Gallery Modal
    galleryModalContainer: {
      flex: 1,
    },
    galleryModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
    },
    galleryTitleContainer: {
      flex: 1,
      alignItems: "center",
    },
    galleryModalTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    galleryPhotoCount: {
      fontSize: RFValue(12),
      color: colors.slate[500],
    },
    galleryHeaderIcons: {
      flexDirection: "row",
      gap: RFValue(16),
    },
    headerIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    gallerySlider: {
      flex: 1,
    },
    gallerySlideImage: {
      width: width,
      height: "100%",
    },
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: RFValue(16),
      gap: RFValue(6),
    },
    dot: {
      width: RFValue(6),
      height: RFValue(6),
      borderRadius: RFValue(3),
      backgroundColor: colors.slate[300],
    },
    dotActive: {
      backgroundColor: colors.slate[650],
      width: RFValue(20),
    },
    thumbnailsContainer: {
      paddingHorizontal: RFValue(16),
      marginBottom: RFValue(16),
    },
    thumbnailsScroll: {
      gap: RFValue(8),
    },
    thumbnail: {
      width: RFValue(70),
      height: RFValue(70),
      borderRadius: RFValue(8),
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "transparent",
      position: "relative",
    },
    thumbnailActive: {
      borderColor: colors.slate[650],
    },
    thumbnailImage: {
      width: "100%",
      height: "100%",
    },
    thumbnailOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
    thumbnailOverlayText: {
      color: "#FFFFFF",
      fontSize: RFValue(16),
      fontWeight: "700",
    },
    virtualTourContainer: {
      paddingHorizontal: RFValue(16),
      paddingBottom: RFValue(20),
    },
    // Inspection Modal - Bottom Sheet
    inspectionModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    inspectionBottomSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(32),
      maxHeight: "85%",
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginVertical: RFValue(12),
    },
    inspectionModalBody: {
      gap: RFValue(10),
    },
    inspectionModalTitle: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[650],
      textAlign: "center",
      marginBottom: RFValue(4),
    },
    inspectionModalSubtitle: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      textAlign: "center",
      lineHeight: RFValue(18),
      marginBottom: RFValue(8),
    },
    inputLabel: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    inspectionInput: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      padding: RFValue(16),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    inspectionInputText: {
      flex: 1,
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    inspectionInputPlaceholder: {
      color: colors.slate[450],
    },
    inspectionInputIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
    chevronIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    inspectionFeeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: RFValue(16),
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.slate[300],
    },
    inspectionFeeLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    inspectionFeeAmount: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
    },
    inspectionNote: {
      flexDirection: "row",
      gap: RFValue(8),
      padding: RFValue(12),
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
    },
    shieldIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.success[200],
      marginTop: RFValue(2),
    },
    inspectionNoteText: {
      flex: 1,
      fontSize: RFValue(12),
      color: colors.slate[600],
      lineHeight: RFValue(16),
      textAlign: "center",
    },
    inspectionButtons: {
      gap: RFValue(12),
    },
    // Time Slot Modal
    timeSlotModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    timeSlotBottomSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(32),
    },
    timeSlotModalTitle: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
      textAlign: "center",
      marginBottom: RFValue(4),
    },
    timeSlotModalSubtitle: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      textAlign: "center",
      lineHeight: RFValue(18),
      marginBottom: RFValue(20),
    },
    timeSlotList: {
      gap: RFValue(12),
    },
    timeSlotItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: RFValue(16),
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      gap: RFValue(12),
    },
    timeSlotRadio: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 2,
      borderColor: colors.slate[400],
      alignItems: "center",
      justifyContent: "center",
    },
    timeSlotRadioSelected: {
      borderColor: colors.slate[650],
    },
    timeSlotRadioInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    timeSlotItemText: {
      flex: 1,
      fontSize: RFValue(14),
      color: colors.slate[650],
    },
    loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: RFValue(20),
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: RFValue(12),
      fontSize: RFValue(14),
      fontWeight: "600",
      textAlign: "center",
    },
    othersInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(4),
      marginTop: -RFValue(4),
    },
    othersInput: {
      flex: 1,
      fontSize: RFValue(14),
      color: colors.slate[650],
      paddingVertical: RFValue(10),
    },
    othersInputClearIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[450],
    },
  });
