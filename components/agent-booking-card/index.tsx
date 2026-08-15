import { useTheme } from "@/contexts/themeContext";
import { ActiveActivityItem } from "@/types";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

// ─── Card Component ──────────────────────────────────────────────────────────

export const AgentBookingCard = ({
  item,
  onPress,
}: {
  item: ActiveActivityItem;
  onPress?: () => void;
}) => {
  const { colors, isDarkMode } = useTheme();
  const s = styles(colors, isDarkMode);

  const date = item.due_date ? new Date(item.due_date) : null;
  const month = date ? date.toLocaleString("default", { month: "short" }) : "—";
  const day = date ? String(date.getDate()).padStart(2, "0") : "—";
  const dueText = item.due_date
    ? `Due: ${new Date(item.due_date).toLocaleDateString()}`
    : undefined;

  return (
    <Pressable
      onPress={onPress}
      className="flex flex-row items-center gap-4 py-3"
    >
      {/* Left Column: Date Badge */}
      <View style={s.dateBadge}>
        <Text style={s.month}>{month}</Text>
        <Text style={s.day}>{day}</Text>
      </View>

      {/* Center Column: Text Details */}
      <View className="flex-1 justify-center">
        {dueText && <Text style={s.dueText}>{dueText}</Text>}
        <Text style={s.cardTitle} numberOfLines={1}>
          {item.property.title}
        </Text>
        <Text style={s.cardLocation} numberOfLines={1}>
          {item.property.location}
        </Text>
      </View>

      {/* Right Column: Badge & Arrow */}
      <View className="flex flex-row items-center gap-2">
        {item.is_new && (
          <View style={s.newBadge}>
            <Text style={s.newBadgeText}>NEW</Text>
          </View>
        )}
        <Image
          source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
          className="w-4 h-4"
          style={s.arrowTint}
        />
      </View>
    </Pressable>
  );
};

const styles = (colors: ColorScheme, isDarkMode: boolean) =>
  StyleSheet.create({
    // Date badge
    dateBadge: {
      width: RFValue(44),
      height: RFValue(46),
      borderRadius: RFValue(10),
      borderWidth: 1,
      borderColor: colors.slate[300],
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDarkMode ? colors.slate[100] : "#FFFFFF",
    },
    month: {
      fontSize: RFValue(11),
      color: colors.slate[500],
      textTransform: "uppercase",
      fontWeight: "600",
    },
    day: {
      fontSize: RFValue(16.5),
      fontWeight: "bold",
      color: colors.slate[650],
      marginTop: -2,
    },
    dueText: {
      fontSize: RFValue(12),
      color: colors.slate[500],
      marginBottom: 1,
      fontWeight: "500",
    },
    cardTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    cardLocation: {
      fontSize: RFValue(13.5),
      color: colors.slate[500],
      marginTop: 1,
    },
    // NEW badge
    newBadge: {
      backgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 20,
    },
    newBadgeText: {
      color: "#EF4444",
      fontSize: RFValue(10.5),
      fontWeight: "bold",
    },
    arrowTint: {
      tintColor: colors.slate[550],
    },
    // Section
    sectionTitle: {
      color: colors.slate[650],
      fontSize: RFValue(18),
      fontWeight: "700",
      marginBottom: RFValue(8),
    },
    // Today card
    todayCard: {
      borderColor: colors.slate[250],
      backgroundColor: isDarkMode ? colors.slate[100] : colors.slate[150],
      borderWidth: 1,
    },
    calendarTint: {
      tintColor: colors.slate[650],
    },
    todayTitle: {
      color: colors.slate[650],
      fontSize: RFValue(16),
      fontWeight: "bold",
    },
    todayBody: {
      color: colors.slate[600],
      fontSize: RFValue(14),
      lineHeight: RFValue(19),
      fontWeight: "500",
    },
    todayFooter: {
      borderColor: colors.slate[250],
    },
    withLabel: {
      fontSize: RFValue(13),
      color: colors.slate[550],
    },
    avatarFirst: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 1.5,
      borderColor: isDarkMode ? colors.slate[100] : colors.slate[150],
    },
    avatarSecond: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 1.5,
      borderColor: isDarkMode ? colors.slate[100] : colors.slate[150],
      marginLeft: -RFValue(6),
    },
    avatarExtra: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      backgroundColor: colors.slate[250],
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: isDarkMode ? colors.slate[100] : colors.slate[150],
      marginLeft: -RFValue(6),
    },
    avatarExtraText: {
      fontSize: RFValue(9.5),
      color: colors.slate[550],
      fontWeight: "bold",
    },
    viewScheduleText: {
      color: colors.slate[650],
      fontSize: RFValue(14),
      fontWeight: "600",
    },
    emptyText: {
      color: colors.slate[550],
      fontSize: RFValue(13),
      textAlign: "center",
      marginTop: 20,
    },
  });
