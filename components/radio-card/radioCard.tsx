import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
      className={`flex-row w-full items-center justify-between px-4 py-4 rounded-xl mb-3 
       border-2
      `}
    >
      <View className="flex-row items-center">
        {/* Circle radio */}
        <View
          style={isActive ? Styles.border : Styles.border2}
          className={`  items-center justify-center mr-3 ${
            isActive ? "" : "border-2 h-5 w-5 rounded-full"
          }`}
        >
          {isActive && (
            <Image
              source={require("../../assets/icons/checkbox-circle-fill.png")}
              className="w-5 h-5"
              style={{ tintColor: colors.slate[100] }}
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
      borderColor: colors.slate[100],
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
      color: colors.slate[100],
    },
    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[100],
    },
    small: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[600],
    },
  });
