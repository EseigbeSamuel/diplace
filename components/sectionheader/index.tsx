import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HeaderComponentProps {
  title?: string;
  rightIconSource?: ImageSourcePropType;
  onRightIconPress?: () => void;
  rightIconView?: React.ReactNode;
  onLeftIconPress?: () => void;
  isTransparent?: boolean;
}

const SectionHeader = ({
  title,
  rightIconSource,
  rightIconView,
  onRightIconPress,
  onLeftIconPress,
  isTransparent = false,
}: HeaderComponentProps) => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };
  const { colors, isDarkMode } = useTheme();
  const Styles = styles(colors);
  return (
    <View className="z-50 flex flex-row items-center justify-between p-2">
      <TouchableOpacity
        onPress={onLeftIconPress || handleBackPress}
        className="items-center justify-center w-12 h-12 rounded-full"
        style={Styles.container}
      >
        <Image
          source={
            isDarkMode
              ? require("@/assets/icons/arrow-left-light.png")
              : require("@/assets/icons/arrow-left-dark.png")
          }
          className="w-6 h-6"
        />
      </TouchableOpacity>

      <Text
        style={{ color: colors.slate[650] }}
        className="text-lg font-semibold"
      >
        {title}
      </Text>
      {rightIconView ? (
        <View>{rightIconView}</View>
      ) : (
        <TouchableOpacity
          onPress={onRightIconPress}
          className="items-center justify-center w-12 h-12 rounded-full"
          style={Styles.container}
        >
          {rightIconSource ? (
            <Image source={rightIconSource} className="w-6 h-6" />
          ) : null}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.slate[200],
    },
  });
