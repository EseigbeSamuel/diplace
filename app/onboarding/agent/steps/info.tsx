import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type InfoProps = {
  onNext: () => void;
};

const VerifyAccountInfoStep = ({ onNext }: InfoProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  return (
    <View style={Styles.container}>
      {/* Icon and Content */}
      <View style={{ flex: 1 }}>
        <ScrollView
          style={Styles.contentContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {/* 3D Icon */}
          <View style={Styles.iconContainer}>
            <Image
              source={require("@/assets/icons/verify-file-3d.png")}
              style={Styles.icon3d}
              resizeMode="contain"
            />
          </View>

          {/* Title and Description */}
          <View style={Styles.textContainer}>
            <Text style={Styles.headText}>Verify your account</Text>
            <Text style={Styles.descriptionText}>
              To help connect you with verified agents, we have to collect some
              info to verify your account.
            </Text>
          </View>

          {/* Verification Items List */}
          <View style={Styles.listContainer}>
            {/* Selfie */}
            <View style={Styles.listItem}>
              <Image
                source={require("@/assets/icons/Camera - Iconly Pro.png")}
                style={Styles.listIcon}
                resizeMode="contain"
              />
              <Text style={Styles.listText}>Selfie</Text>
            </View>

            {/* Email Address */}
            <View style={Styles.listItem}>
              <Image
                source={require("@/assets/icons/mail-outline-light.png")}
                style={Styles.listIcon}
                resizeMode="contain"
              />
              <Text style={Styles.listText}>Email Address</Text>
            </View>

            {/* Phone Number */}
            <View style={Styles.listItem}>
              <Image
                source={require("@/assets/icons/Call - Iconly Pro.png")}
                style={Styles.listIcon}
                resizeMode="contain"
              />
              <Text style={Styles.listText}>Phone Number</Text>
            </View>

            {/* Identification Document */}
            <View style={[Styles.listItem]}>
              <Image
                source={require("@/assets/icons/identification 2.png")}
                style={Styles.listIcon}
                resizeMode="contain"
              />
              <Text style={Styles.listText}>Identification Document</Text>
            </View>

            <View style={[Styles.listItem]}>
              <Image
                source={require("@/assets/icons/Profile - Iconly Pro.png")}
                style={Styles.listIcon}
                resizeMode="contain"
              />
              <Text style={Styles.listText}>Personal Data</Text>
            </View>
            <View style={[Styles.listItem, Styles.lastListItem]}>
              <Image
                source={require("@/assets/icons/bank-light.png")}
                style={Styles.listIcon}
                resizeMode="contain"
              />
              <Text style={Styles.listText}>Bank Details</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Continue Button */}
      <View style={Styles.buttonContainer}>
        <AppButton title="Continue" onPress={onNext} fullwidth size="large" />
      </View>
    </View>
  );
};

export default VerifyAccountInfoStep;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingBottom: RFValue(20),
    },
    contentContainer: {
      flex: 1,
      gap: RFValue(12),
      paddingTop: RFValue(40),
    },
    iconContainer: {
      marginBottom: RFValue(8),
    },
    icon3d: {
      width: RFValue(120),
      height: RFValue(120),
    },
    textContainer: {
      gap: RFValue(8),
    },
    headText: {
      fontSize: RFValue(24),
      fontWeight: "600",
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    descriptionText: {
      fontSize: RFValue(14),
      lineHeight: RFValue(22),
      color: colors.slate[600],
    },
    listContainer: {
      width: "100%",
      paddingHorizontal: RFValue(8),
      backgroundColor: colors.background,
      borderRadius: RFValue(16),
      borderWidth: 1,
      borderColor: colors.slate[300],
      paddingVertical: RFValue(8),
      marginTop: RFValue(8),
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(12),
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(8),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
    },
    lastListItem: {
      borderBottomWidth: 0,
    },
    listIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[600],
    },
    listText: {
      fontSize: RFValue(15),
      lineHeight: RFValue(22),
      color: colors.slate[650],
      fontWeight: "500",
    },
    buttonContainer: {
      marginTop: RFValue(20),
    },
  });
