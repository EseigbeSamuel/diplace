import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const Placedetails = () => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  return (
    <SafeAreaViewContainer>
      <SectionHeader
        title=""
        rightIconSource={require("@/assets/icons/more-2-line.png")}
      />

      <View
        style={{
          height: RFValue(380),
        }}
        className="w-full rounded-lg"
      >
        <Image
          className="w-full h-full"
          source={require("@/assets/images/idViewImage.png")}
        />
      </View>
      <View className="flex flex-row justify-between pt-4">
        <Text style={homeStyles.title} className="w-[70%]">
          2 Bedroom in-suite apartment
        </Text>
        <Text style={homeStyles.title}>₦600,000</Text>
      </View>
      <View className="flex flex-row justify-between py-4">
        <View className="flex gap-1 flex-row items-center w-[70%]">
          <Image
            source={require("@/assets/icons/Location - Iconly Pro.png")}
            className="w-6 h-6"
          />
          <Text style={homeStyles.subTitlegray}>
            Road 13, Tony Estate, Rumuewhera, Port Harcourt
          </Text>
        </View>
        <Text style={homeStyles.subTitlegray}>/annum</Text>
      </View>
      <View className="">
        <Text className="py-2 italic text-center text-gray-400">
          ⚠️ Heads up! The price you see is for the space only. Agent fees and
          other charges may apply.
        </Text>
      </View>
      <View className="flex flex-col gap-3 py-2">
        <AppButton title="Book Now" onPress={() => {}} size="large" />
        <AppButton
          title="Virtual Tour"
          onPress={() => {}}
          size="large"
          variant="tertiary"
          beforeIcon={require("@/assets/icons/Video - Iconly Pro.png")}
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default Placedetails;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    gray: {
      color: colors.slate[600],
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
    },
    titlegray: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[600],
    },
    subTitlegray: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
  });
