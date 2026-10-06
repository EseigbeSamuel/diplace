import { Calling, Chat } from "@/assets/icons";
import BookmarkButton from "@/components/bookmark";
import { BottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { SimpleSelector } from "@/components/selector";
import { HAS_GOOGLE_MAPS_API_KEY } from "@/constants/google";
import { useTheme } from "@/contexts/themeContext";
import {
    useGetConversations,
    useGetCurrentUser,
    useGetPropertyAvailability,
    useGetPropertyDetails,
    useListPropertyReviews,
    useReportProperty,
    useScheduleInspection,
    useStartConversation,
} from "@/hooks";
import { useSpaceStore } from "@/store/useSpace";
import type { ReportPropertyReason } from "@/types";
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
  const { colors } = useTheme();
  const { spaceForm } = useSpaceStore();
  const styles = createStyles(colors);
  const { id } = useLocalSearchParams<{ id?: string }>();
  const propertyId = Array.isArray(id) ? id[0] : id;

  const [selectedTime, setSelectedTime] = useState<timeslot | null>(null);
  const [enlargeMapVisible, setEnlargeMapVisible] = useState(false);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [activeInspectionSheet, setActiveInspectionSheet] = useState<
    "inspection" | "date" | "time" | null
  >(null);
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
  const { propertyAvailability, isPropertyAvailabilityLoading } =
    useGetPropertyAvailability({
      propertyId,
      enabled: !!propertyId,
      params: { status: "available", limit: 100, sort_order: "asc" },
    });
  const { scheduleInspectionMutation, isScheduleInspectionPending } =
    useScheduleInspection();
  const { reportPropertyMutation, reportPropertyPending } = useReportProperty();

  const [isContactLoading, setIsContactLoading] = useState<
    "chat" | "call" | null
  >(null);
  const { conversations: conversationsData, refetchConversations } =
    useGetConversations({
      limit: 100,
    });
  const { startConversationMutation } = useStartConversation();
  const { currentUser } = useGetCurrentUser();
  const conversationRequestRef = useRef<Promise<string | null> | null>(null);

  const getOrCreateConversation = async (): Promise<string | null> => {
    if (conversationRequestRef.current) {
      return conversationRequestRef.current;
    }

    const request = (async () => {
      const propId = property?.public_id || propertyId;
      const listerUserId =
        property?.lister?.public_id || (property as any)?.lister_id;

      const latestConversations = await refetchConversations();
      const availableConversations =
        latestConversations.data?.conversations ??
        conversationsData?.conversations ??
        [];

      // Conversations are shared across all properties owned by the same lister.
      const existingConv = listerUserId
        ? availableConversations.find((c) =>
            c.participants?.some((p) => p.public_id === listerUserId),
          )
        : availableConversations.find(
            (c) => propId && c.property_id === propId,
          );

      if (existingConv?.public_id) {
        return existingConv.public_id;
      }

      // 2. If no conversation exists yet, start one with the backend
      try {
        const newConv = await startConversationMutation({
          property_id: propId || undefined,
          message_content: `Hi ${listedByName}, I'm inquiring about "${displayTitle}".`,
        });
        return newConv?.conversation_id || null;
      } catch (err) {
        console.warn("Failed to create conversation:", err);
        return null;
      }
    })();

    conversationRequestRef.current = request;
    try {
      return await request;
    } finally {
      conversationRequestRef.current = null;
    }
  };

  const handleStartChat = async () => {
    if (isContactLoading) return;
    setIsContactLoading("chat");
    try {
      const convId = await getOrCreateConversation();
      if (convId) {
        router.push({
          pathname: "/views/chat/[id]",
          params: {
            id: convId,
            recipientName: listedByName,
            recipientAvatar: listedByAvatar || "",
            propertyId: property?.public_id || propertyId,
          },
        });
      }
    } finally {
      setIsContactLoading(null);
    }
  };

  const handleStartCall = async () => {
    if (isContactLoading) return;
    setIsContactLoading("call");
    try {
      const convId = await getOrCreateConversation();
      if (convId) {
        router.push({
          pathname: "/views/call",
          params: {
            conversationId: convId,
            callerName: listedByName,
            callerAvatar: listedByAvatar || "",
            mode: "outgoing",
          },
        });
      }
    } finally {
      setIsContactLoading(null);
    }
  };

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

    setActiveInspectionSheet(null);
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
      <View style={styles.loadingContainer} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.slate[650]} />
        <Text style={[styles.loadingText, { color: colors.slate[650] }]} className="font-semibold text-center">
          Loading property...
        </Text>
      </View>
    );
  }

  if (propertyId && (propertyDetailsError || !property)) {
    return (
      <View style={styles.loadingContainer} className="flex-1 items-center justify-center">
        <Text style={[styles.loadingText, { color: colors.slate[650] }]} className="font-semibold text-center">
          Failed to load property details.
        </Text>
        <View style={{ width: RFValue(140), marginTop: RFValue(8) }}>
          <AppButton title="Go Back" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer} className="flex-1">
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
          <View style={styles.imageContainer} className="w-[100%px] relative">
            {spaceForm.value.media && spaceForm.value.media.length > 0 ? (
              <Image
                source={{ uri: spaceForm.value.media[0]?.uri }}
                style={styles.mainImage}
                resizeMode="cover"
               className="w-[100%px] h-[100%px]"/>
            ) : (
              <View>
                <Image
                  source={require("@/assets/images/diplace.jpg")}
                  style={styles.mainImage}
                  resizeMode="cover"
                 className="w-[100%px] h-[100%px]"/>
                <View style={styles.actionButtons} className="flex-row absolute bg-[rgba(0, 0, 0, 0.5)] text-[#FFFFFF]">
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setShowGalleryModal(true)}
                   className="flex-1 flex-row items-center justify-center">
                    <Text style={styles.actionButtonText} className="font-semibold text-[#FFFFFF] tracking-[0.5px]">GALLERY</Text>
                  </TouchableOpacity>

                  <View style={styles.divider}  className="w-[2px] bg-[rgba(255, 255, 255, 0.5)]"/>

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
                   className="flex-1 flex-row items-center justify-center">
                    <Text style={styles.actionButtonText} className="font-semibold text-[#FFFFFF] tracking-[0.5px]">STREET VIEW</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Bookmark Icon */}
            <BookmarkButton
              id={propertyId}
              containerStyle={styles.bookmarkButton}
              size={15}
            />
          </View>

          {/* Gallery and Street View Buttons - Below Image */}

          {/* Property Info Card */}
          <View style={styles.propertyCard}>
            <View style={styles.propertyTitleRow} className="flex-row justify-between items-start">
              <View style={styles.propertyTitleContainer} className="flex-1">
                <Text style={styles.propertyTitle} className="font-bold flex-1">{displayTitle}</Text>
                <View style={styles.locationRow} className="flex-row items-center">
                  <Image
                    source={require("@/assets/icons/location.png")}
                    style={styles.locationIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.addressText} className="flex-1">{displayAddress}</Text>
                </View>
              </View>
              <View  className="flex-col items-end">
                <Text style={styles.priceText} className="font-bold">₦{displayPrice}</Text>

                <Text style={styles.priceUnit} className="font-normal">/{displayDuration}</Text>
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
                    : spaceForm.value.capacity?.rooms || "2"}{" "}
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
                    : `${spaceForm.value.capacity?.bathrooms || "2"} Baths`}
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
                    : spaceForm.value.capacity?.roomSize || "10 by 12ft"}
                </Text>
              </View>
            </View>
          </View>

          {/* Listed by Section */}
          <View
            className="flex flex-row items-center justify-between py-3 border-t"
            style={styles.section}
          >
            <Text style={styles.sectionTitle} className="font-semibold">Listed by</Text>
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
                className="h-[100%] w-[100%]"
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
              <TouchableOpacity
                disabled={
                  isContactLoading !== null || !property?.lister?.public_id
                }
                onPress={handleStartChat}
                style={[
                  { opacity: !property?.lister?.public_id ? 0.4 : 1 },
                  { backgroundColor: colors.slate[200] },
                  { borderColor: colors.slate[500], borderWidth: 1 },
                ]}
                className="flex items-center justify-center size-12 rounded-full"
                accessibilityLabel="Chat with lister"
              >
                {isContactLoading === "chat" ? (
                  <ActivityIndicator size="small" color={colors.slate[650]} />
                ) : (
                  // <Image
                  //   source={require("@/assets/icons/chat-active.png")}
                  //   className="w-5 h-5"
                  //   style={{ tintColor: colors.slate[650] }}
                  // />
                  <Chat color={colors.slate[650]} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                disabled={
                  isContactLoading !== null || !property?.lister?.public_id
                }
                onPress={handleStartCall}
                style={[
                  { opacity: !property?.lister?.public_id ? 0.4 : 1 },
                  { backgroundColor: colors.slate[200] },
                  { borderColor: colors.slate[500], borderWidth: 1 },
                ]}
                className="flex items-center justify-center size-12 rounded-full"
                accessibilityLabel="Call lister"
              >
                {isContactLoading === "call" ? (
                  <ActivityIndicator size="small" color={colors.slate[650]} />
                ) : (
                  // <Image
                  //   source={require("@/assets/icons/calling.png")}
                  //   className="w-5 h-5"
                  //   style={{ tintColor: colors.slate[650] }}
                  // />
                  <Calling color={colors.slate[650]} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section} className="border-t">
            <Text style={styles.sectionTitle} className="font-semibold">About this space</Text>
            <Text style={styles.aboutText}>{aboutText}</Text>
          </View>

          {/* Amenities Section */}
          <View style={styles.section} className="border-t">
            <Text style={styles.sectionTitle} className="font-semibold">Amenities</Text>
            {amenities?.map((amenity, index) => (
              <View key={index} style={styles.amenityRow} className="flex-row items-start">
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.amenityText} className="flex-1">{amenity}</Text>
              </View>
            ))}
          </View>

          {/* Location Section */}
          <View style={styles.section} className="border-t">
            <Text style={styles.sectionTitle} className="font-semibold">Location</Text>
            <Text style={styles.locationAddress}>{displayAddress}</Text>

            <View style={styles.mapContainer} className="w-[100%px] overflow-hidden relative">
              {HAS_GOOGLE_MAPS_API_KEY ? (
                <MapView
                  className="flex-1"
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
                <View style={styles.mapFallback} className="flex-1 items-center justify-center">
                  <Text style={styles.mapFallbackText} className="text-center">
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
               className="absolute flex-row items-center">
                <Image
                  source={require("@/assets/icons/Streetview-solid.png")}
                  style={styles.streetViewIcon}
                  resizeMode="contain"
                 className="tint-[#FFFFFF]"/>
                <Text style={styles.streetViewText} className="font-medium text-[#FFFFFF]">Street view</Text>
              </TouchableOpacity>

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

          {/* Cost Breakdown Section */}
          <View style={styles.section} className="border-t">
            <Text style={styles.sectionTitle} className="font-semibold">Cost Breakdown</Text>

            <View style={styles.costBreakdownContainer}>
              {costBreakdown.map((item, index) => (
                <View key={index} style={styles.costRow} className="flex-row justify-between items-center">
                  <Text style={styles.costLabel}>{item.title}</Text>
                  <Text style={styles.costAmount} className="font-semibold">{item.value}</Text>
                </View>
              ))}

              <View style={styles.totalRow} className="flex-row justify-between items-center border-t">
                <Text style={styles.totalLabel} className="font-semibold">Total Payable</Text>
                <Text style={styles.totalAmount} className="font-bold">₦{totalPackage}</Text>
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
          <View style={styles.completeButtonContainer} className="flex">
            <AppButton
              title="Book Now"
              onPress={() => setActiveInspectionSheet("inspection")}
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
            <View  className="flex-1">
              {/* Header */}
              <View style={styles.galleryModalHeader} className="flex-row items-center justify-between border-b">
                <Pressable onPress={() => setShowGalleryModal(false)}>
                  <Image
                    source={require("@/assets/icons/arrow-left-light.png")}
                    style={styles.backIcon}
                  />
                </Pressable>
                <View  className="flex-1 items-center">
                  <Text style={styles.galleryModalTitle} className="font-semibold">Gallery</Text>
                  <Text style={styles.galleryPhotoCount}>
                    {galleryData.length} Photos
                  </Text>
                </View>
                <View style={styles.galleryHeaderIcons} className="flex-row">
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

               className="flex-1">
                {galleryData.map((image, index) => (
                  <Image
                    key={index}
                    source={image}
                    style={styles.gallerySlideImage}
                    resizeMode="cover"
                   className="h-[100%px]"/>
                ))}
              </ScrollView>

              {/* Dots Indicator */}
              <View style={styles.dotsContainer} className="flex-row justify-center items-center">
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
                     className="overflow-hidden border-[2px] border-[transparent] relative">
                      <Image
                        source={image}

                        resizeMode="cover"
                       className="w-[100%px] h-[100%px]"/>
                      {index === 3 && (
                        <View  className="absolute top-[0px] left-[0px] right-[0px] bottom-[0px] bg-[rgba(0, 0, 0, 0.5)] items-center justify-center">
                          <Text style={styles.thumbnailOverlayText} className="text-[#FFFFFF] font-bold">+7</Text>
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
           className="flex-1 bg-[rgba(0,0,0,0.15)] items-end">
            <Pressable
              style={styles.optionsMenuContainer}
              onPress={(e) => e.stopPropagation()}
             className="shadow-color-[#000] shadow-opacity-[0.15px] shadow-radius-[10px] elevation-[8px]">
              <TouchableOpacity
                style={styles.optionsMenuItem}
                onPress={() => {}}
               className="flex-row items-center">
                <BookmarkButton id={propertyId} showLabel />
              </TouchableOpacity>

              <View style={styles.optionsMenuDivider}  className="h-[1px]"/>

              <TouchableOpacity
                style={styles.optionsMenuItem}
                onPress={() => {
                  setShowOptionsMenu(false);
                  // trigger share logic here
                }}
               className="flex-row items-center">
                <Image
                  source={require("@/assets/icons/share.png")}
                  style={styles.optionsMenuIcon}
                />
                <Text style={styles.optionsMenuText} className="font-medium">Share</Text>
              </TouchableOpacity>

              <View style={styles.optionsMenuDivider}  className="h-[1px]"/>

              <TouchableOpacity
                style={styles.optionsMenuItem}
                onPress={() => {
                  setShowOptionsMenu(false);
                  setShowReportModal(true);
                }}
               className="flex-row items-center">
                <Image
                  source={require("@/assets/icons/flag-red.png")}
                  style={styles.optionsMenuIcon}
                />
                <Text
                  style={[styles.optionsMenuText, { color: colors.error[200] }]}
                 className="font-medium">
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

            onPress={() => setShowReportModal(false)}
           className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-end">
            <Pressable
              style={styles.reportBottomSheet}
              onPress={(e) => e.stopPropagation()}
             className="max-h-[85%px]">
              <View style={styles.modalHandle}  className="self-center"/>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.reportModalBody}>
                  <Text style={styles.reportModalTitle} className="font-bold text-center">
                    Report this property
                  </Text>
                  <Text style={styles.reportModalSubtitle} className="text-center">
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
                            <View style={styles.othersInputContainer} className="flex-row items-center border-[1px]">
                              <TextInput
                                style={styles.othersInput}
                                placeholder="Type here..."
                                placeholderTextColor={colors.slate[450]}
                                value={othersText}
                                onChangeText={setOthersText}
                               className="flex-1"/>
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

        <BottomSheet
          isVisible={activeInspectionSheet !== null}
          onClose={() =>
            setActiveInspectionSheet((current) =>
              current === "inspection" ? null : "inspection",
            )
          }
          snapPoints={
            activeInspectionSheet === "date"
              ? [0.65]
              : activeInspectionSheet === "time"
                ? [0.5]
                : [0.73]
          }
        >
          {activeInspectionSheet === "inspection" && (
            <View style={styles.inspectionModalBody}>
              <Text style={styles.inspectionModalTitle} className="font-bold text-center">
                Schedule an inspection
              </Text>
              <Text style={styles.inspectionModalSubtitle} className="text-center">
                Pick a convenient time to inspect this space in person. A small
                inspection fee may apply, payable before confirmation.
              </Text>

              <TouchableOpacity
                style={styles.inspectionInput}
                onPress={() => setActiveInspectionSheet("date")}
               className="flex-row items-center justify-between border-[1px]">
                <Text
                  style={[
                    styles.inspectionInputText,
                    !selectedDate && styles.inspectionInputPlaceholder,
                  ]}
                 className="flex-1">
                  {selectedDate
                    ? formatReadableDate(selectedDate)
                    : "Select inspection date"}
                </Text>
                <Image
                  source={require("@/assets/icons/calendar.png")}
                  style={styles.inspectionInputIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inspectionInput}
                onPress={() => setActiveInspectionSheet("time")}
               className="flex-row items-center justify-between border-[1px]">
                <Text
                  style={[
                    styles.inspectionInputText,
                    !selectedTime && styles.inspectionInputPlaceholder,
                  ]}
                 className="flex-1">
                  {selectedTime ? selectedTime.label : "Select time"}
                </Text>
                <Image source={require("@/assets/icons/chevron-right.png")} />
              </TouchableOpacity>

              <View style={styles.inspectionFeeRow} className="flex-row justify-between items-center border-t border-b">
                <Text style={styles.inspectionFeeLabel}>Inspection fee:</Text>
                <Text style={styles.inspectionFeeAmount} className="font-bold">
                  {formatMoneyParam(selectedTime?.price ?? 0)}
                </Text>
              </View>

              <View style={styles.inspectionNote} className="flex-row">
                <Text style={styles.inspectionNoteText} className="flex-1 text-center">
                  🔐 Fee is held by DiPlace and only released after a successful
                  inspection. Refunded if canceled or not completed.
                </Text>
              </View>

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
                    setActiveInspectionSheet(null);
                    router.push({
                      pathname: "/views/booking/renters-info",
                      params: bookingRouteParams,
                    });
                  }}
                  variant="tertiary"
                />
              </View>
            </View>
          )}

          {activeInspectionSheet === "date" && (
            <>
              <Text style={{ color: colors.slate[600], marginBottom: 8 }}>
                Select date
              </Text>

              <Text
                style={{
                  color: colors.slate[650],
                  fontSize: 24,
                  fontWeight: "600",
                  marginBottom: 16,
                }}
              >
                {selectedDate
                  ? formatReadableDate(selectedDate)
                  : formatReadableDate(new Date())}
              </Text>

              <View
                style={{
                  height: 1,
                  backgroundColor: colors.slate[350],
                  marginBottom: 16,
                }}
              />

              <Calendar
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                  setSelectedTime(null);
                }}
                markingType="custom"
                markedDates={
                  selectedDate
                    ? {
                        [selectedDate]: {
                          customStyles: {
                            container: {
                              borderWidth: 2,
                              borderColor: colors.info[200],
                              backgroundColor: colors.info[100],
                              borderRadius: 999,
                            },
                            text: {
                              color: colors.slate[650],
                              fontWeight: "600",
                            },
                          },
                        },
                      }
                    : {}
                }
                theme={{
                  backgroundColor: colors.background,
                  calendarBackground: colors.background,
                  textSectionTitleColor: colors.slate[500],
                  monthTextColor: colors.slate[650],
                  textMonthFontWeight: "600",
                  textMonthFontSize: 16,
                  dayTextColor: colors.slate[650],
                  textDayFontSize: 15,
                  arrowColor: colors.info[200],
                  todayTextColor: colors.info[200],
                  textDisabledColor: colors.slate[450],
                }}
                className="rounded-[20px] pb-[10px]"
              />

              <View
                className="flex-row justify-end mt-[12px]"
              >
                <TouchableOpacity
                  onPress={() => setActiveInspectionSheet("inspection")}
                >
                  <Text style={{ color: colors.slate[600], marginRight: 24 }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveInspectionSheet("inspection")}
                >
                  <Text style={{ color: colors.info[200], fontWeight: "600" }}>
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {activeInspectionSheet === "time" && (
            <>
              <Text style={styles.timeSlotModalTitle} className="font-bold text-center">Choose time slot</Text>
              <Text style={styles.timeSlotModalSubtitle} className="text-center">
                Pick a convenient time for you from the agent&apos;s available
                time slot.
              </Text>

              {isPropertyAvailabilityLoading ? (
                <ActivityIndicator color={colors.info[200]} />
              ) : inspectionTimeSlots.length > 0 ? (
                <View style={styles.timeSlotList}>
                  {inspectionTimeSlots.map((item: timeslot) => {
                    const isSelected = selectedTime?.id === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.timeSlotItem}
                        onPress={() => {
                          setSelectedTime(item);
                          setActiveInspectionSheet("inspection");
                        }}
                       className="flex-row items-center border-[1px]">
                        <View
                          style={[
                            styles.timeSlotRadio,
                            isSelected && styles.timeSlotRadioSelected,
                          ]}
                         className="border-[2px] items-center justify-center">
                          {isSelected && (
                            <View style={styles.timeSlotRadioInner} />
                          )}
                        </View>
                        <Text style={styles.timeSlotItemText} className="flex-1">
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.timeSlotEmptyText} className="text-center align-middle">
                  {selectedDate
                    ? "No available time slots for this date."
                    : "No inspection time slots are currently available."}
                </Text>
              )}
            </>
          )}
        </BottomSheet>

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
            {HAS_GOOGLE_MAPS_API_KEY ? (
              <MapView
                className="flex-1"
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
              <View style={styles.mapFallback} className="flex-1 items-center justify-center">
                <Text style={styles.mapFallbackText} className="text-center">
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
             className="absolute flex-row items-center">
              <Image
                source={require("@/assets/icons/Streetview-solid.png")}
                style={styles.streetViewIcon}
               className="tint-[#FFFFFF]"/>
              <Text style={styles.streetViewText} className="font-medium text-[#FFFFFF]">Street view</Text>
            </TouchableOpacity>

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

            {showLocationSheet && (
              <Pressable

                onPress={() => setShowLocationSheet(false)}
               className="absolute bottom-[0px] left-[0px] right-[0px] justify-end">
                <Pressable style={styles.bottomSheetContainer} className="bg-[#FFFFFF] min-h-[15%px] shadow-color-[#000] shadow-opacity-[0.1px] shadow-radius-[8px] elevation-[10px]">
                  <View style={styles.bottomSheetHandle}  className="self-center"/>
                  <View style={styles.bottomSheetContent}>
                    <Text style={styles.bottomSheetTitle} className="font-semibold">Location</Text>
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
    mainContainer: {paddingBottom: RFValue(50),
paddingTop: RFValue(24),
backgroundColor: colors.background},
    contentContainer: {
      paddingHorizontal: RFValue(16),
    },
    imageContainer: {height: RFValue(250),
marginBottom: RFValue(12)},
    mainImage: {borderRadius: RFValue(12)},
    bookmarkButton: {top: RFValue(12),
right: RFValue(12),
width: RFValue(36),
height: RFValue(36),
borderRadius: RFValue(18)},
    divider: {marginVertical: RFValue(8)},
    bookmarkIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    actionButtons: {gap: RFValue(8),
marginBottom: RFValue(20),
bottom: -RFValue(20),
borderBottomEndRadius: RFValue(12),
borderBottomStartRadius: RFValue(12)},
    actionButton: {paddingVertical: RFValue(12),
gap: RFValue(8)},
    actionButtonIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    actionButtonText: {fontSize: RFValue(13)},
    propertyCard: {
      marginBottom: RFValue(24),
    },
    propertyTitleRow: {marginBottom: RFValue(8)},
    propertyTitle: {fontSize: RFValue(16),
color: colors.slate[650],
marginRight: RFValue(12)},
    propertyTitleContainer: {marginRight: RFValue(12)},
    badgeContainer: {},
    locationRow: {gap: RFValue(6),
marginBottom: RFValue(8)},
    locationIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    addressText: {fontSize: RFValue(13),
color: colors.slate[500]},
    priceText: {fontSize: RFValue(18),
color: colors.slate[650]},
    priceUnit: {fontSize: RFValue(14),
color: colors.slate[650],
marginBottom: RFValue(12)},
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
    sectionTitle: {fontSize: RFValue(16),
color: colors.slate[650],
marginBottom: RFValue(12)},
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
    costBreakdownContainer: {
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
    // Options dropdown menu
    optionsMenuOverlay: {paddingTop: RFValue(56),
paddingRight: RFValue(16)},
    optionsMenuContainer: {backgroundColor: colors.background,
borderRadius: RFValue(14),
width: RFValue(180),
paddingVertical: RFValue(4),
shadowOffset: { width: 0, height: 4 }},
    optionsMenuItem: {gap: RFValue(10),
paddingVertical: RFValue(12),
paddingHorizontal: RFValue(14)},
    optionsMenuIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    optionsMenuText: {fontSize: RFValue(14),
color: colors.slate[650]},
    optionsMenuDivider: {backgroundColor: colors.slate[300],
marginHorizontal: RFValue(14)},

    // Report property modal - Bottom Sheet
    reportModalOverlay: {},
    reportBottomSheet: {backgroundColor: colors.background,
borderTopLeftRadius: RFValue(24),
borderTopRightRadius: RFValue(24),
paddingHorizontal: RFValue(20),
paddingBottom: RFValue(32)},
    reportModalBody: {
      gap: RFValue(10),
      paddingBottom: RFValue(8),
    },
    reportModalTitle: {fontSize: RFValue(18),
color: colors.slate[650],
marginBottom: RFValue(4)},
    reportModalSubtitle: {fontSize: RFValue(13),
color: colors.slate[500],
marginBottom: RFValue(12)},
    reportReasonsList: {
      gap: RFValue(12),
    },
    reportReasonItem: {padding: RFValue(16),
backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
borderColor: colors.slate[300],
gap: RFValue(12)},
    reportReasonText: {fontSize: RFValue(14),
color: colors.slate[650]},
    reportSubmitContainer: {
      paddingTop: RFValue(20),
    },
    totalLabel: {fontSize: RFValue(16),
color: colors.slate[650]},
    totalAmount: {fontSize: RFValue(18),
color: colors.slate[650]},
    completeButtonContainer: {marginTop: RFValue(8),
gap: RFValue(8)},
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    // Gallery Modal
    galleryModalContainer: {},
    galleryModalHeader: {paddingVertical: RFValue(16),
paddingHorizontal: RFValue(16),
borderBottomColor: colors.slate[300]},
    galleryTitleContainer: {},
    galleryModalTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    galleryPhotoCount: {
      fontSize: RFValue(12),
      color: colors.slate[500],
    },
    galleryHeaderIcons: {gap: RFValue(16)},
    headerIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    gallerySlider: {},
    gallerySlideImage: {width: width},
    dotsContainer: {paddingVertical: RFValue(16),
gap: RFValue(6)},
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
    thumbnail: {width: RFValue(70),
height: RFValue(70),
borderRadius: RFValue(8)},
    thumbnailActive: {
      borderColor: colors.slate[650],
    },
    thumbnailImage: {},
    thumbnailOverlay: {},
    thumbnailOverlayText: {fontSize: RFValue(16)},
    virtualTourContainer: {
      paddingHorizontal: RFValue(16),
      paddingBottom: RFValue(20),
    },
    // Inspection Modal - Bottom Sheet
    inspectionModalOverlay: {},
    inspectionBottomSheet: {backgroundColor: colors.background,
borderTopLeftRadius: RFValue(24),
borderTopRightRadius: RFValue(24),
paddingHorizontal: RFValue(20),
paddingBottom: RFValue(32)},
    modalHandle: {width: RFValue(40),
height: RFValue(4),
backgroundColor: colors.slate[300],
borderRadius: RFValue(2),
marginVertical: RFValue(12)},
    inspectionModalBody: {
      gap: RFValue(10),
    },
    inspectionModalTitle: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(4)},
    inspectionModalSubtitle: {fontSize: RFValue(13),
color: colors.slate[500],
lineHeight: RFValue(18),
marginBottom: RFValue(8)},
    inputLabel: {fontSize: RFValue(14),
color: colors.slate[650],
marginBottom: RFValue(8)},
    inspectionInput: {backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
padding: RFValue(16),
borderColor: colors.slate[300]},
    inspectionInputText: {fontSize: RFValue(15),
color: colors.slate[650]},
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
    inspectionFeeRow: {paddingVertical: RFValue(16),
borderColor: colors.slate[300]},
    inspectionFeeLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    inspectionFeeAmount: {fontSize: RFValue(18),
color: colors.slate[650]},
    inspectionNote: {gap: RFValue(8),
padding: RFValue(12),
backgroundColor: colors.slate[150],
borderRadius: RFValue(12)},
    shieldIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.success[200],
      marginTop: RFValue(2),
    },
    inspectionNoteText: {fontSize: RFValue(12),
color: colors.slate[600],
lineHeight: RFValue(16)},
    inspectionButtons: {
      gap: RFValue(12),
    },
    // Time Slot Modal
    timeSlotModalOverlay: {},
    timeSlotBottomSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(32),
    },
    timeSlotModalTitle: {fontSize: RFValue(18),
color: colors.slate[650],
marginBottom: RFValue(4)},
    timeSlotModalSubtitle: {fontSize: RFValue(13),
color: colors.slate[500],
lineHeight: RFValue(18),
marginBottom: RFValue(20)},
    timeSlotList: {
      gap: RFValue(12),
    },
    timeSlotEmptyText: {color: colors.slate[500],
fontSize: RFValue(14),
minHeight: RFValue(72)},
    timeSlotItem: {padding: RFValue(16),
backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
borderColor: colors.slate[300],
gap: RFValue(12)},
    timeSlotRadio: {width: RFValue(20),
height: RFValue(20),
borderRadius: RFValue(10),
borderColor: colors.slate[400]},
    timeSlotRadioSelected: {
      borderColor: colors.slate[650],
    },
    timeSlotRadioInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    timeSlotItemText: {fontSize: RFValue(14),
color: colors.slate[650]},
    loadingContainer: {paddingHorizontal: RFValue(20),
backgroundColor: colors.background},
    loadingText: {marginTop: RFValue(12),
fontSize: RFValue(14)},
    othersInputContainer: {backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
borderColor: colors.slate[300],
paddingHorizontal: RFValue(16),
paddingVertical: RFValue(4),
marginTop: -RFValue(4)},
    othersInput: {fontSize: RFValue(14),
color: colors.slate[650],
paddingVertical: RFValue(10)},
    othersInputClearIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[450],
    },
  });
