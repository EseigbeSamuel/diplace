import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SelfieVerificationStep from "./capture-selfie";
import EmailVerificationStep from "./email";
import Identification from "./identification";
import Info from "./info";
import Info2 from "./info2";
import PhoneVerificationStep from "./phone";
import Selfie from "./selfie";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useGetCurrentUser } from "@/hooks";
import PersonalDataStep from "./personal";
import AddBankDetails from "./bank";
import { router } from "expo-router";

const Renter = () => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const [current, setCurrent] = useState(1);
  const { currentUser } = useGetCurrentUser();

  const renderStep = () => {
    switch (current) {
      case 1:
        return <Info onNext={handleNext} />;
      case 2:
        return <Selfie onNext={handleNext} />;
      case 3:
        return (
          <SelfieVerificationStep onNext={handleNext} handleBack={handleBack} />
        );
      case 4:
        return <EmailVerificationStep onNext={handleNext} />;
      case 5:
        return <PhoneVerificationStep onNext={handleNext} />;
      case 6:
        return <Identification onNext={handleNext} />;
      case 7:
        if (currentUser?.user_type === "renter") {
          return <Info2 />;
        }
        return <PersonalDataStep onNext={handleNext} />;
      case 8:
        return <AddBankDetails onNext={handleNext} />;
      case 9:
        return <Info2 />;

      default:
        return <Info onNext={handleNext} />;
    }
  };

  const handleNext = () => {
    if (
      (currentUser?.user_type === "renter" && current < 7) ||
      (currentUser?.user_type === "agent" && current < 9)
    ) {
      setCurrent(current + 1);
    }
  };

  const handleBack = () => {
    if (current > 1) {
      setCurrent(current - 1);
    } else {
      // Optionally, you can handle the case when the user is on the first step and presses back
      // For example, you might want to exit the onboarding flow or show a confirmation dialog
      router.push("/onboarding/welcome");
    }
  };

  if (current === 3) {
    return (
      <View style={{ position: "relative", flex: 1 }}>
        <View style={{ flex: 1 }}>{renderStep()}</View>
      </View>
    );
  }

  return (
    <SafeAreaViewContainer>
      {current < (currentUser?.user_type === "renter" ? 7 : 9) && (
        <View className="flex-row items-center justify-between w-full">
          <View>
            <TouchableOpacity
              onPress={handleBack}
              className="p-4 rounded-full w-[50px] "
              style={{ backgroundColor: colors.slate[300] }}
            >
              <Image
                source={require("@/assets/icons/arrow-left-dark.png")}
                className="w-6 h-6"
                style={{ tintColor: colors.slate[650] }}
              />
            </TouchableOpacity>
          </View>
          <Text className="text-xl" style={{ color: colors.slate[650] }}>
            Verify account
          </Text>
          <Text style={Styles.skip} onPress={handleNext}>
            Skip
          </Text>
        </View>
      )}
      <View style={{ flex: 1 }}>{renderStep()}</View>
    </SafeAreaViewContainer>
  );
};

export default Renter;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    skip: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.error[200],
    },
  });
