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
      className={cn("uppercase font-semibold")}
      style={{
        fontSize: RFValue(9.5),
        marginTop: RFValue(4),
        color: focused ? colors.slate[650] : colors.slate[400],
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
  size?: number;
};

export const CustomTabIcon: React.FC<CustomTabIconProps> = ({
  focused,
  activeIcon,
  inactiveIcon,
  badge,
}) => {
  const { colors } = useTheme();

  return (
    <TabBarIcon
      focused={focused}
      Icon={
        <View style={{ position: "relative" }}>
          <Image
            source={focused ? activeIcon : inactiveIcon}
            style={{ width: RFValue(22), height: RFValue(22) }}
            resizeMode="contain"
          />
          {badge !== undefined && badge > 0 && (
            <View
              style={{
                position: "absolute",
                top: -RFValue(4),
                right: -RFValue(6),
                minWidth: RFValue(14),
                height: RFValue(14),
                borderRadius: RFValue(7),
                backgroundColor: colors.error[200],
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 2.5,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: RFValue(8),
                  fontWeight: "bold",
                }}
              >
                {badge}
              </Text>
            </View>
          )}
        </View>
      }
    />
  );
};
