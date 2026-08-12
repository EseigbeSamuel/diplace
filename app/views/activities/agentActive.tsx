import { useTheme } from "@/contexts/themeContext";
import { useGetAgentActiveActivities, useGetTodayActivities } from "@/hooks";
import { ActiveActivityItem } from "@/types";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

// ─── Card Component ──────────────────────────────────────────────────────────

const AgentBookingCard = ({
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

// ─── Main Screen ─────────────────────────────────────────────────────────────

const AgentActiveActivity = () => {
  const { colors, isDarkMode } = useTheme();
  const s = styles(colors, isDarkMode);
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  const { data: activityData, isLoading } = useGetAgentActiveActivities();
  const { data: todayData } = useGetTodayActivities();

  const todayCount = todayData?.length ?? 0;

  const filterTabs = [
    { id: "all", name: "All" },
    { id: "scheduled", name: "Scheduled" },
    { id: "reserved", name: "Reserved" },
    { id: "booked", name: "Booked" },
    { id: "inspected", name: "Inspected" },
    { id: "cancelled", name: "Cancelled" },
  ];

  const scheduledList = useMemo(
    () => activityData?.scheduled ?? [],
    [activityData],
  );
  const reservedList = useMemo(
    () => activityData?.reserved ?? [],
    [activityData],
  );
  const bookedList = useMemo(() => activityData?.booked ?? [], [activityData]);
  const inspectedList = useMemo(
    () => activityData?.inspected ?? [],
    [activityData],
  );

  const handleCardPress = (item: ActiveActivityItem) => {
    router.push({
      pathname: "/views/activities/activity-schedule/[index]",
      params: {
        index: item.booking_id || item.inspection_id,
        status: item.category,
        title: item.property.title,
        role: "agent",
      },
    });
  };

  const renderSection = (title: string, list: ActiveActivityItem[]) => {
    if (list.length === 0) return null;
    return (
      <View className="mb-6">
        <Text style={s.sectionTitle}>{title}</Text>
        <View className="gap-1.5">
          {list.map((item) => (
            <AgentBookingCard
              key={item.booking_id || item.inspection_id}
              item={item}
              onPress={() => handleCardPress(item)}
            />
          ))}
        </View>
      </View>
    );
  };

  const hasNoData =
    !scheduledList.length &&
    !reservedList.length &&
    !bookedList.length &&
    !inspectedList.length;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Horizontal Filter Tabs */}
      <View className="my-4">
        <FlatList
          data={filterTabs}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: RFValue(8) }}
          renderItem={({ item }) => {
            const isActive = activeFilter === item.id;
            return (
              <Pressable onPress={() => setActiveFilter(item.id)}>
                <View
                  style={{
                    borderColor: isActive
                      ? colors.slate[650]
                      : colors.slate[300],
                    backgroundColor: isActive
                      ? colors.slate[150]
                      : "transparent",
                  }}
                  className="rounded-full py-1.5 px-3.5 border flex-row items-center gap-1.5"
                >
                  <Text
                    style={{
                      color: isActive ? colors.slate[650] : colors.slate[550],
                      fontSize: RFValue(11.5),
                      fontWeight: isActive ? "600" : "500",
                    }}
                  >
                    {item.name}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Loading state */}
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={colors.slate[650]}
          className="mt-10"
        />
      )}

      {/* Today's Activity Card — only in "All" view */}
      {!isLoading && activeFilter === "all" && (
        <View
          style={s.todayCard}
          className="flex flex-col gap-3 p-4 rounded-2xl mb-6"
        >
          <View className="flex flex-row gap-4 items-start">
            <Image
              source={require("@/assets/icons/calender-dark.png")}
              className="w-9 h-9"
              style={s.calendarTint}
            />
            <View className="flex-1 gap-1">
              <Text style={s.todayTitle}>Today's Activity</Text>
              <Text style={s.todayBody}>
                You have {todayCount} activit{todayCount === 1 ? "y" : "ies"}{" "}
                lined up for you today. Check them out now.
              </Text>
            </View>
          </View>

          <View
            style={s.todayFooter}
            className="flex flex-row items-center justify-between mt-1 pt-2 border-t border-dashed"
          >
            <View className="flex flex-row items-center gap-1.5">
              <Text style={s.withLabel}>With:</Text>
              <View className="flex flex-row items-center">
                <Image
                  source={require("@/assets/images/sammy.jpg")}
                  style={s.avatarFirst}
                />
                <Image
                  source={require("@/assets/images/user.png")}
                  style={s.avatarSecond}
                />
                <View style={s.avatarExtra}>
                  <Text style={s.avatarExtraText}>+2</Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => router.push("/views/activities/todayActivity")}
              className="flex flex-row items-center gap-1"
            >
              <Text style={s.viewScheduleText}>View schedule</Text>
              <Image
                source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
                className="w-3.5 h-3.5"
                style={s.calendarTint}
              />
            </Pressable>
          </View>
        </View>
      )}

      {/* Lists based on filter */}
      {!isLoading && activeFilter === "all" && (
        <View>
          {renderSection("Scheduled", scheduledList)}
          {renderSection("Reserved", reservedList)}
          {renderSection("Booked", bookedList)}
          {renderSection("Inspected", inspectedList)}
          {hasNoData && (
            <Text style={s.emptyText}>No active activities found.</Text>
          )}
        </View>
      )}

      {!isLoading &&
        activeFilter === "scheduled" &&
        renderSection("Scheduled", scheduledList)}
      {!isLoading &&
        activeFilter === "reserved" &&
        renderSection("Reserved", reservedList)}
      {!isLoading &&
        activeFilter === "booked" &&
        renderSection("Booked", bookedList)}
      {!isLoading &&
        activeFilter === "inspected" &&
        renderSection("Inspected", inspectedList)}

      {!isLoading && activeFilter === "cancelled" && (
        <View className="py-10 items-center justify-center">
          <Text style={s.emptyText}>No cancelled bookings found.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AgentActiveActivity;

// ─── Styles ───────────────────────────────────────────────────────────────────

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
