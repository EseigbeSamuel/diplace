import { CustomBottomSheet } from "@/components/bottom-sheet";
import { AppHeader } from "@/components/header";
import SafeAreaViewContainer from "@/components/safeareaview";
import { promoData, RecentEarningsDB } from "@/constants/ownerHome";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { ChevronDown, Eye, EyeOff } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";

import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PromoCard from "@/components/promocard";
import { TouchableOpacity } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import AddSpaceBottomSheet from "../spaces/components/AddSpacesBottomContainer";
export default function OwnersHome() {
  const { colors, isDarkMode } = useTheme();
  const custom = styles(colors);
  const addSpaceRef = useRef<BottomSheetModal>(null);
  const [hidden, setHidden] = useState(false);

  const anim = useSharedValue(0);

  const handleAddSpace = () => {
    addSpaceRef.current?.present();
  };

  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

  return (
    <SafeAreaViewContainer className="flex-col gap-5">
      {/* <View className="gap-2">
        <Text style={{ fontFamily: "InstrumentSansBold" }} className="text-2xl">
          Owners Home
        </Text>
      </View> */}

      <AppHeader
        title={
          <View className="gap-2">
            <Text style={custom.subTitle} className="font-semibold">
              Welcome Ibe! 👋
            </Text>
            <Pressable
              onPress={() => router.push("/views/location")}
              className="flex-row items-center gap-2"
            >
              <Image source={require("@/assets/icons/location.png")} />
              <Text style={custom.small} className="">
                14 Amadi Str, Rumuewhera
              </Text>
              <Image source={require("@/assets/icons/angle.png")} />
            </Pressable>
          </View>
        }
      />

      <ScrollView nestedScrollEnabled>
        <View className="flex-col gap-8">
          {/*  */}
          <View>
            <Text style={custom.text} className=" font-medium">
              Confirm space availability
            </Text>
            <View className="rounded-3xl flex-wrap flex-row p-5">
              <Image
                source={require("@/assets/images/landlord-right.jpg")}
                className="object-cover h-[200px] w-full rounded-3xl"
              />
            </View>
          </View>
          {/*  */}
          <View>
            <View className="flex-row items-center w-full justify-between mb-3">
              <Text style={custom.subTitle} className="font-medium ">
                Overview
              </Text>
              <Pressable onPress={handleAddSpace}>
                <Text style={custom.smallDrak} className="font-medium ">
                  + Add New Space
                </Text>
              </Pressable>
            </View>

            <View className="flex-row w-full items-center gap-2">
              <View
                style={custom.container2}
                className="rounded-3xl p-4  gap-3 flex-1"
              >
                <View className="flex-row flex-wrap items-center justify-between w-full">
                  <Text style={custom.small}>Total Space</Text>
                  <View>
                    <Image
                      source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
                      className="size-10"
                    />
                  </View>
                </View>
                <View className="flex-row flex-wrap items-center justify-between w-full">
                  <View
                    style={custom.border}
                    className="flex-row justify-center items-center rounded-full p-3 border"
                  >
                    <Image
                      source={require("@/assets/icons/paper.png")}
                      className="size-7"
                    />
                  </View>
                  <Text style={custom.big} className="font-semibold">
                    12
                  </Text>
                </View>

                <View>
                  <View className="flex-row items-center gap-1">
                    <Image
                      source={require("@/assets/icons/Lock-fill.png")}
                      className="size-7"
                    />
                    <Text style={custom.small}>6 Available spaces</Text>
                  </View>
                  <View
                    style={{ backgroundColor: colors.slate[250] }}
                    className="w-full h-3 rounded-full "
                  >
                    <View
                      style={{ backgroundColor: colors.info[200] }}
                      className="w-[80%] rounded-full h-3"
                    ></View>
                  </View>
                </View>
              </View>

              <View className="flex-1 gap-3 ">
                <View
                  style={custom.container2}
                  className="flex-row items-center p-3 rounded-3xl gap-4"
                >
                  <Image
                    source={require("@/assets/icons/badge-check-green.png")}
                  />
                  <View>
                    <Text style={custom.small}>Booked Space</Text>
                    <Text style={custom.subTitle} className=" font-semibold">
                      4
                    </Text>
                  </View>
                </View>

                <View
                  style={custom.container2}
                  className="flex-row items-center gap-3 rounded-3xl p-4"
                >
                  <Image
                    source={require("@/assets/icons/badge-check-green.png")}
                  />
                  <View>
                    <Text style={custom.small}>Reserved Space</Text>
                    <Text style={custom.subTitle} className=" font-semibold">
                      2
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Promo Slider */}
          <View className="w-full">
            <FlatList
              data={promoData}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={RFValue(260) + 20}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 10 }}
              contentContainerClassName="gap-5"
              renderItem={({ item, index }) => {
                return <PromoCard item={item} animationValue={anim} />;
              }}
              keyExtractor={(item) => item.id}
            />

            <View className="flex-row justify-center mt-3 gap-2">
              <View className="w-6 h-3 bg-black rounded-full" />
              <View className="w-3 h-3 bg-gray-300 rounded-full" />
              <View className="w-3 h-3 bg-gray-300 rounded-full" />
            </View>
          </View>

          {/* earning card */}
          <View className="bg-[#111] rounded-2xl h-[150px] p-5 w-full relative overflow-hidden">
            <View className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
              <View className="absolute w-[200%] h-10 bg-gray-700 rotate-[-25deg] top-6 left-[-50%]" />
              <View className="absolute w-[200%] h-10 bg-gray-800 rotate-[-25deg] top-12 left-[-40%]" />
            </View>

            <View className="relative top-5 flex-col items-center justify-center">
              <Text className="text-gray-300 text-center mb-1">
                Your Earnings
              </Text>

              <View className="flex-row justify-center items-center gap-2">
                <Text className="text-white text-3xl font-bold">
                  {hidden ? "******" : "₦500,000.00"}
                </Text>

                <TouchableOpacity onPress={() => setHidden(!hidden)}>
                  {hidden ? (
                    <Eye size={22} color="white" />
                  ) : (
                    <EyeOff size={22} color="white" />
                  )}
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-center items-center mt-3">
                <Text className="text-green-500 font-semibold mr-1">+3.5%</Text>
                <Text className="text-gray-200 mr-1">All time</Text>
                <ChevronDown size={16} color="white" />
              </View>
            </View>
          </View>

          {/* recent transctions  */}
          <View>
            <FlatList
              data={RecentEarningsDB}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <View className="flex-row justify-between items-center w-full">
                  <Text style={custom.subTitle} className=" font-medium">
                    Recent Earnings
                  </Text>
                  <Pressable className="flex-row gap-2">
                    <Text style={custom.smallDrak}>see more</Text>
                    {isDarkMode ? (
                      <Image
                        source={require("@/assets/icons/arrow-left-light.png")}
                        className="w-[20px] h-[20px]"
                      />
                    ) : (
                      <Image
                        source={require("@/assets/icons/arrow-right-dark.png")}
                        className="w-[20px] h-[20px]"
                      />
                    )}
                  </Pressable>
                </View>
              }
              contentContainerClassName="gap-3 "
              renderItem={({ item }) => (
                <View
                  style={custom.border}
                  className="w-full p-5 justify-between items-center flex-row border-b capitalize"
                >
                  <View className="flex-row items-center gap-2">
                    <View
                      style={custom.container2}
                      className="rounded-full p-3 items-center justify-center flex-row"
                    >
                      {item.type === "booking" ? (
                        <Image
                          source={require("@/assets/icons/checkbox-circle-fill.png")}
                          className="size-5"
                        />
                      ) : item.type === "reservation" ? (
                        <Image source={require("@/assets/icons/Lock.png")} />
                      ) : item.type === "inspection" ? (
                        <Image
                          source={require("@/assets/icons/calendar.png")}
                          className="size-5"
                        />
                      ) : (
                        <Image source={require("@/assets/icons/Lock.png")} />
                      )}
                    </View>
                    <View>
                      <Text className="capitalize" style={custom.text}>
                        {item.name}{" "}
                      </Text>
                      <Text style={custom.small}>
                        {item.date},{item.time}
                      </Text>
                    </View>
                  </View>
                  <Text style={custom.text} className="font-semibold  ">
                    +${item.amount}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </ScrollView>

      {/*  */}
      <CustomBottomSheet
        bottomSheetProps={{
          ref: addSpaceRef,
          snapPoints,
          index: 2,
          enableContentPanningGesture: true,
          enableHandlePanningGesture: true,
          enablePanDownToClose: true,
        }}
      >
        <AddSpaceBottomSheet
          colors={colors}
          closeSheet={() => addSpaceRef.current?.close()}
        />
      </CustomBottomSheet>
    </SafeAreaViewContainer>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    container2: { backgroundColor: colors.slate[150] },
    border: {
      borderColor: colors.slate[300],
    },
    big: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    title: {
      fontSize: RFValue(20),
      lineHeight: RFValue(28),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(16),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    small: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    smallDrak: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    tiny: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[650],
    },
  });
