import { useTheme } from "@/contexts/themeContext";
import { router } from "expo-router";
import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "../button";

const ActiveActivityCard = ({
  buttonTitle,
  image,
  date,
  location,
  title,
}: {
  buttonTitle: string;
  image: ImageSourcePropType;
  date?: string;
  location: string;
  title: string;
}) => {
  const { colors } = useTheme();
  return (
    <View className="flex flex-row items-center gap-6">
      <Image source={image} className="w-6 h-6" />

      <View className="flex flex-row items-center justify-between flex-1 gap-2">
        <View className="flex-1 gap-1">
          <View className="flex flex-row gap-1">
            <Image
              source={require("@/assets/icons/clock.png")}
              className="w-4 h-4"
            />
            <Text
              style={{ color: colors.slate[600], fontSize: RFValue(12) }}
              className=""
            >
              {date}
            </Text>
          </View>
          <Text
            style={{ color: colors.slate[650], fontSize: RFValue(16) }}
            className="font-medium"
          >
            {title}
          </Text>
          <Text style={{ color: colors.slate[650], fontSize: RFValue(14) }}>
            {location}
          </Text>
        </View>
        <View>
          <AppButton
            title={buttonTitle}
            onPress={() => {
              router.push("/views/activities/activity-schedule/[index]");
            }}
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
};

export default ActiveActivityCard;
