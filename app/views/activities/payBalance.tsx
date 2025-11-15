import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const PayBalance = () => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Pay Balance" />
      <View className="py-4 flex-1">
        <View className="my-4 p-4 bg-black rounded-xl flex flex-row justify-between items-center">
          <View>
            <Text className="text-white">Total Amount Payable:</Text>
            <Text className="font-semibold text-white text-xl">
              ₦1,004,800.00
            </Text>
          </View>
          <View>
            <Image
              source={require("@/assets/icons/money-bag.png")}
              className="w-6 h-6"
            />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text className="py-4" style={homeStyles.title}>
              Property Info
            </Text>
            <View className="flex gap-4 flex-row items-center">
              <View>
                <Image
                  source={require("@/assets/images/featuredSpaceImage1.png")}
                  className="w-[76px] h-[76px] rounded-lg"
                />
              </View>
              <View>
                <Text style={homeStyles.title}>Atraz Palace Event Hall</Text>
                <Text style={homeStyles.gray}>GRA Phase II, Port Harcourt</Text>
                <Text style={homeStyles.title}>
                  ₦400,000
                  <Text style={homeStyles.gray}>/day</Text>
                </Text>
              </View>
            </View>
          </View>
          <View className="border-b border-t border-gray-300 py-4 my-4">
            <Text style={homeStyles.title} className="pb-4">
              Cost Breakdown
            </Text>
            <View>
              <View className="flex flex-row justify-between py-2">
                <Text style={homeStyles.titleGray}>Rent (3 days)</Text>
                <Text className="font-semibold text-lg">₦1,200,000.00</Text>
              </View>
              <View className="flex flex-row justify-between py-2">
                <Text style={homeStyles.titleGray}>
                  Caution fee (refundable)
                </Text>
                <Text className="font-semibold text-lg">₦50,000.00</Text>
              </View>
              <View className="flex flex-row justify-between py-2">
                <Text style={homeStyles.titleGray}>
                  DiPlace Platform fee (0.5%)
                </Text>
                <Text className="font-semibold text-lg">₦6,000.00</Text>
              </View>
            </View>
          </View>
          <View className="py-4 border-b border-gray-300">
            <View className="flex flex-row justify-between">
              <Text className="" style={homeStyles.subTitle}>
                Total Amount
              </Text>
              <Text className="font-semibold" style={homeStyles.title}>
                ₦1,256,000.00
              </Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="" style={homeStyles.titleGray}>
                Initial deposit
              </Text>
              <Text className="font-semibold" style={homeStyles.title}>
                ₦251,200.00
              </Text>
            </View>
          </View>
          <View className="flex flex-row justify-between border-b py-4 border-gray-300">
            <Text className="" style={homeStyles.subTitle}>
              Balance Due
            </Text>
            <Text className="font-semibold" style={homeStyles.title}>
              ₦1,004,800.00
            </Text>
          </View>
          <View className="border-b border-gray-300 py-4 ">
            <Text style={homeStyles.title}>Renter’s Information</Text>
            <View className="bg-[#F9F9FB] rounded-xl p-4 mt-4">
              <Text style={homeStyles.title}>Rhema Generation Inc.</Text>
              <Text style={homeStyles.subTitlegray}>Event Planner</Text>
              <Text style={homeStyles.subTitlegray}>
                info@rgiworld.com | +2348102934980
              </Text>
            </View>
          </View>
          <View className="border-b border-gray-300 py-4 ">
            <Text style={homeStyles.title}>Event Details</Text>
            <View className="bg-[#F9F9FB] rounded-xl p-4 mt-4 flex flex-col gap-1">
              <View>
                <Text style={homeStyles.title}>Wedding & Engagement</Text>
              </View>
              <View className="flex flex-row gap-1">
                <Image
                  source={require("@/assets/icons/Calendar.png")}
                  className="w-5 h-5"
                />
                <Text style={homeStyles.subTitlegray}>Event Date:</Text>
                <Text>Thu. 17 Aug, - Sat. 19 Aug, 2025</Text>
              </View>
              <View className="flex flex-row gap-1">
                <Image
                  source={require("@/assets/icons/Time.png")}
                  className="w-5 h-5"
                />
                <Text style={homeStyles.subTitlegray}>Estimated Duration:</Text>
                <Text>8 hours</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View className="py-4">
          <AppButton title="Confirm & Pay" onPress={() => {}} />
        </View>
      </View>
    </SafeAreaViewContainer>
  );
};

export default PayBalance;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
    },
    titleGray: {
      fontSize: RFValue(16),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    subTitle: {
      fontSize: RFValue(16),
      lineHeight: RFValue(20),
    },
    subTitlegray: {
      fontSize: RFValue(16),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    gray: {
      color: colors.slate[600],
    },
  });
