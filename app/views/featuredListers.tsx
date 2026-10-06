import Dropdown from "@/components/dropdown";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useFeaturedListers } from "@/hooks";
import { ColorScheme } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type DropdownOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

const FeaturedListers = () => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const navigation = useNavigation();
  const { featuredListers, isLoading, refetch } = useFeaturedListers();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const options: DropdownOption[] = [
    { id: "grid", label: "Grid" },
    { id: "list", label: "List" },
  ];

  const [selected, setSelected] = useState<DropdownOption>(options[0]);

  // Load saved layout on mount
  useEffect(() => {
    const loadLayout = async () => {
      const saved = await AsyncStorage.getItem("layout_type");
      if (saved) {
        const found = options.find((o) => o.id === saved);
        if (found) setSelected(found);
      }
    };

    loadLayout();
  }, []);

  // Save layout whenever the user changes it
  const handleSelect = async (option: DropdownOption) => {
    setSelected(option);
    await AsyncStorage.setItem("layout_type", option.id);
  };

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
            onSelect={handleSelect}
          />
        </View>
      </View>

      <View className="h-full px-3">
        {isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color={colors.slate[650]} />
          </View>
        ) : featuredListers.length === 0 ? (
          <View className="py-20 items-center justify-center">
            <Text style={Styles.subTitle}>No featured listers found.</Text>
          </View>
        ) : selected.id === "grid" ? (
          <FlatList
            data={featuredListers}
            key={"grid"}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerClassName="gap-4 pb-28"
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
                tintColor={colors.slate[650]}
              />
            }
            renderItem={({ item }) => (
              <View
                style={[Styles.back, Styles.border]}
                className="flex-1 max-w-[48%] border rounded-xl shadow-lg p-3"
              >
                <Image
                  source={item.imageSource}
                  className="w-14 h-14 rounded-full self-center mb-2"
                />
                <View className="grid gap-1">
                  <Text
                    style={Styles.title}
                    className="font-medium capitalize"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View className="flex flex-row items-center w-full">
                    <Image source={require("@/assets/icons/location.png")} />
                    <Text
                      style={Styles.subTitle}
                      className="capitalize"
                      numberOfLines={1}
                    >
                      {item.location}{" "}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center w-full justify-between">
                    <View className="flex flex-row items-center gap-1">
                      <Image
                        source={require("@/assets/icons/star.png")}
                        className="size-[18px]"
                      />
                      <Text style={Styles.text} className="font-medium">
                        {item.rating}
                      </Text>
                    </View>
                    <View>
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
            data={featuredListers}
            key={"list"}
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 pb-28"
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
                tintColor={colors.slate[650]}
              />
            }
            renderItem={({ item }) => (
              <View
                style={[Styles.back, Styles.border]}
                className="flex flex-row border gap-3 items-center shadow-lg rounded-2xl p-3 w-full"
              >
                <Image
                  source={item.imageSource}
                  className="w-12 h-12 rounded-full"
                />
                <View className="flex-1">
                  <Text
                    style={Styles.title}
                    className="font-medium capitalize"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View className="flex flex-row items-center">
                    <Image source={require("@/assets/icons/location.png")} />
                    <Text style={Styles.subTitle} numberOfLines={1}>
                      {item.location}{" "}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center w-full justify-between">
                    <View className="flex flex-row gap-1 items-center flex-shrink">
                      <Image
                        source={require("@/assets/icons/star.png")}
                        className="size-[18px]"
                      />
                      <Text style={Styles.text} className="font-medium">
                        {item.rating}
                      </Text>
                      {item.reviews > 0 && (
                        <Text style={Styles.small} className="text-blue-500">
                          ({item.reviews} Reviews)
                        </Text>
                      )}
                    </View>
                    <View>
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


export default FeaturedListers;

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
    borderShadow: {shadowColor: colors.slate[650],
shadowOffset: { width: 0, height: 2 }},
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
