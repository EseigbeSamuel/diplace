import { CustomBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import Filter from "@/components/filter";
import HouseCard from "@/components/housecard";
import HouseCardTile from "@/components/houseCardTile";
import { spacesDrafts } from "@/constants/home";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const SpacesDrafts = ({ layout }: { layout: "tiles" | "box" }) => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  const addSpaceRef = useRef<BottomSheetModal>(null);

  const handleAddSpace = () => {
    addSpaceRef.current?.present();
  };

  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);
  return (
    <View className="flex-1">
      <View className="py-2">
        <Filter size="large" />
      </View>
      <FlatList
        data={spacesDrafts}
        renderItem={({ item }) =>
          layout === "box" ? (
            <HouseCard {...item} onPress={handleAddSpace} />
          ) : (
            <HouseCardTile
              imageSource={item.imageSource}
              name={item.title}
              location={item.location}
              badgeType={item.badgeType}
              onPress={handleAddSpace}
            />
          )
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-4"
      />
      <CustomBottomSheet
        bottomSheetProps={{
          ref: addSpaceRef,
          snapPoints,
          index: 2,
        }}
      >
        <View className="flex-1 py-4 justify-center items-center">
          <View>
            <Image
              source={require("@/assets/images/featuredSpaceImage1.png")}
              className="h-[100px] w-[100px] rounded-xl"
            />
          </View>
          <View className="flex-1 gap-1 items-center justify-center py-2">
            <Text style={homeStyles.textBlack}>
              2 Bedroom in-suite apartment
            </Text>
            <Text style={homeStyles.subTitle}>Rewheremuara, Port Harcourt</Text>
          </View>
          <View className="w-full flex-1 gap-3 py-4">
            <AppButton
              title="Edit Space"
              afterIcon={require("@/assets/icons/edit-pencil.png")}
              className=""
              onPress={() => {}}
            />
            <AppButton
              title="Remove Space"
              className=" w-full"
              onPress={() => {}}
              variant="tertiary"
              afterIcon={require("@/assets/icons/delete.png")}
            />
          </View>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default SpacesDrafts;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    textBlack: {
      color: colors.slate[650],
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
