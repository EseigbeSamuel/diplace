import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useSpaceStore } from "@/store/useSpace";

interface ConfirmCostSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const ConfirmCostSubstep: React.FC<ConfirmCostSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { setValue, spaceForm } = useSpaceStore();

  const costBreakdown = [
    {
      id: "0",
      title: `Space rent (${spaceForm.value.rentalCost?.rentDuration})`,
      description: "",
      value: spaceForm.value.rentalCost?.rentalCost || "",
      editable: true,
    },
  ].concat(spaceForm.value.otherCharges || []);

  const totalPackage = costBreakdown.reduce((sum, item) => {
    const amount = Number(item.value.toString().replace(/[^0-9]/g, "")) || 0;
    return sum + amount;
  }, 0);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleEdit = () => {
    // Navigate to edit cost breakdown
  };

  const handleConfirm = () => {
    onNext();
  };

  return (
    <View style={styles.container} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title} className="font-semibold">Confirm total cost</Text>

        {/* Total Package Card */}
        <View style={styles.totalPackageCard} className="flex-row items-center justify-between">
          <View  className="flex-1">
            <Text style={styles.totalPackageLabel}>Total Package</Text>
            <Text style={styles.totalPackageAmount} className="font-bold">
              {formatCurrency(totalPackage)}
            </Text>
          </View>
          <Image
            source={require("@/assets/icons/money-bag.png")}
            style={styles.moneyBagIcon}
          />
        </View>

        {/* Cost Breakdown Section */}
        <View style={styles.breakdownSection} className="border-[1px]">
          <View style={styles.breakdownHeader} className="flex-row items-center justify-between">
            <Text style={styles.breakdownTitle} className="font-semibold">Cost Breakdown</Text>
            <Pressable style={styles.editButton} onPress={handleEdit} className="flex-row items-center">
              <Image
                source={require("@/assets/icons/edit-pencil.png")}
                style={styles.editIcon}
              />
              <Text style={styles.editText} className="font-medium">Edit</Text>
            </Pressable>
          </View>

          <View style={styles.breakdownList}>
            {/* Space Rent */}

            {costBreakdown?.map((charge) => (
              <View style={styles.breakdownItem} key={charge.id} className="flex-row items-center justify-between">
                <Text style={styles.breakdownItemLabel}>{charge.title}</Text>
                <Text style={styles.breakdownItemValue} className="font-semibold">
                  {formatCurrency(
                    Number(charge.value.replace(/[^0-9]/g, "")) || 0
                  )}
                </Text>
              </View>
            ))}

            {/* Total Divider */}
            <View style={styles.totalDivider}  className="h-[1px]"/>

            {/* Total Payable */}
            <View style={styles.totalPayableRow} className="flex-row items-center justify-between">
              <Text style={styles.totalPayableLabel} className="font-semibold">Total Payable</Text>
              <Text style={styles.totalPayableValue} className="font-bold">
                {formatCurrency(totalPackage)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Confirm"
          onPress={handleConfirm}
          size="large"
          fullwidth={true}
        />
      </View>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {backgroundColor: colors.background},
    scrollContent: {
      paddingTop: RFValue(32),
    },
    title: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(24)},
    totalPackageCard: {backgroundColor: colors.slate[650],
borderRadius: RFValue(16),
padding: RFValue(24),
marginBottom: RFValue(32)},
    totalPackageContent: {},
    totalPackageLabel: {
      fontSize: RFValue(14),
      color: colors.slate[200],
      marginBottom: RFValue(8),
    },
    totalPackageAmount: {fontSize: RFValue(24),
color: colors.slate[100]},
    moneyBagIcon: {
      width: RFValue(48),
      height: RFValue(48),
    },
    breakdownSection: {marginBottom: RFValue(24),
borderColor: colors.slate[300],
borderRadius: RFValue(12)},
    breakdownHeader: {marginBottom: RFValue(20),
backgroundColor: colors.slate[300],
paddingHorizontal: RFValue(8),
paddingVertical: RFValue(16),
borderTopRightRadius: RFValue(12),
borderTopLeftRadius: RFValue(12)},
    breakdownTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    editButton: {gap: RFValue(6)},
    editIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    editText: {fontSize: RFValue(14),
color: colors.slate[650]},
    breakdownList: {
      gap: RFValue(16),
    },
    breakdownItem: {paddingHorizontal: RFValue(8)},
    breakdownItemLabel: {
      fontSize: RFValue(15),
      color: colors.slate[600],
    },
    breakdownItemValue: {fontSize: RFValue(15),
color: colors.slate[650]},
    totalDivider: {backgroundColor: colors.slate[300],
marginVertical: RFValue(8)},
    totalPayableRow: {paddingHorizontal: RFValue(8),
paddingBottom: RFValue(12)},
    totalPayableLabel: {fontSize: RFValue(16),
color: colors.slate[650]},
    totalPayableValue: {fontSize: RFValue(18),
color: colors.slate[650]},
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default ConfirmCostSubstep;
