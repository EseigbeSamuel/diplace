import Dropdown from "@/components/dropdown";
import SafeAreaViewContainer from "@/components/safeareaview";
import { featuredLister } from "@/constants/discover";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const featuredListers = () => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };
  const options = [
    { id: "grid", label: "Grid", icon: "" },
    { id: "list", label: "List", icon: "" },
  ];

  const [selected, setSelected] = useState(options[0]);

  return (
    <SafeAreaViewContainer>
      <View>
        <View className="">
          <TouchableOpacity
            onPress={handleBackPress}
            className="p-4 bg-gray-100 rounded-full w-[50px] "
          >
            <Image
              source={require("@/assets/icons/arrow-left-dark.png")}
              className="w-6 h-6"
            />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row p-5 items-center w-full justify-between">
          <Text style={Styles.head} className="font-semibold">
            Featured Listers
          </Text>
          <Dropdown
            options={options}
            selected={selected}
            onSelect={setSelected}
          />
        </View>
      </View>

      <View style={Styles.container} className="h-full p-3">
        {selected.id === "grid" ? (
          <FlatList
            data={featuredLister}
            key={"grid"}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerClassName="gap-4 "
            renderItem={({ item }) => (
              <View
                style={Styles.back}
                className="w-[180px] rounded-xl shadow-lg p-3"
              >
                <Image source={item.imageSource} />
                <View className="grid gap-1">
                  <Text style={Styles.title} className="font-medium capitalize">
                    {item.name}
                  </Text>
                  <View className="flex flex-row items-center w-full">
                    <Image source={require("@/assets/icons/location.png")} />
                    <Text style={Styles.subTitle} className="capitalize">
                      {item.location}{" "}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center w-full justify-between ">
                    <View className="flex flex-row items-center gap-1">
                      <Image
                        source={require("@/assets/icons/Star-Iconly-Pro-1.png")}
                        className="size-[20px]"
                      />
                      <Text style={Styles.text} className=" font-medium">
                        {item.rating}
                      </Text>
                    </View>
                    <View>
                      {/* <Image /> */}
                      <Text style={Styles.small}>{item.spaces} Spaces</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <FlatList
            data={featuredLister}
            key={"list"}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4"
            renderItem={({ item }) => (
              <View
                style={Styles.back}
                className="flex flex-row gap-3 items-center shadow-lg rounded-2xl p-3 w-full "
              >
                <Image source={item.imageSource} />
                <View className="flex-1">
                  <Text style={Styles.title} className="font-medium capitalize">
                    {item.name}
                  </Text>
                  <View className="flex flex-row items-center">
                    <Image source={require("@/assets/icons/location.png")} />
                    <Text style={Styles.subTitle}>{item.location} </Text>
                  </View>
                  <View className="flex flex-row items-center w-full justify-between ">
                    <View className="flex flex-row gap-1 items-center flex-shrink">
                      <Image
                        source={require("@/assets/icons/Star-Iconly-Pro-1.png")}
                        className="size-[20px]"
                      />
                      <Text style={Styles.text} className=" font-medium">
                        {item.rating}
                      </Text>
                      <Text style={Styles.small} className="text-blue-500 ">
                        ({item.reviews} Reviews )
                      </Text>
                    </View>
                    <View>
                      {/* <Image /> */}
                      <Text
                        style={Styles.small}
                        className="flex-shrink text-right"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.spaces} Spaces Listed
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </SafeAreaViewContainer>
  );
};

export default featuredListers;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.slate[150],
    },
    back: {
      backgroundColor: colors.background,
    },

    border: {
      borderColor: colors.slate[300],
    },
    head: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    title: {
      fontSize: RFValue(16),
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
      color: colors.slate[650],
    },
  });
