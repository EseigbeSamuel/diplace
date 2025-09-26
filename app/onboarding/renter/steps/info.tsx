import SafeAreaViewContainer from "@/components/safeareaview";
import React from "react";
import { Text, View } from "react-native";

const Info = () => {
  return (
    <SafeAreaViewContainer className="items-center justify-center gap-4">
      <View>
        <Text className="text-white">info</Text>
      </View>
    </SafeAreaViewContainer>
  );
};

export default Info;
