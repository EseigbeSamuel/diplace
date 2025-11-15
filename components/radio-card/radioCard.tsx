import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type RadioCardProps = {
  label: string;
  value: string;
  selected: string;
  onSelect: (value: string) => void;
};

const RadioCard: React.FC<RadioCardProps> = ({
  label,
  value,
  selected,
  onSelect,
}) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const isActive = selected === value;

  return (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      activeOpacity={0.8}
      style={isActive ? Styles.border : Styles.border2}
      className={`flex-row w-full items-center justify-between px-4 py-3 rounded-xl mb-3 
       border-2
      `}
    >
      <View className="flex-row items-center">
        {/* Circle radio */}
        <View
          style={isActive ? Styles.border : Styles.border2}
          className="h-5 w-5 rounded-full border-2 items-center justify-center mr-3"
        >
          {isActive && (
            <View
              style={Styles.container}
              className="h-2.5 w-2.5 rounded-full "
            />
          )}
        </View>

        {/* Label */}
        <Text style={Styles.text} className="text-white text-base">
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RadioCard;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    border: {
      borderColor: colors.slate[650],
    },
    border2: {
      borderColor: colors.slate[300],
    },
    container: {
      backgroundColor: colors.slate[650],
    },
    headText: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    small: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[600],
    },
  });
