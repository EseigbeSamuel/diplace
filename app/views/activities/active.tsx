import ActiveActivityCard from "@/components/ActiveActivityCard";
import { useTheme } from "@/contexts/themeContext";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

const ActiveActivity = () => {
  const { colors, isDarkMode } = useTheme();
  return (
    <ScrollView>
      <View
        style={{
          borderColor: colors.slate[300],
          backgroundColor: colors.slate[150],
        }}
        className="flex flex-row gap-4 p-4 border rounded-lg"
      >
        <Image
          source={require("@/assets/icons/calender-dark.png")}
          className="w-9 h-9"
        />
        <View>
          <Text
            style={{ color: colors.slate[650] }}
            className="text-lg font-semibold"
          >
            Today’s Activity
          </Text>
          <Text
            style={{ color: colors.slate[650] }}
            className="break-words w-[80%] font-medium"
          >
            You have an inspection scheduled between 10AM - 12PM.
          </Text>
          <View className="flex flex-row items-center gap-2">
            <Text style={{ color: colors.slate[650] }} className="pt-7">
              View schedule
            </Text>
            {/* <Image
              source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
              className="w-5 h-5"
            /> */}
          </View>
        </View>
      </View>
      <View className="p-4 border-b border-gray-300">
        <Text
          style={{ color: colors.slate[650] }}
          className="pb-4 text-lg font-semibold"
        >
          Scheduled
        </Text>
        <View className="gap-4">
          <ActiveActivityCard
            buttonTitle="View"
            date="9th Aug, 2025 | 10AM - 12PM"
            title="2 Bedroom in-suite apartment"
            image={
              isDarkMode
                ? require("@/assets/icons/calender-white.png")
                : require("@/assets/icons/calendar.png")
            }
            location="Rumuewhera, Port Harcourt"
          />
          <ActiveActivityCard
            buttonTitle="View"
            date="9th Aug, 2025 | 10AM - 12PM"
            title="2 Bedroom in-suite apartment"
            image={
              isDarkMode
                ? require("@/assets/icons/calender-white.png")
                : require("@/assets/icons/calendar.png")
            }
            location="Rumuewhera, Port Harcourt"
          />
          <ActiveActivityCard
            buttonTitle="View"
            date="9th Aug, 2025 | 10AM - 12PM"
            title="2 Bedroom in-suite apartment"
            image={
              isDarkMode
                ? require("@/assets/icons/calender-white.png")
                : require("@/assets/icons/calendar.png")
            }
            location="Rumuewhera, Port Harcourt"
          />
        </View>
      </View>
      <View className="p-4 border-b border-gray-300">
        <Text
          style={{ color: colors.slate[650] }}
          className="pb-4 text-lg font-semibold"
        >
          Reserved
        </Text>
        <ActiveActivityCard
          buttonTitle="View"
          date="Due: 10th Aug, 2025"
          title="Atraz Palace Event Hall"
          image={
            isDarkMode
              ? require("@/assets/icons/lock-light.png")
              : require("@/assets/icons/Lock.png")
          }
          location="GRA Phase II, Port Harcourt"
        />
      </View>
      <View className="p-4 border-b border-gray-300">
        <Text
          style={{ color: colors.slate[650] }}
          className="pb-4 text-lg font-semibold"
        >
          Inspected
        </Text>
        <ActiveActivityCard
          buttonTitle="Book"
          title="2 Bedroom in-suite apartment"
          image={
            isDarkMode
              ? require("@/assets/icons/lock-light.png")
              : require("@/assets/icons/Lock.png")
          }
          location="GRA Phase II, Port Harcourt"
        />
      </View>
    </ScrollView>
  );
};

export default ActiveActivity;
