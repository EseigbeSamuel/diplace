import { CustomBottomSheet } from "@/components/bottom-sheet";
import { AppHeader } from "@/components/header";
import SafeAreaViewContainer from "@/components/safeareaview";
import { promoData, RecentEarningsDB } from "@/constants/ownerHome";
import { useTheme } from "@/contexts/themeContext";
import { useTransactionHistory } from "@/hooks/transaction";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowUpRight, ChevronDown, MapPin } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { RFValue } from "react-native-responsive-fontsize";
import AddSpaceBottomSheet from "../spaces/components/AddSpacesBottomContainer";

export default function OwnersHome() {
  const { colors, isDarkMode } = useTheme();
  const custom = styles(colors);
  const addSpaceRef = useRef<BottomSheetModal>(null);
  const [hidden, setHidden] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { width } = Dimensions.get("window");
  const CARD_WIDTH = width * 0.88;

  const anim = useSharedValue(0);

  const handleAddSpace = () => {
    addSpaceRef.current?.present();
  };

  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

  const [filters, setFilters] = useState({
    skip: 0,
    limit: 20,
    status: undefined,
  });

  const { data, isLoading, isError, error, refetch, isFetching } =
    useTransactionHistory(filters);

  return (
    <SafeAreaViewContainer className="flex-col gap-5">
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

      <FlatList
        data={RecentEarningsDB}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-8 pb-10"
        ListHeaderComponent={
          <View className="flex-col gap-8">
            {/* Confirm space availability */}
            <View>
              <Text style={custom.text} className=" font-medium">
                Confirm space availability
              </Text>
              <View className="w-full px-4 mt-4">
                <View className="rounded-3xl overflow-hidden bg-white shadow-lg shadow-black/20">
                  <View className="w-full h-48 overflow-hidden rounded-3xl">
                    <Image
                      source={require("@/assets/images/landlord-right.jpg")}
                      className="w-full h-full rounded-3xl"
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.85)"]}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "60%",
                        borderBottomLeftRadius: 24,
                        borderBottomRightRadius: 24,
                      }}
                    />
                    <View className="absolute bottom-4 left-4 right-4">
                      <Text className="text-white text-lg font-semibold">
                        Atraz Palace Hall
                      </Text>

                      <View className="flex-row items-center mt-1">
                        <MapPin size={16} color="#fff" />
                        <Text className="text-white ml-1 text-sm">
                          10 Onukem Street, Eneka, Port Harcourt
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity className="absolute bottom-4 right-4 bg-black/80 rounded-full w-10 h-10 flex items-center justify-center">
                      <ArrowUpRight size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="h-4 w-[85%] mx-auto bg-black/10 rounded-full mt-[-6px] blur-lg opacity-20" />
              </View>
            </View>

            {/* Overview */}
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
                    <View
                      style={{ backgroundColor: colors.slate[650] }}
                      className="rounded-full p-2 justify-center items-center flex-row"
                    >
                      {isDarkMode ? (
                        <Image
                          source={require("@/assets/icons/arrow-right-up-dark.png")}
                          className="size-7"
                        />
                      ) : (
                        <Image
                          source={require("@/assets/icons/arrow-right-up-light.png")}
                          className="size-7"
                        />
                      )}
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
                        source={require("@/assets/icons/blue-unlock.png")}
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
                    <Image source={require("@/assets/icons/yellow-lock.png")} />
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
              <Carousel
                loop
                width={CARD_WIDTH}
                height={130}
                autoPlay
                autoPlayInterval={3000}
                data={promoData}
                scrollAnimationDuration={800}
                pagingEnabled
                onProgressChange={(_, absoluteProgress) => {
                  const index = Math.round(absoluteProgress) % promoData.length;
                  setActiveIndex(index);
                }}
                renderItem={({ item }) => (
                  <View className="px-3">
                    <View
                      style={{
                        backgroundColor: item.color,
                        borderColor: item.borderColor,
                      }}
                      className="rounded-2xl border px-4 py-4"
                    >
                      <View className="flex-row justify-between items-center mb-2">
                        <Text
                          style={{
                            fontSize: RFValue(15),
                            lineHeight: RFValue(20),
                          }}
                          className="font-semibold"
                        >
                          {item.title}
                        </Text>

                        <ArrowUpRight size={18} />
                      </View>

                      <Text
                        style={{
                          fontSize: RFValue(13),
                          lineHeight: RFValue(18),
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                )}
              />

              {/* Pagination */}
              <View className="flex-row justify-center items-center mt-2">
                {promoData.map((_, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <View
                      key={index}
                      style={{
                        marginHorizontal: 4,
                        height: 10,
                        width: isActive ? 28 : 10,
                        borderRadius: 999,
                        backgroundColor: isActive
                          ? isDarkMode
                            ? "#F5F5F5"
                            : "#111111"
                          : "transparent",
                        borderWidth: isActive ? 0 : 1,
                        borderColor: isDarkMode
                          ? "rgba(255,255,255,0.35)"
                          : "rgba(0,0,0,0.25)",
                      }}
                    />
                  );
                })}
              </View>
            </View>

            {/* Earning card */}
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
                    {hidden ? "*********" : "₦500,000.00"}
                  </Text>

                  <TouchableOpacity onPress={() => setHidden(!hidden)}>
                    {hidden ? (
                      <Image
                        source={require("@/assets/icons/eye-open-light.png")}
                      />
                    ) : (
                      <Image
                        source={require("@/assets/icons/eye-closed-light.png")}
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-center items-center mt-3">
                  <Text className="text-green-500 font-semibold mr-1">
                    +3.5%
                  </Text>
                  <Text className="text-gray-200 mr-1">All time</Text>
                  <ChevronDown size={16} color="white" />
                </View>
              </View>
            </View>

            {/* Recent Earnings Header */}
            <View className="flex-row justify-between items-center w-full">
              <Text style={custom.subTitle} className=" font-medium">
                Recent Earnings
              </Text>
              <Pressable className="flex-row gap-2">
                <Text style={custom.smallDrak}>see more</Text>
                {isDarkMode ? (
                  <Image
                    source={require("@/assets/icons/arrow-right-light.png")}
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
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={custom.border}
            className="w-full py-5 justify-between items-center flex-row border-b capitalize"
          >
            <View className="flex-row items-center gap-3">
              <View
                style={custom.container2}
                className="rounded-full p-3 items-center justify-center flex-row"
              >
                {item.type === "booking" ? (
                  isDarkMode ? (
                    <Image
                      source={require("@/assets/icons/badge-check-outline-light.png")}
                      className="size-5"
                    />
                  ) : (
                    <Image
                      source={require("@/assets/icons/checkbox-circle-fill.png")}
                      className="size-5"
                    />
                  )
                ) : item.type === "reservation" ? (
                  isDarkMode ? (
                    <Image
                      source={require("@/assets/icons/lock-light.png")}
                      className="size-5"
                    />
                  ) : (
                    <Image
                      source={require("@/assets/icons/Lock.png")}
                      className="size-5"
                    />
                  )
                ) : item.type === "inspection" ? (
                  isDarkMode ? (
                    <Image
                      source={require("@/assets/icons/calender-light.png")}
                      className="size-5"
                    />
                  ) : (
                    <Image
                      source={require("@/assets/icons/calender-dark.png")}
                      className="size-5"
                    />
                  )
                ) : isDarkMode ? (
                  <Image
                    source={require("@/assets/icons/badge-check-outline-light.png")}
                    className="size-5"
                  />
                ) : (
                  <Image
                    source={require("@/assets/icons/checkbox-circle-fill.png")}
                    className="size-5"
                  />
                )}
              </View>
              <View>
                <Text style={custom.text} className="font-medium">
                  {item.name || "Unknown"}
                </Text>
                <Text style={custom.small}>{item.date || "N/A"}</Text>
              </View>
            </View>
            <Text style={custom.subTitle} className="font-semibold">
              +${item.amount || "₦0"}
            </Text>
          </View>
        )}
      />

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
