import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

interface SubstepComponentProps {
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

interface Step {
  name: string;
  substeps: React.ComponentType<SubstepComponentProps>[];
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStepIndex: number;
  currentSubstepIndex: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStepIndex,
  currentSubstepIndex,
}) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  return (
    <View className="flex-row">
      {steps.map((step, index) => {
        let progress = 0;
        if (index < currentStepIndex) {
          progress = 0;
        } else if (index === currentStepIndex) {
          progress = currentSubstepIndex / step.substeps.length;
        }
        return (
          <View
            key={index}
            className="flex-1 h-2 rounded-full overflow-hidden mx-0.5"
            style={Styles.slate250}
          >
            <View
              className="h-full rounded-full"
              style={[Styles.slate650, { width: `${progress * 100}%` }]}
            />
          </View>
        );
      })}
    </View>
  );
};

interface StepperProps {
  steps: Step[];
  onComplete?: () => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentSubstepIndex, setCurrentSubstepIndex] = useState(0);

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

  const handlePrev = () => {
    if (currentSubstepIndex > 0) {
      setCurrentSubstepIndex(currentSubstepIndex - 1);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setCurrentSubstepIndex(steps[currentStepIndex - 1].substeps.length - 1);
    }
  };

  const handleSkip = () => {
    // If NOT on the last step, jump to the next step
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentSubstepIndex(0);
    } else {
      // If last step → just finish the whole form
      if (onComplete) onComplete();
    }
  };

  const CurrentSubstep = steps[currentStepIndex].substeps[currentSubstepIndex];

  return (
    <View className="flex-1">
      <ProgressIndicator
        steps={steps}
        currentStepIndex={currentStepIndex}
        currentSubstepIndex={currentSubstepIndex + 1}
      />
      <View className="flex-1">
        {/* <Text className="text-lg font-bold mb-4">
          {steps[currentStepIndex].name} - Substep {currentSubstepIndex + 1}
        </Text> */}
        <CurrentSubstep
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
        />
      </View>
    </View>
  );
};

export default Stepper;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    slate250: {
      backgroundColor: colors.slate[250],
    },
    slate650: {
      backgroundColor: colors.slate[650],
    },
  });
