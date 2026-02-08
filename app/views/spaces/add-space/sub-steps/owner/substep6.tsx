import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { useSpaceStore } from "@/store/useSpace";
import { BankDetails } from "@/types/add-space-types";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";
import AddBankDetails from "./substep3";

interface LandlordAccountInfoSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const LandlordAccountInfoSubstep: React.FC<LandlordAccountInfoSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, setType, spaceForm } = useSpaceStore();

  const [showBankModal, setShowBankModal] = useState(false);

  const handleNext = () => {
    onNext();
  };

  const handleBankUpdate = (updatedBank: BankDetails) => {
    setValue({ ownerAccountDetails: updatedBank });
    setShowBankModal(false);
  };

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
          Give us the {spaceForm.type === "event" ? "owner's" : "landlord's"}{" "}
          payment details
        </Text>

        {!spaceForm.value.ownerAccountDetails?.accountName ? (
          <>
            <View style={styles.previewCard}>
              <View style={styles.cardHeader}>
                <View style={styles.bankIconContainer}>
                  <Image
                    source={require("@/assets/icons/bank-emoji.png")}
                    style={styles.bankIcon}
                  />
                </View>
                <View style={styles.accountNumberSection}>
                  <Text style={styles.accountNumberLabel}>Account Number</Text>
                  <Text style={styles.accountNumber}>
                    {spaceForm.value.ownerAccountDetails?.accountNumber ||
                      "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.accountNameSection}>
                  <Text style={styles.accountNameLabel}>Account Name</Text>
                  <Text style={styles.accountName}>
                    {spaceForm.value.ownerAccountDetails?.accountName ||
                      "UNAVAILABLE"}
                  </Text>
                </View>
                <View style={styles.bankSection}>
                  <Text style={styles.bankLabel}>Bank</Text>
                  <Text style={styles.bankName}>
                    {spaceForm.value.ownerAccountDetails?.bank || "UNAVAILABLE"}
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <Pressable
                onPress={() => setShowBankModal(true)}
                style={styles.addContent}
              >
                <Image
                  source={require("@/assets/icons/plus.png")}
                  style={styles.addIcon}
                />
                <Text style={styles.addText}>Add bank details</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <View style={styles.infoContainer}>
              <View style={styles.sectionHeaderInside}>
                <Text style={styles.sectionTitle}>Bank Details</Text>
                <Pressable
                  style={styles.editButton}
                  onPress={() => setShowBankModal(true)}
                >
                  <Image
                    source={require("@/assets/icons/edit-pencil-fill.png")}
                    style={styles.editIcon}
                  />
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Account Number</Text>
                  <Text style={styles.infoValue}>
                    {spaceForm.value.ownerAccountDetails?.accountNumber}
                  </Text>
                </View>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Account Name</Text>
                  <Text style={styles.infoValue}>
                    {spaceForm.value.ownerAccountDetails?.accountName}
                  </Text>
                </View>
              </View>
              <View style={styles.fullWidthRow}>
                <Text style={styles.infoLabel}>Bank</Text>
                <Text style={styles.infoValue}>
                  {spaceForm.value.ownerAccountDetails?.bank}
                </Text>
              </View>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>

      <Modal visible={showBankModal} animationType="slide" transparent={true}>
        <AddBankDetails
          onComplete={handleBankUpdate}
          ownerAcct={true}
          initialBankDetails={spaceForm.value.ownerAccountDetails}
          onClose={() => setShowBankModal(false)}
        />
      </Modal>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Next"
          onPress={handleNext}
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
      paddingBottom: RFValue(20),
    },
    title: {
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      lineHeight: RFValue(28),
      marginBottom: RFValue(32),
    },
    previewCard: {
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(16),
      padding: RFValue(20),
      marginBottom: RFValue(32),
      minHeight: RFValue(180),
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: RFValue(40),
    },
    bankIconContainer: {
      width: RFValue(48),
      height: RFValue(48),
      borderRadius: RFValue(12),
      alignItems: "center",
      justifyContent: "center",
    },
    bankIcon: {
      width: RFValue(48),
      height: RFValue(48),
    },
    accountNumberSection: {
      alignItems: "flex-end",
    },
    accountNumberLabel: {
      fontSize: RFValue(11),
      color: colors.slate[200],
      marginBottom: RFValue(4),
    },
    accountNumber: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[100],
      letterSpacing: 1,
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    accountNameSection: {
      flex: 1,
    },
    accountNameLabel: {
      fontSize: RFValue(11),
      color: colors.slate[200],
      marginBottom: RFValue(4),
    },
    accountName: {
      fontSize: RFValue(14),
      fontWeight: "600",
      color: colors.slate[100],
    },
    bankSection: {
      alignItems: "flex-end",
    },
    bankLabel: {
      fontSize: RFValue(11),
      color: colors.slate[200],
      marginBottom: RFValue(4),
    },
    bankName: {
      fontSize: RFValue(12),
      fontWeight: "600",
      color: colors.slate[100],
      textAlign: "right",
    },

    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
    addContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(8),
      justifyContent: "center",
    },
    addIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    addText: {
      fontSize: RFValue(16),
      fontWeight: "500",
      color: colors.slate[650],
    },
    section: { marginBottom: RFValue(24) },
    sectionHeaderInside: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.slate[150],
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(16),
      marginHorizontal: RFValue(-16),
      marginTop: RFValue(-16),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
      borderTopLeftRadius: RFValue(12),
      borderTopRightRadius: RFValue(12),
    },
    sectionTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    editButton: { flexDirection: "row", alignItems: "center", gap: RFValue(6) },
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
    infoContainer: {
      backgroundColor: colors.background,
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      padding: RFValue(16),
      gap: RFValue(16),
    },
    infoRow: { flexDirection: "row", gap: RFValue(16) },
    infoField: { flex: 1 },
    fullWidthRow: { width: "100%" },
    infoLabel: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      marginBottom: RFValue(6),
    },
    infoValue: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      lineHeight: RFValue(22),
    },
  });

export default LandlordAccountInfoSubstep;
