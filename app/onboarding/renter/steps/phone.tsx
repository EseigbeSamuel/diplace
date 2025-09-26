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

const Phone = ({ onNext }: props) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  return (
    <SafeAreaViewContainer className="flex-col justify-between h-full">
      <View className="gap-5">
        <View>
          <Image source={require("@/assets/icons/Call - Iconly Pro.png")} />
        </View>

        <View>
          <Text style={Styles.headText} className="font-semibold ">
            Verify your phone number
          </Text>
          <Text style={Styles.text}>
            We will send an OTP to your phone number to verify your account.
          </Text>
        </View>
      </View>

      <View className="w-full ">
        <AppButton title="Continue" onPress={onNext} fullwidth />
      </View>
    </SafeAreaViewContainer>
  );
};

export default Phone;
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
