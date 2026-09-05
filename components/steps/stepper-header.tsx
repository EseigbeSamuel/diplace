import { useTheme } from "@/contexts/themeContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { ProgressIndicator } from ".";
import AppButton from "../button";
import SafeAreaViewContainer from "../safeareaview";
import SectionHeader from "../sectionheader";

interface SubstepComponentProps {
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  // searchData?: any;
}

interface Step {
  name: string;
  substeps: React.ComponentType<SubstepComponentProps>[];
}

interface StepperWithHeaderProps {
  steps: Step[];
  onComplete?: () => void;
  initialStepIndex?: number;
  initialSubstepIndex?: number;
  onSaveAndEditLater?: () => Promise<void> | void;
  rightActionTitle?: string;
}

const StepperWithHeader: React.FC<StepperWithHeaderProps> = ({
  steps,
  onComplete,
  initialStepIndex = 0,
  initialSubstepIndex = 0,
  onSaveAndEditLater,
  rightActionTitle = "Save as Draft",
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [currentSubstepIndex, setCurrentSubstepIndex] =
    useState(initialSubstepIndex);
  const router = useRouter();
  const { colors } = useTheme();

  // type StepperRouteParams = { searchData?: any };
  // const route =
  //   useRoute<RouteProp<Record<string, StepperRouteParams>, string>>();
  // const [searchData, setSearchData] = useState<any>(null);

  // useEffect(() => {
  //   if (route.params?.searchData) {
  //     setSearchData(route.params.searchData);
  //     // Optionally, reset params to avoid re-triggering
  //     navigation.setParams({ searchData: undefined } as any);
  //   }
  // }, [route.params]);
  const handlePrev = () => {
    if (currentSubstepIndex > 0) {
      setCurrentSubstepIndex(currentSubstepIndex - 1);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setCurrentSubstepIndex(steps[currentStepIndex - 1].substeps.length - 1);
    } else if (currentSubstepIndex === 0 && currentStepIndex === 0) {
      router.back();
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

  const handleSkip = () => {
    // If current step still has substeps left — SKIP all of them
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentSubstepIndex(0);
    } else {
      // last step — just complete the thing
      if (onComplete) onComplete();
    }
  };

  const handleSaveAndEditLater = () => {
    onSaveAndEditLater?.();
  };

  const CurrentSubstep = steps[currentStepIndex].substeps[currentSubstepIndex];

  const rightIconView = (
    <AppButton
      title={rightActionTitle}
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
        <CurrentSubstep
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default StepperWithHeader;
