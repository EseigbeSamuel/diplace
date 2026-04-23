import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const IncomingCall = () => {
  const { colors, isDarkMode } = useTheme();
  const custom = styles(colors);
  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Calling ibe" />
      <View className="h-[80%] w-full flex flex-col ">
        <View className="flex flex-col h-full w-full justify-center items-center">
          <View className="rounded-full size-[200px] ">
            <Image
              source={require("@/assets/images/user.png")}
              className="h-full w-full"
            />
          </View>
          <Text style={custom.text}>Ibe Alex</Text>
          <Text style={[custom.small, { fontFamily: "InstrumentSansItalic" }]}>
            Not Answerd
          </Text>
        </View>

        <View className="flex-col flex justify-end items-center w-full ">
          <View
            style={custom.container2}
            className="py-3 px-5 gap-10 rounded-full flex-row flex justify-between items-center "
          >
            <View
              style={{ backgroundColor: colors.slate[300] }}
              className="rounded-full p-3 flex-row items-center gap-2 "
            >
              <Image
                source={
                  isDarkMode
                    ? require("@/assets/icons/chat.png")
                    : require("@/assets/icons/chat-dark.png")
                }
                className="size-6"
              />
              <Text style={custom.text} className="font-medium">
                Chat
              </Text>
            </View>
            <View
              style={{ backgroundColor: "#22C55E" }}
              className="rounded-full p-3 flex-row items-center gap-2 "
            >
              <Image
                source={require("@/assets/icons/call-up-light.png")}
                className="size-6"
              />
              <Text style={custom.text} className="font-medium ">
                Redial
              </Text>
            </View>
            {/* <View
              style={{ backgroundColor: "#EF4444" }}
              className="rounded-full p-3 "
            >
              <Image
                source={require("@/assets/icons/call-down-light.png")}
                className="size-6"
              />
            </View> */}
          </View>
        </View>
      </View>
    </SafeAreaViewContainer>
  );
};

export default IncomingCall;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    container2: { backgroundColor: colors.slate[200] },
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
