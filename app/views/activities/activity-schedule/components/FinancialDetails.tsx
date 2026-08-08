import React from "react";
import { View, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/contexts/themeContext";

interface FinancialDetailsProps {
  status: string;
  isEventCenter: boolean;
  role: string;
}

const FinancialDetails: React.FC<FinancialDetailsProps> = ({ status, isEventCenter, role }) => {
  const { colors } = useTheme();

  if (!isEventCenter || status !== "reserved") {
    return null;
  }

  return (
    <View
      style={{ borderColor: colors.slate[200] }}
      className="py-4 border-t gap-3"
    >
      <View className="flex flex-row justify-between">
        <Text style={{ color: colors.slate[550], fontSize: RFValue(15) }}>
          Initial deposit:
        </Text>
        <Text style={{ color: colors.slate[650], fontSize: RFValue(15.5) }} className="font-bold">
          ₦251,200.00
        </Text>
      </View>
      {role === "agent" && (
        <View className="flex flex-row justify-between">
          <Text style={{ color: colors.slate[550], fontSize: RFValue(15) }}>
            Balance payment:
          </Text>
          <Text style={{ color: colors.slate[650], fontSize: RFValue(15.5) }} className="font-bold">
            ₦1,004,800.00
          </Text>
        </View>
      )}
      <View className="flex flex-row justify-between">
        <Text style={{ color: colors.slate[550], fontSize: RFValue(15) }}>
          Balance due:
        </Text>
        <Text className="text-red-500 font-bold text-base">
          Thu. 10th Aug, 2025
        </Text>
      </View>
    </View>
  );
};

export default FinancialDetails;
