import { useTheme } from "@/contexts/themeContext";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type Props = {
  selectedType: string;
  onSelectType: (type: string) => void;

  rooms: number;
  setRooms: (val: number) => void;

  baths: number;
  setBaths: (val: number) => void;

  onPressCity: () => void;
  onPressNeighborhood: () => void;

  onClear: () => void;
  onApply: () => void;
};

const PROPERTY_TYPES = ["Any", "Apartment", "Shop", "Office", "Event center"];

export default function FilterBottomSheets({
  selectedType,
  onSelectType,
  rooms,
  setRooms,
  baths,
  setBaths,
  onPressCity,
  onPressNeighborhood,
  onClear,
  onApply,
}: Props) {
  const { colors } = useTheme();

  const Counter = ({
    value,
    onIncrease,
    onDecrease,
  }: {
    value: number;
    onIncrease: () => void;
    onDecrease: () => void;
  }) => (
    <View className="flex-row items-center gap-3">
      <TouchableOpacity
        onPress={onDecrease}
        className="w-8 h-8 rounded-full border items-center justify-center"
        style={{ borderColor: colors.slate[300] }}
      >
        <Text style={{ fontSize: RFValue(16), color: colors.slate[650] }}>
          −
        </Text>
      </TouchableOpacity>

      <Text style={{ fontSize: RFValue(16), color: colors.slate[650] }}>
        {value}
      </Text>

      <TouchableOpacity
        onPress={onIncrease}
        className="w-8 h-8 rounded-full border items-center justify-center"
        style={{ borderColor: colors.slate[300] }}
      >
        <Text style={{ fontSize: RFValue(16), color: colors.slate[650] }}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="items-center mb-4">
        <Text style={{ fontSize: RFValue(20), color: colors.slate[650] }}>
          Filters
        </Text>
      </View>

      {/* Property Type */}
      <View className="mb-5 gap-2">
        <Text style={{ fontSize: RFValue(14), color: colors.slate[600] }}>
          Property type
        </Text>

        <View className="flex-row flex-wrap gap-2">
          {PROPERTY_TYPES.map((item) => {
            const isActive = selectedType === item;

            return (
              <TouchableOpacity
                key={item}
                onPress={() => onSelectType(item)}
                className="px-3 py-2 rounded-full border"
                style={{
                  borderColor: colors.slate[300],
                  backgroundColor: isActive ? colors.slate[650] : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(14),
                    color: isActive ? "#fff" : colors.slate[650],
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Location */}
      <View className="mb-5 gap-2">
        <Text style={{ fontSize: RFValue(14), color: colors.slate[600] }}>
          Location
        </Text>

        <TouchableOpacity
          onPress={onPressCity}
          className="px-3 py-3 rounded-lg"
          style={{ backgroundColor: colors.slate[150] }}
        >
          <Text style={{ fontSize: RFValue(16), color: colors.slate[650] }}>
            City
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPressNeighborhood}
          className="px-3 py-3 rounded-lg mt-2"
          style={{ backgroundColor: colors.slate[150] }}
        >
          <Text style={{ fontSize: RFValue(16), color: colors.slate[650] }}>
            Neighborhood
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rooms */}
      <View className="flex-row justify-between items-center mb-5">
        <Text style={{ fontSize: RFValue(16), color: colors.slate[650] }}>
          No. of rooms
        </Text>

        <Counter
          value={rooms}
          onIncrease={() => setRooms(rooms + 1)}
          onDecrease={() => setRooms(Math.max(0, rooms - 1))}
        />
      </View>

      {/* Baths */}
      <View className="flex-row justify-between items-center mb-5">
        <Text style={{ fontSize: RFValue(16), color: colors.slate[650] }}>
          No. of baths
        </Text>

        <Counter
          value={baths}
          onIncrease={() => setBaths(baths + 1)}
          onDecrease={() => setBaths(Math.max(0, baths - 1))}
        />
      </View>

      {/* Footer */}
      <View
        className="flex-row justify-between items-center pt-3 border-t mt-auto"
        style={{ borderColor: colors.slate[200] }}
      >
        <TouchableOpacity onPress={onClear}>
          <Text style={{ fontSize: RFValue(16), color: colors.slate[650] }}>
            Clear
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onApply}
          className="px-5 py-3 rounded-full"
          style={{ backgroundColor: colors.slate[650] }}
        >
          <Text style={{ color: "#fff", fontSize: RFValue(14) }}>
            Apply filter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
