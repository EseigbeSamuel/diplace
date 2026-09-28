import { BottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import { SimpleSelector } from "@/components/selector";
import { useTheme } from "@/contexts/themeContext";
import { useSpaceStore } from "@/store/useSpace";
import { ColorScheme } from "@/utils";
import React, { useMemo, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

type RentDuration = "per annum" | "per month" | "per day" | "per hour";

interface RentalCostSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const RentalCostSubstep: React.FC<RentalCostSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, spaceForm } = useSpaceStore();

  const rentage = spaceForm.value.rentalCost;

  const [showDurationModal, setShowDurationModal] = useState(false);

  const rentDurations: RentDuration[] = [
    "per annum",
    "per month",
    "per day",
    "per hour",
  ];

  const handleCostChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setValue({ rentalCost: { ...rentage, rentalCost: numericValue } });
  };

  const handleMaxPayoutChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setValue({ rentalCost: { ...rentage, maxRentPayout: numericValue } });
  };

  const formatCurrency = (value: string) => {
    if (!value) return "0";
    return parseInt(value).toLocaleString();
  };

  const handleSelectDuration = (duration: RentDuration) => {
    setValue({ rentalCost: { ...rentage, rentDuration: duration } });
    setShowDurationModal(false);
  };

  const getDurationLabel = () => {
    return spaceForm.value.rentalCost?.rentDuration || "Select";
  };

  const getPayoutUnit = () => {
    switch (spaceForm.value.rentalCost?.rentDuration) {
      case "per annum":
        return "years";
      case "per month":
        return "months";
      case "per day":
        return "days";
      case "per hour":
        return "hours";
      default:
        return "select";
    }
  };

  const handleNext = () => {
    if (
      spaceForm.value.rentalCost?.rentalCost &&
      spaceForm.value.rentalCost?.rentDuration &&
      spaceForm.value.rentalCost?.maxRentPayout
    ) {
      onNext();
    }
  };

  const isValid =
    spaceForm.value.rentalCost?.rentalCost &&
    spaceForm.value.rentalCost?.rentDuration &&
    spaceForm.value.rentalCost?.maxRentPayout;

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>
          What is the cost of renting this space?
        </Text>

        {/* Cost Input */}
        <View style={styles.costInputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencySymbol}>₦</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={colors.slate[400]}
              value={formatCurrency(
                spaceForm.value.rentalCost?.rentalCost || "",
              )}
              onChangeText={handleCostChange}
              keyboardType="numeric"
              maxLength={12}
            />
          </View>

          {/* Warning Text */}
          <View style={styles.warningContainer}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              This should exclude other charges
            </Text>
          </View>
        </View>

        {/* Rent Duration Selector */}
        <View style={styles.durationContainer}>
          <TouchableOpacity
            style={styles.durationSelector}
            onPress={() => setShowDurationModal(true)}
          >
            <Text style={styles.durationLabel}>Rent duration</Text>
            <View style={styles.durationValueContainer}>
              <Text style={styles.durationValue}>{getDurationLabel()}</Text>
              <Image
                source={require("@/assets/icons/chevron-right.png")}
                style={styles.arrowIcon}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          {spaceForm.value.rentalCost?.rentDuration && (
            <View style={styles.payoutContainer}>
              <Text style={styles.payoutLabel}>Maximum rent pay out</Text>
              <View style={styles.payoutInputWrapper}>
                <TextInput
                  style={styles.payoutInput}
                  value={spaceForm.value.rentalCost?.maxRentPayout}
                  onChangeText={handleMaxPayoutChange}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text style={styles.payoutUnit}>{getPayoutUnit()}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Maximum Rent Payout (Conditional) */}
      </KeyboardAwareScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Next"
          onPress={handleNext}
          size="large"
          fullwidth={true}
          disabled={!isValid}
        />
      </View>

      {/* Duration Selection Modal */}
      <BottomSheet
        isVisible={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        snapPoints={useMemo(() => ["50%"], [])}
      >
        <Text style={styles.modalTitle}>Rent duration</Text>
        <Text style={styles.modalDescription}>
          Select the rent duration of this property.
        </Text>

        <View style={styles.durationOptions}>
          {rentDurations.map((duration) => (
            <SimpleSelector
              title={duration}
              isChecked={spaceForm.value.rentalCost?.rentDuration === duration}
              onChange={() => handleSelectDuration(duration)}
              key={duration}
            />
          ))}
        </View>
      </BottomSheet>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingTop: RFValue(32),
      paddingBottom: RFValue(20),
    },
    title: {
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      lineHeight: RFValue(28),
      marginBottom: RFValue(48),
    },
    costInputContainer: {
      alignItems: "center",
      marginBottom: RFValue(40),
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: RFValue(12),
      backgroundColor: colors.slate[200],
      paddingVertical: RFValue(8),
      paddingHorizontal: RFValue(16),
      borderBottomColor: colors.slate[650],
      borderBottomWidth: 2,
    },
    currencySymbol: {
      fontSize: RFValue(32),
      fontWeight: "700",
      color: colors.slate[650],
      marginRight: RFValue(8),
    },
    input: {
      fontSize: RFValue(32),
      fontWeight: "700",
      color: colors.slate[650],
      minWidth: RFValue(120),
      textAlign: "center",
      padding: 0,
    },
    warningContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
    },
    warningIcon: {
      fontSize: RFValue(14),
    },
    warningText: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    durationSelector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    durationContainer: {
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.background,
      borderRadius: RFValue(12),
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.slate[300],
      marginBottom: RFValue(16),
    },
    durationLabel: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
    },
    durationValueContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(8),
    },
    durationValue: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[600],
    },
    arrowIcon: {
      height: RFValue(10),
      tintColor: colors.slate[600],
    },
    payoutContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(12),
    },
    payoutLabel: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
    },
    payoutInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(12),
      minWidth: RFValue(40),
      paddingVertical: RFValue(4),
      paddingHorizontal: RFValue(8),
      borderBottomWidth: 2,
      backgroundColor: colors.slate[200],
      borderBottomColor: colors.slate[650],
    },
    payoutInput: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      textAlign: "center",
      width: RFValue(20),
    },
    payoutUnit: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[600],
    },
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingTop: RFValue(12),
      paddingBottom: RFValue(32),
      paddingHorizontal: RFValue(16),
      textAlign: "center",
      alignItems: "center",
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginBottom: RFValue(20),
    },
    modalTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    modalDescription: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      marginBottom: RFValue(24),
    },
    durationOptions: {
      gap: RFValue(16),
      width: "100%",
    },
    durationOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.background,
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    radioContainer: {
      marginRight: RFValue(12),
    },
    radioOuter: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 2,
      borderColor: colors.slate[400],
      alignItems: "center",
      justifyContent: "center",
    },
    radioOuterSelected: {
      borderColor: colors.slate[650],
    },
    radioInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    durationOptionText: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
    },
  });

export default RentalCostSubstep;
