import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useNavigation } from "@react-navigation/native";
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
}

const SectionHeader = ({
  title,
  rightIconSource,
  rightIconView,
  onRightIconPress,
  onLeftIconPress,
}: HeaderComponentProps) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };
  const { colors, isDarkMode } = useTheme();
  const Styles = styles(colors);
  return (
    <View className="flex flex-row items-center justify-between pb-2">
      <TouchableOpacity
        onPress={onLeftIconPress || handleBackPress}
        className="items-center justify-center rounded-full h-11 w-11"
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
      <TouchableOpacity
        onPress={onRightIconPress}
        className="p-4"
        style={Styles.container}
      >
        {rightIconSource ? (
          <Image source={rightIconSource} className="w-6 h-6" />
        ) : (
          rightIconView
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.slate[150],
    },
  });
