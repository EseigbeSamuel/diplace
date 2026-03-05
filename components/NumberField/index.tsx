import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface NumericFieldProps {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  shadowed?: boolean;
}

const NumericField: React.FC<NumericFieldProps> = ({
  value,
  onChange,
  minValue = 0,
  maxValue = 100,
  shadowed = false,
}) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  const handleIncrement = () => {
    if (value < maxValue) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > minValue) {
      onChange(value - 1);
    }
  };

  return (
    <View
      className="flex-row items-center justify-between rounded-xl"
      style={[!shadowed ? Styles.borderDarkGray : Styles.shadowed]}
    >
      <Text className="text-xl font-bold" style={Styles.textBlack}>
        {value}
      </Text>

      <View className="flex-col">
        <Pressable
          onPress={handleIncrement}
          hitSlop={8}
          style={Styles.stepperButton}
        >
          <Text className="text-xl font-bold" style={Styles.textBlack}>
            +
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDecrement}
          hitSlop={8}
          style={Styles.stepperButton}
        >
          <Text className="text-xl font-bold" style={Styles.textBlack}>
            -
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NumericField;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    textBlack: {
      color: colors.slate[650],
    },
    borderDarkGray: {
      width: 104,
      minHeight: 54,
      borderRadius: 12,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: colors.slate[450],
      backgroundColor: colors.slate[150],
      paddingHorizontal: 10,
      paddingVertical: 6,
      alignItems: "center",
    },
    shadowed: {
      width: 104,
      minHeight: 54,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(0,0,0,0.15)",
      alignItems: "center",
    },
    stepperButton: {
      minWidth: 28,
      minHeight: 22,
      alignItems: "center",
      justifyContent: "center",
    },
  });
