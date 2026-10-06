import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";

interface VerificationPageProps {
  onViewSpaces: () => void;
}

const VerificationPage: React.FC<VerificationPageProps> = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const styles = createStyles(colors);

  const onViewSpaces = () => {
    router.push("/(tabs)/spaces");
  };

  return (
    <View style={styles.container} className="flex-1 justify-center items-center">
      <View  className="items-center w-[100%px]">
        <View style={styles.successIconContainer} className="justify-center items-center relative">
          <View style={styles.successBackGroundIconContainer} className="absolute opacity-[0.2] justify-center items-center"></View>
          <Image
            source={require("@/assets/icons/latern.png")} // Use your success icon
            style={styles.successIcon}
          />
        </View>

        <Text style={styles.title} className="font-bold text-center">Verification ongoing</Text>

        <Text style={styles.description} className="text-center">
          We are verifying your space. This usually takes a few minutes. You'll
          receive an email once we're done and your space will go live on the
          app immediately it succeeds!
        </Text>

        <View style={styles.buttonContainer} className="w-[100%px]">
          <AppButton
            title="View Your Spaces"
            onPress={onViewSpaces}
            size="large"
            fullwidth={true}
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {backgroundColor: colors.background,
paddingHorizontal: RFValue(24)},
    verifyingContainer: {},
    loaderContainer: {width: RFValue(80),
height: RFValue(80),
borderRadius: RFValue(40),
backgroundColor: colors.slate[100],
marginBottom: RFValue(32)},
    title: {fontSize: RFValue(24),
color: colors.slate[650],
marginBottom: RFValue(16)},
    description: {fontSize: RFValue(15),
color: colors.slate[600],
lineHeight: RFValue(22)},
    successContainer: {},
    successIconContainer: {borderRadius: RFValue(70),
marginBottom: RFValue(12)},
    successBackGroundIconContainer: {width: RFValue(150),
height: RFValue(200),
borderRadius: RFValue(70),
backgroundColor: colors.warning[100],
marginBottom: RFValue(32)},
    successIcon: {
      width: RFValue(200),
      height: RFValue(200),
    },
    successTitle: {fontSize: RFValue(26),
color: colors.slate[650],
marginBottom: RFValue(16)},
    successDescription: {fontSize: RFValue(15),
color: colors.slate[600],
lineHeight: RFValue(22),
marginBottom: RFValue(40)},
    buttonContainer: {marginTop: RFValue(16)},
  });

export default VerificationPage;
