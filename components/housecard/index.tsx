import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const HouseCard = ({
  imageSource,
  title,
  location,
  price,
  badgeType,
  duration,
  type,
  onPress,
}: {
  imageSource: ImageSourcePropType;
  title: string;
  location: string;
  price: string;
  badgeType?: string;
  duration: string;
  type?: "featured" | "nearby";
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
}) => {
  const { colors, isDarkMode } = useTheme();
  const homeStyles = styles(colors);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
  };

  const renderBadge = () => {
    switch (badgeType) {
      case "hot":
        return (
          <View className="flex flex-row items-center gap-2 px-2 py-1 border border-red-500 rounded-full bg-red-400/40">
            <Image
              source={require("@/assets/icons/fire-b-fill.png")}
              className="w-4 h-4"
            />
            <Text className="text-red-600">Hot space</Text>
          </View>
        );
      case "diplace":
        return (
          <View className="flex flex-row items-center gap-2 px-2 py-1 border border-orange-500 rounded-full bg-orange-400/40">
            <Image
              source={require("@/assets/icons/Shield Done.png")}
              className="w-4 h-4"
            />
            <Text className="text-orange-600">DiPlaces</Text>
          </View>
        );
      case "verified":
        return (
          <View className="flex flex-row items-center gap-2 px-2 py-1 border border-green-500 rounded-full bg-green-400/40">
            <Image
              source={require("@/assets/icons/badge-check-green.png")}
              className="w-4 h-4"
            />
            <Text className="text-green-600">Verified</Text>
          </View>
        );
      case "rented":
        return (
          <View className="flex flex-row items-center gap-2 px-2 py-1 border border-green-500 rounded-full bg-green-400/40">
            <Image
              source={require("@/assets/icons/badge-check-green.png")}
              className="w-4 h-4"
            />
            <Text className="text-green-600">Rented</Text>
          </View>
        );
      case "inDrafts":
        return (
          <View className="flex flex-row items-center gap-2 px-2 py-1 border border-[#60646C] rounded-full bg-[#F2F2F5]">
            <Image
              source={require("@/assets/icons/edit-pencil-fill.png")}
              className="w-4 h-4"
            />
            <Text className="text-[#1C2024]">In draft</Text>
          </View>
        );
      case "pending":
        return (
          <View className="flex flex-row items-center gap-2 px-2 py-1 border border-[#F59E0B] rounded-full bg-[#FEF3C7]">
            <Image
              source={require("@/assets/icons/Checkbox-circle-intermediate.png")}
              className="w-4 h-4"
            />
            <Text className="text-[#D97706]">Pending</Text>
          </View>
        );
      case "reserved":
        return (
          <View className="flex flex-row items-center gap-2 px-2 py-1 border border-[#F59E0B] rounded-full bg-[#FEF3C7]">
            <Image
              source={require("@/assets/icons/Lock-fill.png")}
              className="w-4 h-4"
            />
            <Text className="text-[#D97706]">Reserved</Text>
          </View>
        );
      case "available":
        return (
          <View className="flex flex-row items-center gap-2 px-2 py-1 border border-[#3B82F6] rounded-full bg-[#DBEAFE]">
            <Image
              source={require("@/assets/icons/Unlock-fill.png")}
              className="w-4 h-4"
            />
            <Text className="text-[#2563EB]">Reserved</Text>
          </View>
        );
    }
  };

  return (
    <Pressable onPress={onPress} style={{ minWidth: RFValue(280) }}>
      <View className="flex-1 gap-0.5">
        <View className="rounded-2xl">
          <Image
            source={imageSource}
            style={{
              height: RFValue(155),
              width: "100%",
              borderRadius: RFValue(15),
            }}
          />
        </View>
        <View className="flex flex-row justify-between pt-2">
          <Text style={homeStyles.title}>{title}</Text>
          <TouchableOpacity onPress={handleBookmarkPress}>
            <Image
              source={
                isBookmarked
                  ? require("@/assets/icons/bookmark-light-active.png")
                  : isDarkMode
                  ? require("@/assets/icons/bookmark-inactive-white.png")
                  : require("@/assets/icons/bookmark-inactive.png")
              }
              style={{ height: RFValue(19), width: RFValue(14.94) }}
            />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center gap-0.5">
          <Image
            source={
              isDarkMode
                ? require("@/assets/icons/location-white.png")
                : require("@/assets/icons/location-black.png")
            }
            className="w-4 h-4"
          />
          <Text style={homeStyles.subTitlegray}>{location}</Text>
        </View>
        <View className="flex flex-row items-center justify-between gap-2">
          <Text
            style={{
              fontSize: RFValue(18),
              fontFamily: "InstrumentSansSemiBold",
              color: colors.slate[650],
            }}
            className="font-semibold"
          >
            {price}
            <Text
              style={[
                homeStyles.subTitlegray,
                { fontFamily: "InstrumentSansRegular" },
              ]}
            >
              /{duration}
            </Text>
          </Text>
          {renderBadge()}
        </View>
      </View>
    </Pressable>
  );
};

export default HouseCard;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    gray: {
      color: colors.slate[600],
    },
    title: {
      fontSize: RFValue(16),
      color: colors.slate[650],
      lineHeight: RFValue(24),
      fontFamily: "InstrumentSansRegular",
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
    },
    titlegray: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[600],
    },
    subTitlegray: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
  });
