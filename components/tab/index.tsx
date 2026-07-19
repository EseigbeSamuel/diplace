import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/contexts/themeContext";
import { cn } from "@/utils";
import { RFValue } from "react-native-responsive-fontsize";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export const TabBarLabel = ({
  focused,
  children,
  title,
}: {
  focused: boolean;
  color: string;
  children: string;
  title?: string;
}): React.ReactNode => {
  const { colors } = useTheme();
  return (
    <Text
      style={{
        fontSize: RFValue(10.5),
        marginTop: RFValue(2),
        fontWeight: focused ? "600" : "500",
        color: focused ? colors.slate[650] : colors.slate[600],
      }}
    >
      {title ?? children}
    </Text>
  );
};

const tabBarIconBaseStyle = StyleSheet.create({
  container: {
    width: hp(5),
    height: hp(5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(2.5),
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: RFValue(24),
  },
});

interface TabBarIconProps {
  focused: boolean;
  Icon: React.ReactNode;
}

export const TabBarIcon = ({ focused, Icon }: TabBarIconProps) => {
  return (
    <View style={tabBarIconBaseStyle.iconWrapper}>
      <View>{Icon}</View>
    </View>
  );
};

type CustomTabIconProps = {
  focused: boolean;
  activeIcon: ImageSourcePropType;
  inactiveIcon: ImageSourcePropType;
  badge?: number;
  showDot?: boolean;
  size?: number;
};

export const CustomTabIcon: React.FC<CustomTabIconProps> = ({
  focused,
  activeIcon,
  inactiveIcon,
  badge,
  showDot,
  size = RFValue(22),
}) => {
  const { colors } = useTheme();

  return (
    <TabBarIcon
      focused={focused}
      Icon={
        <View style={{ position: "relative" }}>
          <Image
            source={focused ? activeIcon : inactiveIcon}
            style={{
              width: size,
              height: size,
              tintColor: focused ? colors.slate[650] : colors.slate[600],
            }}
            resizeMode="contain"
          />
          {badge !== undefined && badge > 0 ? (
            <View
              style={{
                position: "absolute",
                top: -RFValue(4),
                right: -RFValue(6),
                minWidth: RFValue(15),
                height: RFValue(15),
                borderRadius: RFValue(7.5),
                backgroundColor: colors.error[200] || "#EF4444",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 3,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: RFValue(8.5),
                  fontWeight: "bold",
                }}
              >
                {badge}
              </Text>
            </View>
          ) : showDot ? (
            <View
              style={{
                position: "absolute",
                top: -RFValue(2),
                right: -RFValue(3),
                width: RFValue(7),
                height: RFValue(7),
                borderRadius: RFValue(3.5),
                backgroundColor: colors.error[200] || "#EF4444",
              }}
            />
          ) : null}
        </View>
      }
    />
  );
};
