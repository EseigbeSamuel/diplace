import { useNavigation } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

const PrevButton = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <View className="">
      <TouchableOpacity
        onPress={handleBackPress}
        className="p-4 bg-gray-100 rounded-full w-[50px] "
      >
        <Image
          source={require("@/assets/icons/arrow-left-dark.png")}
          className="w-6 h-6"
        />
      </TouchableOpacity>
    </View>
  );
};

export default PrevButton;
