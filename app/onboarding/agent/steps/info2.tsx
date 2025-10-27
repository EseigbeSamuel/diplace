import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type InfoProps = {
  onNext: () => void;
};

const Info2 = ({ onNext }: InfoProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const route = useRouter();

  return (
    <SafeAreaViewContainer className="items-center flex-col justify-between h-full gap-4">
      <View className=" items-center justify-center gap-5 w-full">
        <View>
          <Image source={require("@/assets/icons/verify-file-3d.png")} />
        </View>
        <View>
          <Text style={Styles.headText} className="font-semibold ">
            All set! Your account has been verified. 🎉
          </Text>
          <Text style={Styles.text}>
            Your account verification was successful. Enjoy a wonderful
            experience with DiPlace.
          </Text>
        </View>
        <View
          style={Styles.border}
          className="rounded-2xl p-5 border w-full gap-5 "
        >
          <View
            style={Styles.border}
            className="border-b flex-row items-center gap-2 "
          >
            <Image
              source={require("@/assets/icons/Camera - Iconly Pro.png")}
              className="size-[30px]"
            />
            <View>
              <Text style={Styles.small}>Selfie</Text>
            </View>
          </View>
          <View
            style={Styles.border}
            className="border-b flex-row items-center gap-2 "
          >
            <Image
              source={require("@/assets/icons/Call - Iconly Pro.png")}
              className="size-[30px]"
            />
            <View>
              <Text style={Styles.small}>Phone Number</Text>
            </View>
          </View>
          <View className="border-b flex-row items-center gap-2 ">
            <Image
              source={require("@/assets/icons/ID solid.png")}
              className="size-[30px]"
            />
            <View>
              <Text style={Styles.small}>Identification Document</Text>
            </View>
          </View>
          <View className="border-b flex-row items-center gap-2 ">
            <Image
              source={require("@/assets/icons/ID solid.png")}
              className="size-[30px]"
            />
            <View>
              <Text style={Styles.small}>Personal Data</Text>
            </View>
          </View>
          <View className=" flex-row items-center gap-2 ">
            <Image
              source={require("@/assets/icons/ID solid.png")}
              className="size-[30px]"
            />
            <View>
              <Text style={Styles.small}>Bank Details</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="w-full ">
        <AppButton
          title="Post a Space Now"
          onPress={() => route.navigate("/(tabs)")}
          fullwidth
        />
      </View>
      <View className="w-full ">
        <AppButton
          title="Proceed to Home"
          onPress={() => route.navigate("/(tabs)")}
          fullwidth
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default Info2;

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
