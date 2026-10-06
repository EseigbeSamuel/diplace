import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { useUser } from "@/contexts/user-context";
import { useGetRenterTodayActivities, useGetTodayActivities } from "@/hooks";
import { TodayActivityItem } from "@/types";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

// ─── Card ─────────────────────────────────────────────────────────────────────

const TodayActivityCard = ({
  item,
  userRole,
}: {
  item: TodayActivityItem;
  userRole: "renter" | "agent";
}) => {
  const { colors, isDarkMode } = useTheme();
  const s = styles(colors, isDarkMode);

  const isInspection =
    item.activity_type?.toLowerCase().includes("inspection") ||
    !item.booking_id;
  const activityId = isInspection
    ? item.inspection_id || item.booking_id
    : item.booking_id || item.inspection_id;

  const handlePress = () => {
    router.push({
      pathname: "/views/activities/activity-schedule/[index]",
      params: {
        index: activityId,
        status: isInspection ? "scheduled" : "booked",
        title: item.property.title,
        role: userRole,
      },
    });
  };

  return (
    <Pressable onPress={handlePress} style={s.card} className="p-4 mb-4 border-[1px]">
      {/* Top Header Row */}
      <View className="flex flex-row items-center justify-between mb-2">
        <Text style={s.activityType} className="font-bold uppercase">{item.activity_type}</Text>
        <Text style={s.timeLabel}>{item.time_label}</Text>
      </View>

      {/* Middle Content Row */}
      <View className="flex flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-2">
          <Text style={s.propertyTitle} className="font-bold">{item.property.title}</Text>
          <Text style={s.propertyLocation} numberOfLines={1} className="font-medium mt-[2px]">
            📍 {item.property.location}
          </Text>
        </View>
        <Image
          source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
          style={s.arrowIcon}
         className="w-[14px] h-[14px]"/>
      </View>

      {/* Bottom Row */}
      <View
        style={s.footerDivider}
        className="pt-3 flex flex-row items-center justify-between border-dashed border-t"
      >
        <View className="flex flex-row items-center gap-2">
          <Image
            source={{
              uri:
                item.actor.profile_picture ||
                "https://ui-avatars.com/api/?name=" + item.actor.first_name,
            }}
            style={s.avatar}
          />
          <Text style={s.actorName} className="font-semibold">
            {item.actor.first_name} {item.actor.last_name}{" "}
            {item.actor.status === "verified" && (
              <Image
                source={require("@/assets/icons/badge-check-green.png")}
                style={s.verifiedBadge}
               className="w-[12px] h-[12px]"/>
            )}
          </Text>
        </View>

        <View className="flex flex-row gap-3">
          <Pressable>
            <Image
              source={require("@/assets/icons/Chat - Iconly Pro.png")}
              style={s.actionIcon}
             className="w-[16px] h-[16px]"/>
          </Pressable>
          <Pressable>
            <Image
              source={require("@/assets/icons/calling.png")}
              style={s.actionIcon}
             className="w-[16px] h-[16px]"/>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

const TodayActivityScreen = () => {
  const { userType } = useUser();
  const isRenter = userType === "renter";

  const renterQuery = useGetRenterTodayActivities({ enabled: isRenter });
  const agentQuery = useGetTodayActivities({ enabled: !isRenter });

  const {
    data: todayActivities,
    isLoading,
    refetch,
    isRefetching,
  } = isRenter ? renterQuery : agentQuery;

  const { colors, isDarkMode } = useTheme();
  const s = styles(colors, isDarkMode);

  return (
    <SafeAreaViewContainer disableBottom>
      <SectionHeader
        title="Today's Activity"
        rightIconSource={require("@/assets/icons/plus.png")}
      />
      <ScrollView
        className="px-4 flex-1 pt-2"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.slate[650]}
            colors={[colors.slate[650]]}
          />
        }
      >
        <View className="pb-10">
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.slate[650]}
              className="mt-10"
            />
          ) : todayActivities && todayActivities.length > 0 ? (
            todayActivities.map((activity, index) => (
              <TodayActivityCard
                key={activity.booking_id || activity.inspection_id || index}
                item={activity}
                userRole={isRenter ? "renter" : "agent"}
              />
            ))
          ) : (
            <Text style={s.emptyText} className="text-center mt-[20px]">No activities for today.</Text>
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

      borderRadius: RFValue(12),
    },
    activityType: {color: colors.slate[500],
fontSize: RFValue(13)},
    timeLabel: {
      color: colors.slate[500],
      fontSize: RFValue(13),
    },
    propertyTitle: {
      color: colors.slate[650],
      fontSize: RFValue(16),

    },
    propertyLocation: {
      color: colors.slate[550],
      fontSize: RFValue(13.5),


    },
    arrowIcon: {


      tintColor: colors.slate[550],
    },
    footerDivider: {borderColor: colors.slate[200]},
    avatar: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
    },
    actorName: {
      color: colors.slate[650],
      fontSize: RFValue(14),

    },
    verifiedBadge: {


    },
    actionIcon: {


      tintColor: colors.slate[550],
    },
    emptyText: {
      color: colors.slate[500],


    },
  });
