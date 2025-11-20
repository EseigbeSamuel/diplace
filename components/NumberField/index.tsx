import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface NumericFieldProps {
  onChange?: (value: number) => void;
  initialValue?: number;
  minValue?: number;
  maxValue?: number;
}

const NumericField: React.FC<NumericFieldProps> = ({
  onChange,
  initialValue = 0,
  minValue = 0,
  maxValue = 100,
}) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const [value, setValue] = useState<number>(initialValue);

  const handleIncrement = () => {
    if (value < maxValue) {
      const newValue = value + 1;
      setValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (value > minValue) {
      const newValue = value - 1;
      setValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  return (
    <View
      className="flex-row items-center justify-between p-2 rounded-lg w-[100px]"
      style={Styles.borderDarkGray}
    >
      <Text className="text-xl font-bold" style={Styles.textBlack}>
        {value}
      </Text>
      <View className="flex-col">
        <Pressable onPress={handleIncrement} className="mb-1">
          <Text className="text-xl font-bold" style={Styles.textBlack}>
            ⬆
          </Text>
        </Pressable>
        <TouchableOpacity onPress={handleDecrement}>
          <Text className="text-xl font-bold " style={Styles.textBlack}>
            ⬇
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NumericField;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    textBlack: {
      color: colors.slate[650],
    },
    borderDarkGray: {
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: colors.slate[600],
    },
  });
