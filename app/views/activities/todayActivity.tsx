import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View, Pressable } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface ActivityCardItem {
  id: string;
  category: string;
  dateText: string;
  title: string;
  location: string;
  statusText?: string;
  statusType?: "scheduled" | "reserved" | "booked";
  user: {
    name: string;
    avatar: any;
    verified: boolean;
  };
}

const todayActivities: ActivityCardItem[] = [
  {
    id: "1",
    category: "Space Inspection",
    dateText: "16 Sept, 2025",
    title: "2 Bedroom in-suite apartment",
    location: "10 Tenable Str, D&D Phase II, Port Harcourt",
    statusText: "Scheduled",
    statusType: "scheduled",
    user: {
      name: "Sammy Kalu",
      avatar: require("@/assets/images/sammy.jpg"),
      verified: true,
    },
  },
  {
    id: "2",
    category: "Reservation Due",
    dateText: "18 Aug - 20 Aug, 2025 (10 Hours)",
    title: "Atraz Palace Event Hall",
    location: "10 Tenable Str, D&D Phase II, Port Harcourt",
    statusType: "reserved",
    user: {
      name: "Sammy Kalu",
      avatar: require("@/assets/images/sammy.jpg"),
      verified: true,
    },
  },
  {
    id: "3",
    category: "Wedding & Engagement",
    dateText: "18 Aug - 20 Aug, 2025 (10 Hours)",
    title: "Atraz Palace Event Hall",
    location: "10 Tenable Str, D&D Phase II, Port Harcourt",
    statusType: "booked",
    user: {
      name: "Sammy Kalu",
      avatar: require("@/assets/images/sammy.jpg"),
      verified: true,
    },
  },
];

const TodayActivityCard = ({ item }: { item: ActivityCardItem }) => {
  const { colors, isDarkMode } = useTheme();

  const handlePress = () => {
    router.push({
      pathname: "/views/activities/activity-schedule/[index]",
      params: {
        index: item.id,
        status: item.statusType || "scheduled",
        title: item.title,
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
          {item.category}
        </Text>
        <Text style={{ color: colors.slate[500], fontSize: RFValue(13) }}>
          {item.dateText}
        </Text>
      </View>

      {/* Middle Content Row */}
      <View className="flex flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-2">
          <Text
            style={{ color: colors.slate[650], fontSize: RFValue(16) }}
            className="font-bold"
          >
            {item.title}
          </Text>
          <Text
            style={{ color: colors.slate[550], fontSize: RFValue(13.5), marginTop: 2 }}
            className="font-medium"
            numberOfLines={1}
          >
            📍 {item.location}
          </Text>
        </View>

        {/* Right Pill/Badge or Arrow */}
        {item.statusText ? (
          <View className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <Text className="text-blue-600 font-bold text-[9px]">{item.statusText}</Text>
          </View>
        ) : (
          <Image
            source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
            style={{ width: 14, height: 14, tintColor: colors.slate[550] }}
          />
        )}
      </View>

      {/* Bottom Separator */}
      <View style={{ borderTopWidth: 1, borderColor: colors.slate[200], borderStyle: "dashed" }} className="pt-3 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Image
            source={item.user.avatar}
            style={{ width: RFValue(20), height: RFValue(20), borderRadius: RFValue(10) }}
          />
          <Text
            style={{ color: colors.slate[650], fontSize: RFValue(14) }}
            className="font-semibold flex-row items-center"
          >
            {item.user.name}{" "}
            {item.user.verified && (
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
  return (
    <SafeAreaViewContainer disableBottom>
      <SectionHeader
        title="Today's Activity"
        rightIconSource={require("@/assets/icons/plus.png")}
      />

      {/* Main List */}
      <ScrollView className="px-4 flex-1 pt-2" showsVerticalScrollIndicator={false}>
        <View className="pb-10">
          {todayActivities.map((activity) => (
            <TodayActivityCard key={activity.id} item={activity} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default TodayActivityScreen;
