import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { StyleSheet, Text, View } from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
export default function OwnersHome() {
  const { colors } = useTheme();
  const homeStyles = styles(colors);

  return (
    <SafeAreaViewContainer>
      <View className="gap-2">
        <Text style={{ fontFamily: "InstrumentSansBold" }} className="text-2xl">
          Owners Home
        </Text>
      </View>
    </SafeAreaViewContainer>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
  });
