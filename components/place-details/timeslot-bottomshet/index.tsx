import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomBottomSheet } from "../../bottom-sheet";

type timeslot = {
  id: string;
  label: string;
};

const timeslotDB: timeslot[] = [
  { id: "morning", label: "10AM - 12PM (Morning slot)" },
  { id: "afternoon", label: "1PM - 3PM (Afternoon slot)" },
  { id: "evening", label: "4PM - 6PM (Evening slot)" },
];

interface Props {
  selectedTime: timeslot | null;
  setSelectedTime: (time: timeslot) => void;
  openTimeSlot: React.RefObject<BottomSheetModal | null>;
}

export default function TimeslotBottomSheet(props: Props) {
  const snapPoints = useMemo(() => ["75%", "90%"], []);
  const { colors, isDarkMode } = useTheme();

  const homeStyles = styles(colors);

  return (
    <CustomBottomSheet
      bottomSheetProps={{
        ref: props.openTimeSlot,
        snapPoints,
      }}
    >
      <View className="flex flex-col gap-10">
        <View>
          <Text style={homeStyles.title2} className="text-center">
            Choose Time Slot
          </Text>
          <Text style={homeStyles.subTitlegray} className="text-center">
            Pick a convenient time for you from the agent’s available time slot.
          </Text>
        </View>
        <View>
          <FlatList
            data={timeslotDB}
            keyExtractor={(item) => item.id}
            // contentContainerClassName="gap-3"
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => {
              const isSelected = props.selectedTime?.id === item.id;

              return (
                <TouchableOpacity
                  style={homeStyles.border}
                  className="p-4 border rounded-2xl"
                  onPress={() => {
                    props.setSelectedTime(item);
                    props.openTimeSlot.current?.dismiss();
                  }}
                >
                  <View className="flex-row items-center">
                    {/* Radio circle */}
                    <View
                      style={
                        isSelected ? homeStyles.border2 : homeStyles.border
                      }
                      className={`h-5 w-5 rounded-full border-2 items-center justify-center mr-3 
                            `}
                    >
                      {isSelected && (
                        <View
                          style={{ backgroundColor: colors.slate?.[650] }}
                          className="h-2.5 w-2.5 rounded-full "
                        />
                      )}
                    </View>

                    <Text style={homeStyles.subTitlegray} className="text-base">
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </CustomBottomSheet>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    gray: {
      color: colors.slate[600],
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
    },
    titlegray: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[600],
    },
    subTitlegray: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    title2: {
      fontSize: RFValue(20),
      lineHeight: RFValue(28),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(16),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    small: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[600],
    },
    border: {
      borderColor: colors.slate[300],
      backgroundAttachment: colors.slate[150],
    },
    border2: {
      borderColor: colors.slate[650],
    },
  });
