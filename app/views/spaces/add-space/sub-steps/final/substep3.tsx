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
    <View style={styles.container} className="flex-1">
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title} className="font-semibold">
          What is the cost of renting this space?
        </Text>

        {/* Cost Input */}
        <View style={styles.costInputContainer} className="items-center">
          <View style={styles.inputWrapper} className="flex-row items-center justify-center border-bottom-[2px]">
            <Text style={styles.currencySymbol} className="font-bold">₦</Text>
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
             className="font-bold text-center p-[0px]"/>
          </View>

          {/* Warning Text */}
          <View style={styles.warningContainer} className="flex-row items-center">
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              This should exclude other charges
            </Text>
          </View>
        </View>

        {/* Rent Duration Selector */}
        <View style={styles.durationContainer} className="border-t border-b">
          <TouchableOpacity

            onPress={() => setShowDurationModal(true)}
           className="flex-row items-center justify-between">
            <Text style={styles.durationLabel} className="font-medium">Rent duration</Text>
            <View style={styles.durationValueContainer} className="flex-row items-center">
              <Text style={styles.durationValue} className="font-medium">{getDurationLabel()}</Text>
              <Image
                source={require("@/assets/icons/chevron-right.png")}
                style={styles.arrowIcon}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          {spaceForm.value.rentalCost?.rentDuration && (
            <View style={styles.payoutContainer} className="flex-row items-center justify-between">
              <Text style={styles.payoutLabel} className="font-medium">Maximum rent pay out</Text>
              <View style={styles.payoutInputWrapper} className="flex-row items-center border-bottom-[2px]">
                <TextInput
                  style={styles.payoutInput}
                  value={spaceForm.value.rentalCost?.maxRentPayout}
                  onChangeText={handleMaxPayoutChange}
                  keyboardType="numeric"
                  maxLength={3}
                 className="font-semibold text-center"/>
                <Text style={styles.payoutUnit} className="font-medium">{getPayoutUnit()}</Text>
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
        <Text style={styles.modalTitle} className="font-semibold">Rent duration</Text>
        <Text style={styles.modalDescription}>
          Select the rent duration of this property.
        </Text>

        <View style={styles.durationOptions} className="w-[100%px]">
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
    container: {backgroundColor: colors.background},
    scrollContent: {
      paddingTop: RFValue(32),
      paddingBottom: RFValue(20),
    },
    title: {fontSize: RFValue(20),
color: colors.slate[650],
lineHeight: RFValue(28),
marginBottom: RFValue(48)},
    costInputContainer: {marginBottom: RFValue(40)},
    inputWrapper: {marginBottom: RFValue(12),
backgroundColor: colors.slate[200],
paddingVertical: RFValue(8),
paddingHorizontal: RFValue(16),
borderBottomColor: colors.slate[650]},
    currencySymbol: {fontSize: RFValue(32),
color: colors.slate[650],
marginRight: RFValue(8)},
    input: {fontSize: RFValue(32),
color: colors.slate[650],
minWidth: RFValue(120)},
    warningContainer: {gap: RFValue(6)},
    warningIcon: {
      fontSize: RFValue(14),
    },
    warningText: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    durationSelector: {},
    durationContainer: {paddingVertical: RFValue(16),
paddingHorizontal: RFValue(16),
backgroundColor: colors.background,
borderRadius: RFValue(12),
borderColor: colors.slate[300],
marginBottom: RFValue(16)},
    durationLabel: {fontSize: RFValue(15),
color: colors.slate[650]},
    durationValueContainer: {gap: RFValue(8)},
    durationValue: {fontSize: RFValue(15),
color: colors.slate[600]},
    arrowIcon: {
      height: RFValue(10),
      tintColor: colors.slate[600],
    },
    payoutContainer: {paddingVertical: RFValue(12)},
    payoutLabel: {fontSize: RFValue(15),
color: colors.slate[650]},
    payoutInputWrapper: {gap: RFValue(12),
minWidth: RFValue(40),
paddingVertical: RFValue(4),
paddingHorizontal: RFValue(8),
backgroundColor: colors.slate[200],
borderBottomColor: colors.slate[650]},
    payoutInput: {fontSize: RFValue(15),
color: colors.slate[650],
width: RFValue(20)},
    payoutUnit: {fontSize: RFValue(15),
color: colors.slate[600]},
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
    modalOverlay: {},
    modalContent: {backgroundColor: colors.background,
borderTopLeftRadius: RFValue(24),
borderTopRightRadius: RFValue(24),
paddingTop: RFValue(12),
paddingBottom: RFValue(32),
paddingHorizontal: RFValue(16)},
    modalHandle: {width: RFValue(40),
height: RFValue(4),
backgroundColor: colors.slate[300],
borderRadius: RFValue(2),
marginBottom: RFValue(20)},
    modalTitle: {fontSize: RFValue(18),
color: colors.slate[650],
marginBottom: RFValue(8)},
    modalDescription: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      marginBottom: RFValue(24),
    },
    durationOptions: {gap: RFValue(16)},
    durationOption: {paddingVertical: RFValue(16),
paddingHorizontal: RFValue(16),
backgroundColor: colors.background,
borderRadius: RFValue(12),
borderColor: colors.slate[300]},
    radioContainer: {
      marginRight: RFValue(12),
    },
    radioOuter: {width: RFValue(20),
height: RFValue(20),
borderRadius: RFValue(10),
borderColor: colors.slate[400]},
    radioOuterSelected: {
      borderColor: colors.slate[650],
    },
    radioInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    durationOptionText: {fontSize: RFValue(15),
color: colors.slate[650]},
  });

export default RentalCostSubstep;
