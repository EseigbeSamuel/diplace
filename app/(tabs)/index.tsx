// Home.tsx
import Filter from "@/components/filter";
import { AppHeader } from "@/components/header";
import HouseCard from "@/components/pagecomponents/home/housecard";
import SafeAreaViewContainer from "@/components/safeareaview";
import { FeaturedSpaces, SpacesNearby } from "@/constants/home";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";
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

const Home = () => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);

  return (
    <SafeAreaViewContainer>
      <View className="">
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
        <Filter size="large" />
      </View>
      <View className="pt-[38px] pb-4 flex flex-row justify-between">
        <Text style={homeStyles.title} className="font-semibold">
          Featured Space 🔥
        </Text>

        <Pressable
          onPress={() => router.push("/views/location")}
          className="flex-row items-center gap-2"
        >
          <Text>View More</Text>
          <Image
            source={require("@/assets/icons/arrow-right-dark.png")}
            className="w-[20px] h-[20px]"
          />
        </Pressable>
      </View>
      <ScrollView>
        <FlatList
          data={FeaturedSpaces}
          renderItem={({ item }) => <HouseCard {...item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          className=""
        />

        <Text style={homeStyles.title} className="font-semibold pt-8 pb-4">
          Spaces Nearby 📍
        </Text>
        <FlatList
          data={SpacesNearby}
          renderItem={({ item }) => <HouseCard {...item} />}
          scrollEnabled
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
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
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
    },
  });
