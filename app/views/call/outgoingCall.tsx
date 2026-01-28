import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const OutgoingCall = () => {
  const { colors, isDarkMode } = useTheme();
  const custom = styles(colors);
  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Calling ibe" />
      <View style={custom.container2} className="h-full w-full flex flex-col ">
        <View className="flex flex-col h-full w-full justify-center items-center">
          <View className="rounded-full size-[200px] ">
            <Image
              source={require("@/assets/images/user.png")}
              className="h-full w-full"
            />
          </View>
          <Text style={custom.text}>Ibe Alex</Text>
          <Text style={[custom.small, { fontFamily: "InstrumentSansItalic" }]}>
            Calling
          </Text>
        </View>

        <View className="flex-col flex justify-end ">
          <View
            style={custom.container}
            className="py-2 px-4 gap-3 rounded-3xl flex-row flex items-center "
          >
            <View className="rounded-full p-2 ">
              <Image source={require("@/assets/icons/chat.png")} />
            </View>
            <View
              style={{ backgroundColor: colors.success[300] }}
              className="rounded-full p-2  "
            >
              <Image source={require("@/assets/icons/calling.png")} />
            </View>
            <View className="rounded-full p-2 ">
              <Image
                style={{ backgroundColor: colors.warning[300] }}
                source={require("@/assets/icons/calling.png")}
              />{" "}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaViewContainer>
  );
};

export default OutgoingCall;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    container2: { backgroundColor: colors.slate[150] },
    border: {
      borderColor: colors.slate[300],
    },
    big: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    title: {
      fontSize: RFValue(20),
      lineHeight: RFValue(28),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(16),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    small: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },

    smallDrak: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    tiny: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[650],
    },
  });
