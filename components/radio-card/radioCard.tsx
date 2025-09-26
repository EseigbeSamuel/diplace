import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
  const isActive = selected === value;

  return (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      activeOpacity={0.8}
      className={`flex-row w-full items-center justify-between px-4 py-3 rounded-xl mb-3 
        ${
          isActive
            ? "border-2 border-white bg-[#ffffff10]"
            : "border border-gray-500"
        }
      `}
    >
      <View className="flex-row items-center">
        {/* Circle radio */}
        <View className="h-5 w-5 rounded-full border-2 border-white items-center justify-center mr-3">
          {isActive && <View className="h-2.5 w-2.5 rounded-full bg-white" />}
        </View>

        {/* Label */}
        <Text className="text-white text-base">{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RadioCard;
