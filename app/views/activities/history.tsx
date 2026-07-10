import HistoryCard from "@/components/HistoryCard";
import { useTheme } from "@/contexts/themeContext";
import { useUser } from "@/contexts/user-context";
import React from "react";
import { Text, View } from "react-native";
import AgentActivityHistory from "./agentHistory";

const ActivityHistory = () => {
  const { colors } = useTheme();
  const { userType } = useUser();

  if (userType !== "renter") {
    return <AgentActivityHistory />;
  }

  return (
    <View>
      <View className="py-4">
        <Text
          style={{ color: colors.slate[650] }}
          className="font-semibold text-lg"
        >
          August, 2025
        </Text>
        <HistoryCard
          badgeType="successful"
          action="Scheduled"
          date="9th Aug, 2025"
          description="You scheduled an inspection of 2 bedroom apartment at Rumuewhera, Port Harcourt."
          title="Made payment for inspection"
        />
      </View>
      <View>
        <Text
          style={{ color: colors.slate[650] }}
          className="font-semibold text-lg"
        >
          July, 2025
        </Text>
        <HistoryCard
          badgeType="inprogress"
          action="Cancellation"
          date="28th Jul, 2025"
          description="You cancelled reservation for Mini Flat in Yaba."
          title="Cancelled booking"
        />
      </View>
    </View>
  );
};

export default ActivityHistory;
