import AppButton from "@/components/button";
import StepperWithHeader from "@/components/steps/stepper-header";
import React from "react";
import { Text, View } from "react-native";

const Substep1: React.FC<{ onNext: () => void; onPrev: () => void }> = ({
  onNext,
  onPrev,
}) => (
  <View>
    <Text>Content for Step 1, Substep 1</Text>
    <View>
      <AppButton onPress={onNext} title="Next" />
    </View>
  </View>
);

const Substep2: React.FC<{ onNext: () => void; onPrev: () => void }> = ({
  onNext,
  onPrev,
}) => (
  <View>
    <Text>Content for Step 1, Substep 2</Text>
    <View>
      <AppButton onPress={onNext} title="Next" />
    </View>
  </View>
);

const EditSteps: React.FC = () => {
  const steps = [
    {
      name: "Step 1",
      substeps: [Substep1, Substep2, Substep1, Substep2, Substep1],
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
