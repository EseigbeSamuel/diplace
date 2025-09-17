import { CustomBottomSheet } from "@/components/bottom-sheet";
import { CustomTabIcon, TabBarLabel } from "@/components/tab";
import { useTheme } from "@/contexts/themeContext";
import { useUser } from "@/contexts/user-context";
import { tabItems } from "@/utils/permissions";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import React, { useMemo, useRef } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const TabLayout = () => {
  const { colors } = useTheme();
  const { userType } = useUser();

  const addSpaceRef = useRef<BottomSheetModal>(null);

  const handleAddSpace = () => {
    addSpaceRef.current?.present();
  };

  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: hp("11.57%"),
            backgroundColor: colors.background,
            opacity: 40,
            paddingBottom: hp(0.8),
            paddingTop: hp(0.5),
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          tabBarItemStyle: {
            paddingVertical: hp(0.8),
          },
        }}
        initialRouteName="index"
      >
        {tabItems.map((item) => (
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
                            source={require("@/assets/icons/Plus.png")}
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
        }}
      >
        <View style={{ padding: 20 }}>
          <Text>Add Space</Text>
        </View>
      </CustomBottomSheet>
    </>
  );
};

export default TabLayout;
