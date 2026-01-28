import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter, useLocalSearchParams } from "expo-router";

import { Calendar } from "react-native-calendars";
import AppButton from "@/components/button";
import { SimpleSelector } from "@/components/selector";

const EVENT_TYPES = [
  "Wedding & Engagement",
  "Parties & Social Gathering",
  "Corporate Event & Conference",
  "Religious Gathering",
  "Workshops & Trainings",
  "Educational Event",
  "Entertainment & Shows",
  "Fashion & Lifestyle Events",
  "Children Events",
  "Others",
];

const DURATION_OPTIONS = [
  { label: "Full work day (8 hours)", value: 8 },
  { label: "Half work day (4 hours)", value: 4 },
  { label: "1 hour", value: 1 },
  { label: "2 hours", value: 2 },
  { label: "Custom", value: "custom" },
];

const EventDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, isDarkMode } = useTheme();
  const styles = getStyles(colors);

  const [eventType, setEventType] = useState("");
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState("1");
  const [duration, setDuration] = useState<number | string>("");
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const isFormValid =
    eventType && startDate && endDate && numberOfDays && duration;

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleContinue = () => {
    if (isFormValid) {
      router.push({
        pathname: "/views/booking/review-agreement",
        params: {
          ...params,
          eventType,
          startDate: startDate,
          endDate: endDate,
          numberOfDays,
          duration: duration.toString(),
          notes,
        },
      });
    }
  };

  return (
    <SafeAreaViewContainer>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Image
            source={require("@/assets/icons/arrow-left-light.png")}
            style={styles.backIcon}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Event details</Text>
        <Text style={styles.stepIndicator}>2/4</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Event Details</Text>
            <Text style={styles.subtitle}>
              Let's know about the event schedule.
            </Text>
          </View>

          {/* Event Schedule Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Event Schedule</Text>

            {/* Event Type */}
            <Pressable
              style={styles.inputContainer}
              onPress={() => setShowEventTypeModal(true)}
            >
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Event type</Text>
                <Text
                  style={[
                    styles.inputValue,
                    !eventType && styles.inputPlaceholder,
                  ]}
                >
                  {eventType || "Select event type"}
                </Text>
              </View>
              <Image
                source={require("@/assets/icons/chevron-right.png")}
                // style={styles.chevronIcon}
              />
            </Pressable>

            {/* Date of Event */}
            <Pressable
              style={styles.inputContainer}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Image
                source={require("@/assets/icons/calendar.png")}
                style={styles.inputIcon}
              />
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Date of event</Text>
                <Text
                  style={[
                    styles.inputValue,
                    !startDate && styles.inputPlaceholder,
                  ]}
                >
                  {startDate && endDate
                    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                    : "Select date"}
                </Text>
              </View>
            </Pressable>

            {/* Number of Days */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>No. of days</Text>
                <TextInput
                  style={styles.input}
                  value={numberOfDays}
                  onChangeText={setNumberOfDays}
                  placeholder="1"
                  placeholderTextColor={colors.slate[450]}
                  keyboardType="number-pad"
                />
              </View>
              <Image
                source={require("@/assets/icons/chevronupdown.png")}
                // style={styles.upDownIcon}
              />
            </View>

            {/* Estimated Duration */}
            <Pressable
              style={styles.inputContainer}
              onPress={() => setShowDurationModal(true)}
            >
              <Image
                source={require("@/assets/icons/Time.png")}
                style={styles.inputIcon}
              />
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Estimated duration</Text>
                <Text
                  style={[
                    styles.inputValue,
                    !duration && styles.inputPlaceholder,
                  ]}
                >
                  {duration
                    ? typeof duration === "number"
                      ? `${duration} hours`
                      : duration
                    : "Select duration"}
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Add Notes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Add Notes</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any extra details we should know..."
              placeholderTextColor={colors.slate[450]}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingBottom: RFValue(16) }}>
        <AppButton
          onPress={handleContinue}
          disabled={!isFormValid}
          title="Continue"
        />
      </View>

      {/* Event Type Modal */}
      <Modal
        visible={showEventTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEventTypeModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowEventTypeModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Choose event type</Text>
            <Text style={styles.modalSubtitle}>
              Select the type of event that suits what you will be using the
              space for.
            </Text>
            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            >
              {EVENT_TYPES.map((type) => (
                <View style={styles.modalItem}>
                  <SimpleSelector
                    title={type}
                    isChecked={eventType === type}
                    onChange={() => {
                      setEventType(type);
                      setShowEventTypeModal(false);
                    }}
                  />
                </View>
              ))}
            </ScrollView>

            <AppButton
              onPress={() => setShowEventTypeModal(false)}
              title="Save"
            />
          </View>
        </Pressable>
      </Modal>

      {/* Duration Modal */}
      <Modal
        visible={showDurationModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDurationModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDurationModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Estimate duration</Text>
            <Text style={styles.modalSubtitle}>
              Give an estimate of how long the event will last.
            </Text>
            <ScrollView style={styles.modalList}>
              {DURATION_OPTIONS.map((option) => (
                <View style={styles.modalItem}>
                  <SimpleSelector
                    title={option.label}
                    isChecked={duration === option.value}
                    onChange={() => {
                      setDuration(option.value);
                      setShowDurationModal(false);
                    }}
                  />
                </View>
              ))}
            </ScrollView>

            <AppButton
              onPress={() => setShowDurationModal(false)}
              title="Save"
            />
          </View>
        </Pressable>
      </Modal>

      {/* Date Pickers */}
      <Modal
        visible={showStartDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStartDatePicker(false)}
      >
        <Pressable
          style={styles.calenderModalOverlay}
          onPress={() => setShowStartDatePicker(false)}
        >
          <Pressable style={styles.calendarModal}>
            <Calendar
              onDayPress={(day) => {
                setStartDate(day.dateString);
                setEndDate(null);
                setShowStartDatePicker(false);
                setShowEndDatePicker(true);
              }}
              markedDates={
                startDate
                  ? {
                      [startDate]: {
                        selected: true,
                        selectedColor: "#000",
                        selectedTextColor: "#fff",
                      },
                    }
                  : {}
              }
              theme={{
                backgroundColor: isDarkMode ? "#181818" : "#FCFCFC",
                calendarBackground: isDarkMode ? "#181818" : "#FCFCFC",
                textSectionTitleColor: "#9ca3af",
                monthTextColor: isDarkMode ? "#ffffff" : "#000000",
                arrowColor: isDarkMode ? "#fff" : "#000",
                dayTextColor: isDarkMode ? "#e5e7eb" : "#000000",
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showEndDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEndDatePicker(false)}
      >
        <Pressable
          style={styles.calenderModalOverlay}
          onPress={() => setShowEndDatePicker(false)}
        >
          <Pressable style={styles.calendarModal}>
            <Calendar
              minDate={startDate || undefined}
              onDayPress={(day) => {
                setEndDate(day.dateString);
                setShowEndDatePicker(false);
              }}
              markedDates={{
                ...(startDate && {
                  [startDate]: { selected: true, selectedColor: "#000" },
                }),
                ...(endDate && {
                  [endDate]: { selected: true, selectedColor: "#000" },
                }),
              }}
              theme={{
                backgroundColor: isDarkMode ? "#181818" : "#FCFCFC",
                calendarBackground: isDarkMode ? "#181818" : "#FCFCFC",
                textSectionTitleColor: "#9ca3af",
                monthTextColor: isDarkMode ? "#ffffff" : "#000000",
                arrowColor: isDarkMode ? "#fff" : "#000",
                dayTextColor: isDarkMode ? "#e5e7eb" : "#000000",
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaViewContainer>
  );
};

export default EventDetails;

const getStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
    },
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    headerTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
      flex: 1,
      textAlign: "center",
    },
    stepIndicator: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      fontWeight: "500",
    },
    scrollContent: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
    },
    titleSection: {
      marginTop: RFValue(24),
      marginBottom: RFValue(32),
    },
    title: {
      fontSize: RFValue(22),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    subtitle: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      lineHeight: RFValue(20),
    },
    section: {
      marginBottom: RFValue(32),
    },

    sectionLabel: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(16),
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      paddingVertical: RFValue(8),
      paddingHorizontal: RFValue(16),
      marginBottom: RFValue(16),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    inputIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
      marginRight: RFValue(12),
    },
    inputWrapper: {
      flex: 1,
    },
    inputLabel: {
      fontSize: RFValue(12),
      color: colors.slate[500],
      marginBottom: RFValue(6),
    },
    input: {
      fontSize: RFValue(15),
      color: colors.slate[650],
      padding: 0,
    },
    inputValue: {
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    inputPlaceholder: {
      color: colors.slate[450],
    },
    chevronIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    upDownIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    notesInput: {
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      padding: RFValue(16),
      borderWidth: 1,
      borderColor: colors.slate[300],
      fontSize: RFValue(15),
      color: colors.slate[650],
      minHeight: RFValue(120),
    },
    footer: {
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(16),
      borderTopWidth: 1,
      borderTopColor: colors.slate[300],
    },
    continueButton: {
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(12),
      paddingVertical: RFValue(16),
      alignItems: "center",
      justifyContent: "center",
    },
    continueButtonTextDisabled: {
      color: colors.slate[500],
    },
    calendarModal: {
      backgroundColor: colors.background,
      borderRadius: RFValue(20),
      padding: RFValue(16),
      width: "90%",
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    calenderModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },

    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(40),
      maxHeight: "80%",
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginVertical: RFValue(12),
    },
    modalTitle: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(8),
      marginTop: RFValue(8),
    },
    modalSubtitle: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      marginBottom: RFValue(24),
      lineHeight: RFValue(20),
    },
    modalList: {
      marginBottom: RFValue(16),
    },
    modalItem: {
      paddingVertical: RFValue(4),
    },
    radioButton: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 2,
      borderColor: colors.slate[400],
      marginRight: RFValue(12),
      alignItems: "center",
      justifyContent: "center",
    },
    radioButtonInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    modalItemText: {
      fontSize: RFValue(15),
      color: colors.slate[650],
      flex: 1,
    },
    modalSaveButton: {
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(12),
      paddingVertical: RFValue(16),
      alignItems: "center",
      justifyContent: "center",
    },
  });
