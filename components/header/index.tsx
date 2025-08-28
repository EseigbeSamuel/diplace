// src/components/common/Header.tsx
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface HeaderProps {
  title: string | React.ReactNode;
}

export const AppHeader = (props: HeaderProps) => {
  const { colors } = useTheme();
  const headerStyles = styles(colors);

  return (
    <View style={headerStyles.container} className="flex-row justify-between">
      {typeof props.title === "string" ? (
        <Text className="text-2xl font-bold">{props.title}</Text>
      ) : (
        props.title
      )}

      <View className="flex-row items-end gap-2">
        <View className="h-[48px] w-[48px] rounded-full relative bg-[#F9F9FB] justify-center items-center">
          <Image source={require("@/assets/icons/notification.png")} />
          <View className="absolute top-0 right-0 items-center justify-center w-[18px] h-[18px] font-semibold bg-red-500 rounded-full">
            <Text className="text-xs text-white">2</Text>
          </View>
        </View>
        <View className="h-[48px] w-[48px] rounded-full bg-[#F9F9FB]">
          <Image source={require("@/assets/images/user.png")} />
        </View>
      </View>
    </View>
  );
};

const styles = (colors: ColorScheme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      color: colors.slate[650],
    },
    title: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
    },
  });
};
