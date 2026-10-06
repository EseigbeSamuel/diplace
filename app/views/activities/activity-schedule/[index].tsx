import { useTheme } from "@/contexts/themeContext";
import { useUser } from "@/contexts/user-context";
import {
  useGetBookingDetail,
  useGetInspectionDetail,
} from "@/hooks";
import {
  ActivityDetailUser,
  BookingDetailResponse,
  InspectionDetailResponse,
  PaymentSchedule,
} from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomButtonBar from "./components/BottomButtonBar";
import BookingDetails from "./components/BookingDetails";
import ContactCard from "./components/ContactCard";
import FinancialDetails from "./components/FinancialDetails";
import ParallaxHeader from "./components/ParallaxHeader";
import RentersNotes from "./components/RentersNotes";
import WarningBanner from "./components/WarningBanner";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true when status maps to an inspection endpoint */
const isInspectionStatus = (s: string) => {
  const norm = (s || "").toLowerCase();
  return norm === "scheduled" || norm === "inspected" || norm === "inspection";
};

/** Build a full address string from property.address */
const buildAddress = (
  data: InspectionDetailResponse | BookingDetailResponse | undefined,
): string => {
  const addr = data?.property?.address;
  if (!addr) return "";
  return [addr.street, addr.city, addr.state].filter(Boolean).join(", ");
};

/** Resolve the primary gallery image URI from media array */
const resolveImageUri = (
  data: InspectionDetailResponse | BookingDetailResponse | undefined,
): string | undefined => {
  const media = data?.property?.media ?? [];
  const gallery = media.find((m) => m.media_role === "gallery") ?? media[0];
  return gallery?.file_url;
};

// ── Screen ───────────────────────────────────────────────────────────────────

