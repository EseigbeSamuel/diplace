import { CustomBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type timeslot = {
  id: string;
  label: string;
};

interface Props {
  showDatePicker: boolean;
  selectedDate: string | null;
  selectedTime: timeslot | null;
  openInspection: React.RefObject<BottomSheetModal | null>;
  setSelectedTime: React.Dispatch<React.SetStateAction<timeslot | null>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenTimeSlot: () => void;
}

export default function InspectionBottomSheet(props: Props) {
  const snapPoints = useMemo(() => ["75%", "90%"], []);
  const { colors, isDarkMode } = useTheme();
  const homeStyles = styles(colors);

  const formatReadableDate = (
    dateString: string | Date | null | undefined
  ): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <CustomBottomSheet
      bottomSheetProps={{
        ref: props.openInspection,
        snapPoints,
      }}
    >
      <View className="flex flex-col gap-5 ">
        <View>
          <Text
            className="font-semibold text-center "
            style={homeStyles.title2}
          >
            Schedule an Inspection
          </Text>
          <Text className="text-center " style={homeStyles.subTitlegray}>
            Pick a convenient time to inspect this space in person. A small
            inspection fee may apply, payable before confirmation.
          </Text>
        </View>

        <View>
          <TouchableOpacity
            className="flex-row justify-between w-full p-4 mt-6 border border-gray-300 dark:border-gray-600 rounded-2xl"
            onPress={() => props.setShowDatePicker(true)}
          >
            <Text className="text-base dark:text-white" style={homeStyles.text}>
              {props.selectedDate
                ? formatReadableDate(props.selectedDate)
                : "Select Inspection Date"}
            </Text>

            {isDarkMode ? (
              <Image source={require("@/assets/icons/calender-white.png")} />
            ) : (
              <Image
                source={require("@/assets/icons/icon-calender-white.png")}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between w-full p-4 mt-6 border border-gray-300 dark:border-gray-600 rounded-2xl"
            onPress={props.handleOpenTimeSlot}
          >
            <Text className="text-base dark:text-white">
              {props.selectedTime
                ? props.selectedTime.label
                : "Choose Time Slot"}
            </Text>
            <Image
              className="rotate-45"
              source={require("@/assets/icons/angle.png")}
            />
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between w-full ">
          <Text style={homeStyles.text}>inspection fee: </Text>
          <Text style={homeStyles.title2} className="font-semibold ">
            $1000
          </Text>
        </View>
        <View className="flex flex-col gap-5 py-3 mt-2 border-t border-gray-300">
          <Text style={homeStyles.small} className="italic text-center">
            🔐 Fee is held by DiPlace and only released after a successful
            inspection. Refunded if canceled or not completed.
          </Text>

          <View className="flex flex-col gap-5">
            <AppButton
              title="Schedule Inspection"
              onPress={() => {
                router.push("/views/inspection/inspection-payment");
                props.openInspection.current?.dismiss();
              }}
              size="large"
              disabled={!props.selectedTime}
            />
            <Text style={homeStyles.text} className="font-medium text-center">
              Skip & Proceed to Book Now
            </Text>
          </View>
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
