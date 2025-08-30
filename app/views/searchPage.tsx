import Filter from "@/components/filter";
import SafeAreaViewContainer from "@/components/safeareaview";
import { spacesData } from "@/constants/home";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const SearchPage = () => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);

  return (
    <SafeAreaViewContainer>
      <Filter size="large" />

      <View className="pt-6 pb-2">
        <Text style={homeStyles.title}>Top Result</Text>

        {/* Card component */}
        <Pressable
          onPress={() => {
            router.push("/views/placedetails");
          }}
        >
          <FlatList
            data={spacesData}
            renderItem={({ item }) => (
              <View className="py-4 flex flex-row gap-2 justify-between">
                <View className="flex flex-row gap-2">
                  <View className="">
                    <Image
                      source={item.imageSource}
                      className="w-[72px] h-[72px] rounded-lg"
                    />
                  </View>
                  <View className="flex gap-1">
                    <Text className="text-xl">{item.name}</Text>
                    <Text className="text-gray-400">{item.location}</Text>
                    <View className="flex flex-row">
                      <Text className="font-semibold text-lg">
                        {item.price}
                      </Text>
                      <Text className="text-gray-400">/{item.duration}</Text>
                    </View>
                  </View>
                </View>
                <View>
                  <Image
                    source={require("@/assets/icons/arrow-left-up-outline-dark.png")}
                    className="w-6 h-6"
                  />
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </Pressable>
      </View>
    </SafeAreaViewContainer>
  );
};

export default SearchPage;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
    },
  });
