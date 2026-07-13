import { useGetConversations } from "@/hooks";
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

  const { conversations } = useGetConversations({ limit: 50, skip: 0 });
  const unreadChatsCount = useMemo(() => {
    if (!conversations?.conversations) return 0;
    return conversations.conversations.filter((c) => c.unread_count > 0).length;
  }, [conversations]);

  console.log(userType);

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
            height: hp("9.5%"),
            backgroundColor: colors.background,
            borderTopLeftRadius: RFValue(25),
            borderTopRightRadius: RFValue(25),
            borderTopWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 8,
          },
          tabBarItemStyle: {
            paddingVertical: hp("0.8%"),
          },
        }}
        initialRouteName="index"
      >
        {tabItems(isDarkMode).map((item) => (
          <Tabs.Screen
            key={item.name}
            name={item.name}
            listeners={
              item.name === "add"
                ? {
                    tabPress: (e) => {
                      e.preventDefault();
                      handleAddSpace();
                    },
                  }
                : undefined
            }
            options={{
              href: item.grantPermission.includes(userType) ? undefined : null,
              ...(item.name === "add"
                ? {
                    tabBarLabel: () => null,
                    tabBarIcon: () => (
                      <Pressable
                        onPress={handleAddSpace}
                        style={{
                          top: -RFValue(12),
                          height: RFValue(52),
                          width: RFValue(52),
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            width: RFValue(48),
                            height: RFValue(48),
                            borderRadius: RFValue(24),
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: colors.slate[650],
                            shadowColor: colors.slate[650],
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.25,
                            shadowRadius: 8,
                            elevation: 8,
                          }}
                        >
                          <Image
                            source={
                              isDarkMode
                                ? require("@/assets/icons/plus.png")
                                : require("@/assets/icons/plus-white.png")
                            }
                            style={{ width: RFValue(18), height: RFValue(18) }}
                            resizeMode="contain"
                          />
                        </View>
                      </Pressable>
                    ),
                  }
                : {
                    tabBarLabel: (props) => (
                      <TabBarLabel {...props}>
                        {item.name === "activity" && userType !== "renter" ? "Bookings" : item.label}
                      </TabBarLabel>
                    ),
                    tabBarLabelPosition: "below-icon",
                    tabBarIcon: ({ focused }) => (
                      <CustomTabIcon
                        focused={focused}
                        activeIcon={item.activeIcon}
                        inactiveIcon={item.inactiveIcon}
                        badge={item.name === "chats" ? unreadChatsCount : undefined}
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
