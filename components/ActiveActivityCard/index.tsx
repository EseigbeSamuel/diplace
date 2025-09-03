import { router } from "expo-router";
import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";
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
  return (
    <View className="flex flex-row gap-6 items-center">
      <View>
        <Image source={image} className="w-6 h-6" />
      </View>

      <View className="flex flex-row justify-between items-center">
        <View className="">
          <Text className="text-gray-300">{date}</Text>
          <Text className="text-lg font-semibold">{title}</Text>
          <Text>{location}</Text>
        </View>
        <View>
          <AppButton
            title={buttonTitle}
            onPress={() => {
              router.push("/views/place-details/[id]");
            }}
            variant="secondary"
          />
        </View>
      </View>
    </View>
  );
};

export default ActiveActivityCard;
