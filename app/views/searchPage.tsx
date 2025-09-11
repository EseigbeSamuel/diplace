import Filter from "@/components/filter";
import HouseCardTile from "@/components/houseCardTile";
import SafeAreaViewContainer from "@/components/safeareaview";
import { spacesData } from "@/constants/home";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
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
            router.push("/views/place-details/[id]");
          }}
        >
          <FlatList
            data={spacesData}
            renderItem={({ item }) => (
              <HouseCardTile
                imageSource={item.imageSource}
                name={item.name}
                location={item.location}
                price={item.price}
                duration={item.duration}
              />
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
