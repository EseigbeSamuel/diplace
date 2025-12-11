import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Identification from "./steps/identification";
import Info from "./steps/info";
import Info2 from "./steps/info2";
import Selfie from "./steps/selfie";
import SelfieVerificationStep from "./steps/capture-selfie";
import EmailVerificationStep from "./steps/email";
import PhoneVerificationStep from "./steps/phone";

const Renter = () => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const [current, setCurrent] = useState(1);

  const renderStep = () => {
    switch (current) {
      case 1:
        return <Info onNext={handleNext} />;
      case 2:
        return <Selfie onNext={handleNext} />;
      case 3:
        return <SelfieVerificationStep onNext={handleNext} />;
      case 4:
        return <EmailVerificationStep onNext={handleNext} />;
      case 5:
        return <PhoneVerificationStep onNext={handleNext} />;
      case 6:
        return <Identification onNext={handleNext} />;
      case 7:
        return <Info2 />;

      default:
        return <Info onNext={handleNext} />;
    }
  };
  const handleNext = () => {
    if (current < 7) {
      setCurrent(current + 1);
    }
  };

  const handleBack = () => {
    if (current > 1) {
      setCurrent(current - 1);
    }
  };

  if (current === 3) {
    return (
      <View style={{ flex: 1 }}>
        {" "}
        <View className="w-[75%] justify-between px-3  top-16 z-50 fixed items-center flex-row">
          <View>
            <TouchableOpacity
              onPress={handleBack}
              className="p-4 bg-gray-100/50 rounded-full w-[50px] "
            >
              <Image
                source={require("@/assets/icons/arrow-left-dark.png")}
                className="w-6 h-6"
                style={{ tintColor: "#ffffff" }}
              />
            </TouchableOpacity>
          </View>
          <Text className="text-xl text-white">Take a selfie</Text>
        </View>
        <View style={{ flex: 1 }}>{renderStep()}</View>
      </View>
    );
  }

  return (
    <SafeAreaViewContainer>
      {current < 7 && (
        <View className="w-full justify-between items-center flex-row">
          <View>
            <TouchableOpacity
              onPress={handleBack}
              className="p-4 bg-gray-100 rounded-full w-[50px] "
            >
              <Image
                source={require("@/assets/icons/arrow-left-dark.png")}
                className="w-6 h-6"
              />
            </TouchableOpacity>
          </View>
          <Text className="text-xl">Verify account</Text>
          <Text
            style={Styles.skip}
            onPress={handleNext}
            className="text-red-600"
          >
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
    },
  });
