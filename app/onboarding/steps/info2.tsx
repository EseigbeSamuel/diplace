import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import { useGetCurrentUser } from "@/hooks";

const VerificationCompleteStep = () => {
  const { currentUser } = useGetCurrentUser();
  const { colors } = useTheme();
  const Styles = styles(colors);
  const router = useRouter();

  const isAgent = currentUser?.user_type === "agent";

  const baseItems = [
    {
      icon: require("@/assets/icons/Camera - Iconly Pro.png"),
      label: "Selfie",
    },
    {
      icon: require("@/assets/icons/mail-outline-light.png"),
      label: "Email Address",
    },
    {
      icon: require("@/assets/icons/Call - Iconly Pro.png"),
      label: "Phone Number",
    },
    {
      icon: require("@/assets/icons/identification 2.png"),
      label: "Identification Document",
    },
  ];

  const extraItems = [
    {
      icon: require("@/assets/icons/Profile - Iconly Pro.png"),
      label: "Personal Data",
    },
    {
      icon: require("@/assets/icons/bank-light.png"),
      label: "Bank Details",
    },
  ];

  const verificationItems = isAgent ? baseItems : [...baseItems, ...extraItems];

  const handleProceedToHome = () => {
    // Navigate to main app
    router.replace("/(tabs)");
  };
  const handleProceedToPost = () => {
    // Navigate to main app
    router.replace("/views/spaces/add-spaces");
  };

  return (
    <View style={Styles.container}>
      {/* Content */}
      <View style={Styles.contentContainer}>
        {/* Success Badge */}
        <View>
          <View style={Styles.successBadge}>
            <Image
              source={require("@/assets/icons/success-large.png")}
              style={Styles.checkIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Title and Description */}
        <View style={Styles.textContainer}>
          <Text style={Styles.headText}>
            All set! Your account has been verified. 🎉
          </Text>
          <Text style={Styles.descriptionText}>
            Your account verification was successful. Enjoy a wonderful
            experience with DRPlace.
          </Text>
        </View>

        {/* Verification Checklist */}
        <View style={Styles.checklistContainer}>
          {verificationItems.map((item, index) => (
            <View
              key={index}
              style={[
                Styles.checklistItem,
                index === verificationItems.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
            >
              <View style={Styles.checklistIconContainer}>
                <Image
                  source={item.icon}
                  style={Styles.checklistIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={Styles.checklistLabel}>{item.label}</Text>
              <View style={Styles.checkmarkCircle}>
                <Image
                  source={require("@/assets/icons/checkbox-circle-fill.png")}
                  style={Styles.checkmarkIcon}
                  resizeMode="contain"
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Proceed Button */}
      <View style={Styles.buttonContainer}>
        <AppButton
          title="Post a Space Now"
          onPress={handleProceedToPost}
          fullwidth
          size="large"
          variant="secondary"
        />
        <AppButton
          title="Proceed to Home"
          onPress={handleProceedToHome}
          fullwidth
          size="large"
        />
      </View>
    </View>
  );
};

export default VerificationCompleteStep;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingBottom: RFValue(20),
    },
    contentContainer: {
      flex: 1,
      alignItems: "center",
    },

    successBadge: {
      width: RFValue(100),
      height: RFValue(100),
      alignItems: "center",
      justifyContent: "center",
    },
    checkIcon: {
      width: RFValue(140),
      height: RFValue(140),
    },
    textContainer: {
      alignItems: "center",
      marginBottom: RFValue(8),
      marginTop: RFValue(8),
      gap: RFValue(2),
    },
    headText: {
      fontSize: RFValue(24),
      fontWeight: "600",
      lineHeight: RFValue(32),
      color: colors.slate[650],
      textAlign: "center",
    },
    descriptionText: {
      fontSize: RFValue(14),
      lineHeight: RFValue(22),
      color: colors.slate[600],
      textAlign: "center",
    },
    checklistContainer: {
      width: "100%",
      paddingHorizontal: RFValue(8),
      backgroundColor: colors.background,
      borderRadius: RFValue(16),
      borderWidth: 1,
      borderColor: colors.slate[300],
      paddingVertical: RFValue(2),
    },
    checklistItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(12),
      paddingVertical: RFValue(10),
      paddingHorizontal: RFValue(8),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
    },
    checklistIconContainer: {
      width: RFValue(24),
      height: RFValue(24),
      alignItems: "center",
      justifyContent: "center",
    },
    checklistIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    checklistLabel: {
      flex: 1,
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
    },
    checkmarkCircle: {
      width: RFValue(24),
      height: RFValue(24),
      borderRadius: RFValue(12),

      alignItems: "center",
      justifyContent: "center",
    },
    checkmarkIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.success[200],
    },
    buttonContainer: {
      marginTop: RFValue(10),
      flexDirection: "column",
      gap: RFValue(12),
    },
  });
