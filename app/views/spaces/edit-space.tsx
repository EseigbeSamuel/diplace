import AppButton from "@/components/button";
import Filter from "@/components/filter";
import NumericField from "@/components/NumberField";
import { SimpleSelector } from "@/components/selector";
import StepperWithHeader from "@/components/steps/stepper-header";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

const Substep1: React.FC<{ onNext: () => void; onPrev: () => void }> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  return (
    <View className="flex-1 pt-8 pb-4">
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        enableAutomaticScroll={true}
      >
        <View className="py-4 flex-1">
          <Text className="font-semibold" style={Styles.title}>
            What type of property is this space?
          </Text>

          <View className="flex flex-1 flex-col gap-3 pt-4">
            <SimpleSelector title="Apartment" />
            <SimpleSelector title="Event Center" />
            <SimpleSelector title="Shop" />
            <SimpleSelector title="Office" />
          </View>
          <View className="flex flex-1 ">
            <Text className="font-semibold py-4" style={Styles.title}>
              How many units are available?
            </Text>
            <NumericField />
          </View>
        </View>
        <View>
          <AppButton onPress={onNext} title="Next" />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const Substep2: React.FC<{ onNext: () => void; onPrev: () => void }> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  return (
    <View className="flex-1 pt-8 pb-4">
      <View className="py-4 flex-1">
        <Text className="font-semibold" style={Styles.title}>
          What type of property is this space?
        </Text>

        <View className="flex flex-1 flex-col gap-3 pt-4">
          <SimpleSelector title="Indoor " />
          <SimpleSelector title="Open air / Outdoor" />
        </View>
      </View>
      <View>
        <AppButton onPress={onNext} title="Next" />
      </View>
    </View>
  );
};
const Substep3: React.FC<{ onNext: () => void; onPrev: () => void }> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  return (
    <View className="flex-1 pt-8 pb-4">
      <View className="py-4 flex-1">
        <Text className="font-semibold" style={Styles.title}>
          Where is this property located?
        </Text>
        <Filter />
        {/* would enter location which should reflect in the map below */}
        <View className="bg-gray-300 h-[300px]">
          <Text>Map</Text>
        </View>
      </View>
      <View>
        <AppButton onPress={onNext} title="Next" />
      </View>
    </View>
  );
};
const Substep4: React.FC<{ onNext: () => void; onPrev: () => void }> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  return (
    <View className="flex-1 pt-8 pb-4">
      <View className="py-4 flex-1">
        <Text className="font-semibold" style={Styles.title}>
          Let&apos;s know the capacity of the space.
        </Text>
        <View className="py-8 flex-1 flex-col">
          <View className="flex flex-row justify-between pb-6">
            <Text style={Styles.subTitle} className="w-[50%]">
              What is the capacity of the hall?
            </Text>
            <View>
              <TextInput
                placeholder="250 Cap"
                className="rounded-md p-5 border-[1px] border-style-[solid]"
                placeholderTextColor={colors.slate[600]}
                style={[Styles.borderDarkGray, Styles.textBlack]}
              />
            </View>
          </View>
          <View className="flex flex-row justify-between pb-6">
            <Text style={Styles.subTitle} className="w-[50%]">
              What is the estimated size of the space?
            </Text>
            <View>
              <TextInput
                placeholder="30ft X 75ft"
                className="rounded-md p-5 border-[1px] border-style-[solid]"
                placeholderTextColor={colors.slate[600]}
                style={[Styles.borderDarkGray, Styles.textBlack]}
              />
            </View>
          </View>
          <View className="flex flex-row justify-between pb-6">
            <Text style={Styles.subTitle} className="w-[50%]">
              How many changing rooms are there?
            </Text>
            <View>
              <NumericField />
            </View>
          </View>
          <View className="flex flex-row justify-between pb-6">
            <Text style={Styles.subTitle} className="w-[50%]">
              How many bathrooms are there?
            </Text>
            <View>
              <NumericField />
            </View>
          </View>
        </View>
      </View>
      <View>
        <AppButton onPress={onNext} title="Next" />
      </View>
    </View>
  );
};

const EditSteps: React.FC = () => {
  const steps = [
    {
      name: "Step 1",
      substeps: [Substep1, Substep2, Substep3, Substep4, Substep1],
    },
    {
      name: "Step 2",
      substeps: [Substep1, Substep2, Substep1],
    },
  ];

  const handleComplete = () => {
    console.log("All steps completed!");
  };

  return <StepperWithHeader steps={steps} onComplete={handleComplete} />;
};

export default EditSteps;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    textBlack: {
      color: colors.slate[650],
    },
    checkbox: {
      //   backgroundColor: colors.slate[650],
      color: colors.slate[650],
    },
    checkboxButton: {color: colors.slate[100],
borderColor: colors.slate[600]},
    borderDarkGray: {borderColor: colors.slate[600]},
    borderLightGray: {borderColor: colors.slate[300]},
    title: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(16),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
  });
