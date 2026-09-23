import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type HouseCardTileProps = {
  imageSource: ImageSourcePropType | string;
  name: string;
  location?: string;
  price?: string;
  duration?: string;
  badgeType?: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
};
const renderBadge = (badgeType: string) => {
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
    case "booked":
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
    case "approved":
    case "active":
      return (
        <View className="flex flex-row items-center gap-2 px-2 py-1 border border-[#3B82F6] rounded-full bg-[#DBEAFE]">
          <Image
            source={require("@/assets/icons/Unlock-fill.png")}
            className="w-4 h-4"
          />
          <Text className="text-[#2563EB]">Available</Text>
        </View>
      );
    case "sold":
    case "completed":
    case "rented":
      return (
        <View className="flex flex-row items-center gap-2 px-2 py-1 border border-green-500 rounded-full bg-green-400/40">
          <Image
            source={require("@/assets/icons/badge-check-green.png")}
            className="w-4 h-4"
          />
          <Text className="text-green-600">
            {badgeType === "sold" ? "Sold" : "Rented"}
          </Text>
        </View>
      );
    case "rejected":
    case "cancelled":
    case "inactive":
    case "archived":
      return (
        <View className="flex flex-row items-center gap-2 px-2 py-1 border border-red-500 rounded-full bg-red-400/20">
          <Image
            source={require("@/assets/icons/delete.png")}
            className="w-4 h-4"
          />
          <Text className="text-red-600">
            {badgeType.charAt(0).toUpperCase() + badgeType.slice(1)}
          </Text>
        </View>
      );
    case "unverified":
      return (
        <View className="flex flex-row items-center gap-2 px-2 py-1 border border-[#60646C] rounded-full bg-[#F2F2F5]">
          <Image
            source={require("@/assets/icons/Checkbox-circle-intermediate.png")}
            className="w-4 h-4"
          />
          <Text className="text-[#1C2024]">Unverified</Text>
        </View>
      );
  }
};
const HouseCardTile = ({
  imageSource,
  name,
  location,
  price,
  duration,
  onPress,
  badgeType,
}: HouseCardTileProps) => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  const remoteImageUri =
    typeof imageSource === "string"
      ? imageSource
      : imageSource &&
          typeof imageSource === "object" &&
          "uri" in imageSource &&
          typeof imageSource.uri === "string"
        ? imageSource.uri
        : "";
  const cardImageSource =
    remoteImageUri.length >= 7
      ? typeof imageSource === "string"
        ? { uri: imageSource }
        : imageSource
      : require("@/assets/images/diplace.jpg");
  return (
    <Pressable onPress={onPress}>
      <View className="flex flex-row justify-between gap-2 py-2">
        <View className="flex flex-row gap-2">
          <View className="">
            <Image
              source={cardImageSource}
              className="w-[72px] h-[72px] rounded-lg"
            />
          </View>
          <View className="flex gap-1">
            <View>{renderBadge(badgeType || "")}</View>
            <Text
              className="text-xl"
              style={homeStyles.subTitleblack}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
            <Text className="text-gray-400">{location}</Text>
            <View className="flex flex-row">
              <Text
                className="text-lg font-semibold"
                style={homeStyles.subTitleblack}
              >
                {price}
              </Text>
              <Text style={homeStyles.subTitleblack}>
                {duration ? `/${duration}` : ""}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Image
            source={require("@/assets/icons/arrow-left-up-outline-dark.png")}
            className="w-6 h-6"
          />
        </View>
      </View>
    </Pressable>
  );
};

export default HouseCardTile;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    gray: {
      color: colors.slate[600],
    },
    title: {
      fontSize: RFValue(18),
      color: colors.slate[650],
      lineHeight: RFValue(24),
    },
    borderBlack: {
      borderBlockColor: colors.slate[650],
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
    subTitleblack: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
  });
