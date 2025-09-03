import Filter from "@/components/filter";
import { AppHeader } from "@/components/header";
import HouseCard from "@/components/housecard";
import ImageSlider from "@/components/imageslider";
import SafeAreaViewContainer from "@/components/safeareaview";
import { categories, featuredListers } from "@/constants/discover";
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
      <Filter size="large" />

      <ScrollView>
        <View className="flex flex-col gap-3 my-5">
          <Text style={homeStyles.title} className="font-semibold">
            Categories
          </Text>
          <FlatList
            data={categories}
            horizontal
            contentContainerClassName="gap-2"
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={homeStyles.border}
                className="flex flex-col items-center border rounded-2xl p-4 min-w-[108px]"
              >
                <Image className="size-[28px]" source={item.icon} />
                <Text style={homeStyles.subTitle} className="capitalize">
                  {item.name}{" "}
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <ImageSlider />

        <View className="flex flex-col gap-3 my-5">
          <View className="flex flex-row justify-between ">
            <Text style={homeStyles.title} className="font-semibold">
              Featured Listers
            </Text>
            <Pressable
              onPress={() => router.push("/views/apartments")}
              className="flex-row items-center gap-2"
            >
              <Text>View more</Text>
              <Image
                source={require("@/assets/icons/arrow-right-dark.png")}
                className="w-[20px] h-[20px]"
              />
            </Pressable>
          </View>
          <FlatList
            data={featuredListers}
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
                    style={homeStyles.subTitle}
                    className="font-medium capitalize"
                  >
                    {item.name}{" "}
                  </Text>
                  <View className="flex flex-row items-center">
                    <Image
                      source={require("@/assets/icons/Star-Iconly-Pro-1.png")}
                      className="size-[20px]"
                    />
                    <Text style={homeStyles.subTitle} className="">
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
              <Text>View More</Text>
              <Image
                source={require("@/assets/icons/arrow-right-dark.png")}
                className="w-[20px] h-[20px]"
              />
            </Pressable>
          </View>
          <FlatList
            data={featuredSpaces}
            renderItem={({ item }) => <HouseCard {...item} />}
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
              <Text>View More</Text>
              <Image
                source={require("@/assets/icons/arrow-right-dark.png")}
                className="w-[20px] h-[20px]"
              />
            </Pressable>
          </View>
          <FlatList
            data={featuredSpaces}
            renderItem={({ item }) => <HouseCard {...item} />}
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
              <Text>View More</Text>
              <Image
                source={require("@/assets/icons/arrow-right-dark.png")}
                className="w-[20px] h-[20px]"
              />
            </Pressable>
          </View>
          <FlatList
            data={featuredSpaces}
            renderItem={({ item }) => <HouseCard {...item} />}
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
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
  });
