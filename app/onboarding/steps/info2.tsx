import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { useGetCurrentUser } from "@/hooks";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

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
    <View style={Styles.container} className="flex-1 justify-between">
      {/* Content */}
      <View  className="flex-1 items-center">
        {/* Success Badge */}
        <View>
          <View style={Styles.successBadge} className="items-center justify-center">
            <Image
              source={require("@/assets/icons/success-large.png")}
              style={Styles.checkIcon}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Title and Description */}
        <View style={Styles.textContainer} className="items-center">
          <Text style={Styles.headText} className="font-semibold text-center">
            All set! Your account has been verified. 🎉
          </Text>
          <Text style={Styles.descriptionText} className="text-center">
            Your account verification was successful. Enjoy a wonderful
            experience with DRPlace.
          </Text>
        </View>

        {/* Verification Checklist */}
        <View style={Styles.checklistContainer} className="w-[100%px] border-[1px]">
          {verificationItems.map((item, index) => (
            <View
              key={index}
              style={[
                Styles.checklistItem,
                index === verificationItems.length - 1 && {
                  borderBottomWidth: 0,
                },
              ]}
             className="flex-row items-center border-b">
              <View style={Styles.checklistIconContainer} className="items-center justify-center">
                <Image
                  source={item.icon}
                  style={Styles.checklistIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={Styles.checklistLabel} className="flex-1 font-medium">{item.label}</Text>
              <View style={Styles.checkmarkCircle} className="items-center justify-center">
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
      <View style={Styles.buttonContainer} className="flex-col">
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
    container: {paddingBottom: RFValue(20)},
    contentContainer: {},

    successBadge: {width: RFValue(100),
height: RFValue(100)},
    checkIcon: {
      width: RFValue(140),
      height: RFValue(140),
    },
    textContainer: {marginBottom: RFValue(8),
marginTop: RFValue(8),
gap: RFValue(2)},
    headText: {fontSize: RFValue(24),
lineHeight: RFValue(32),
color: colors.slate[650]},
    descriptionText: {fontSize: RFValue(14),
lineHeight: RFValue(22),
color: colors.slate[600]},
    checklistContainer: {paddingHorizontal: RFValue(8),
backgroundColor: colors.background,
borderRadius: RFValue(16),
borderColor: colors.slate[300],
paddingVertical: RFValue(2)},
    checklistItem: {gap: RFValue(12),
paddingVertical: RFValue(10),
paddingHorizontal: RFValue(8),
borderBottomColor: colors.slate[300]},
    checklistIconContainer: {width: RFValue(24),
height: RFValue(24)},
    checklistIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    checklistLabel: {fontSize: RFValue(15),
color: colors.slate[650]},
    checkmarkCircle: {width: RFValue(24),
height: RFValue(24),
borderRadius: RFValue(12)},
    checkmarkIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.success[200],
    },
    buttonContainer: {marginTop: RFValue(10),
gap: RFValue(12)},
  });
