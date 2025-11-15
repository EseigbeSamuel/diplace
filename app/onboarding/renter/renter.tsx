import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Identification from "./steps/identification";
import Info from "./steps/info";
import Info2 from "./steps/info2";
import Phone from "./steps/phone";
import Selfie from "./steps/selfie";

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
        return <Phone onNext={handleNext} />;
      case 4:
        return <Identification onNext={handleNext} />;
      case 5:
        return <Info2 />;

      default:
        return <Info onNext={handleNext} />;
    }
  };
  const handleNext = () => {
    if (current < 5) {
      setCurrent(current + 1);
    }
  };

  const handleBack = () => {
    if (current > 1) {
      setCurrent(current - 1);
    }
  };
  return (
    <SafeAreaViewContainer>
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
        <Text style={Styles.skip} onPress={handleNext} className="text-red-600">
          Skip
        </Text>
      </View>
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
