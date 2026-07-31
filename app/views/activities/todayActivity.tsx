import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useGetTodayActivities } from "@/hooks";
import { TodayActivityItem } from "@/types";

const TodayActivityCard = ({ item }: { item: TodayActivityItem }) => {
  const { colors, isDarkMode } = useTheme();

  const handlePress = () => {
    router.push({
      pathname: "/views/activities/activity-schedule/[index]",
      params: {
        index: item.booking_id || item.inspection_id,
        status: "scheduled", // TODO: Update based on real status if needed from API
        title: item.property.title,
        role: "renter",
      },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        backgroundColor: isDarkMode ? colors.slate[100] : "#FFFFFF",
        borderColor: colors.slate[250],
        borderWidth: 1,
        borderRadius: RFValue(12),
      }}
      className="p-4 mb-4"
    >
      {/* Top Header Row */}
      <View className="flex flex-row items-center justify-between mb-2">
        <Text style={{ color: colors.slate[500], fontSize: RFValue(13) }} className="font-bold uppercase">
          {item.activity_type}
        </Text>
        <Text style={{ color: colors.slate[500], fontSize: RFValue(13) }}>
          {item.time_label}
        </Text>
      </View>

      {/* Middle Content Row */}
      <View className="flex flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-2">
          <Text
            style={{ color: colors.slate[650], fontSize: RFValue(16) }}
            className="font-bold"
          >
            {item.property.title}
          </Text>
          <Text
            style={{ color: colors.slate[550], fontSize: RFValue(13.5), marginTop: 2 }}
            className="font-medium"
            numberOfLines={1}
          >
            📍 {item.property.location}
          </Text>
        </View>

        {/* Right Pill/Badge or Arrow */}
        {/* We can map activity_type to a status tag if necessary, else show arrow */}
        <Image
          source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
          style={{ width: 14, height: 14, tintColor: colors.slate[550] }}
        />
      </View>

      {/* Bottom Separator */}
      <View style={{ borderTopWidth: 1, borderColor: colors.slate[200], borderStyle: "dashed" }} className="pt-3 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Image
            source={{ uri: item.actor.profile_picture || "https://ui-avatars.com/api/?name=" + item.actor.first_name }}
            style={{ width: RFValue(20), height: RFValue(20), borderRadius: RFValue(10) }}
          />
          <Text
            style={{ color: colors.slate[650], fontSize: RFValue(14) }}
            className="font-semibold flex-row items-center"
          >
            {item.actor.first_name} {item.actor.last_name}{" "}
            {item.actor.status === "verified" && (
              <Image
                source={require("@/assets/icons/badge-check-green.png")}
                style={{ width: 12, height: 12 }}
              />
            )}
          </Text>
        </View>

        <View className="flex flex-row gap-3">
          <Pressable>
            <Image
              source={require("@/assets/icons/Chat - Iconly Pro.png")}
              style={{ width: 16, height: 16, tintColor: colors.slate[550] }}
            />
          </Pressable>
          <Pressable>
            <Image
              source={require("@/assets/icons/calling.png")}
              style={{ width: 16, height: 16, tintColor: colors.slate[550] }}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const TodayActivityScreen = () => {
  const { data: todayActivities, isLoading } = useGetTodayActivities();
  const { colors } = useTheme();

  return (
    <SafeAreaViewContainer disableBottom>
      <SectionHeader
        title="Today's Activity"
        rightIconSource={require("@/assets/icons/plus.png")}
      />

      {/* Main List */}
      <ScrollView className="px-4 flex-1 pt-2" showsVerticalScrollIndicator={false}>
        <View className="pb-10">
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.slate[650]} className="mt-10" />
          ) : todayActivities && todayActivities.length > 0 ? (
            todayActivities.map((activity, index) => (
              <TodayActivityCard key={activity.booking_id || activity.inspection_id || index} item={activity} />
            ))
          ) : (
            <Text style={{ color: colors.slate[500], textAlign: "center", marginTop: 20 }}>
              No activities for today.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default TodayActivityScreen;
