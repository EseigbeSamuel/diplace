import HistoryCard from "@/components/HistoryCard";
import { useTheme } from "@/contexts/themeContext";
import { useUser } from "@/contexts/user-context";
import { useGetRenterHistoryActivities } from "@/hooks";
import { HistoryActivityItem } from "@/types";
import { ColorScheme } from "@/utils";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AgentActivityHistory from "./agentHistory";

const ActivityHistory = () => {
  const { colors } = useTheme();
  const s = styles(colors);
  const { userType } = useUser();
  const {
    data: historyData,
    isLoading,
    refetch,
    isRefetching,
  } = useGetRenterHistoryActivities({ enabled: userType === "renter" });

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

  const refreshControl = (
    <RefreshControl
      refreshing={isRefetching}
      onRefresh={refetch}
      tintColor={colors.slate[650]}
      colors={[colors.slate[650]]}
    />
  );

  if (!historyData || historyData.length === 0) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        <View className="py-8">
          <Text style={s.emptyText} className="text-center">No activity history found.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {historyData.map((group, groupIndex) => (
        <View key={group.label || groupIndex} className="py-4">
          <Text style={s.groupLabel} className="font-semibold text-[18px] pb-[8px]">{group.label}</Text>
          {(group.items ?? []).map((item: HistoryActivityItem, itemIndex) => {
            const rawDate = item.occurred_at || item.date_created;
            const dateText = rawDate
              ? new Date(rawDate).toLocaleDateString()
              : "";

            return (
              <HistoryCard
                key={item.public_id || itemIndex}
                badgeType={
                  item.badge as
                    | "successful"
                    | "inprogress"
                    | "failed"
                    | "pending"
                    | "reserved"
                }
                action={item.action}
                date={dateText}
                description={item.description}
                title={item.title}
              />
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

export default ActivityHistory;

// Styles

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    groupLabel: {color: colors.slate[650]},
    emptyText: {color: colors.slate[500]},
  });
