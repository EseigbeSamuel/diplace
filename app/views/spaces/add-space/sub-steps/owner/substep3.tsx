import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { useBankNameInquiry, useSupportedBanks } from "@/hooks";
import { useSpaceStore } from "@/store/useSpace";
import { SupportedBank } from "@/types";
import { ColorScheme } from "@/utils";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

interface Props {
  onComplete: (bankDetails: {
    accountNumber: string;
    accountName: string;
    bank: string;
  }) => void;
  initialBankDetails?: {
    accountNumber: string;
    accountName: string;
    bank: string;
  };
  onClose: () => void;
  ownerAcct?: boolean;
}

const AddBankDetails = ({
  onClose,
  onComplete,
  initialBankDetails,
  ownerAcct = false,
}: Props) => {
  const { colors } = useTheme();
  const { setValue } = useSpaceStore();
  const addBankStyles = styles(colors);
  const { bankNameInquiryMutation, bankNameInquiryPending } =
    useBankNameInquiry();

  const [selectedBank, setSelectedBank] = useState<SupportedBank | null>(
    initialBankDetails?.bank
      ? { name: initialBankDetails.bank, code: "" }
      : null,
  );
  const [accountNumber, setAccountNumber] = useState(
    initialBankDetails?.accountNumber || "",
  );
  const [accountName, setAccountName] = useState(
    initialBankDetails?.accountName || "",
  );
  const [showBankModal, setShowBankModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    supportedBanks,
    isSupportedBanksLoading,
    isSupportedBanksFetching,
    supportedBanksError,
    refetchSupportedBanks,
  } = useSupportedBanks({ query: searchQuery, enabled: showBankModal });
  const isVerifying = bankNameInquiryPending;

  // Auto-verify account when 10 digits are entered
  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank?.code) {
      verifyAccountNumber();
    } else if (accountNumber.length < 10) {
      setAccountName("");
    }
  }, [accountNumber, selectedBank?.code]);

  const verifyAccountNumber = async () => {
    setAccountName("");
    if (!selectedBank?.code || accountNumber.length !== 10) return;

    try {
      const response = await bankNameInquiryMutation({
        bankCode: selectedBank.code,
        accountNumber,
      });
      setAccountName(response.account_name || "");
    } catch {
      setAccountName("");
    }
  };

  const handleSelectBank = (bank: SupportedBank) => {
    setSelectedBank(bank);
    setShowBankModal(false);
    setSearchQuery("");
    setAccountName("");
  };

  const handleComplete = () => {
    if (selectedBank && accountNumber.length === 10 && accountName) {
      const bankDetails = {
        accountName,
        accountNumber,
        bank: selectedBank.name,
      };
      ownerAcct
        ? setValue({
            ownerAccountDetails: bankDetails,
          })
        : setValue({
            accountDetails: bankDetails,
          });
      onComplete(bankDetails);
      onClose();
    }
  };

  const isFormValid =
    selectedBank && accountNumber.length === 10 && accountName && !isVerifying;

  return (
    <SafeAreaViewContainer>
      <View style={addBankStyles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Pressable onPress={onClose} style={addBankStyles.confirmCloseButton}>
            <Image
              source={require("@/assets/icons/X-close.png")}
              style={addBankStyles.closeIcon}
            />
          </Pressable>
          <View style={addBankStyles.container}>
            {/* Header */}
            <View style={addBankStyles.headerSection}>
              <Text style={addBankStyles.title}>Bank Details</Text>
            </View>

            {/* Preview Card */}
            <View style={addBankStyles.previewCard}>
              <View style={addBankStyles.cardHeader}>
                <View style={addBankStyles.bankIconContainer}>
                  <Image
                    source={require("@/assets/icons/bank-emoji.png")}
                    style={addBankStyles.bankIcon}
                  />
                </View>
                <View style={addBankStyles.accountNumberSection}>
                  <Text style={addBankStyles.accountNumberLabel}>
                    Account Number
                  </Text>
                  <Text style={addBankStyles.accountNumber}>
                    {accountNumber || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={addBankStyles.cardFooter}>
                <View style={addBankStyles.accountNameSection}>
                  <Text style={addBankStyles.accountNameLabel}>
                    Account Name
                  </Text>
                  <Text style={addBankStyles.accountName}>
                    {accountName || "UNAVAILABLE"}
                  </Text>
                </View>
                <View style={addBankStyles.bankSection}>
                  <Text style={addBankStyles.bankLabel}>Bank</Text>
                  <Text style={addBankStyles.bankName}>
                    {selectedBank?.name || "UNAVAILABLE"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Form Section */}
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              <View style={addBankStyles.formSection}>
                {/* Bank Name Selector */}

                <TextField
                  label="Bank Name"
                  type="dropdown"
                  value={selectedBank?.name || ""}
                  onDropdownPress={() => setShowBankModal(true)}
                  onChange={() => {}}
                />

                {/* Account Number Input */}

                <TextField
                  label="Account Number"
                  value={accountNumber}
                  onChange={(value) =>
                    setAccountNumber(value.toString().replace(/\D/g, ""))
                  }
                  keyboardType="numeric"
                  maxLength={10}
                  editable={!!selectedBank}
                />
                {accountNumber.length === 10 && (
                  <View>
                    {isVerifying ? (
                      <View style={addBankStyles.verifyingContainer}>
                        <Text style={addBankStyles.verifyingText}>
                          fetching name...{" "}
                        </Text>
                        <ActivityIndicator
                          size="small"
                          color={colors.slate[500]}
                        />
                      </View>
                    ) : accountName ? (
                      <TextField
                        label="Account Name"
                        value={accountName}
                        onChange={(value) => setAccountName(value.toString())}
                        editable={false}
                      />
                    ) : null}
                  </View>
                )}
              </View>

              {/* Complete Button */}
            </KeyboardAwareScrollView>
          </View>
        </KeyboardAwareScrollView>

        <View style={addBankStyles.buttonContainer}>
          <AppButton
            title="Confirm"
            onPress={handleComplete}
            size="large"
            variant={isFormValid ? "primary" : "secondary"}
            disabled={!isFormValid}
            fullwidth
          />
        </View>
        {/* Bank Selection Modal */}
        <Modal
          visible={showBankModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowBankModal(false)}
        >
          <View style={addBankStyles.modalOverlay}>
            <Pressable
              style={addBankStyles.modalBackdrop}
              onPress={() => setShowBankModal(false)}
            />
            <View style={addBankStyles.modalContent}>
              {/* Modal Handle */}
              <View style={addBankStyles.modalHandle} />

              <View style={addBankStyles.modalHeader}>
                <Text style={addBankStyles.modalTitle}>Select your bank</Text>
              </View>

              {/* Search Input */}
              <View style={addBankStyles.searchContainer}>
                <Image
                  source={require("@/assets/icons/search.png")}
                  style={addBankStyles.searchIcon}
                />
                <TextInput
                  style={addBankStyles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search..."
                  placeholderTextColor={colors.slate[450]}
                />
              </View>

              {/* Bank List */}
              <ScrollView style={addBankStyles.bankList}>
                {isSupportedBanksLoading || isSupportedBanksFetching ? (
                  <View style={addBankStyles.bankState}>
                    <ActivityIndicator size="small" color={colors.slate[500]} />
                    <Text style={addBankStyles.bankStateText}>
                      Loading banks...
                    </Text>
                  </View>
                ) : supportedBanksError ? (
                  <Pressable
                    style={addBankStyles.bankState}
                    onPress={() => refetchSupportedBanks()}
                  >
                    <Text style={addBankStyles.bankStateText}>
                      Unable to load banks. Tap to retry.
                    </Text>
                  </Pressable>
                ) : supportedBanks.length > 0 ? (
                  supportedBanks.map((bank) => (
                  <Pressable
                    key={bank.code}
                    style={addBankStyles.bankItem}
                    onPress={() => handleSelectBank(bank)}
                  >
                    <View
                      style={[
                        addBankStyles.radioButton,
                        selectedBank?.code === bank.code &&
                          addBankStyles.radioButtonSelected,
                      ]}
                    >
                      {selectedBank?.code === bank.code && (
                        <View style={addBankStyles.radioButtonInner} />
                      )}
                    </View>
                    <Text style={addBankStyles.bankItemText}>{bank.name}</Text>
                  </Pressable>
                  ))
                ) : (
                  <View style={addBankStyles.bankState}>
                    <Text style={addBankStyles.bankStateText}>
                      No banks found.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaViewContainer>
  );
};

export default AddBankDetails;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
    },
    headerSection: {
      paddingTop: RFValue(8),
      marginBottom: RFValue(16),
    },
    title: {
      fontSize: RFValue(24),
      fontWeight: "700",
      color: colors.slate[650],
    },
    previewCard: {
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(16),
      padding: RFValue(20),
      marginBottom: RFValue(16),
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
    formSection: {
      gap: RFValue(4),
    },
    selectorContainer: {
      paddingVertical: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      borderRadius: RFValue(10),
      backgroundColor: colors.slate[200],
      paddingHorizontal: RFValue(16),
    },
    selectorLabel: {
      fontSize: RFValue(13),
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    confirmCloseButton: {
      width: RFValue(32),
      height: RFValue(32),
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
      backgroundColor: colors.background,
      borderRadius: RFValue(16),
    },
    closeIcon: {
      width: RFValue(30),
      height: RFValue(30),
      tintColor: colors.slate[650],
    },
    selectorValue: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    selectorHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    selectorText: {
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    placeholder: {
      color: colors.slate[450],
    },
    chevronIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
    inputWrapper: {
      paddingVertical: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      borderRadius: RFValue(10),
      backgroundColor: colors.slate[200],
      paddingHorizontal: RFValue(16),
    },
    inputLabel: {
      fontSize: RFValue(13),
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(8),
    },
    textInput: {
      flex: 1,
      fontSize: RFValue(15),
      color: colors.slate[650],
      padding: 0,
    },
    verifyingText: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      fontStyle: "italic",
    },
    verifyingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(2),
      justifyContent: "flex-end",
    },
    accountNameDisplay: {
      gap: RFValue(4),
      paddingVertical: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      borderRadius: RFValue(10),
      backgroundColor: colors.slate[200],
      paddingHorizontal: RFValue(12),
    },
    accountNameDisplayLabel: {
      fontSize: RFValue(13),
      color: colors.slate[650],
    },
    accountNameDisplayValue: {
      fontSize: RFValue(15),
      color: colors.slate[650],
      fontWeight: "600",
    },
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      maxHeight: "80%",
      paddingBottom: RFValue(20),
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginTop: RFValue(12),
      marginBottom: RFValue(8),
    },
    modalHeader: {
      padding: RFValue(20),
      paddingTop: RFValue(12),
    },
    modalTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
      textAlign: "center",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.slate[150],
      marginHorizontal: RFValue(16),
      marginBottom: RFValue(8),
      paddingHorizontal: RFValue(12),
      borderRadius: RFValue(8),
    },
    searchIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
      marginRight: RFValue(8),
    },
    searchInput: {
      flex: 1,
      fontSize: RFValue(15),
      color: colors.slate[650],
      paddingVertical: RFValue(12),
    },
    bankList: {
      marginTop: RFValue(8),
    },
    bankState: {
      alignItems: "center",
      flexDirection: "row",
      gap: RFValue(8),
      justifyContent: "center",
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(20),
    },
    bankStateText: {
      color: colors.slate[500],
      fontSize: RFValue(14),
      textAlign: "center",
    },
    bankItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(16),
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
    radioButtonSelected: {
      borderColor: colors.slate[650],
    },
    radioButtonInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    bankItemText: {
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
  });
