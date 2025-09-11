import ActiveActivityCard from "@/components/ActiveActivityCard";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

const ActiveActivity = () => {
  return (
    <ScrollView>
      <View className="bg-[#F9F9FB] rounded-lg flex flex-row gap-4 p-4">
        <View>
          <Image
            source={require("@/assets/icons/Calendar-fill.png")}
            className="w-9 h-9"
          />
        </View>
        <View>
          <Text className="font-semibold text-lg">Today’s Activity</Text>
          <Text className="break-words w-[80%] text-[#60646C]">
            You have an inspection scheduled between 10AM - 12PM.
          </Text>
          <View className="flex flex-row gap-2 items-center">
            <Text className="pt-7">View schedule</Text>
            {/* <Image
              source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
              className="w-5 h-5"
            /> */}
          </View>
        </View>
      </View>
      <View className="p-4 border-b border-gray-300">
        <Text className="text-lg font-semibold pb-4">Scheduled</Text>
        <ActiveActivityCard
          buttonTitle="View"
          date="9th Aug, 2025 | 10AM - 12PM"
          title="2 Bedroom in-suite apartment"
          image={require("@/assets/icons/Calendar.png")}
          location="Rumuewhera, Port Harcourt"
        />
        <ActiveActivityCard
          buttonTitle="View"
          date="9th Aug, 2025 | 10AM - 12PM"
          title="2 Bedroom in-suite apartment"
          image={require("@/assets/icons/Calendar.png")}
          location="Rumuewhera, Port Harcourt"
        />
        <ActiveActivityCard
          buttonTitle="View"
          date="9th Aug, 2025 | 10AM - 12PM"
          title="2 Bedroom in-suite apartment"
          image={require("@/assets/icons/Calendar.png")}
          location="Rumuewhera, Port Harcourt"
        />
        <ActiveActivityCard
          buttonTitle="View"
          date="9th Aug, 2025 | 10AM - 12PM"
          title="2 Bedroom in-suite apartment"
          image={require("@/assets/icons/Calendar.png")}
          location="Rumuewhera, Port Harcourt"
        />
        <ActiveActivityCard
          buttonTitle="View"
          date="9th Aug, 2025 | 10AM - 12PM"
          title="2 Bedroom in-suite apartment"
          image={require("@/assets/icons/Calendar.png")}
          location="Rumuewhera, Port Harcourt"
        />
        <ActiveActivityCard
          buttonTitle="View"
          date="9th Aug, 2025 | 10AM - 12PM"
          title="2 Bedroom in-suite apartment"
          image={require("@/assets/icons/Calendar.png")}
          location="Rumuewhera, Port Harcourt"
        />
        <ActiveActivityCard
          buttonTitle="View"
          date="9th Aug, 2025 | 10AM - 12PM"
          title="2 Bedroom in-suite apartment"
          image={require("@/assets/icons/Calendar.png")}
          location="Rumuewhera, Port Harcourt"
        />
        <ActiveActivityCard
          buttonTitle="View"
          date="9th Aug, 2025 | 10AM - 12PM"
          title="2 Bedroom in-suite apartment"
          image={require("@/assets/icons/Calendar.png")}
          location="Rumuewhera, Port Harcourt"
        />
        <ActiveActivityCard
          buttonTitle="View"
          date="9th Aug, 2025 | 10AM - 12PM"
          title="2 Bedroom in-suite apartment"
          image={require("@/assets/icons/Calendar.png")}
          location="Rumuewhera, Port Harcourt"
        />
      </View>
      <View className="p-4 border-b border-gray-300">
        <Text className="text-lg font-semibold pb-4">Reserved</Text>
        <ActiveActivityCard
          buttonTitle="View"
          date="Due: 10th Aug, 2025"
          title="Atraz Palace Event Hall"
          image={require("@/assets/icons/Lock.png")}
          location="GRA Phase II, Port Harcourt"
        />
      </View>
      <View className="p-4 border-b border-gray-300">
        <Text className="text-lg font-semibold pb-4">Inspected</Text>
        <ActiveActivityCard
          buttonTitle="Book"
          title="2 Bedroom in-suite apartment"
          image={require("@/assets/icons/Lock.png")}
          location="GRA Phase II, Port Harcourt"
        />
      </View>
    </ScrollView>
  );
};

export default ActiveActivity;
