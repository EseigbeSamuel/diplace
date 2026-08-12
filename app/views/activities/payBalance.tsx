import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const PayBalance = () => {
  const { colors, isDarkMode } = useTheme();
  const homeStyles = styles(colors);
  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Pay Balance" />
      <View className="flex-1 py-4">
        <View className="flex flex-row items-center justify-between p-4 my-4 bg-black rounded-xl">
          <View>
            <Text className="text-white">Total Amount Payable:</Text>
            <Text className="text-xl font-semibold text-white">
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
          <View style={homeStyles.borderB} className="py-4 my-4 border-t">
            <Text className="py-4" style={homeStyles.title}>
              Property Info
            </Text>
            <View className="flex flex-row items-center gap-4">
              <View>
                <Image
                  source={require("@/assets/images/featuredSpaceImage1.png")}
                  className="w-[76px] h-[76px] rounded-lg"
                />
              </View>
              <View className="flex flex-col gap-2">
                <Text style={homeStyles.title}>Atraz Palace Event Hall</Text>
                <Text style={homeStyles.gray}>GRA Phase II, Port Harcourt</Text>
                <Text style={homeStyles.title}>
                  ₦400,000
                  <Text style={homeStyles.gray}>/day</Text>
                </Text>
              </View>
            </View>
          </View>

          <View style={homeStyles.borderB} className="py-4 my-4 border-t">
            <Text style={homeStyles.title} className="pb-4">
              Cost Breakdown
            </Text>
            <View>
              <View className="flex flex-row justify-between py-2">
                <Text style={homeStyles.titleGray}>Rent (3 days)</Text>
                <Text style={homeStyles.text} className="text-lg font-semibold">
                  ₦1,200,000.00
                </Text>
              </View>
              <View className="flex flex-row justify-between py-2">
                <Text style={homeStyles.titleGray}>
                  Caution fee (refundable)
                </Text>
                <Text style={homeStyles.text} className="text-lg font-semibold">
                  ₦50,000.00
                </Text>
              </View>
              <View className="flex flex-row justify-between py-2">
                <Text style={homeStyles.titleGray}>
                  DiPlace Platform fee (0.5%)
                </Text>
                <Text style={homeStyles.text} className="text-lg font-semibold">
                  ₦6,000.00
                </Text>
              </View>
            </View>
          </View>

          <View style={homeStyles.borderB} className="py-4 border-t ">
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
          <View
            style={homeStyles.borderB}
            className="flex flex-row justify-between py-4 border-t"
          >
            <Text className="" style={homeStyles.subTitle}>
              Balance Due
            </Text>
            <Text className="font-semibold" style={homeStyles.title}>
              ₦1,004,800.00
            </Text>
          </View>
          <View style={homeStyles.borderB} className="py-4 border-t ">
            <Text style={homeStyles.title}>Renter’s Information</Text>
            <View
              style={homeStyles.infoBox}
              className=" rounded-xl p-4 mt-4"
            >
              <Text style={homeStyles.title}>Rhema Generation Inc.</Text>
              <Text style={homeStyles.subTitlegray}>Event Planner</Text>
              <Text style={homeStyles.subTitlegray}>
                info@rgiworld.com | +2348102934980
              </Text>
            </View>
          </View>
          <View style={homeStyles.borderB} className="py-4 border-t">
            <Text style={homeStyles.title}>Event Details</Text>
            <View
              style={homeStyles.infoBox}
              className=" rounded-xl p-4 mt-4 flex flex-col gap-1"
            >
              <View>
                <Text style={homeStyles.title}>Wedding & Engagement</Text>
              </View>
              <View className="flex flex-row gap-2">
                <Image
                  source={
                    isDarkMode
                      ? require("@/assets/icons/calender-white.png")
                      : require("@/assets/icons/calendar.png")
                  }
                  className="w-5 h-5"
                />
                <Text style={homeStyles.subTitlegray}>Event Date:</Text>
                <Text style={homeStyles.text}>
                  Thu. 17 Aug, - Sat. 19 Aug, 2025
                </Text>
              </View>
              <View className="flex flex-row gap-2">
                <Image
                  source={require("@/assets/icons/clock.png")}
                  className="w-5 h-5"
                />
                <Text style={homeStyles.subTitlegray}>Estimated Duration:</Text>
                <Text style={homeStyles.text}>8 hours</Text>
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
      color: colors.slate[650],
    },
    titleGray: {
      fontSize: RFValue(16),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    subTitle: {
      fontSize: RFValue(16),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    subTitlegray: {
      fontSize: RFValue(16),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    borderB: {
      borderTopColor: colors.slate[300],
    },
    gray: {
      color: colors.slate[600],
    },
    infoBox: {
      backgroundColor: colors.slate[150],
    },
  });
