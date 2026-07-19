import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ActivitySchedule = () => {
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ index?: string; status?: string; title?: string }>();

  const status = (params.status || "scheduled").toLowerCase();
  const title = params.title || "2 Bedroom in-suite apartment";
  const isEventCenter = title.toLowerCase().includes("event");

  // Determine property image
  const propertyImage = isEventCenter
    ? require("@/assets/images/halls.png")
    : require("@/assets/images/SpacesNearbyImage1.png");

  // Determine pricing text
  const priceText = isEventCenter ? "₦400,000/day" : "₦800,000/annum";
  const locationText = isEventCenter ? "GRA Phase II, Port Harcourt" : "Rumuehwhera, Port Harcourt";

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
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-IMAGE_HEIGHT, 0],
      [2, 1],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
      [IMAGE_HEIGHT / 2, 0, -IMAGE_HEIGHT * 0.5],
      Extrapolate.CLAMP
    );
    return {
      transform: [
        { translateY },
        { scale },
      ],
    };
  });

  return (
    <View style={{ backgroundColor: colors.background }} className="relative flex-1">
      {/* Background Image Banner */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: IMAGE_HEIGHT,
            zIndex: 1,
          },
          imageAnimatedStyle,
        ]}
      >
        <Image source={propertyImage} className="w-full h-full" resizeMode="cover" />
      </Animated.View>

      {/* Absolute Custom Header Overlaid on Image */}
      <View style={{ top: Math.max(insets.top, 16) }} className="absolute z-20 w-full px-4 flex flex-row items-center justify-between">
        <Pressable
          onPress={handleBack}
          style={{
            width: RFValue(36),
            height: RFValue(36),
            borderRadius: RFValue(18),
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Image
            source={require("@/assets/icons/arrow-right-dark.png")}
            style={{ width: 16, height: 16, transform: [{ rotate: "180deg" }], tintColor: "#1C2024" }}
          />
        </Pressable>

        <Pressable
          style={{
            width: RFValue(36),
            height: RFValue(36),
            borderRadius: RFValue(18),
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Image
            source={require("@/assets/icons/more-2-line.png")}
            style={{ width: 18, height: 18, tintColor: "#1C2024" }}
          />
        </Pressable>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ zIndex: 10, flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Transparent Spacer matching image height minus the border overlap */}
        <View style={{ height: IMAGE_HEIGHT - 32, backgroundColor: "transparent" }} />

        {/* Content Overlap Container */}
        <View
          style={{ backgroundColor: colors.background }}
          className="flex flex-col rounded-t-[28px] px-4 pt-6 pb-24"
        >
          {/* Title & Info */}
          <View className="pb-4">
            <Text
              style={{ color: colors.slate[650], fontSize: RFValue(22) }}
              className="font-bold"
            >
              {title}
            </Text>
            <Text
              style={{ color: colors.slate[550], fontSize: RFValue(15.5), marginTop: 4 }}
              className="font-medium"
            >
              📍 {locationText}
            </Text>
            <Text
              style={{ color: colors.slate[650], fontSize: RFValue(17.5), marginTop: 8 }}
              className="font-bold"
            >
              {priceText}
            </Text>
          </View>

          <View style={{ borderTopWidth: 1, borderColor: colors.slate[200] }} className="my-2" />

          {/* Dynamic Section 1: Booking Details */}
          <View className="py-4">
            {status === "booked" && !isEventCenter ? (
              // Case: Apartment Booked
              <View className="gap-3.5">
                <Text style={{ color: colors.slate[650], fontSize: RFValue(15) }} className="font-bold">
                  Booking Details
                </Text>
                <View className="flex flex-row items-center justify-between">
                  <View className="flex flex-row items-center gap-2">
                    <Image source={require("@/assets/icons/contract.png")} className="w-5 h-5" style={{ tintColor: colors.slate[550] }} />
                    <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">Rent - 1 Year</Text>
                  </View>
                </View>
                <View className="flex flex-row items-center justify-between">
                  <View className="flex flex-row items-center gap-2">
                    <Image source={require("@/assets/icons/calendar.png")} className="w-5 h-5" style={{ tintColor: colors.slate[550] }} />
                    <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">Move In: Fri, 20th Aug, 2025</Text>
                  </View>
                  <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <Text className="text-emerald-600 font-bold text-[12px]">✓ Booked</Text>
                  </View>
                </View>
                <View className="flex flex-row items-center gap-2">
                  <Image source={require("@/assets/icons/user.png")} className="w-5 h-5" style={{ tintColor: colors.slate[550] }} />
                  <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">Occupants: 1 Adult, 0 Children</Text>
                </View>
              </View>
            ) : (
              // Other Cases: Scheduled, Inspected, Reserved, Event Center Booked
              <View className="gap-3.5">
                {isEventCenter && (
                  <Text style={{ color: colors.slate[650], fontSize: RFValue(15) }} className="font-bold">
                    Wedding & Engagement
                  </Text>
                )}

                <View className="flex flex-row items-center justify-between">
                  <View className="flex flex-row items-center gap-2">
                    <Image
                      source={require("@/assets/icons/calendar.png")}
                      className="w-5 h-5"
                      style={{ tintColor: colors.slate[550] }}
                    />
                    <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">
                      {isEventCenter ? "Thu, 17 Aug - Sat, 19 Aug, 2025" : "Wed, 9th August, 2025"}
                    </Text>
                  </View>

                  {/* Status Badge */}
                  {status === "scheduled" && (
                    <View className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      <Text className="text-blue-600 font-bold text-[12px]">● Scheduled</Text>
                    </View>
                  )}
                  {status === "inspected" && (
                    <View className="bg-gray-100 px-3 py-1 rounded-full border border-gray-300 flex flex-row items-center gap-1">
                      <Image source={require("@/assets/icons/badge-check-green.png")} className="w-3 h-3" style={{ tintColor: "#1C2024" }} />
                      <Text className="text-gray-800 font-bold text-[12px]">Inspected</Text>
                    </View>
                  )}
                  {status === "reserved" && (
                    <View className="bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      <Text className="text-amber-600 font-bold text-[12px]">● Reserved</Text>
                    </View>
                  )}
                  {status === "booked" && isEventCenter && (
                    <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <Text className="text-emerald-600 font-bold text-[12px]">✓ Booked</Text>
                    </View>
                  )}
                </View>

                <View className="flex flex-row items-center gap-2">
                  <Image
                    source={require("@/assets/icons/Time.png")}
                    className="w-5 h-5"
                    style={{ tintColor: colors.slate[550] }}
                  />
                  <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">
                    {isEventCenter ? "Full work day (10 hours)" : "1PM - 3PM Afternoon slot"}
                  </Text>
                </View>

                {!isEventCenter && (
                  <View className="flex flex-row items-center gap-2">
                    <Image
                      source={require("@/assets/icons/money-bag.png")}
                      className="w-5 h-5"
                      style={{ tintColor: colors.slate[550] }}
                    />
                    <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">
                      Fee: ₦2,000
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={{ borderTopWidth: 1, borderColor: colors.slate[200] }} className="my-2" />

          {/* Dynamic Section 2: Contact Details */}
          <View className="py-4 flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-3">
              <Image
                source={require("@/assets/images/sammy.jpg")}
                style={{ width: RFValue(40), height: RFValue(40), borderRadius: RFValue(20) }}
              />
              <View>
                <Text style={{ color: colors.slate[500], fontSize: RFValue(13) }}>
                  {status === "booked" ? "Booked By:" : status === "reserved" ? "Reserved By:" : "Scheduled By:"}
                </Text>
                <View className="flex flex-row items-center gap-1">
                  <Text
                    style={{ color: colors.slate[650], fontSize: RFValue(15.5) }}
                    className="font-bold"
                  >
                    Sammy Kalu
                  </Text>
                  <Image
                    source={require("@/assets/icons/badge-check-green.png")}
                    style={{ width: 14, height: 14 }}
                  />
                </View>
              </View>
            </View>

            <View className="flex flex-row gap-3">
              <Pressable
                style={{ backgroundColor: colors.slate[150] }}
                className="w-12 h-12 rounded-full items-center justify-center"
              >
                <Image
                  source={require("@/assets/icons/Chat - Iconly Pro.png")}
                  className="w-5 h-5"
                  style={{ tintColor: colors.slate[650] }}
                />
              </Pressable>
              <Pressable
                style={{ backgroundColor: colors.slate[150] }}
                className="w-12 h-12 rounded-full items-center justify-center"
              >
                <Image
                  source={require("@/assets/icons/calling.png")}
                  className="w-5 h-5"
                  style={{ tintColor: colors.slate[650] }}
                />
              </Pressable>
            </View>
          </View>

          {/* Dynamic Section 3: Financial Details (Only for Event Center Reserved) */}
          {isEventCenter && status === "reserved" && (
            <View style={{ borderColor: colors.slate[200] }} className="py-4 border-t gap-3">
              <View className="flex flex-row justify-between">
                <Text style={{ color: colors.slate[550], fontSize: RFValue(15) }}>Initial deposit:</Text>
                <Text style={{ color: colors.slate[650], fontSize: RFValue(15.5) }} className="font-bold">₦251,200.00</Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text style={{ color: colors.slate[550], fontSize: RFValue(15) }}>Balance payment:</Text>
                <Text style={{ color: colors.slate[650], fontSize: RFValue(15.5) }} className="font-bold">₦1,034,800.00</Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text style={{ color: colors.slate[550], fontSize: RFValue(15) }}>Balance due:</Text>
                <Text className="text-red-500 font-bold text-base">Thu. 10th Aug, 2025</Text>
              </View>
            </View>
          )}

          {/* Dynamic Section 4: Renter's Notes (Only for Booked or Reserved status) */}
          {(status === "booked" || status === "reserved") && (
            <View style={{ borderColor: colors.slate[200] }} className="py-4 border-t">
              <Text style={{ color: colors.slate[650], fontSize: RFValue(15.5), marginBottom: 6 }} className="font-bold">
                Renter's Notes
              </Text>
              <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5), lineHeight: RFValue(19.5) }}>
                {isEventCenter
                  ? "We are expecting dignitaries and would like the place to be on lock down."
                  : "I would love everything to be fixed before moving in. Just work with my move in date."}
              </Text>
            </View>
          )}

          <View style={{ borderTopWidth: 1, borderColor: colors.slate[200] }} className="my-2" />

          {/* Warning notice banner */}
          {(status === "scheduled" || status === "inspected") && (
            <View
              style={{
                backgroundColor: colors.warning[100],
                borderColor: isDarkMode ? colors.warning[100] : colors.warning[200],
                borderWidth: 1,
                borderRadius: RFValue(12),
              }}
              className="p-4 mt-4"
            >
              <Text style={{ fontSize: RFValue(13.5), lineHeight: RFValue(18.5), color: isDarkMode ? colors.warning[300] : colors.warning[300] }}>
                ⚠️ <Text className="font-bold">Heads up!</Text> The price you see is for the space only. Renter is to pay other charges from their app.
              </Text>
            </View>
          )}

        </View>
      </Animated.ScrollView>

      {/* Floating Bottom Button Bar */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderColor: colors.slate[200],
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 12),
        }}
      >
        {status === "inspected" ? (
          // Inspected status: single button
          <AppButton
            title="Hold for Renter"
            onPress={handleBack}
            fullwidth
          />
        ) : (
          // Scheduled, Booked, Reserved status: cancel + view space buttons
          <View className="flex flex-row items-center justify-between gap-4">
            <Pressable onPress={handleBack} className="flex-1 items-center py-3">
              <Text className="text-red-500 font-bold text-[14px]">Cancel Booking</Text>
            </Pressable>
            <View className="flex-[1.5]">
              <AppButton
                title="View space"
                onPress={handleBack}
                fullwidth
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default ActivitySchedule;
