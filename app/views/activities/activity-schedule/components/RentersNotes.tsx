import React from "react";
import { View, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/contexts/themeContext";

interface RentersNotesProps {
  status: string;
  isEventCenter: boolean;
  role: string;
}

const RentersNotes: React.FC<RentersNotesProps> = ({ status, isEventCenter, role }) => {
  const { colors } = useTheme();

  if (role !== "agent" || (status !== "booked" && status !== "reserved")) {
    return null;
  }

  return (
    <View
      style={{ borderColor: colors.slate[200] }}
      className="py-4 border-t"
    >
      <Text
        style={{
          color: colors.slate[650],
          fontSize: RFValue(15.5),
          marginBottom: 6,
        }}
        className="font-bold"
      >
        Renter's Notes
      </Text>
      <Text
        style={{
          color: colors.slate[600],
          fontSize: RFValue(14.5),
          lineHeight: RFValue(19.5),
        }}
      >
        {isEventCenter
          ? "We are expecting dignitaries and would like the place to be on lock down."
          : "I would love everything to be fixed before moving in. Just work with my move in date."}
      </Text>
    </View>
  );
};

export default RentersNotes;
