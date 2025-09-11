import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

type HouseCardTileProps = {
  imageSource: ImageSourcePropType;
  name: string;
  location: string;
  price: string;
  duration: string;
  badgeType?: string;
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
            source={require("@/assets/icons/Edit-pencil-fill.png")}
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
const HouseCardTile = ({
  imageSource,
  name,
  location,
  price,
  duration,
  badgeType,
}: HouseCardTileProps) => {
  return (
    <View className="py-2 flex flex-row gap-2 justify-between">
      <View className="flex flex-row gap-2">
        <View className="">
          <Image
            source={imageSource}
            className="w-[72px] h-[72px] rounded-lg"
          />
        </View>
        <View className="flex gap-1">
          <Text>{renderBadge(badgeType || "")}</Text>
          <Text className="text-xl">{name}</Text>
          <Text className="text-gray-400">{location}</Text>
          <View className="flex flex-row">
            <Text className="font-semibold text-lg">{price}</Text>
            <Text className="text-gray-400">/{duration}</Text>
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
  );
};

export default HouseCardTile;
