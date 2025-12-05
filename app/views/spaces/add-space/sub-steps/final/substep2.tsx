import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useSpaceStore } from "@/store/useSpace";
import { SimpleSelector } from "@/components/selector";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  selected: boolean;
}

interface InspectionTimeSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const InspectionTimeSubstep: React.FC<InspectionTimeSubstepProps> = ({
  onNext,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, spaceForm } = useSpaceStore();

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");
  const [tempStartTime, setTempStartTime] = useState(new Date());
  const [tempEndTime, setTempEndTime] = useState(new Date());

  const toggleSlotSelection = (id: string) => {
    const updatedSlots = spaceForm.value.inspectionTimeSlots?.map((slot) =>
      slot.id === id ? { ...slot, selected: !slot.selected } : slot
    );
    setValue({ inspectionTimeSlots: updatedSlots });
  };

  const formatTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  const handleAddCustomTime = () => {
    const now = new Date();
    now.setHours(8, 0, 0, 0);
    setTempStartTime(now);
    setTempEndTime(new Date(now.getTime() + 2 * 60 * 60 * 1000));
    setPickerMode("start");
    setShowPicker(true);
  };

  const handleConfirm = (date: Date) => {
    if (pickerMode === "start") {
      setTempStartTime(date);
      setPickerMode("end"); // open end time next
    } else {
      setTempEndTime(date);
      const newSlot: TimeSlot = {
        id: Date.now().toString(),
        startTime: formatTime(tempStartTime),
        endTime: formatTime(date),
        label: "Custom slot",
        selected: true,
      };
      const updatedSlots = [
        ...(spaceForm.value?.inspectionTimeSlots ?? []),
        newSlot,
      ];
      setValue({ inspectionTimeSlots: updatedSlots });
      setShowPicker(false);
    }
  };

  const handleNext = () => {
    if (spaceForm.value.inspectionTimeSlots?.some((slot) => slot.selected))
      onNext();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>
          When can renters come for physical inspection?
        </Text>
        <Text style={styles.description}>
          Please set your time for inspection. Select all that applies
        </Text>

        <View style={styles.slotsContainer}>
          {spaceForm.value.inspectionTimeSlots?.map((slot) => (
            <SimpleSelector
              key={slot.id}
              title={`${slot.startTime} - ${slot.endTime} (${slot.label})`}
              isChecked={slot.selected}
              onChange={() => toggleSlotSelection(slot.id)}
            />
          ))}

          <TouchableOpacity
            style={styles.addCustomButton}
            onPress={handleAddCustomTime}
          >
            <Image
              source={require("@/assets/icons/plus.png")}
              style={styles.addIcon}
              resizeMode="contain"
            />
            <Text style={styles.addCustomText}>Add custom time</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <AppButton
          title="Next"
          onPress={handleNext}
          size="large"
          fullwidth
          disabled={
            !spaceForm.value.inspectionTimeSlots?.some((slot) => slot.selected)
          }
        />
      </View>

      <DateTimePickerModal
        isVisible={showPicker}
        mode="time"
        date={pickerMode === "start" ? tempStartTime : tempEndTime}
        onConfirm={handleConfirm}
        onCancel={() => setShowPicker(false)}
        is24Hour
      />
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { paddingTop: RFValue(32), paddingBottom: RFValue(100) },
    title: {
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      lineHeight: RFValue(28),
      marginBottom: RFValue(16),
    },
    description: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(22),
      marginBottom: RFValue(32),
    },
    slotsContainer: { gap: RFValue(16) },
    addCustomButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingVertical: RFValue(14),
      gap: RFValue(8),
    },
    addIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    addCustomText: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
    },
    buttonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.slate[200],
    },
  });

export default InspectionTimeSubstep;
