// Home.tsx
import AppButton from "@/components/button";
import Filter from "@/components/filter";
import { AppHeader } from "@/components/header";
import HouseCard from "@/components/housecard";
import SafeAreaViewContainer from "@/components/safeareaview";
import { featuredSpaces, spacesNearby, Tabs } from "@/constants/home";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

const Home = () => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);

  return (
    <SafeAreaViewContainer>
      <View className="gap-2">
        <AppHeader
          title={
            <View className="gap-2">
              <Text style={homeStyles.title} className="font-semibold">
                Welcome Sarhmy! 👋
              </Text>
              <Pressable
                onPress={() => router.push("/views/location")}
                className="flex-row items-center gap-2"
              >
                <Image source={require("@/assets/icons/location.png")} />
                <Text style={homeStyles.subTitle} className="text-[#60646C]">
                  14 Amadi Str, Rumuewhera
                </Text>
                <Image source={require("@/assets/icons/angle.png")} />
              </Pressable>
            </View>
          }
        />
        <Filter
          size="small"
          // onFocus={() => {
          //   router.push("/views/searchPage");
          // }}
        />
      </View>
      <FlatList
        data={Tabs}
        contentContainerClassName="gap-2"
        renderItem={({ item }) => (
          <View className="h-[60px] my-4">
            <AppButton
              title={item.name}
              size="small"
              onPress={() => {}}
              variant="tertiary"
              className="border-4 border-green-500"
            />
          </View>
        )}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={spacesNearby}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View className="pt-[38px] pb-4 flex flex-row justify-between">
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

            <Text style={homeStyles.title} className="pt-8 pb-4 font-semibold">
              Spaces Nearby 📍
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View className="pb-8">
            <HouseCard
              {...item}
              onPress={() => router.push("/views/place-details/[id]")}
            />
          </View>
        )}
      />
    </SafeAreaViewContainer>
  );
};

export default Home;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
  });
