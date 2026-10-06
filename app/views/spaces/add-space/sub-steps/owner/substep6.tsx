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
          Give us the {spaceForm.type === "event" ? "owner's" : "landlord's"}{" "}
          payment details
        </Text>

        {!spaceForm.value.ownerAccountDetails?.accountName ? (
          <>
            <View style={styles.previewCard}>
              <View style={styles.cardHeader} className="flex-row justify-between items-start">
                <View style={styles.bankIconContainer} className="items-center justify-center">
                  <Image
                    source={require("@/assets/icons/bank-emoji.png")}
                    style={styles.bankIcon}
                  />
                </View>
                <View  className="items-end">
                  <Text style={styles.accountNumberLabel}>Account Number</Text>
                  <Text style={styles.accountNumber} className="font-bold tracking-[1px]">
                    {spaceForm.value.ownerAccountDetails?.accountNumber ||
                      "N/A"}
                  </Text>
                </View>
              </View>
              <View  className="flex-row justify-between">
                <View  className="flex-1">
                  <Text style={styles.accountNameLabel}>Account Name</Text>
                  <Text style={styles.accountName} className="font-semibold">
                    {spaceForm.value.ownerAccountDetails?.accountName ||
                      "UNAVAILABLE"}
                  </Text>
                </View>
                <View  className="items-end">
                  <Text style={styles.bankLabel}>Bank</Text>
                  <Text style={styles.bankName} className="font-semibold text-right">
                    {spaceForm.value.ownerAccountDetails?.bank || "UNAVAILABLE"}
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <Pressable
                onPress={() => setShowBankModal(true)}
                style={styles.addContent}
               className="flex-row items-center justify-center">
                <Image
                  source={require("@/assets/icons/plus.png")}
                  style={styles.addIcon}
                />
                <Text style={styles.addText} className="font-medium">Add bank details</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <View style={styles.infoContainer} className="border-[1px]">
              <View style={styles.sectionHeaderInside} className="flex-row items-center justify-between border-b">
                <Text style={styles.sectionTitle} className="font-semibold">Bank Details</Text>
                <Pressable
                  style={styles.editButton}
                  onPress={() => setShowBankModal(true)}
                 className="flex-row items-center">
                  <Image
                    source={require("@/assets/icons/edit-pencil-fill.png")}
                    style={styles.editIcon}
                  />
                  <Text style={styles.editText} className="font-medium">Edit</Text>
                </Pressable>
              </View>

              <View style={styles.infoRow} className="flex-row">
                <View  className="flex-1">
                  <Text style={styles.infoLabel}>Account Number</Text>
                  <Text style={styles.infoValue} className="font-semibold">
                    {spaceForm.value.ownerAccountDetails?.accountNumber}
                  </Text>
                </View>
                <View  className="flex-1">
                  <Text style={styles.infoLabel}>Account Name</Text>
                  <Text style={styles.infoValue} className="font-semibold">
                    {spaceForm.value.ownerAccountDetails?.accountName}
                  </Text>
                </View>
              </View>
              <View  className="w-[100%px]">
                <Text style={styles.infoLabel}>Bank</Text>
                <Text style={styles.infoValue} className="font-semibold">
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
    container: {backgroundColor: colors.background},
    scrollContent: {
      paddingTop: RFValue(32),
      paddingBottom: RFValue(20),
    },
    title: {fontSize: RFValue(20),
color: colors.slate[650],
lineHeight: RFValue(28),
marginBottom: RFValue(32)},
    previewCard: {
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(16),
      padding: RFValue(20),
      marginBottom: RFValue(32),
      minHeight: RFValue(180),
    },
    cardHeader: {marginBottom: RFValue(40)},
    bankIconContainer: {width: RFValue(48),
height: RFValue(48),
borderRadius: RFValue(12)},
    bankIcon: {
      width: RFValue(48),
      height: RFValue(48),
    },
    accountNumberSection: {},
    accountNumberLabel: {
      fontSize: RFValue(11),
      color: colors.slate[200],
      marginBottom: RFValue(4),
    },
    accountNumber: {fontSize: RFValue(20),
color: colors.slate[100]},
    cardFooter: {},
    accountNameSection: {},
    accountNameLabel: {
      fontSize: RFValue(11),
      color: colors.slate[200],
      marginBottom: RFValue(4),
    },
    accountName: {fontSize: RFValue(14),
color: colors.slate[100]},
    bankSection: {},
    bankLabel: {
      fontSize: RFValue(11),
      color: colors.slate[200],
      marginBottom: RFValue(4),
    },
    bankName: {fontSize: RFValue(12),
color: colors.slate[100]},

    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
    addContent: {gap: RFValue(8)},
    addIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    addText: {fontSize: RFValue(16),
color: colors.slate[650]},
    section: { marginBottom: RFValue(24) },
    sectionHeaderInside: {backgroundColor: colors.slate[150],
paddingHorizontal: RFValue(16),
paddingVertical: RFValue(16),
marginHorizontal: RFValue(-16),
marginTop: RFValue(-16),
borderBottomColor: colors.slate[300],
borderTopLeftRadius: RFValue(12),
borderTopRightRadius: RFValue(12)},
    sectionTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    editButton: {gap: RFValue(6)},
    editIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    editText: {fontSize: RFValue(14),
color: colors.slate[650]},
    infoContainer: {backgroundColor: colors.background,
borderRadius: RFValue(12),
borderColor: colors.slate[300],
padding: RFValue(16),
gap: RFValue(16)},
    infoRow: {gap: RFValue(16)},
    infoField: {},
    fullWidthRow: {},
    infoLabel: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      marginBottom: RFValue(6),
    },
    infoValue: {fontSize: RFValue(15),
color: colors.slate[650],
lineHeight: RFValue(22)},
  });

export default LandlordAccountInfoSubstep;
