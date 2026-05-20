import Filter from "@/components/filter";
import { AppHeader } from "@/components/header";
import HouseCard from "@/components/housecard";
import SafeAreaViewContainer from "@/components/safeareaview";
import { categories, featuredLister, slider } from "@/constants/discover";
import { featuredSpaces } from "@/constants/home";
import { useTheme } from "@/contexts/themeContext";
import { useListProperties } from "@/hooks";
import { PropertyListItem } from "@/types";
import { ColorScheme } from "@/utils";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { RFValue } from "react-native-responsive-fontsize";

const Discover = () => {
  const { colors, isDarkMode } = useTheme();
  const homeStyles = styles(colors);
  const [activeIndex, setActiveIndex] = useState(0);
  const anim = useSharedValue(0);
  const { width } = Dimensions.get("window");
  const CARD_WIDTH = width * 0.88;

  // --- Live property hook ---
  const { properties, isPropertiesLoading } = useListProperties({
    params: { limit: 100 },
  });

  const formatCurrency = (amount: number) =>
    `NGN ${new Intl.NumberFormat("en-NG").format(amount || 0)}`;

  const formatCostFrequency = (value: string) =>
    value ? value.replace(/^per_/, "").replace(/_/g, " ") : "";

  const mapBadgeType = (item: PropertyListItem): string | undefined => {
    if (item.is_verified) return "verified";
    if (item.listing_type === "sponsored") return "hot";
    if (item.status === "booked") return "reserved";
    return undefined;
  };

  const mapToCardProps = (item: PropertyListItem) => ({
    id: item.public_id,
    imageSource: item.media?.[0]?.file_url
      ? { uri: item.media[0].file_url }
      : require("@/assets/images/featuredSpaceImage1.png"),
    title: item.title,
    location:
      [
        item.address?.street,
        item.address?.city,
        item.address?.state,
        item.address?.country,
      ]
        .filter(Boolean)
        .join(", ") || "Unknown location",
    price: formatCurrency(item.price),
    badgeType: mapBadgeType(item),
    duration: formatCostFrequency(item.cost_frequency),
  });

  const handleOpenProperty = (propertyId: string) => {
    router.push({
      pathname: "/views/place-details/[id]",
      params: { id: propertyId },
    });
  };

  const featuredSpacesList = useMemo(() => {
    const available = properties.filter(
      (p) => p.status === "available" || p.status === "approved" || p.status === "active"
    );
    const filtered = available.filter((p) => p.is_verified || p.listing_type !== "normal");
    return (filtered.length > 0 ? filtered : available).map(mapToCardProps);
  }, [properties]);

  const discountedSpacesList = useMemo(() => {
    const available = properties.filter(
      (p) => p.status === "available" || p.status === "approved" || p.status === "active"
    );
    const filtered = [...available].sort((a, b) => a.price - b.price);
    return (filtered.length > 0 ? filtered : available).map(mapToCardProps);
  }, [properties]);

  const eventPlacesList = useMemo(() => {
    const available = properties.filter(
      (p) => p.status === "available" || p.status === "approved" || p.status === "active"
    );
    const filtered = available.filter(
      (p) => p.property_type === "hall" || p.property_type === "event_centre"
    );
    return (filtered.length > 0 ? filtered : available.slice().reverse()).map(mapToCardProps);
  }, [properties]);

  return (
    <SafeAreaViewContainer className="flex-1">
      <AppHeader title={"Discover"} />
      <View className="py-3">
        <Filter size="large" />
      </View>

      <ScrollView nestedScrollEnabled>
        <View className="flex flex-col gap-3 mt-5 mb-7">
          <Text style={homeStyles.title} className="font-semibold">
            Categories
          </Text>
          <FlatList
            data={categories}
            horizontal
            contentContainerStyle={{ gap: 8 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push("/views/apartments")}
                className={`flex flex-col items-center border rounded-2xl p-4 min-w-[108px] ${
                  item.name === "apartment"
                    ? "bg-blue-50 border-blue-500"
                    : item.name === "shops"
                    ? "bg-amber-50 border-amber-500"
                    : item.name === "offices"
                    ? "bg-green-50 border-green-500"
                    : item.name === "event center"
                    ? "bg-pink-50 border-pink-500"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <Image className="size-[28px]" source={item.icon} />
                <Text className="text-black capitalize">{item.name}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View className="flex flex-col w-full gap-3">
          <Text style={homeStyles.title} className="font-semibold">
            Neighborhoods
          </Text>
          <View className="w-full">
            <Carousel
              loop
              width={CARD_WIDTH}
              height={170}
              autoPlay
              autoPlayInterval={3000}
              data={slider}
              scrollAnimationDuration={800}
              pagingEnabled
              onProgressChange={(_, absoluteProgress) => {
                const index = Math.round(absoluteProgress) % slider.length;
                setActiveIndex(index);
              }}
              renderItem={({ item }) => (
                <View key={item.id} className="m-2 overflow-hidden rounded-2xl">
                  <Image
                    source={item.image}
                    resizeMode="cover"
                    className="w-full h-full"
                  />

                  {item.location && (
                    <BlurView
                      intensity={10}
                      tint={isDarkMode ? "dark" : "light"}
                      className="absolute flex-row items-center w-full gap-2 p-4 -bottom-1 rounded-xl"
                    >
                      {isDarkMode ? (
                        <Image
                          source={require("@/assets/icons/location-white.png")}
                          className="w-4 h-4"
                        />
                      ) : (
                        <Image
                          source={require("@/assets/icons/location-black.png")}
                          className="w-4 h-4"
                        />
                      )}

                      <Text
                        className="font-semibold capitalize"
                        style={{ color: colors.slate[650] }}
                      >
                        {item.location}
                      </Text>
                    </BlurView>
                  )}
                </View>
              )}
            />

            <View className="flex-row justify-center items-center mt-2">
              {slider.map((_, index) => {
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
        </View>

        <View className="flex flex-col gap-3 my-5">
          <View className="flex flex-row justify-between ">
            <Text style={homeStyles.title} className="font-semibold">
              Featured Listers
            </Text>
            <Pressable
              onPress={() => router.push("/views/featuredListers")}
              className="flex-row items-center gap-2"
            >
              <Text style={homeStyles.text}>View more</Text>
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
          <FlatList
            data={featuredLister}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
            renderItem={({ item }) => (
              <View
                style={homeStyles.border}
                className="flex flex-row gap-3 items-center border rounded-2xl p-3 min-w-[170px] "
              >
                <Image source={item.imageSource} />
                <View>
                  <View className="flex flex-row items-center gap-1">
                    <Text
                      style={homeStyles.text}
                      className="font-medium capitalize"
                    >
                      {item.name}
                    </Text>
                    <Image
                      source={require("@/assets/icons/badge-check-green.png")}
                    />
                  </View>

                  <View className="flex flex-row items-center gap-1">
                    <Image
                      source={require("@/assets/icons/star.png")}
                      className="size-[20px]"
                    />
                    <Text style={homeStyles.small} className="">
                      {item.rating}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View className="flex flex-col gap-3 my-5">
          <View className="flex flex-row justify-between ">
            <Text style={homeStyles.title} className="font-semibold">
              Featured Space 🔥
            </Text>
            <Pressable
              onPress={() => router.push("/views/apartments")}
              className="flex-row items-center gap-2"
            >
              <Text style={homeStyles.text}>View More</Text>

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
          {isPropertiesLoading ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator color={colors.slate[650]} size="small" />
            </View>
          ) : (
            <FlatList
              data={featuredSpacesList}
              renderItem={({ item }) => (
                <HouseCard
                  {...item}
                  onPress={() => handleOpenProperty(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            />
          )}
        </View>

        <View className="flex flex-col gap-3 my-5">
          <View className="flex flex-row justify-between">
            <Text style={homeStyles.title} className="font-semibold">
              Discounted 🏷️
            </Text>
            <Pressable
              onPress={() => router.push("/views/apartments")}
              className="flex-row items-center gap-2"
            >
              <Text style={homeStyles.text}>View More</Text>
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
          {isPropertiesLoading ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator color={colors.slate[650]} size="small" />
            </View>
          ) : (
            <FlatList
              data={discountedSpacesList}
              renderItem={({ item }) => (
                <HouseCard
                  {...item}
                  onPress={() => handleOpenProperty(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            />
          )}
        </View>

        <View className="flex flex-col gap-3 my-5">
          <View className="flex flex-row justify-between">
            <Text style={homeStyles.title} className="font-semibold">
              Top Event Places 🎉
            </Text>
            <Pressable
              onPress={() => router.push("/views/apartments")}
              className="flex-row items-center gap-2"
            >
              <Text style={homeStyles.text}>View More</Text>
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
          {isPropertiesLoading ? (
            <View className="py-10 items-center justify-center">
              <ActivityIndicator color={colors.slate[650]} size="small" />
            </View>
          ) : (
            <FlatList
              data={eventPlacesList}
              renderItem={({ item }) => (
                <HouseCard
                  {...item}
                  onPress={() => handleOpenProperty(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default Discover;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    border: {
      borderColor: colors.slate[300],
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    small: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[600],
    },
  });
