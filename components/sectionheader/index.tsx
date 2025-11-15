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
  const { colors } = useTheme();
  const Styles = styles(colors);
  return (
    <View className="flex flex-row items-center justify-between pb-2">
      <TouchableOpacity
        onPress={onLeftIconPress || handleBackPress}
        className="p-4 rounded-full"
        style={Styles.container}
      >
        <Image
          source={require("@/assets/icons/arrow-left-dark.png")}
          className="w-6 h-6"
        />
      </TouchableOpacity>
      <Text className="text-lg font-semibold">{title}</Text>
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
      backgroundColor: colors.background,
    },
  });
