import { CustomBottomSheet } from "@/components/bottom-sheet";
import { CustomTabIcon, TabBarLabel } from "@/components/tab";
import { useTheme } from "@/contexts/themeContext";
import { useUser } from "@/contexts/user-context";
import { tabItems } from "@/utils/permissions";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import React, { useMemo, useRef } from "react";
import { Image, Pressable, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import AddSpaceBottomSheet from "../views/spaces/components/AddSpacesBottomContainer";

const TabLayout = () => {
  const { colors, isDarkMode } = useTheme();
  const { userType } = useUser();

  const addSpaceRef = useRef<BottomSheetModal>(null);

  const handleAddSpace = () => {
    addSpaceRef.current?.present();
  };

  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: hp("11.57%"),
            backgroundColor: colors.background,
            paddingBottom: hp(0.8),
            paddingTop: hp(0.5),
            borderTopLeftRadius: RFValue(30),
            borderTopRightRadius: RFValue(30),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.12,
            shadowRadius: 6,

            // Android shadow
            elevation: 10,
          },

          tabBarItemStyle: {
            paddingVertical: hp(0.8),
            backgroundColor: colors.background,
          },
        }}
        initialRouteName="index"
      >
        {tabItems(isDarkMode).map((item) => (
          <Tabs.Screen
            key={item.name}
            name={item.name}
            options={{
              href: item.grantPermission.includes(userType) ? undefined : null,
              ...(item.name === "add"
                ? {
                    tabBarLabel: () => null,
                    tabBarIcon: () => (
                      <Pressable onPress={handleAddSpace}>
                        <View
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 100,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: colors.slate[650],
                          }}
                        >
                          <Image
                            source={
                              isDarkMode
                                ? require("@/assets/icons/plus.png")
                                : require("@/assets/icons/plus-white.png")
                            }
                            style={{ width: 48, height: 48 }}
                            resizeMode="contain"
                          />
                        </View>
                      </Pressable>
                    ),
                  }
                : {
                    tabBarLabel: (props) => (
                      <TabBarLabel {...props}>{item.label}</TabBarLabel>
                    ),
                    tabBarLabelPosition: "below-icon",
                    tabBarIcon: ({ focused }) => (
                      <CustomTabIcon
                        focused={focused}
                        activeIcon={item.activeIcon}
                        inactiveIcon={item.inactiveIcon}
                      />
                    ),
                  }),
            }}
          />
        ))}
      </Tabs>
      <CustomBottomSheet
        bottomSheetProps={{
          ref: addSpaceRef,
          snapPoints,
          index: 2,
          enableContentPanningGesture: true,
          enableHandlePanningGesture: true,
          enablePanDownToClose: true,
        }}
      >
        <AddSpaceBottomSheet
          colors={colors}
          closeSheet={() => addSpaceRef.current?.close()}
        />
      </CustomBottomSheet>
    </View>
  );
};

export default TabLayout;
