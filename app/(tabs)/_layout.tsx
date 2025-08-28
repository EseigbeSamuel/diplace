import { CustomTabIcon, TabBarLabel } from "@/components/tab";
import { useTheme } from "@/contexts/themeContext";
import { Tabs } from "expo-router";
import React from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const TabLayout = () => {
  const { colors } = useTheme();
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
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: (props) => <TabBarLabel {...props}>Home</TabBarLabel>,
          tabBarLabelPosition: "below-icon",
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              focused={focused}
              activeIcon={require("../../assets/icons/home-active.png")}
              inactiveIcon={require("../../assets/icons/home.png")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarLabel: (props) => (
            <TabBarLabel {...props}>Discover</TabBarLabel>
          ),
          tabBarLabelPosition: "below-icon",
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              focused={focused}
              activeIcon={require("../../assets/icons/discovery-active.png")}
              inactiveIcon={require("../../assets/icons/discovery.png")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          tabBarLabel: (props) => <TabBarLabel {...props}>Chats</TabBarLabel>,
          tabBarLabelPosition: "below-icon",
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              focused={focused}
              activeIcon={require("../../assets/icons/chat-active.png")}
              inactiveIcon={require("../../assets/icons/chat.png")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          tabBarLabel: (props) => (
            <TabBarLabel {...props}>Activity</TabBarLabel>
          ),
          tabBarLabelPosition: "below-icon",
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              focused={focused}
              activeIcon={require("../../assets/icons/activity-active.png")}
              inactiveIcon={require("../../assets/icons/activity.png")}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
