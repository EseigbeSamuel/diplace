import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type props = {
  onNext: () => void;
};

const Selfie = ({ onNext }: props) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  return (
    <View className="flex-col justify-between h-full">
      <View className="gap-4 pt-9 pb-8">
        <View>
          <Image
            source={require("@/assets/icons/Camera - Iconly Pro.png")}
            className="size-14"
            style={{ tintColor: colors.slate[650] }}
          />
        </View>
        <View>
          <Text style={Styles.headText} className="font-semibold pb-1">
            Smile, it’s time for a selfie!
          </Text>
          <Text style={Styles.text}>
            Capture a selfie of you following the instructions in the next
            screen.
          </Text>
        </View>
      </View>
      <View className="w-full mb-6">
        <AppButton title="Continue" onPress={onNext} fullwidth size="large" />
      </View>
    </View>
  );
};

export default Selfie;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    border: {
      borderColor: colors.slate[300],
    },
    headText: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    small: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[600],
    },
  });
