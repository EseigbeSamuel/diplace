import { useTheme } from "@/contexts/themeContext";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";
import { ProgressIndicator } from ".";
import AppButton from "../button";
import SafeAreaViewContainer from "../safeareaview";
import SectionHeader from "../sectionheader";

interface SubstepComponentProps {
  onNext: () => void;
  onPrev: () => void;
}

interface Step {
  name: string;
  substeps: React.ComponentType<SubstepComponentProps>[];
}

interface StepperWithHeaderProps {
  steps: Step[];
  onComplete?: () => void;
}

const StepperWithHeader: React.FC<StepperWithHeaderProps> = ({
  steps,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentSubstepIndex, setCurrentSubstepIndex] = useState(0);
  const navigation = useNavigation();
  const { colors } = useTheme();

  const handlePrev = () => {
    if (currentSubstepIndex > 0) {
      setCurrentSubstepIndex(currentSubstepIndex - 1);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setCurrentSubstepIndex(steps[currentStepIndex - 1].substeps.length - 1);
    } else if (currentSubstepIndex === 0 && currentStepIndex === 0) {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    const currentStep = steps[currentStepIndex];
    if (currentSubstepIndex < currentStep.substeps.length - 1) {
      setCurrentSubstepIndex(currentSubstepIndex + 1);
    } else if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentSubstepIndex(0);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handleSaveAndEditLater = () => {
    // navigation.navigate(screen: "/"); // Adjust 'Home' to your actual home screen route name
  };

  const CurrentSubstep = steps[currentStepIndex].substeps[currentSubstepIndex];

  const rightIconView = (
    <AppButton
      title="Save & Edit"
      variant="tertiary"
      onPress={handleSaveAndEditLater}
    />
  );

  return (
    <SafeAreaViewContainer>
      <SectionHeader
        onLeftIconPress={handlePrev}
        onRightIconPress={handleSaveAndEditLater}
        rightIconView={rightIconView}
      />
      <ProgressIndicator
        steps={steps}
        currentStepIndex={currentStepIndex}
        currentSubstepIndex={currentSubstepIndex + 1}
      />
      <View className="flex-1">
        <CurrentSubstep onNext={handleNext} onPrev={handlePrev} />
      </View>
    </SafeAreaViewContainer>
  );
};

export default StepperWithHeader;
