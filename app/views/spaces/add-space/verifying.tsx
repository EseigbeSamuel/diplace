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
    <View style={styles.container}>
      <View style={styles.verifyingContainer}>
        <View style={styles.successIconContainer}>
          <View style={styles.successBackGroundIconContainer}></View>
          <Image
            source={require("@/assets/icons/latern.png")} // Use your success icon
            style={styles.successIcon}
          />
        </View>

        <Text style={styles.title}>Verification ongoing</Text>

        <Text style={styles.description}>
          We are verifying your space. This usually takes a few minutes. You'll
          receive an email once we're done and your space will go live on the
          app immediately it succeeds!
        </Text>

        <View style={styles.buttonContainer}>
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
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: RFValue(24),
    },
    verifyingContainer: {
      alignItems: "center",
      width: "100%",
    },
    loaderContainer: {
      width: RFValue(80),
      height: RFValue(80),
      borderRadius: RFValue(40),
      backgroundColor: colors.slate[100],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: RFValue(32),
    },
    title: {
      fontSize: RFValue(24),
      fontWeight: "700",
      color: colors.slate[650],
      textAlign: "center",
      marginBottom: RFValue(16),
    },
    description: {
      fontSize: RFValue(15),
      color: colors.slate[600],
      textAlign: "center",
      lineHeight: RFValue(22),
    },
    successContainer: {
      alignItems: "center",
      width: "100%",
    },
    successIconContainer: {
      borderRadius: RFValue(70),
      justifyContent: "center",
      alignItems: "center",
      marginBottom: RFValue(12),
      position: "relative",
    },
    successBackGroundIconContainer: {
      position: "absolute",
      width: RFValue(150),
      height: RFValue(200),
      borderRadius: RFValue(70),
      opacity: 0.2,
      backgroundColor: colors.warning[100],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: RFValue(32),
    },
    successIcon: {
      width: RFValue(200),
      height: RFValue(200),
    },
    successTitle: {
      fontSize: RFValue(26),
      fontWeight: "700",
      color: colors.slate[650],
      textAlign: "center",
      marginBottom: RFValue(16),
    },
    successDescription: {
      fontSize: RFValue(15),
      color: colors.slate[600],
      textAlign: "center",
      lineHeight: RFValue(22),
      marginBottom: RFValue(40),
    },
    buttonContainer: {
      width: "100%",
      marginTop: RFValue(16),
    },
  });

export default VerificationPage;
