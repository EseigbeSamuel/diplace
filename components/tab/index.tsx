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
      className={cn("uppercase")}
      style={{
        fontSize: RFValue(14),
        marginTop: hp(1.2),
        color: colors.slate[650],
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
    // paddingTop: hp(0.4),
    height: RFValue(62),
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
  size?: number;
};

export const CustomTabIcon: React.FC<CustomTabIconProps> = ({
  focused,
  activeIcon,
  inactiveIcon,
}) => {
  return (
    <TabBarIcon
      focused={focused}
      Icon={
        <Image
          source={focused ? activeIcon : inactiveIcon}
          style={{ width: hp("3.5%"), height: hp("3.5%") }}
        />
      }
    />
  );
};
