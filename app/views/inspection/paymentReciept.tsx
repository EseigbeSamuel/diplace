import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const PaymentReciept = () => {
  const { colors } = useTheme();
  const custom = styles(colors);

  return (
    <SafeAreaViewContainer>
      <View>
        <View>
          <Text>Payment Reciept </Text>
        </View>

        <View style={custom.border} className="border rounded p-5">
          <View className="w-full flex-row justify-center">
            <View className="bg-[#D1FAE5] border border-[#22C55E] rounded-full ">
              <Image source={require("@/assets/icons/badge-check-green.png")} />
            </View>
            <View>
              <Text style={custom.title} className="font-semibold text-center ">
                Payment Success 🎉
              </Text>
              <Text style={custom.small} className="text-center">
                Your payment has been successfully processed.
              </Text>
            </View>
          </View>

          <View
            style={custom.border}
            className="p-5 border-dotted border-y flex-col gap-5 "
          >
            <View className="flex-row justify-between w-full items-center ">
              <Text style={custom.small}>Reference number</Text>
              <Text style={custom.text} className="font-medium ">
                0247001241746{" "}
              </Text>
            </View>
            <View className="flex-row justify-between w-full items-center ">
              <Text style={custom.small}>Date & time</Text>
              <Text style={custom.text} className="font-medium ">
                05 Aug 2025, 10:34 AM{" "}
              </Text>
            </View>
            <View className="flex-row justify-between w-full items-center ">
              <Text style={custom.small}>Payment method</Text>
              <Text style={custom.text} className="font-medium ">
                Bank transfer{" "}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center w-full justify-between">
            <Text> Total Amount</Text>
            <Text>$1000</Text>
          </View>

          <View className="flex-row items-center justify-center gap-5">
            <View className="flex-row items-center gap-3">
              <Image
                source={require("@/assets/icons/Download - Iconly Pro.png")}
              />
              <Text>Download</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Image source={require("@/assets/icons/share.png")} />{" "}
              <Text>Share</Text>
            </View>
          </View>
        </View>

        <View className="flex flex-col gap-3 py-4">
          <AppButton title="View Schedule" onPress={() => {}} size="large" />
          <AppButton
            title="Back Home"
            onPress={() => {}}
            size="large"
            variant="tertiary"
          />
        </View>
      </View>
    </SafeAreaViewContainer>
  );
};

export default PaymentReciept;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    background: {
      backgroundColor: colors.background,
    },
    back: { backgroundColor: colors.slate[150] },
    border: {
      borderColor: colors.slate[300],
      backgroundColor: colors.slate[150],
    },
    border2: {
      borderColor: colors.slate[650],
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
    tiny: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[650],
    },
  });
