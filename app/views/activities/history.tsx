import HistoryCard from "@/components/HistoryCard";
import { useTheme } from "@/contexts/themeContext";
import { useUser } from "@/contexts/user-context";
import { useGetRenterHistoryActivities } from "@/hooks";
import { HistoryActivityItem } from "@/types";
import { ColorScheme } from "@/utils";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AgentActivityHistory from "./agentHistory";

const ActivityHistory = () => {
  const { colors } = useTheme();
  const s = styles(colors);
  const { userType } = useUser();
  const { data: historyData, isLoading } = useGetRenterHistoryActivities();

  if (userType !== "renter") {
    return <AgentActivityHistory />;
  }

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.slate[650]}
        className="mt-10"
      />
    );
  }

  if (!historyData || historyData.length === 0) {
    return (
      <View className="py-8">
        <Text style={s.emptyText}>No activity history found.</Text>
      </View>
    );
  }

  return (
    <View>
      {historyData.map((group, groupIndex) => (
        <View key={group.label || groupIndex} className="py-4">
          <Text style={s.groupLabel}>{group.label}</Text>
          {group.items.map((item: HistoryActivityItem, itemIndex) => (
            <HistoryCard
              key={item.public_id || itemIndex}
              badgeType={
                item.badge as "successful" | "inprogress" | "failed" | "pending"
              }
              action={item.action}
              date={new Date(
                item.occurred_at || item.date_created,
              ).toLocaleDateString()}
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

// Styles

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    groupLabel: {
      color: colors.slate[650],
      fontWeight: "600",
      fontSize: 18,
      paddingBottom: 8,
    },
    emptyText: {
      color: colors.slate[500],
      textAlign: "center",
    },
  });
