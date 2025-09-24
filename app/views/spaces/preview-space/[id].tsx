import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const PreviewSpaces = () => {
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
        <View className="flex-1 flex flex-row gap-2 mt-4">
          <Text
            className="py-1 px-2 rounded-full bg-gray-300"
            style={homeStyles.slate200}
          >
            Apartment
          </Text>
          <Text
            className="py-1 px-2 rounded-full bg-gray-300"
            style={homeStyles.green}
          >
            1 Unit available
          </Text>
        </View>
        <View className="flex flex-row justify-between pt-4">
          <Text style={homeStyles.title} className="w-[70%]">
            2 Bedroom in-suite apartment
          </Text>
        </View>
        <View className=" py-4">
          <View className="flex gap-1 flex-row items-center">
            <Image
              source={require("@/assets/icons/Location - Iconly Pro.png")}
              className="w-6 h-6"
            />
            <Text style={homeStyles.subTitlegray}>
              10 Onukem Street, Eneka, Port Harcourt.
            </Text>
          </View>
          {/* <Text style={homeStyles.subTitlegray}>/annum</Text> */}
        </View>
        <Text style={homeStyles.title}>₦600,000</Text>
        <View className="flex flex-row py-4 mt-4 border-b border-t  border-gray-300 justify-evenly">
          <View className="flex items-center justify-center">
            <Image
              source={require("@/assets/icons/bed-outline.png")}
              className="w-6 h-6"
            />
            <Text style={homeStyles.textBlack}>2 Bedrooms</Text>
          </View>
          <View className="flex items-center justify-center">
            <Image
              source={require("@/assets/icons/bath.png")}
              className="w-6 h-6"
            />
            <Text style={homeStyles.textBlack}>2 Baths</Text>
          </View>
          <View className="flex items-center justify-center">
            <Image
              source={require("@/assets/icons/bath.png")}
              className="w-6 h-6"
            />
            <Text style={homeStyles.textBlack}>10 by 12ft</Text>
          </View>
        </View>
        <View className="py-3 border-b border-gray-300">
          <Text style={homeStyles.title} className="pb-2">
            About this space
          </Text>
          <Text style={homeStyles.textBlack}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus, ipsa consequatur excepturi in ab nemo est porro hic,
            ad, maxime at. Odio, sunt. Necessitatibus similique eos quod
            molestias iste ipsa?
          </Text>
          <Text className="py-2" style={homeStyles.title}>
            Amentities
          </Text>
          {listItems.map((item, index) => (
            <Text
              style={homeStyles.textBlack}
              key={index}
            >{`\u2022 ${item}`}</Text>
          ))}
        </View>
        <View className="py-3 border-b border-gray-300">
          <Text style={homeStyles.title} className="pb-2">
            Location
          </Text>
          <Text style={homeStyles.textBlack}>
            Road 2, Tony Estate, Port Harcourt
          </Text>
          <View className="h-[300px] rounded-xl bg-gray-500 my-2"></View>
        </View>
        <View>
          <View className="mb-4">
            <Text style={homeStyles.title} className="font-semibold my-4">
              Landlord&apos;s Details
            </Text>
            <View className="ml-4">
              <View className="flex-row items-center mb-2">
                <Text className="font-semibold" style={homeStyles.title}>
                  Grace Alex
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("@/assets/icons/calling.png")}
                  className="w-4 h-4"
                />
                <Text style={homeStyles.textBlack}>+2348102349800</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("@/assets/icons/bank-light.png")}
                  className="w-4 h-4"
                />
                <Text style={homeStyles.textBlack}>
                  Grace Alex | B102934980 | Access Bank Plc
                </Text>
              </View>
            </View>
          </View>

          <View className="my-2">
            <TouchableOpacity
              className="flex-row justify-between p-4 rounded-xl"
              style={homeStyles.slate150}
            >
              <View>
                <Text className="font-medium" style={homeStyles.gray}>
                  Tenancy Agreement
                </Text>
                <View className="flex gap-1 flex-row items-center">
                  <Image
                    source={require("@/assets/icons/flag.png")}
                    className="w-4 h-4"
                  />
                  <Text style={homeStyles.gray}>Uploaded: 256kb</Text>
                </View>
              </View>
              <View className="flex flex-row gap-2 items-center">
                <Text style={homeStyles.gray}>Preview </Text>
                <Image
                  source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
                  className="w-4 h-4"
                />
              </View>
            </TouchableOpacity>
          </View>

          <View className=" my-5 py-5 border-t border-gray-300">
            <Text style={homeStyles.title} className="font-medium pb-2">
              Inspection Schedule
            </Text>
            <View style={homeStyles.slate150} className="p-4">
              <View className="py-2 border-b border-gray-300">
                <View className="flex-row items-center my-2">
                  <Text style={homeStyles.textBlack}>Inspection fee:</Text>
                </View>
                <View className="flex flex-row gap-1 items-center">
                  <Image
                    source={require("@/assets/icons/money-bag.png")}
                    className="w-4 h-4"
                  />
                  <Text style={homeStyles.textBlack} className="text-lg">
                    N 2,000.00
                  </Text>
                </View>
              </View>
              <View className="py-2">
                <Text className="py-1" style={homeStyles.textBlack}>
                  Inspection times:
                </Text>
                <View className="flex flex-col gap-2 rounded-xl">
                  <View className="flex-row items-center gap-2">
                    <Image
                      source={require("@/assets/icons/Time.png")}
                      className="w-6 h-6"
                    />
                    <View className="flex-1 justify-between flex-row">
                      <Text style={homeStyles.subTitlegray}>Morning slot:</Text>
                      <Text style={homeStyles.subTitleBlack}>10AM - 12PM</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Image
                      source={require("@/assets/icons/Time.png")}
                      className="w-6 h-6"
                    />

                    <View className="flex-1 justify-between flex-row">
                      <Text style={homeStyles.subTitlegray}>
                        Afternoon slot:{" "}
                      </Text>
                      <Text style={homeStyles.subTitleBlack}>1PM - 3PM</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Image
                      source={require("@/assets/icons/Time.png")}
                      className="w-6 h-6"
                    />
                    <View className="flex-1 justify-between flex-row">
                      <Text style={homeStyles.subTitlegray}>Evening slot:</Text>
                      <Text style={homeStyles.subTitleBlack}>4PM - 6PM</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Image
                      source={require("@/assets/icons/Time.png")}
                      className="w-6 h-6"
                    />

                    <View className="flex-1 justify-between flex-row">
                      <Text style={homeStyles.subTitlegray}>Custom slot: </Text>
                      <Text style={homeStyles.subTitleBlack}>8AM - 10AM</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="py-3 border-b border-t border-gray-300">
          <Text style={homeStyles.title} className="pb-2 font-semibold">
            Cost Breakdown
          </Text>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Space rent</Text>
            <Text className="font-semibold" style={homeStyles.textBlack}>
              N600,000.00
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Space rent</Text>
            <Text className="font-semibold" style={homeStyles.textBlack}>
              N600,000.00
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Space rent</Text>
            <Text className="font-semibold" style={homeStyles.textBlack}>
              N600,000.00
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Space rent</Text>
            <Text className="font-semibold" style={homeStyles.textBlack}>
              N600,000.00
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Space rent</Text>
            <Text className="font-semibold" style={homeStyles.textBlack}>
              N600,000.00
            </Text>
          </View>
        </View>
        <View className="flex flex-row justify-between py-3 border-b border-gray-300">
          <Text className="text-lg" style={homeStyles.textBlack}>
            Total Payable
          </Text>
          <Text style={homeStyles.title} className="font-semibold">
            N716,000.10
          </Text>
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default PreviewSpaces;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    gray: {
      color: colors.slate[600],
    },
    green: {
      color: colors.success[300],
      backgroundColor: colors.success[100],
    },
    slate200: {
      backgroundColor: colors.slate[200],
      color: colors.slate[650],
    },
    slate150: {
      backgroundColor: colors.slate[150],
    },
    textBlack: {
      color: colors.slate[650],
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
    },
    subTitleBlack: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
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
