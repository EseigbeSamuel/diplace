import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const Placedetails = () => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  const listItems = ["Wardrobe", "2 Bethroom"];
  return (
    <SafeAreaViewContainer>
      <SectionHeader
        title=""
        rightIconSource={require("@/assets/icons/more-2-line.png")}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
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
        <View className="border-t border-b border-gray-300">
          <Text className="py-2 italic text-center text-gray-400">
            ⚠️ Heads up! The price you see is for the space only. Agent fees and
            other charges may apply.
          </Text>
        </View>
        <View className="flex flex-row py-4 border-b border-gray-300 justify-evenly">
          <View className="flex items-center justify-center">
            <Image
              source={require("@/assets/icons/bed-outline.png")}
              className="w-6 h-6"
            />
            <Text>2 Bedrooms</Text>
          </View>
          <View className="flex items-center justify-center">
            <Image
              source={require("@/assets/icons/bath.png")}
              className="w-6 h-6"
            />
            <Text>2 Baths</Text>
          </View>
          <View className="flex items-center justify-center">
            <Image
              source={require("@/assets/icons/bath.png")}
              className="w-6 h-6"
            />
            <Text>10 by 12ft</Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between py-3">
          <Text className="font-semibold" style={homeStyles.title}>
            Listed by
          </Text>
          <Text className="">Pushed 2 days ago</Text>
        </View>

        <View className="flex flex-row gap-2 py-3 border-b border-gray-300">
          <View className="h-12 w-12 rounded-[999px] bg-gray-300"></View>
          <View className="w-[50%]">
            <Text>
              Ibe Alex{" "}
              <Image source={require("@/assets/icons/badge-check-green.png")} />
            </Text>
            <Text className="flex flex-row gap-2">
              <Image
                source={require("@/assets/icons/star.png")}
                className="w-4 h-4"
              />{" "}
              4.5 <Text className="text-blue-500">(15 reviews)</Text>
            </Text>
          </View>
          <View className="flex flex-row gap-3">
            <View className="w-14 flex items-center justify-center h-14 rounded-[999px] bg-gray-400 ">
              <Image
                source={require("@/assets/icons/calling.png")}
                className="w-6 h-6"
              />
            </View>
            <View className="w-14 flex items-center justify-center h-14 rounded-[999px] bg-gray-400 ">
              <Image
                source={require("@/assets/icons/calling.png")}
                className="w-6 h-6"
              />
            </View>
          </View>
        </View>
        <View className="py-3 border-b border-gray-300">
          <Text style={homeStyles.title} className="pb-2">
            About this space
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus, ipsa consequatur excepturi in ab nemo est porro hic,
            ad, maxime at. Odio, sunt. Necessitatibus similique eos quod
            molestias iste ipsa?
          </Text>
          <Text className="py-2" style={homeStyles.title}>
            Amentities
          </Text>
          {listItems.map((item, index) => (
            <Text key={index}>{`\u2022 ${item}`}</Text>
          ))}
        </View>
        <View className="py-3 border-b border-gray-300">
          <Text style={homeStyles.title} className="pb-2">
            Location
          </Text>
          <Text>Road 2, Tony Estate, Port Harcourt</Text>
        </View>

        <View className="py-3 border-b border-gray-300">
          <Text style={homeStyles.title} className="pb-2 font-semibold">
            Cost Breakdown
          </Text>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Space rent</Text>
            <Text className="font-semibold">N600,000.00</Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Space rent</Text>
            <Text className="font-semibold">N600,000.00</Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Space rent</Text>
            <Text className="font-semibold">N600,000.00</Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Space rent</Text>
            <Text className="font-semibold">N600,000.00</Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Space rent</Text>
            <Text className="font-semibold">N600,000.00</Text>
          </View>
        </View>
        <View className="flex flex-row justify-between py-3 border-b border-gray-300">
          <Text className="text-lg">Total Payable</Text>
          <Text style={homeStyles.title} className="font-semibold">
            N716,000.10
          </Text>
        </View>

        <Pressable className="flex flex-row items-center gap-3 py-4">
          <Image
            source={require("@/assets/icons/flag.png")}
            className="w-6 h-6"
          />
          <Text>Report listing</Text>
        </Pressable>
      </ScrollView>
      <View className="flex flex-col gap-3 py-4">
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
