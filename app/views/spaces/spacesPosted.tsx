import { CustomBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import ConfirmDialog from "@/components/confirm-dialog";
import Filter from "@/components/filter";
import HouseCard from "@/components/housecard";
import HouseCardTile from "@/components/houseCardTile";
import Selector from "@/components/selector";
import { spacesPosted } from "@/constants/home";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

const SpacesPosted = ({ layout }: { layout: "tiles" | "box" }) => {
  const { colors } = useTheme();
  const homeStyles = styles(colors);
  const viewSpaceref = useRef<BottomSheetModal>(null);
  const viewUpdateStatus = useRef<BottomSheetModal>(null);
  const [isDialogVisible, setDialogVisible] = useState(false);

  const handleViewSpace = () => {
    viewSpaceref.current?.present();
  };
  const handleViewUpdateStatus = () => {
    viewUpdateStatus.current?.present();
  };

  const handleConfirm = () => {
    console.log("Confirmed");
    setDialogVisible(false);
  };

  const handleCancel = () => {
    console.log("Cancelled");
    setDialogVisible(false);
  };
  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);
  return (
    <View className="flex-1">
      <View className="py-2">
        <Filter size="large" />
      </View>
      <FlatList
        data={spacesPosted}
        renderItem={({ item }) =>
          layout === "box" ? (
            <>
              <HouseCard {...item} onPress={handleViewSpace} />
            </>
          ) : (
            <>
              <HouseCardTile
                imageSource={item.imageSource}
                name={item.title}
                location={item.location}
                price={item.price}
                badgeType={item.badgeType}
                duration={item.duration}
                onPress={handleViewSpace}
              />
            </>
          )
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-4"
      />
      <CustomBottomSheet
        bottomSheetProps={{
          ref: viewSpaceref,
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
          <View className="w-full flex-1 gap-4">
            <AppButton
              title="Update Status"
              className=" w-full"
              onPress={handleViewUpdateStatus}
              afterIcon={require("@/assets/icons/tag.png")}
            />
            <AppButton
              title="Edit Space"
              afterIcon={require("@/assets/icons/edit-pencil.png")}
              className=""
              variant="tertiary"
              onPress={() => {
                router.push("/views/spaces/edit-space");
              }}
            />
            <AppButton
              title="Preview space"
              afterIcon={require("@/assets/icons/show.png")}
              className=""
              variant="tertiary"
              onPress={() => router.push("/views/spaces/preview-space/[id]")}
            />
            <AppButton
              title="Promote space"
              afterIcon={require("@/assets/icons/show.png")}
              className=""
              variant="tertiary"
              onPress={() => {}}
            />
            <AppButton
              title="Remove Space"
              className=" w-full"
              onPress={() => setDialogVisible(true)}
              variant="tertiary"
              afterIcon={require("@/assets/icons/delete.png")}
            />
          </View>
        </View>
      </CustomBottomSheet>
      <CustomBottomSheet
        bottomSheetProps={{
          ref: viewUpdateStatus,
          snapPoints,
          index: 2,
        }}
      >
        <View className="flex-1 py-4 justify-center items-center">
          <View>
            <Text style={homeStyles.title} className="py-4 text-center">
              What is the current status of this property?
            </Text>
          </View>
          <View className="pt-4">
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
            <View className="flex flex-row">
              <Text className="font-semibold" style={homeStyles.subTitle}>
                N600,000
              </Text>
              <Text style={homeStyles.subTitle}>/annum</Text>
            </View>
          </View>
          <View
            className="flex-1 flex-row justify-between items-center p-4 rounded-xl my-4"
            style={homeStyles.bgslate150}
          >
            <View className="flex-1">
              <Text style={homeStyles.textBlack}>Current Status:</Text>
            </View>
            <View
              className="flex flex-row items-center gap-2 px-2 py-1 border border-[#3B82F6] rounded-full"
              style={homeStyles.bgInfo100}
            >
              <Image
                source={require("@/assets/icons/Unlock-fill.png")}
                className="w-4 h-4"
              />
              <Text className="text-[#2563EB]">Available</Text>
            </View>
          </View>
          <View className="w-full flex-1 gap-4">
            <Selector
              image={require("@/assets/icons/Unlock.png")}
              title="Available"
            />
            <Selector
              image={require("@/assets/icons/Lock.png")}
              title="Reserved"
            />
            <Selector
              image={require("@/assets/icons/checkbox-circle-fill.png")}
              title="Rented"
            />
          </View>
          <View className="flex-1 my-4 w-full">
            <AppButton onPress={() => setDialogVisible(true)} title="Update" />
          </View>
        </View>
      </CustomBottomSheet>
      <ConfirmDialog
        visible={isDialogVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Confirm Status Update"
        message="You are about to change the status of this property. Do you wish to proceed?"
      />
      <ConfirmDialog
        visible={isDialogVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Remove Space?"
        message="You are about to delete this space? Renters will not be able to see this space again when you remove it. Do you wish to proceed?"
      />
    </View>
  );
};

export default SpacesPosted;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    textBlack: {
      color: colors.slate[650],
    },
    textBlack1: {
      color: colors.slate[150],
    },
    bgInfo100: {
      backgroundColor: colors.info[100],
    },
    bgslate150: {
      backgroundColor: colors.slate[150],
    },

    title: {
      fontSize: RFValue(20),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
  });
