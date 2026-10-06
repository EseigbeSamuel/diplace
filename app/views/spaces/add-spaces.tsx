import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const AddSpace = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const addSpaceStyles = styles(colors);

  const steps = [
    {
      id: 1,
      title: "Tell us about the space",
      description:
        "Share basic info about the space, like the type of space, location etc.",
      icon: require("@/assets/icons/house.png"),
    },
    {
      id: 2,
      title: "Add gallery",
      description:
        "Add photos and videos: plus a virtual tour to make it stand out.",
      icon: require("@/assets/icons/camera.png"),
    },
    {
      id: 3,
      title: "Tell us about the owner",
      description:
        "Share landlord's info, like name and bank details, plus rental agreements if any.",
      icon: require("@/assets/icons/user.png"),
    },
    {
      id: 4,
      title: "Finish and post",
      description:
        "Add the price for this space, preview details and then post space.",
      icon: require("@/assets/icons/contract.png"),
    },
  ];

  const handleGetStarted = () => {
    // Navigate to first step
    router.push("/views/spaces/add-space/form");
  };

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Add a space" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={addSpaceStyles.container} className="flex-1">
          {/* Main Title */}
          <View className="">
            <Text style={addSpaceStyles.mainTitle} className="font-semibold font-[InstrumentSansBold]">
              Get your space on DiPlace with these easy steps.
            </Text>
          </View>
          {/* Steps List */}
          <View style={addSpaceStyles.stepsList}>
            {steps.map((step, index) => (
              <View key={step.id} style={addSpaceStyles.stepItem}>
                <View style={addSpaceStyles.stepContent} className="flex-row items-start justify-between">
                  <View style={addSpaceStyles.stepTextContainer} className="flex-1">
                    <Text style={addSpaceStyles.stepTitle} className="font-semibold">{step.title}</Text>
                    <Text style={addSpaceStyles.stepDescription}>
                      {step.description}
                    </Text>
                  </View>
                  <View style={[addSpaceStyles.iconWrapper]} className="items-center justify-center">
                    <Image source={step.icon} style={addSpaceStyles.stepIcon} />
                  </View>
                </View>
                {index < steps.length - 1 && (
                  <View style={addSpaceStyles.divider}  className="h-[1px]"/>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Get Started Button - Fixed at bottom */}
      <View style={addSpaceStyles.buttonContainer}>
        <AppButton
          title="Get Started"
          fullwidth={true}
          onPress={handleGetStarted}
          size="large"
          afterIcon={require("@/assets/icons/arrow-right-light.png")}
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default AddSpace;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {paddingHorizontal: RFValue(3),
paddingTop: RFValue(20)},
    mainTitle: {fontSize: RFValue(24),
color: colors.slate[650],
lineHeight: RFValue(30),
marginBottom: RFValue(32),
paddingHorizontal: RFValue(2)},
    stepsList: {
      marginBottom: RFValue(20),
    },
    stepItem: {
      marginBottom: RFValue(4),
    },
    stepContent: {paddingVertical: RFValue(20),
paddingHorizontal: RFValue(2)},
    stepTextContainer: {marginRight: RFValue(16)},
    stepTitle: {fontSize: RFValue(16),
color: colors.slate[650],
marginBottom: RFValue(6)},
    stepDescription: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      lineHeight: RFValue(19),
    },
    iconWrapper: {width: RFValue(50),
height: RFValue(50),
borderRadius: RFValue(12)},
    stepIcon: {
      width: RFValue(40),
      height: RFValue(40),
    },
    divider: {backgroundColor: colors.slate[300],
marginHorizontal: RFValue(2)},
    buttonContainer: {
      paddingVertical: RFValue(20),
      backgroundColor: colors.background,
    },
  });
