import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const PaymentReceipt = () => {
  const { colors, isDarkMode } = useTheme();
  const custom = styles(colors);
  const router = useRouter();

  return (
    <SafeAreaViewContainer>
      <View className="flex-col gap-5 h-[80%]">
        <View className="mb-5">
          <Text style={custom.subTitle} className=" text-center font-medium ">
            Payment Reciept
          </Text>
        </View>

        <View style={custom.border} className="border rounded-3xl p-5">
          <View className="w-full flex-col justify-center items-center py-7 px-5">
            <View className="bg-[#D1FAE5] border border-[#22C55E] rounded-full items-center justify-center size-14 ">
              <Image
                source={require("@/assets/icons/badge-check-green.png")}
                className="size-10"
              />
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
            className="py-7 px-5 border-dotted border-y flex-col gap-5 "
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

          <View className="flex-row items-center w-full justify-between px-5 py-5">
            <Text style={custom.small}> Total Amount</Text>
            <Text style={custom.subTitle} className=" font-semibold">
              $1000
            </Text>
          </View>

          <View className="flex-row items-center justify-center  gap-5">
            <View className="flex-row items-center gap-5">
              {isDarkMode ? (
                <Image
                  source={require("@/assets/icons/Download - Iconly Pro-1.png")}
                  className="size-10 "
                />
              ) : (
                <Image
                  source={require("@/assets/icons/Download - Iconly Pro.png")}
                  className="size-10 "
                />
              )}
              <Text style={custom.smallDark}>Download</Text>
            </View>
            <View className="flex-row items-center gap-3">
              {isDarkMode ? (
                <Image
                  source={require("@/assets/icons/share-solid.png")}
                  className="size-10 "
                />
              ) : (
                <Image
                  source={require("@/assets/icons/share.png")}
                  className="size-10"
                />
              )}

              <Text style={custom.smallDark}>Share</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex flex-col gap-3 py-4">
        <AppButton title="View Schedule" onPress={() => {}} size="large" />
        <AppButton
          title="Back Home"
          onPress={() => {
            router.replace("/(tabs)");
          }}
          size="large"
          variant="tertiary"
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default PaymentReceipt;

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
    smallDark: {
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
