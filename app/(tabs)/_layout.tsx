import { CustomTabIcon, TabBarLabel } from "@/components/tab";
import { useTheme } from "@/contexts/themeContext";
import { tabItems } from "@/utils/permissions";
import { Tabs } from "expo-router";
import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const TabLayout = () => {
  const { colors } = useTheme();
  const userRole: "tenant" | "agents" = "agents";
  return (
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
      {tabItems.map((item) => {
        if (!item.grantPermission.includes(userRole)) {
          return (
            <Tabs.Screen
              key={item.name}
              name={item.name}
              options={{ href: null }}
            />
          );
        }
        return (
          <Tabs.Screen
            key={item.name}
            name={item.name}
            options={{
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
            }}
          />
        );
      })}
    </Tabs>
  );
};

export default TabLayout;
