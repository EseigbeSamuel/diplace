import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      className="flex-row items-center justify-between p-2 rounded-xl w-[100px]"
      style={[!shadowed ? Styles.borderDarkGray : Styles.shadowed]}
    >
      <Text className="text-xl font-bold" style={Styles.textBlack}>
        {value}
      </Text>

      <View className="flex-col">
        <Pressable onPress={handleIncrement} className=" mb-1">
          <Text className="text-xl font-bold" style={Styles.textBlack}>
            ˄
          </Text>
        </Pressable>

        <TouchableOpacity onPress={handleDecrement}>
          <Text className="text-xl font-bold" style={Styles.textBlack}>
            ˅
          </Text>
        </TouchableOpacity>
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
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: colors.slate[450],
      backgroundColor: colors.slate[150],
    },
    shadowed: {
      paddingHorizontal: 12,
      backgroundColor: colors.background,

      ...Platform.select({
        ios: {
          shadowColor: colors.slate[650],
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
        },
        android: {
          borderBottomWidth: 1,
          borderBottomColor: "rgba(0,0,0,0.15)",
        },
      }),
    },
  });
