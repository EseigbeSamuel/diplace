import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";

export default function Profile() {
  const { colors, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaViewContainer className="items-center justify-center flex-1 gap-4">
      <Text style={{ color: colors.slate[650] }}>Profile page</Text>
      <AppButton onPress={toggleTheme} title="Toggle theme" />
      <AppButton
        onPress={() => router.replace("/auth/login")}
        title="Log out"
      />
    </SafeAreaViewContainer>
  );
}
