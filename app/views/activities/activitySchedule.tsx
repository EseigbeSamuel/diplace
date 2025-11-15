import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const ActivitySchedule = () => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  const handleRightIconPress = () => {
    console.log("Right icon pressed");
    // Add your custom action here
  };
  return (
    <SafeAreaViewContainer>
      <SectionHeader
        rightIconSource={require("@/assets/icons/more-2-line.png")} // Example right icon
        onRightIconPress={handleRightIconPress}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-[300px] bg-gray-500"></View>
        <View className=" bg-white rounded-t-3xl -mt-8 flex flex-col">
          <View className="pb-6 flex flex-row px-4 py-6 gap-4 ">
            <View className="w-[70%] ">
              <Text style={homeStyles.title}>2 Bedroom in-suite apartment</Text>
              <Text className="pt-2" style={homeStyles.subTitle}>
                Rumuewhera, Port Harcourt
              </Text>
            </View>
            <View>
              <AppButton title="View" onPress={() => {}} variant="secondary" />
            </View>
          </View>
          <View className="border-b border-t mx-4 flex justify-center border-gray-300 h-[100px]">
            <View className=" flex flex-row justify-between items-center">
              <View>
                <Text style={homeStyles.mediumTitle} className="pb-2">
                  Wedding & Engagement
                </Text>
                <View>
                  <View className="flex gap-2 flex-row items-center">
                    <Image
                      source={require("@/assets/icons/Calendar.png")}
                      className="w-[20px] h-[20px]"
                    />
                    <Text>Wed, 9th August, 2025</Text>
                  </View>
                </View>
                <View>
                  <View className="flex gap-2 flex-row items-center">
                    <Image
                      source={require("@/assets/icons/Time.png")}
                      className="w-[20px] h-[20px]"
                    />
                    <Text>1PM - 3PM (Afternoon slot)</Text>
                  </View>
                </View>
              </View>
              <View className="flex flex-row items-center gap-2 px-2 py-1 border border-green-500 rounded-full bg-green-400/40">
                <Image
                  source={require("@/assets/icons/badge-check-green.png")}
                  className="w-4 h-4"
                />
                <Text className="text-green-600">Inspected</Text>
              </View>
            </View>
          </View>
          <View className="flex flex-row gap-2 py-6 mx-4 justify-between ">
            <View className="flex flex-row gap-2">
              <View className="h-12 w-12 rounded-[999px] bg-gray-300"></View>
              <View className="">
                <Text>Listed by:</Text>
                <Text>
                  Ibe Alex{" "}
                  <Image
                    source={require("@/assets/icons/badge-check-green.png")}
                  />
                </Text>
              </View>
            </View>
            <View className="flex flex-row gap-3">
              <View
                className="w-14 flex items-center justify-center h-14 rounded-[999px] "
                style={homeStyles.gray300}
              >
                <Image
                  source={require("@/assets/icons/Chat - Iconly Pro.png")}
                  className="w-6 h-6"
                />
              </View>
              <View
                className="w-14 flex items-center justify-center h-14 rounded-[999px] "
                style={homeStyles.gray300}
              >
                <Image
                  source={require("@/assets/icons/calling.png")}
                  className="w-6 h-6"
                />
              </View>
            </View>
          </View>
          <View className="border-t border-b border-gray-300 ">
            <Text className="py-6 italic text-center text-gray-400">
              ⚠️ Heads up! The price you see is for the space only. Agent fees
              and other charges may apply.
            </Text>
          </View>
          <View className="py-6 border-b border-gray-300">
            <View className="flex flex-row justify-between">
              <Text style={homeStyles.subTitle}>Initial deposit:</Text>
              <Text className="font-semibold">₦251,200.00</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="" style={homeStyles.subTitle}>
                Balance due:
              </Text>
              <Text className="text-[#EF4444]">Thu. 10th Aug, 2025</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="py-[18.5px] h-[88px] flex flex-row justify-between">
        <View>
          <Text style={homeStyles.subTitle}>Balance</Text>
          <Text style={homeStyles.title}>
            ₦600,000
            <Text style={homeStyles.subTitle}>/annum</Text>
          </Text>
        </View>
        <View>
          <AppButton
            title="Book Now"
            onPress={() => {
              router.push("/views/activities/payBalance");
            }}
          />
        </View>
      </View>
    </SafeAreaViewContainer>
  );
};

export default ActivitySchedule;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    border: {
      borderColor: colors.slate[300],
    },
    title: {
      fontSize: RFValue(24),
      lineHeight: RFValue(24),
    },
    mediumTitle: {
      fontSize: RFValue(16),
      lineHeight: RFValue(24),
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    graybg: {
      backgroundColor: colors.slate[150],
    },
    gray300: {
      backgroundColor: colors.slate[300],
    },
  });
