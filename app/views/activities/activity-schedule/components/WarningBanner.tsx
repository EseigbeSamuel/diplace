import React from "react";
import { View, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/contexts/themeContext";

interface WarningBannerProps {
  status: string;
  role: string;
}

const WarningBanner: React.FC<WarningBannerProps> = ({ status, role }) => {
  const { colors } = useTheme();

  if (status !== "scheduled" && status !== "inspected") {
    return null;
  }

  return (
    <View className="mt-4 mb-4">
      <Text
        style={{
          fontSize: RFValue(13.5),
          lineHeight: RFValue(18.5),
          color: colors.slate[500],
        }}
      >
        <Text style={{ color: "#D97706" }}>⚠️ </Text>
        <Text style={{ color: "#D97706" }} className="font-bold">Heads up! </Text>
        {role === "renter" 
          ? "The price you see is for the space only. Agent fees and other charges may apply."
          : "The price you see is for the space only. View space to see other charges that may apply."}
      </Text>
    </View>
  );
};

export default WarningBanner;
