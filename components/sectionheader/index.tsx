import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HeaderComponentProps {
  title: string;
  rightIconSource?: ImageSourcePropType;
  onRightIconPress?: () => void;
}

const SectionHeader = ({
  title,
  rightIconSource,
  onRightIconPress,
}: HeaderComponentProps) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <View className="flex flex-row items-center justify-between pb-2">
      <TouchableOpacity
        onPress={handleBackPress}
        className="p-4 bg-gray-100 rounded-full"
      >
        <Image
          source={require("@/assets/icons/arrow-left-dark.png")}
          className="w-6 h-6"
        />
      </TouchableOpacity>
      <Text className="text-lg font-semibold">{title}</Text>
      <TouchableOpacity onPress={onRightIconPress} className="p-2">
        {rightIconSource ? (
          <Image source={rightIconSource} className="w-6 h-6" />
        ) : (
          <View className="w-6 h-6" /> // Placeholder if no icon is provided
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;
