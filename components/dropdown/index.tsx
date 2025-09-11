// import { ChevronDown } from "lucide-react-native";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type DropdownOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

type DropdownProps = {
  options: DropdownOption[];
  selected: DropdownOption;
  onSelect: (option: DropdownOption) => void;
};

const Dropdown = ({ options, selected, onSelect }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();
  const Styles = styles(colors);
  return (
    <View className="relative">
      {/* Dropdown Button */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={Styles.container}
        className="flex-row items-center px-3 py-2 w-[100px] rounded-xl border "
      >
        {selected.icon && <View className="mr-2">{selected.icon}</View>}
        <Text style={Styles.text} className="text-gray-800">
          {selected.label}
        </Text>
        {/* <ChevronDown size={16} color="#6b7280" style={{ marginLeft: 4 }} /> */}
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {open && (
        <View
          style={Styles.container}
          className="absolute right-0 mt-2 w-36 rounded-lg shadow-lg border z-50"
        >
          <FlatList
            data={options}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  onSelect(item);
                  setOpen(false);
                }}
                className="flex-row items-center px-3 py-2"
              >
                {item.icon && <View className="mr-2">{item.icon}</View>}
                <Text className="text-gray-800">{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Dropdown;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.slate[150],
      borderColor: colors.slate[300],
    },

    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
    },
  });
