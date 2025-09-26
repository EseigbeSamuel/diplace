import AppButton from "@/components/button";
import RadioCard from "@/components/radio-card/radioCard";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function GetStarted() {
  const { colors } = useTheme();

  const route = useRouter();
  const [selected, setSelected] = useState("");

  const handleNavigation = () => {
    if (selected === "renter") {
      route.push("/onboarding/renter/renter");
    } else if (selected === "agent") {
      route.push("/onboarding/agent/agent");
    } else {
      Alert.alert("select an option");
    }
  };

  return (
    <SafeAreaViewContainer className="items-center justify-center gap-4">
      <View className="items-center justify-center">
        <View className="w-[230px] h-[290px] bg-[#F9F9FB]"></View>
      </View>
      <View className="w-full gap-2">
        <Text
          style={{ fontSize: RFValue(32), color: colors.slate[650] }}
          className="font-bold"
        >
          Welcome! 👋 {"\n"}
          Let’s help you tailor {"\n"} your experience.
        </Text>
        <Text
          style={{
            color: colors.slate[600],
          }}
          className="text-base"
        >
          What will you use DiPlace for? Let’s help you {"\n"} customize your
          experience to meet your goals.
        </Text>
      </View>

      <View className="w-full p-5">
        <RadioCard
          label="I am a Renter looking for a space"
          value="renter"
          selected={selected}
          onSelect={setSelected}
        />
        <RadioCard
          label="I am a space Agent / Manager / Owner"
          value="agent"
          selected={selected}
          onSelect={setSelected}
        />
      </View>
      <View className="w-full">
        <AppButton
          title="Get Started"
          // onPress={() => route.push("/auth/login")}
          onPress={handleNavigation}
          fullwidth
          disabled={!selected}
        />
      </View>
    </SafeAreaViewContainer>
  );
}
