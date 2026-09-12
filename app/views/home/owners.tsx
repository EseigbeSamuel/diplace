import { AppHeader } from "@/components/header";
import SafeAreaViewContainer from "@/components/safeareaview";
import { promoData } from "@/constants/ownerHome";
import { useTheme } from "@/contexts/themeContext";
import { useGetCurrentUser, useListProperties } from "@/hooks";
import { ColorScheme } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowUpRight, MapPin } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  DimensionValue,
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
import MyEarnings from "../profile/my-earnings";

function SkeletonBlock({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: {
  width?: number | `${number}%` | "100%";
  height?: number;
  borderRadius?: number;
  style?: any;
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "rgba(148, 163, 184, 0.22)",
        },
        style,
      ]}
    />
  );
}

export default function OwnersHome() {
  const { colors, isDarkMode } = useTheme();
  const custom = styles(colors);
  const { currentUser, isCurrentUserLoading } = useGetCurrentUser();
  const { properties, isPropertiesLoading } = useListProperties({
    params: {
      lister_id: currentUser?.public_id,
      sort_by: "date_created",
      sort_order: "desc",
    },
    enabled: !!currentUser,
  });
  const [hidden, setHidden] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { width } = Dimensions.get("window");
  const CARD_WIDTH = width * 0.88;
  const isOverviewLoading = isCurrentUserLoading || isPropertiesLoading;
  const totalSpaces = properties.length;
  const availableSpaces = properties.filter(
    (item) => item.status === "available",
  ).length;
  const bookedSpaces = properties.filter(
    (item) => item.status === "booked",
  ).length;
  const reservedSpaces = bookedSpaces;
  const progressWidth = totalSpaces
    ? `${Math.min(100, Math.round((availableSpaces / totalSpaces) * 100))}%`
    : "0%";
  const latestProperty = properties[0];
  const latestPropertyTitle = latestProperty?.title || "No space listed yet";
  const latestPropertyAddress =
    [
      latestProperty?.address?.street,
      latestProperty?.address?.city,
      latestProperty?.address?.state,
    ]
      .filter(Boolean)
      .join(", ") || "Add a space to see availability details.";

  const anim = useSharedValue(0);

  const handleAddSpace = () => {
    router.push("/views/spaces/add-spaces");
  };

  // const [filters, setFilters] = useState({
  //   skip: 0,
  //   limit: 20,
  //   status: undefined,
  // });

  // const { data, isLoading, isError, error, refetch, isFetching } =
  //   useTransactionHistory(filters);

  return (
    <SafeAreaViewContainer disableBottom className="flex-col gap-5">
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
        data={[]}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-8 pb-10"
        ListHeaderComponent={
          <View className="flex-col gap-8">
            {/* Confirm space availability */}
            <View>
              <Text style={custom.text} className=" font-medium">
                Confirm space availability
              </Text>
              <View className="w-full mt-4">
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
                      {isOverviewLoading ? (
                        <View>
                          <SkeletonBlock
                            width="62%"
                            height={18}
                            borderRadius={8}
                            style={{
                              backgroundColor: "rgba(255,255,255,0.35)",
                            }}
                          />
                          <SkeletonBlock
                            width="48%"
                            height={14}
                            borderRadius={8}
                            style={{
                              marginTop: 8,
                              backgroundColor: "rgba(255,255,255,0.3)",
                            }}
                          />
                        </View>
                      ) : (
                        <>
                          <Text className="text-white text-lg font-semibold">
                            {latestPropertyTitle}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <MapPin size={16} color="#fff" />
                            <Text className="text-white ml-1 text-sm">
                              {latestPropertyAddress}
                            </Text>
                          </View>
                        </>
                      )}
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
                        />
                      )}
                    </View>
                  </View>
                  <View className="flex-row flex-wrap items-center justify-between w-full">
                    <View
                      style={custom.border}
                      className="flex-row justify-center items-center rounded-full p-3 border"
                    >
                      <Image source={require("@/assets/icons/paper.png")} />
                    </View>
                    {isOverviewLoading ? (
                      <SkeletonBlock width={40} height={28} borderRadius={10} />
                    ) : (
                      <Text style={custom.big} className="font-semibold">
                        {totalSpaces}
                      </Text>
                    )}
                  </View>

                  <View>
                    <View className="flex-row items-center gap-1">
                      <Image
                        source={require("@/assets/icons/blue-unlock.png")}
                      />
                      {isOverviewLoading ? (
                        <SkeletonBlock width={120} height={14} />
                      ) : (
                        <Text style={custom.small}>
                          {`${availableSpaces} Available spaces`}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{ backgroundColor: colors.slate[250] }}
                      className="w-full h-3 rounded-full "
                    >
                      <View
                        style={{
                          backgroundColor: colors.info[200],
                          width: progressWidth as DimensionValue,
                        }}
                        className="rounded-full h-3"
                        width={isOverviewLoading ? "35%" : progressWidth}
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
                      {isOverviewLoading ? (
                        <SkeletonBlock
                          width={34}
                          height={22}
                          borderRadius={8}
                        />
                      ) : (
                        <Text
                          style={custom.subTitle}
                          className=" font-semibold"
                        >
                          {bookedSpaces}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View
                    style={custom.container2}
                    className="flex-row items-center gap-3 rounded-3xl p-4"
                  >
                    <Image source={require("@/assets/icons/yellow-lock.png")} />
                    <View>
                      <Text style={custom.small}>Reserved Space</Text>
                      {isOverviewLoading ? (
                        <SkeletonBlock
                          width={34}
                          height={22}
                          borderRadius={8}
                        />
                      ) : (
                        <Text
                          style={custom.subTitle}
                          className=" font-semibold"
                        >
                          {reservedSpaces}
                        </Text>
                      )}
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

            {/* Recent Earnings Header */}
            <MyEarnings noHeader />
          </View>
        }
      />

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
