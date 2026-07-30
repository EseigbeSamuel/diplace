import { useTheme } from "@/contexts/themeContext";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ParallaxHeader from "./components/ParallaxHeader";
import BookingDetails from "./components/BookingDetails";
import ContactCard from "./components/ContactCard";
import FinancialDetails from "./components/FinancialDetails";
import RentersNotes from "./components/RentersNotes";
import WarningBanner from "./components/WarningBanner";
import BottomButtonBar from "./components/BottomButtonBar";

const ActivitySchedule = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    index?: string;
    status?: string;
    title?: string;
    role?: string;
  }>();

  const role = (params.role || "agent").toLowerCase();
  const status = (params.status || "scheduled").toLowerCase();
  const title = params.title || "2 Bedroom in-suite apartment";
  const isEventCenter = title.toLowerCase().includes("event");

  // Determine property image
  const propertyImage = isEventCenter
    ? require("@/assets/images/halls.png")
    : require("@/assets/images/SpacesNearbyImage1.png");

  // Determine pricing text
  const priceText = isEventCenter ? "₦400,000/day" : "₦800,000/annum";
  const locationText = isEventCenter
    ? "GRA Phase II, Port Harcourt"
    : "Rumuehwhera, Port Harcourt";

  const handleBack = () => {
    router.back();
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
        handleBack={handleBack}
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ zIndex: 10, flex: 1 }}
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
                <Text
                  style={{
                    color: colors.slate[550],
                    fontSize: RFValue(15.5),
                    marginTop: 4,
                  }}
                  className="font-medium"
                >
                  📍 {locationText}
                </Text>
              </View>
              {role === "renter" && (
                <View className="ml-4">
                  <Pressable
                    style={{
                      borderColor: colors.slate[200],
                      borderWidth: 1,
                      borderRadius: 20,
                      paddingHorizontal: 16,
                      paddingVertical: 6,
                    }}
                  >
                    <Text style={{ color: colors.slate[650] }} className="font-medium">
                      View
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
            {role === "agent" && (
              <Text
                style={{
                  color: colors.slate[650],
                  fontSize: RFValue(17.5),
                  marginTop: 8,
                }}
                className="font-bold"
              >
                {priceText}
              </Text>
            )}
          </View>

          <View
            style={{ borderTopWidth: 1, borderColor: colors.slate[200] }}
            className="my-2"
          />

          <BookingDetails status={status} isEventCenter={isEventCenter} />

          <View
            style={{ borderTopWidth: 1, borderColor: colors.slate[200] }}
            className="my-2"
          />

          <ContactCard role={role} status={status} isEventCenter={isEventCenter} />

          <FinancialDetails role={role} status={status} isEventCenter={isEventCenter} />
          
          <RentersNotes role={role} status={status} isEventCenter={isEventCenter} />

          <View
            style={{ borderTopWidth: 1, borderColor: colors.slate[200] }}
            className="my-2"
          />

          <WarningBanner role={role} status={status} />
        </View>
      </Animated.ScrollView>

      <BottomButtonBar
        role={role}
        status={status}
        priceText={priceText}
        handleBack={handleBack}
      />
    </View>
  );
};

export default ActivitySchedule;
