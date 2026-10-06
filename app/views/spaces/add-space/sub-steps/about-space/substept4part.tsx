import AppButton from "@/components/button";
import NumericField from "@/components/NumberField";
import { useTheme } from "@/contexts/themeContext";
import { showToast } from "@/lib";
import { useSpaceStore } from "@/store/useSpace";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

interface CapacitySubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const EventCapacitySubstep: React.FC<CapacitySubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const { setValue, spaceForm } = useSpaceStore();
  const styles = createStyles(colors);
  const [roomSizeError, setRoomSizeError] = useState("");
  const roomSize = spaceForm.value.capacity?.roomSize || "";
  const roomSizeRegex = /^\d+\s*ft\s*x\s*\d+\s*ft$/i;
  const isRoomSizeValid = roomSizeRegex.test(roomSize.trim());

  const handleNext = () => {
    if (!isRoomSizeValid) {
      setRoomSizeError("Use this format: 30ft x 40ft");
      showToast({
        type: "error",
        text1: "Invalid space size",
        text2: "Use this format: 30ft x 40ft",
      });
      return;
    }

    onNext();
  };

  return (
    <View style={styles.container} className="flex-1">
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={90}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title} className="font-semibold">Let's know the capacity of the space.</Text>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Capacity Size */}
          <View style={styles.fieldRow} className="flex-row items-center justify-between">
            <View  className="flex-1">
              <Text style={styles.label}>
                What is the capacity of the hall?
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="260 cap"
                placeholderTextColor={colors.slate[500]}
                onChangeText={(text) =>
                  setValue({
                    capacity: {
                      ...spaceForm.value.capacity,
                      caps: text,
                    },
                  })
                }
                value={spaceForm.value.capacity?.caps || ""}
               className="w-[100%px] border-[1px] text-center"/>
            </View>
          </View>

          {/* Space Size */}
          <View style={styles.fieldRow} className="flex-row items-center justify-between">
            <View  className="flex-1">
              <Text style={styles.label}>
                What is the estimated size of the space?
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="30ft x 40ft"
                placeholderTextColor={colors.slate[500]}
                onChangeText={(text) => {
                  if (roomSizeError) setRoomSizeError("");
                  setValue({
                    capacity: {
                      ...spaceForm.value.capacity,
                      roomSize: text,
                    },
                  });
                }}
                value={roomSize}
               className="w-[100%px] border-[1px] text-center"/>
            </View>
          </View>
          {!!roomSizeError && (
            <Text style={styles.errorText}>{roomSizeError}</Text>
          )}

          {/* Changing Room */}
          <View style={styles.fieldRow} className="flex-row items-center justify-between">
            <View  className="flex-1">
              <Text style={styles.label}>
                How many changing rooms are there?
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <NumericField
                onChange={(value) =>
                  setValue({
                    capacity: {
                      ...spaceForm.value.capacity,
                      changingRooms: value,
                    },
                  })
                }
                value={spaceForm.value.capacity?.changingRooms || 0}
              />
            </View>
          </View>

          {/* Bathrooms */}
          <View style={styles.fieldRow} className="flex-row items-center justify-between">
            <View  className="flex-1">
              <Text style={styles.label}>How many bathrooms are there?</Text>
            </View>
            <View style={styles.inputContainer}>
              <NumericField
                onChange={(value) =>
                  setValue({
                    capacity: { ...spaceForm.value.capacity, bathrooms: value },
                  })
                }
                value={spaceForm.value.capacity?.bathrooms || 0}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Next"
          onPress={handleNext}
          size="large"
          fullwidth={true}
          disabled={
            !spaceForm.value.capacity?.caps ||
            !spaceForm.value.capacity?.roomSize ||
            spaceForm.value.capacity?.changingRooms === 0 ||
            spaceForm.value.capacity?.bathrooms === 0
          }
        />
      </View>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {backgroundColor: colors.background},
    scrollContent: {
      paddingHorizontal: RFValue(4),
      paddingTop: RFValue(32),
      paddingBottom: RFValue(20),
    },
    title: {fontSize: RFValue(20),
color: colors.slate[650],
lineHeight: RFValue(28),
marginBottom: RFValue(32)},
    formContainer: {
      gap: RFValue(24),
    },
    fieldRow: {gap: RFValue(16)},
    labelContainer: {},
    label: {
      fontSize: RFValue(15),
      color: colors.slate[600],
      lineHeight: RFValue(22),
    },
    inputContainer: {
      width: RFValue(120),
    },
    textInput: {paddingVertical: RFValue(12),
paddingHorizontal: RFValue(16),
backgroundColor: colors.background,
borderRadius: RFValue(12),
borderColor: colors.slate[300],
fontSize: RFValue(15),
color: colors.slate[650]},
    errorText: {
      fontSize: RFValue(12),
      color: colors.error[300],
      marginTop: RFValue(-12),
    },
    buttonContainer: {
      paddingHorizontal: RFValue(4),
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default EventCapacitySubstep;
