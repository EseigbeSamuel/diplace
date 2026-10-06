// ConfirmOwnerEventDetailsSubstep.tsx
import { Edit } from "@/assets/icons";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { useGetCurrentUser } from "@/hooks";
import { useSpaceStore } from "@/store/useSpace";
import { BankDetails } from "@/types/add-space-types";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AddBankDetails from "./substep3";

interface ConfirmOwnerEventDetailsSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const ConfirmOwnerEventDetailsSubstep: React.FC<
  ConfirmOwnerEventDetailsSubstepProps
> = ({ onNext, onPrev }) => {
  const { colors } = useTheme();
  const { spaceForm, setValue } = useSpaceStore();
  const { currentUser } = useGetCurrentUser();
  const styles = createStyles(colors);

  const [showBankModal, setShowBankModal] = useState(false);

  const address = currentUser?.address
    ? [
        currentUser.address.street,
        currentUser.address.city,
        currentUser.address.state,
        currentUser.address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const personalInfo = {
    businessName:
      currentUser?.full_name?.trim() ||
      `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`.trim() ||
      "N/A",
    Location: address || "N/A",
    phoneNumber: currentUser?.phone_number || "N/A",
  };

  const handleEditBankDetails = () => {
    setShowBankModal(true);
  };

  const handleNext = () => onNext();

  // Callback when modal completes
  const handleBankUpdate = (updatedBank: BankDetails) => {
    setValue({ accountDetails: updatedBank });
    setShowBankModal(false);
  };

  return (
    <View style={styles.container} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title} className="font-semibold">Confirm your details</Text>

        {/* Personal Info */}
        <View style={styles.section}>
          <View style={styles.infoContainer} className="border-[1px]">
            <View style={styles.sectionHeaderInside} className="flex-row items-center justify-between border-b">
              <Text style={styles.sectionTitle} className="font-semibold">Personal Information</Text>
            </View>
            <View style={styles.infoColumn} className="flex-col">
              <View  className="flex-1">
                <Text style={styles.infoLabel}>Business Name</Text>
                <Text style={styles.infoValue} className="font-semibold">
                  {personalInfo.businessName}
                </Text>
              </View>
              <View  className="flex-1">
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue} className="font-semibold">{personalInfo.Location}</Text>
              </View>
              <View  className="flex-1">
                <Text style={styles.infoLabel}>Phone No.</Text>
                <Text style={styles.infoValue} className="font-semibold">{personalInfo.phoneNumber}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bank Details */}
        <View style={styles.section}>
          <View style={styles.infoContainer} className="border-[1px]">
            <View style={styles.sectionHeaderInside} className="flex-row items-center justify-between border-b">
              <Text style={styles.sectionTitle} className="font-semibold">Bank Details</Text>
              <Pressable
                style={styles.editButton}
                onPress={handleEditBankDetails}
               className="flex-row items-center">
                {/* <Image
                    source={require("@/assets/icons/edit-pencil-fill.png")}
                    style={styles.editIcon}
                  /> */}
                <Edit size={16} color={colors.slate[650]} />
                <Text style={styles.editText} className="font-medium">Edit</Text>
              </Pressable>
            </View>

            <View style={styles.infoRow} className="flex-row">
              <View  className="flex-1">
                <Text style={styles.infoLabel}>Account Number</Text>
                <Text style={styles.infoValue} className="font-semibold">
                  {spaceForm.value.accountDetails?.accountNumber ||
                    "UNAVAILABLE"}
                </Text>
              </View>
              <View  className="flex-1">
                <Text style={styles.infoLabel}>Account Name</Text>
                <Text style={styles.infoValue} className="font-semibold">
                  {spaceForm.value.accountDetails?.accountName || "UNAVAILABLE"}
                </Text>
              </View>
            </View>
            <View  className="w-[100%px]">
              <Text style={styles.infoLabel}>Bank</Text>
              <Text style={styles.infoValue} className="font-semibold">
                {spaceForm.value.accountDetails?.bank || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <AppButton title="Next" onPress={handleNext} size="large" fullwidth />
      </View>

      {/* Bank Modal */}
      <Modal visible={showBankModal} animationType="slide" transparent={true}>
        <AddBankDetails
          onComplete={handleBankUpdate}
          initialBankDetails={spaceForm.value.accountDetails}
          onClose={() => setShowBankModal(false)}
        />
      </Modal>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {backgroundColor: colors.background},
    scrollContent: { paddingTop: RFValue(32) },
    title: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(32)},
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
    infoColumn: {gap: RFValue(16)},
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
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
  });

export default ConfirmOwnerEventDetailsSubstep;
