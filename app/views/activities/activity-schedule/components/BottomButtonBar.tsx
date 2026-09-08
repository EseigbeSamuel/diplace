import React from "react";
import { View, Text, Pressable } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/contexts/themeContext";
import AppButton from "@/components/button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const FREQUENCY_LABEL: Record<string, string> = {
  per_annum: "yr",
  per_month: "mo",
  per_day: "day",
  per_hour: "hr",
  per_night: "night",
};

const formatPrice = (price: number, frequency: string): string => {
  const formatted = `₦${price.toLocaleString("en-NG")}`;
  const freqLabel = FREQUENCY_LABEL[frequency] ?? frequency ?? "yr";
  return `${formatted}/${freqLabel}`;
};

interface BottomButtonBarProps {
  status: string;
  role: string;
  /** Pass raw price + cost_frequency from API; falls back to priceText for backward compat */
  price?: number;
  costFrequency?: string;
  /** @deprecated Use price + costFrequency instead */
  priceText?: string;
  balance?: number;
  propertyId?: string;
  bookingId?: string;
  title?: string;
  location?: string;
  imageUri?: string;
  totalPaid?: number;
  totalAmount?: number;
  handleBack: () => void;
}

const BottomButtonBar: React.FC<BottomButtonBarProps> = ({
  status,
  role,
  price,
  costFrequency,
  priceText,
  balance,
  propertyId,
  bookingId,
  title,
  location,
  imageUri,
  totalPaid,
  totalAmount,
  handleBack,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Build display price from real data when available
  const displayPrice =
    price != null && costFrequency
      ? formatPrice(price, costFrequency)
      : priceText ?? "";

  const [displayAmount, displayUnit] = displayPrice.includes("/")
    ? displayPrice.split("/")
    : [displayPrice, ""];

  const handlePayBalance = () => {
    router.push({
      pathname: "/views/activities/payBalance",
      params: {
        bookingId: bookingId ?? "",
        propertyId: propertyId ?? "",
        title: title ?? "",
        location: location ?? "",
        balance: String(balance ?? 0),
        totalAmount: String(totalAmount ?? price ?? 0),
        initialDeposit: String(totalPaid ?? 0),
        price: String(price ?? 0),
        costFrequency: costFrequency ?? "per_annum",
        imageUri: imageUri ?? "",
      },
    });
  };

  const handleBookNow = () => {
    if (propertyId) {
      router.push({
        pathname: "/views/place-details/[id]",
        params: { id: propertyId },
      });
    } else {
      handleBack();
    }
  };

  const handleViewSpace = () => {
    if (propertyId) {
      router.push({
        pathname: "/views/place-details/[id]",
        params: { id: propertyId },
      });
    } else {
      handleBack();
    }
  };

  return (
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
        zIndex: 20,
      }}
    >
      {role === "renter" ? (
        status === "reserved" ? (
          // Reserved: show balance and Pay Balance CTA
          <View className="flex flex-row items-center justify-between">
            <View>
              <Text style={{ color: colors.slate[500], fontSize: RFValue(13) }}>
                Balance
              </Text>
              <Text
                style={{ color: colors.slate[650], fontSize: RFValue(17.5) }}
                className="font-bold"
              >
                ₦{(balance ?? 0).toLocaleString("en-NG")}
              </Text>
            </View>
            <View className="w-[140px]">
              <AppButton
                title="Pay Balance"
                onPress={handlePayBalance}
                fullwidth
              />
            </View>
          </View>
        ) : status === "scheduled" || status === "inspected" ? (
          // Scheduled / Inspected: show price and Book Now CTA
          <View className="flex flex-row items-center justify-between">
            <View>
              <Text
                style={{ color: colors.slate[650], fontSize: RFValue(17.5) }}
                className="font-bold"
              >
                {displayAmount}
                {displayUnit ? (
                  <Text
                    style={{ color: colors.slate[500], fontSize: RFValue(13) }}
                    className="font-normal"
                  >
                    /{displayUnit}
                  </Text>
                ) : null}
              </Text>
            </View>
            <View className="w-[140px]">
              <AppButton title="Book Now" onPress={handleBookNow} fullwidth />
            </View>
          </View>
        ) : (
          // Booked state as Renter
          <View className="flex flex-row items-center justify-between gap-4">
            <Pressable onPress={handleBack} className="flex-1 items-center py-3">
              <Text className="text-red-500 font-bold text-[14px]">
                Cancel Booking
              </Text>
            </Pressable>
            <View className="flex-[1.5]">
              <AppButton title="View space" onPress={handleViewSpace} fullwidth />
            </View>
          </View>
        )
      ) : (
        // Agent View Logic
        status === "inspected" ? (
          // Inspected status: single button
          <AppButton title="Hold for Renter" onPress={handleBack} fullwidth />
        ) : (
          // Scheduled, Booked, Reserved status: cancel + view space buttons
          <View className="flex flex-row items-center justify-between gap-4">
            <Pressable
              onPress={handleBack}
              className="flex-1 items-center py-3"
            >
              <Text className="text-red-500 font-bold text-[14px]">
                Cancel Booking
              </Text>
            </Pressable>
            <View className="flex-[1.5]">
              <AppButton title="View space" onPress={handleViewSpace} fullwidth />
            </View>
          </View>
        )
      )}
    </View>
  );
};

export default BottomButtonBar;
