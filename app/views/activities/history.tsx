import HistoryCard from "@/components/HistoryCard";
import { useTheme } from "@/contexts/themeContext";
import { useUser } from "@/contexts/user-context";
import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import AgentActivityHistory from "./agentHistory";
import { useGetHistoryActivities } from "@/hooks";
import { HistoryActivityItem } from "@/types";

const ActivityHistory = () => {
  const { colors } = useTheme();
  const { userType } = useUser();
  const { data: historyData, isLoading } = useGetHistoryActivities();

  if (userType !== "renter") {
    return <AgentActivityHistory />;
  }

  if (isLoading) {
    return <ActivityIndicator size="large" color={colors.slate[650]} className="mt-10" />;
  }

  if (!historyData || historyData.length === 0) {
    return (
      <View className="py-8">
        <Text style={{ color: colors.slate[500], textAlign: "center" }}>
          No activity history found.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {historyData.map((group, groupIndex) => (
        <View key={group.label || groupIndex} className="py-4">
          <Text
            style={{ color: colors.slate[650] }}
            className="font-semibold text-lg pb-2"
          >
            {group.label}
          </Text>
          {group.items.map((item: HistoryActivityItem, itemIndex) => (
            <HistoryCard
              key={item.public_id || itemIndex}
              badgeType={item.badge as "successful" | "inprogress" | "failed" | "pending"} // Need to cast depending on badge types
              action={item.action}
              date={new Date(item.occurred_at || item.date_created).toLocaleDateString()}
              description={item.description}
              title={item.title}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default ActivityHistory;