const ActivitySchedule = () => {
  const { colors } = useTheme();
  const { userType } = useUser();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    index?: string;
    status?: string;
    title?: string;
    role?: string;
  }>();

  const role = (params.role || userType || "renter").toLowerCase();
  const status = (params.status || "scheduled").toLowerCase();
  const paramTitle = params.title || "";

  const isInspection = isInspectionStatus(status);

  // ── Fetch the correct detail based on status ──────────────────────────────
  const {
    data: inspectionData,
    isLoading: inspLoading,
  } = useGetInspectionDetail(isInspection ? (params.index ?? "") : "");

  const {
    data: bookingData,
    isLoading: bookLoading,
  } = useGetBookingDetail(!isInspection ? (params.index ?? "") : "");

  const isLoading = isInspection ? inspLoading : bookLoading;
  const data: InspectionDetailResponse | BookingDetailResponse | undefined =
    isInspection ? inspectionData : bookingData;

  // ── Derived display values ────────────────────────────────────────────────
  const title = data?.property?.title || paramTitle || "Property";
  const addressText = buildAddress(data);
  const imageUri = resolveImageUri(data);
  const price = data?.property?.price;
  const costFrequency = data?.property?.cost_frequency;

  // Determine contact to show in ContactCard
  // Renter sees the lister; Agent sees the renter (user)
  let contact: ActivityDetailUser | undefined;
  if (role === "renter") {
    contact = data?.property?.lister;
  } else {
    contact = data?.user;
  }

  // Payment schedules (only present for bookings)
  const paymentSchedules: PaymentSchedule[] | undefined =
    !isInspection
      ? (data as BookingDetailResponse | undefined)?.payment_schedules
      : undefined;

  // Payment calculations
  const paidSchedules =
    paymentSchedules?.filter((s) => s.schedule_status === "paid") ?? [];
  const pendingSchedules =
    paymentSchedules?.filter((s) => s.schedule_status === "pending") ?? [];
  const totalPaid = paidSchedules.reduce((sum, s) => sum + s.amount, 0);
  const totalPending = pendingSchedules.reduce((sum, s) => sum + s.amount, 0);
  const balance =
    totalPending > 0
      ? totalPending
      : Math.max(0, (price ?? 0) - totalPaid);

  // Fallback property image (local)
  const propertyImage = require("@/assets/images/SpacesNearbyImage1.png");

  const handleBack = () => {
    router.back();
  };

  const handleViewProperty = () => {
    const propId = data?.property?.public_id;
    if (propId) {
      router.push({
        pathname: "/views/place-details/[id]",
        params: { id: propId },
      });
    }
  };

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const IMAGE_HEIGHT = 280;

  return (
    <View
      style={{ backgroundColor: colors.background }}
      className="relative flex-1"
    >
      <ParallaxHeader
        scrollY={scrollY}
        IMAGE_HEIGHT={IMAGE_HEIGHT}
        propertyImage={propertyImage}
        imageUri={imageUri}
        handleBack={handleBack}
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        className="z-[10] flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Transparent Spacer matching image height minus the border overlap */}
        <View
          style={{ height: IMAGE_HEIGHT - 32, backgroundColor: "transparent" }}
        />

        {/* Content Overlap Container */}
        <View
          style={{ backgroundColor: colors.background }}
          className="flex flex-col rounded-t-[28px] px-4 pt-6 pb-24"
        >
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.slate[650]}
              className="my-10"
            />
          ) : (
            <>
              {/* Title & Info */}
              <View className="pb-4">
                <View className="flex flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text
                      style={{ color: colors.slate[650], fontSize: RFValue(22) }}
                      className="font-bold"
                    >
                      {title}
                    </Text>
                    {addressText ? (
                      <Text
                        style={{
                          color: colors.slate[550],
                          fontSize: RFValue(15.5),
                          marginTop: 4,
                        }}
                        className="font-medium"
                      >
                        📍 {addressText}
                      </Text>
                    ) : null}
                  </View>
                  {role === "renter" && (
                    <View className="ml-4">
                      <Pressable
                        onPress={handleViewProperty}
                        style={{
                          borderColor: colors.slate[300],
                          borderWidth: 1,
                          borderRadius: 20,
                          paddingHorizontal: 16,
                          paddingVertical: 6,
                          backgroundColor: colors.slate[100],
                        }}
                      >
                        <Text
                          style={{ color: colors.slate[650] }}
                          className="font-semibold text-sm"
                        >
                          View
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>

                {role === "agent" && price != null && costFrequency && (
                  <Text
                    style={{
                      color: colors.slate[650],
                      fontSize: RFValue(17.5),
                      marginTop: 8,
                    }}
                    className="font-bold"
                  >
                    ₦{price.toLocaleString("en-NG")}
                    <Text
                      style={{
                        color: colors.slate[500],
                        fontSize: RFValue(14),
                        fontWeight: "400",
                      }}
                    >
                      /{costFrequency.replace("per_", "")}
                    </Text>
                  </Text>
                )}
              </View>

              <View
                style={{ borderTopWidth: 1, borderColor: colors.slate[200] }}
                className="my-2"
              />

              <BookingDetails status={status} data={data} role={role} />

              <View
                style={{ borderTopWidth: 1, borderColor: colors.slate[200] }}
                className="my-2"
              />

              <ContactCard
                role={role}
                status={status}
                contact={contact}
              />

              <FinancialDetails
                role={role}
                status={status}
                property={data?.property}
                paymentSchedules={paymentSchedules}
              />

              <RentersNotes
                role={role}
                status={status}
                isEventCenter={
                  data?.property?.property_type === "event_space" ||
                  data?.property?.event_space != null
                }
              />

              <View
                style={{ borderTopWidth: 1, borderColor: colors.slate[200] }}
                className="my-2"
              />

              <WarningBanner role={role} status={status} />
            </>
          )}
        </View>
      </Animated.ScrollView>

      <BottomButtonBar
        role={role}
        status={status}
        price={price}
        costFrequency={costFrequency}
        balance={balance}
        propertyId={data?.property?.public_id}
        bookingId={data?.public_id}
        title={title}
        location={addressText}
        imageUri={imageUri}
        totalPaid={totalPaid}
        totalAmount={
          (price ?? 0) +
          (data?.property?.fees?.platform_fee ?? 0) +
          (data?.property?.fees?.caution_fee ?? 0)
        }
        handleBack={handleBack}
      />
    </View>
  );
};

export default ActivitySchedule;
