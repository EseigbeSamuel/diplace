import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function GetStarted() {
  const { colors } = useTheme();
  const route = useRouter();

  return (
    <SafeAreaViewContainer className="items-center justify-center gap-4">
      <Text
        className="font-bold text-center"
        style={{ fontSize: RFValue(24), color: colors.slate[650] }}
      >
        DiPlace
      </Text>
      <View className="items-center justify-center">
        <View
          style={{
            borderColor: colors.slate[600],
            backgroundColor: colors.slate[150],
          }}
          className="border-4 w-[230px] h-[290px]"
        ></View>
      </View>
      <View className="w-[90%] gap-2">
        <Text
          style={{ fontSize: RFValue(24), color: colors.slate[650] }}
          className="font-semibold text-center"
        >
          Find a space without hassle!
        </Text>
        <Text
          style={{
            color: colors.slate[600],
          }}
          className="text-base text-center"
        >
          Escape the stress and wahala of looking for an apartment, office, or
          event center. Find your desired space at the comfy of your home.
        </Text>
      </View>
      <View className="w-[90%]">
        <AppButton
          title="Get Started"
          onPress={() => route.push("/auth/login")}
          fullwidth
          afterIcon={require("../assets/icons/arrow-right-light.png")}
        />
      </View>
    </SafeAreaViewContainer>
  );
}
