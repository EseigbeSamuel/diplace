import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useGetRenterTodayActivities } from "@/hooks";
import { TodayActivityItem } from "@/types";
import { ColorScheme } from "@/utils";

// ─── Card ─────────────────────────────────────────────────────────────────────

const TodayActivityCard = ({ item }: { item: TodayActivityItem }) => {
  const { colors, isDarkMode } = useTheme();
  const s = styles(colors, isDarkMode);

  const handlePress = () => {
    router.push({
      pathname: "/views/activities/activity-schedule/[index]",
      params: {
        index: item.booking_id || item.inspection_id,
        status: "scheduled",
        title: item.property.title,
        role: "renter",
      },
    });
  };

  return (
    <Pressable onPress={handlePress} style={s.card} className="p-4 mb-4">
      {/* Top Header Row */}
      <View className="flex flex-row items-center justify-between mb-2">
        <Text style={s.activityType}>{item.activity_type}</Text>
        <Text style={s.timeLabel}>{item.time_label}</Text>
      </View>

      {/* Middle Content Row */}
      <View className="flex flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-2">
          <Text style={s.propertyTitle}>{item.property.title}</Text>
          <Text style={s.propertyLocation} numberOfLines={1}>
            📍 {item.property.location}
          </Text>
        </View>
        <Image
          source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
          style={s.arrowIcon}
        />
      </View>

      {/* Bottom Row */}
      <View style={s.footerDivider} className="pt-3 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Image
            source={{
              uri:
                item.actor.profile_picture ||
                "https://ui-avatars.com/api/?name=" + item.actor.first_name,
            }}
            style={s.avatar}
          />
          <Text style={s.actorName}>
            {item.actor.first_name} {item.actor.last_name}{" "}
            {item.actor.status === "verified" && (
              <Image
                source={require("@/assets/icons/badge-check-green.png")}
                style={s.verifiedBadge}
              />
            )}
          </Text>
        </View>

        <View className="flex flex-row gap-3">
          <Pressable>
            <Image
              source={require("@/assets/icons/Chat - Iconly Pro.png")}
              style={s.actionIcon}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require("@/assets/icons/calling.png")}
              style={s.actionIcon}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

const TodayActivityScreen = () => {
  const { data: todayActivities, isLoading } = useGetRenterTodayActivities();
  const { colors, isDarkMode } = useTheme();
  const s = styles(colors, isDarkMode);

  return (
    <SafeAreaViewContainer disableBottom>
      <SectionHeader
        title="Today's Activity"
        rightIconSource={require("@/assets/icons/plus.png")}
      />
      <ScrollView className="px-4 flex-1 pt-2" showsVerticalScrollIndicator={false}>
        <View className="pb-10">
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.slate[650]} className="mt-10" />
          ) : todayActivities && todayActivities.length > 0 ? (
            todayActivities.map((activity, index) => (
              <TodayActivityCard
                key={activity.booking_id || activity.inspection_id || index}
                item={activity}
              />
            ))
          ) : (
            <Text style={s.emptyText}>No activities for today.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default TodayActivityScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = (colors: ColorScheme, isDarkMode: boolean) =>
  StyleSheet.create({
    card: {
      backgroundColor: isDarkMode ? colors.slate[100] : "#FFFFFF",
      borderColor: colors.slate[250],
      borderWidth: 1,
      borderRadius: RFValue(12),
    },
    activityType: {
      color: colors.slate[500],
      fontSize: RFValue(13),
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    timeLabel: {
      color: colors.slate[500],
      fontSize: RFValue(13),
    },
    propertyTitle: {
      color: colors.slate[650],
      fontSize: RFValue(16),
      fontWeight: "bold",
    },
    propertyLocation: {
      color: colors.slate[550],
      fontSize: RFValue(13.5),
      fontWeight: "500",
      marginTop: 2,
    },
    arrowIcon: {
      width: 14,
      height: 14,
      tintColor: colors.slate[550],
    },
    footerDivider: {
      borderTopWidth: 1,
      borderColor: colors.slate[200],
      borderStyle: "dashed",
    },
    avatar: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
    },
    actorName: {
      color: colors.slate[650],
      fontSize: RFValue(14),
      fontWeight: "600",
    },
    verifiedBadge: {
      width: 12,
      height: 12,
    },
    actionIcon: {
      width: 16,
      height: 16,
      tintColor: colors.slate[550],
    },
    emptyText: {
      color: colors.slate[500],
      textAlign: "center",
      marginTop: 20,
    },
  });
