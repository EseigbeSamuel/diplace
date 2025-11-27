import Filter from "@/components/filter";
import { AppHeader } from "@/components/header";
import HouseCard from "@/components/housecard";
import ImageSlider from "@/components/imageslider";
import SafeAreaViewContainer from "@/components/safeareaview";
import { categories, featuredLister, slider } from "@/constants/discover";
import { featuredSpaces } from "@/constants/home";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const Discover = () => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
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
            contentContainerClassName="gap-2"
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
                <Text className="capitalize text-black">{item.name}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View className="flex flex-col gap-3 w-full">
          <Text style={homeStyles.title} className="font-semibold">
            Neighborhoods
          </Text>
          <ImageSlider data={slider} />
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
              <Image
                source={require("@/assets/icons/arrow-right-dark.png")}
                className="w-[20px] h-[20px]"
              />
            </Pressable>
          </View>
          <FlatList
            data={featuredLister}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4"
            renderItem={({ item }) => (
              <View
                style={homeStyles.border}
                className="flex flex-row gap-3 items-center border rounded-2xl p-3 min-w-[170px] "
              >
                <Image source={item.imageSource} />
                <View>
                  <Text
                    style={homeStyles.text}
                    className="font-medium capitalize"
                  >
                    {item.name}
                  </Text>
                  <View className="flex flex-row items-center">
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
              <Image
                source={require("@/assets/icons/arrow-right-dark.png")}
                className="w-[20px] h-[20px]"
              />
            </Pressable>
          </View>
          <FlatList
            data={featuredSpaces}
            renderItem={({ item }) => (
              <HouseCard
                {...item}
                onPress={() => router.push("/views/place-details/[id]")}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4"
          />
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
              <Image
                source={require("@/assets/icons/arrow-right-dark.png")}
                className="w-[20px] h-[20px]"
              />
            </Pressable>
          </View>
          <FlatList
            data={featuredSpaces}
            renderItem={({ item }) => (
              <HouseCard
                {...item}
                onPress={() => router.push("/views/place-details/[id]")}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4"
          />
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
              <Image
                source={require("@/assets/icons/arrow-right-dark.png")}
                className="w-[20px] h-[20px]"
              />
            </Pressable>
          </View>
          <FlatList
            data={featuredSpaces}
            renderItem={({ item }) => (
              <HouseCard
                {...item}
                onPress={() => router.push("/views/place-details/[id]")}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4"
          />
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
