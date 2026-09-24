import { useTheme } from "@/contexts/themeContext";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { RFValue } from "react-native-responsive-fontsize";

interface NotificationDatePickerProps {
  visible: boolean;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onClear: () => void;
  onClose: () => void;
}

const NotificationDatePicker = ({
  visible,
  selectedDate,
  onSelectDate,
  onClear,
  onClose,
}: NotificationDatePickerProps) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={[styles.sheet, { backgroundColor: colors.background }]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.slate[650] }]}>
              Filter by date
            </Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={[styles.close, { color: colors.slate[500] }]}>
                Close
              </Text>
            </Pressable>
          </View>

          <Calendar
            current={selectedDate ?? undefined}
            onDayPress={(day) => onSelectDate(day.dateString)}
            markedDates={
              selectedDate
                ? {
                    [selectedDate]: {
                      selected: true,
                      selectedColor: colors.slate[650],
                    },
                  }
                : undefined
            }
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.background,
              textSectionTitleColor: colors.slate[500],
              dayTextColor: colors.slate[650],
              monthTextColor: colors.slate[650],
              textDisabledColor: colors.slate[350],
              arrowColor: colors.slate[650],
              todayTextColor: colors.success[300],
              selectedDayTextColor: colors.background,
              textDayFontWeight: "500",
              textMonthFontWeight: "700",
              textDayHeaderFontWeight: "600",
            }}
          />

          <Pressable
            onPress={onClear}
            disabled={!selectedDate}
            style={[
              styles.clearButton,
              {
                borderColor: colors.slate[300],
                opacity: selectedDate ? 1 : 0.45,
              },
            ]}
          >
            <Text
              style={{
                color: isDarkMode ? colors.slate[600] : colors.slate[650],
              }}
            >
              Clear date filter
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    padding: RFValue(20),
    backgroundColor: "rgba(0, 0, 0, 0.42)",
  },
  sheet: {
    borderRadius: RFValue(18),
    padding: RFValue(16),
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(8),
  },
  title: {
    fontSize: RFValue(16),
    fontWeight: "700",
  },
  close: {
    fontSize: RFValue(11),
    fontWeight: "600",
  },
  clearButton: {
    alignItems: "center",
    borderRadius: RFValue(10),
    borderWidth: 1,
    marginTop: RFValue(10),
    paddingVertical: RFValue(10),
  },
});

export default NotificationDatePicker;
