import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
}: {
  imageSource: ImageSourcePropType;
  title: string;
  location: string;
  price: string;
  badgeType?: string;
  duration: string;
}) => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkPress = () => {
    setIsBookmarked(!isBookmarked);
  };

  const renderBadge = () => {
    switch (badgeType) {
      case "hot":
        return (
          <View className="py-1 px-2 rounded-full border border-red-500 bg-red-400/40 flex flex-row gap-2 items-center">
            <Image
              source={require("@/assets/icons/fire-b-fill.png")}
              className="w-4 h-4"
            />
            <Text className="text-red-600 ">Hot space</Text>
          </View>
        );
      case "diplace":
        return (
          <View className="py-1 px-2 rounded-full border border-orange-500 bg-orange-400/40 flex flex-row gap-2 items-center">
            <Image
              source={require("@/assets/icons/Shield Done.png")}
              className="w-4 h-4"
            />
            <Text className="text-orange-600">DiPlaces</Text>
          </View>
        );
      case "verified":
        return (
          <View className="py-1 px-2 rounded-full border border-green-500 bg-green-400/40 flex flex-row gap-2 items-center">
            <Image
              source={require("@/assets/icons/badge-check-green.png")}
              className="w-4 h-4"
            />
            <Text className="text-green-600">Verified</Text>
          </View>
        );
    }
  };

  return (
    <Pressable onPress={() => router.push("/views/placedetails")}>
      <View className="flex-1">
        <Image source={imageSource} className="rounded-lg" resizeMode="cover" />
        <View className="flex flex-row justify-between pt-2">
          <Text style={homeStyles.title}>{title}</Text>
          <TouchableOpacity onPress={handleBookmarkPress}>
            <Image
              source={
                isBookmarked
                  ? require("@/assets/icons/Bookmark - Iconly Pro-1.png")
                  : require("@/assets/icons/Bookmark - Iconly Pro.png")
              }
              className="w-6 h-6"
            />
          </TouchableOpacity>
        </View>
        <View className="flex gap-1 flex-row">
          <Image
            source={require("@/assets/icons/Location - Iconly Pro.png")}
            className="w-6 h-6"
          />
          <Text style={homeStyles.subTitlegray}>{location}</Text>
        </View>
        <View className="flex gap-2 flex-row justify-between items-center">
          <Text style={homeStyles.title} className="font-semibold">
            {price}
            <Text style={homeStyles.subTitlegray}>/{duration}</Text>
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
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
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
