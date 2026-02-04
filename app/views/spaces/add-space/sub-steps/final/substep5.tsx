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
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>Confirm total cost</Text>

        {/* Total Package Card */}
        <View style={styles.totalPackageCard}>
          <View style={styles.totalPackageContent}>
            <Text style={styles.totalPackageLabel}>Total Package</Text>
            <Text style={styles.totalPackageAmount}>
              {formatCurrency(totalPackage)}
            </Text>
          </View>
          <Image
            source={require("@/assets/icons/money-bag.png")}
            style={styles.moneyBagIcon}
          />
        </View>

        {/* Cost Breakdown Section */}
        <View style={styles.breakdownSection}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownTitle}>Cost Breakdown</Text>
            <Pressable style={styles.editButton} onPress={handleEdit}>
              <Image
                source={require("@/assets/icons/edit-pencil.png")}
                style={styles.editIcon}
              />
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.breakdownList}>
            {/* Space Rent */}

            {costBreakdown?.map((charge) => (
              <View style={styles.breakdownItem} key={charge.id}>
                <Text style={styles.breakdownItemLabel}>{charge.title}</Text>
                <Text style={styles.breakdownItemValue}>
                  {formatCurrency(
                    Number(charge.value.replace(/[^0-9]/g, "")) || 0
                  )}
                </Text>
              </View>
            ))}

            {/* Total Divider */}
            <View style={styles.totalDivider} />

            {/* Total Payable */}
            <View style={styles.totalPayableRow}>
              <Text style={styles.totalPayableLabel}>Total Payable</Text>
              <Text style={styles.totalPayableValue}>
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
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingTop: RFValue(32),
    },
    title: {
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(24),
    },
    totalPackageCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(16),
      padding: RFValue(24),
      marginBottom: RFValue(32),
    },
    totalPackageContent: {
      flex: 1,
    },
    totalPackageLabel: {
      fontSize: RFValue(14),
      color: colors.slate[200],
      marginBottom: RFValue(8),
    },
    totalPackageAmount: {
      fontSize: RFValue(24),
      fontWeight: "700",
      color: colors.slate[100],
    },
    moneyBagIcon: {
      width: RFValue(48),
      height: RFValue(48),
    },
    breakdownSection: {
      marginBottom: RFValue(24),
      borderWidth: 1,
      borderColor: colors.slate[300],
      borderRadius: RFValue(12),
    },
    breakdownHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: RFValue(20),
      backgroundColor: colors.slate[300],
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(16),
      borderTopRightRadius: RFValue(12),
      borderTopLeftRadius: RFValue(12),
    },
    breakdownTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
    },
    editIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    editText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    breakdownList: {
      gap: RFValue(16),
    },
    breakdownItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: RFValue(8),
    },
    breakdownItemLabel: {
      fontSize: RFValue(15),
      color: colors.slate[600],
    },
    breakdownItemValue: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
    totalDivider: {
      height: 1,
      backgroundColor: colors.slate[300],
      marginVertical: RFValue(8),
    },
    totalPayableRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: RFValue(8),
      paddingBottom: RFValue(12),
    },
    totalPayableLabel: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    totalPayableValue: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
    },
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default ConfirmCostSubstep;
