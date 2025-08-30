// Home.tsx
import AppButton from "@/components/button";
import Filter from "@/components/filter";
import { AppHeader } from "@/components/header";
import HouseCard from "@/components/housecard";
import SafeAreaViewContainer from "@/components/safeareaview";
import { FeaturedSpaces, SpacesNearby, Tabs } from "@/constants/home";
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
      <FlatList
        data={Tabs}
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

      <ScrollView showsVerticalScrollIndicator={false}>
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
        <View>
          <FlatList
            data={FeaturedSpaces}
            renderItem={({ item }) => (
              <View className="mr-6">
                <HouseCard {...item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <Text style={homeStyles.title} className="font-semibold pt-8 pb-4">
            Spaces Nearby 📍
          </Text>
          <FlatList
            data={SpacesNearby}
            renderItem={({ item }) => (
              <View className="pb-8">
                <HouseCard {...item} />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
          />
        </View>
        <AppButton
          title="View more"
          onPress={() => router.push("/views/apartments")}
          afterIcon={require("@/assets/icons/arrow-right-light.png")}
          size="large"
        />

        <View className="pt-[38px] pb-4 flex flex-row justify-between">
          <Text style={homeStyles.title} className="font-semibold">
            Recently Added🆕
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

        <View>
          <FlatList
            data={FeaturedSpaces}
            renderItem={({ item }) => (
              <View className="mr-6">
                <HouseCard {...item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <Text style={homeStyles.title} className="font-semibold pt-8 pb-4">
            Recommended 👍
          </Text>
          <FlatList
            data={SpacesNearby}
            renderItem={({ item }) => (
              <View className="pb-8">
                <HouseCard {...item} />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
          />
        </View>
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
