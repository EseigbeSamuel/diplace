import { useTheme } from "@/contexts/themeContext";
import { useGetAgentHistoryActivities } from "@/hooks";
import { HistoryActivitiesResponseItem, HistoryActivityItem } from "@/types";
import { ColorScheme } from "@/utils";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

// Badge colour mapping

const BADGE_COLORS: Record<string, { color: string; bg: string }> = {
  successful: { color: "#16A34A", bg: "#D1FAE5" },
  inspected: { color: "#16A34A", bg: "#D1FAE5" },
  booked: { color: "#0F766E", bg: "#CCFBF1" },
  reserved: { color: "#2563EB", bg: "#DBEAFE" },
  inprogress: { color: "#D97706", bg: "#FEF3C7" },
  pending: { color: "#D97706", bg: "#FEF3C7" },
  failed: { color: "#DC2626", bg: "#FEE2E2" },
  cancelled: { color: "#DC2626", bg: "#FEE2E2" },
  reported: { color: "#4B5563", bg: "#F3F4F6" },
  refunded: { color: "#16A34A", bg: "#D1FAE5" },
};

const getBadgeStyle = (badge: string) =>
  BADGE_COLORS[badge.toLowerCase()] ?? { color: "#4B5563", bg: "#F3F4F6" };

// Card Component

const AgentHistoryCard = ({ item }: { item: HistoryActivityItem }) => {
  const { colors, isDarkMode } = useTheme();
  const s = styles(colors, isDarkMode);
  const { color: statusColor, bg: statusBg } = getBadgeStyle(item.badge);

  const dateText =
    item.occurred_at || item.date_created
      ? new Date(item.occurred_at || item.date_created).toLocaleDateString(
          "en-GB",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          },
        ) + (item.action ? ` • ${item.action}` : "")
      : "";

  return (
    <View style={s.card} className="flex flex-row gap-3 py-3 border-b">
      {/* Icon */}
      <View style={s.iconWrapper}>
        <Image
          source={require("@/assets/icons/Time.png")}
          style={s.iconImage}
        />
      </View>

      {/* Details */}
      <View className="flex-1">
        <View className="flex flex-row items-center justify-between gap-2 mb-1.5">
          <Text style={s.dateText}>{dateText}</Text>
          <View
            style={[
              s.statusBadge,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255, 255, 255, 0.08)"
                  : statusBg,
              },
            ]}
          >
            <Text
              style={[
                s.statusText,
                { color: isDarkMode ? colors.slate[600] : statusColor },
              ]}
            >
              {item.badge.charAt(0).toUpperCase() + item.badge.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={s.cardTitle}>{item.title}</Text>
        <Text style={s.cardDescription}>{item.description}</Text>
      </View>
    </View>
  );
};

// Main Screen

const AgentActivityHistory = () => {
  const { colors, isDarkMode } = useTheme();
  const s = styles(colors, isDarkMode);
  const { data: historyData, isLoading } = useGetAgentHistoryActivities();

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
    <ScrollView showsVerticalScrollIndicator={false}>
      {historyData.map(
        (group: HistoryActivitiesResponseItem, index: number) => (
          <View key={group.label || index} className="py-4">
            <Text style={s.groupTitle}>{group.label}</Text>
            <View className="gap-1">
              {group.items.map((item: HistoryActivityItem) => (
                <AgentHistoryCard
                  key={item.public_id || item.booking_id}
                  item={item}
                />
              ))}
            </View>
          </View>
        ),
      )}
    </ScrollView>
  );
};

export default AgentActivityHistory;

const styles = (colors: ColorScheme, isDarkMode: boolean) =>
  StyleSheet.create({
    groupTitle: {
      color: colors.slate[650],
      fontSize: RFValue(18),
      fontWeight: "bold",
      marginBottom: RFValue(8),
    },
    card: {
      borderColor: colors.slate[200],
    },
    iconWrapper: {
      width: RFValue(36),
      height: RFValue(36),
      borderRadius: RFValue(18),
      backgroundColor: colors.slate[150],
      justifyContent: "center",
      alignItems: "center",
    },
    iconImage: {
      width: 16,
      height: 16,
      tintColor: colors.slate[650],
    },
    dateText: {
      fontSize: RFValue(12.5),
      color: colors.slate[500],
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2.5,
      borderRadius: 12,
    },
    statusText: {
      fontSize: RFValue(11.5),
      fontWeight: "bold",
    },
    cardTitle: {
      fontSize: RFValue(15.5),
      fontWeight: "600",
      color: colors.slate[650],
      lineHeight: RFValue(20.5),
    },
    cardDescription: {
      fontSize: RFValue(13.5),
      color: colors.slate[600],
      lineHeight: RFValue(18.5),
      marginTop: 3,
    },
    emptyText: {
      color: colors.slate[500],
      textAlign: "center",
    },
  });
