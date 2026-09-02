import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { useGetCurrentUser } from "@/hooks";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type InfoProps = {
  onNext: () => void;
  completedVerifications?: {
    face?: boolean;
    email?: boolean;
    phone?: boolean;
    identity?: boolean;
  };
};

const VerifyAccountInfoStep = ({
  onNext,
  completedVerifications,
}: InfoProps) => {
  const { currentUser } = useGetCurrentUser();
  const { colors } = useTheme();
  const Styles = styles(colors);
  const renderVerificationItem = ({
    icon,
    label,
    completed,
    last,
  }: {
    icon: number;
    label: string;
    completed?: boolean;
    last?: boolean;
  }) => (
    <View style={[Styles.listItem, last && Styles.lastListItem]}>
      <View style={Styles.listItemLeft}>
        <Image source={icon} style={Styles.listIcon} resizeMode="contain" />
        <Text style={Styles.listText}>{label}</Text>
      </View>
      {completed ? (
        <Image
          source={require("@/assets/icons/checkbox-circle-fill.png")}
          style={Styles.completedIcon}
          resizeMode="contain"
        />
      ) : null}
    </View>
  );

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
            {renderVerificationItem({
              icon: require("@/assets/icons/Camera - Iconly Pro.png"),
              label: "Selfie",
              completed: completedVerifications?.face,
            })}

            {renderVerificationItem({
              icon: require("@/assets/icons/mail-outline-light.png"),
              label: "Email Address",
              completed: completedVerifications?.email,
            })}

            {renderVerificationItem({
              icon: require("@/assets/icons/Call - Iconly Pro.png"),
              label: "Phone Number",
              completed: completedVerifications?.phone,
            })}

            {renderVerificationItem({
              icon: require("@/assets/icons/identification 2.png"),
              label: "Identification Document",
              completed: completedVerifications?.identity,
              last: currentUser?.user_type !== "agent",
            })}

            {currentUser?.user_type === "agent" && (
              <>
                {renderVerificationItem({
                  icon: require("@/assets/icons/Profile - Iconly Pro.png"),
                  label: "Personal Data",
                })}
                {renderVerificationItem({
                  icon: require("@/assets/icons/bank-light.png"),
                  label: "Bank Details",
                  last: true,
                })}
              </>
            )}
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
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(8),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
    },
    listItemLeft: {
      alignItems: "center",
      flexDirection: "row",
      flex: 1,
      gap: RFValue(12),
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
      flex: 1,
      fontSize: RFValue(15),
      lineHeight: RFValue(22),
      color: colors.slate[650],
      fontWeight: "500",
    },
    completedIcon: {
      height: RFValue(22),
      tintColor: colors.success[300],
      width: RFValue(22),
    },
    buttonContainer: {
      marginTop: RFValue(20),
    },
  });
