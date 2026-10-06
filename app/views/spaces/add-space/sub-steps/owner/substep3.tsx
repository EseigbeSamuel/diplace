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
      <View  className="flex-1 pt-[20px]">
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Pressable onPress={onClose} style={addBankStyles.confirmCloseButton} className="items-center justify-center z-[10]">
            <Image
              source={require("@/assets/icons/X-close.png")}
              style={addBankStyles.closeIcon}
            />
          </Pressable>
          <View  className="flex-1 pt-[20px]">
            {/* Header */}
            <View style={addBankStyles.headerSection}>
              <Text style={addBankStyles.title} className="font-bold">Bank Details</Text>
            </View>

            {/* Preview Card */}
            <View style={addBankStyles.previewCard}>
              <View style={addBankStyles.cardHeader} className="flex-row justify-between items-start">
                <View style={addBankStyles.bankIconContainer} className="items-center justify-center">
                  <Image
                    source={require("@/assets/icons/bank-emoji.png")}
                    style={addBankStyles.bankIcon}
                  />
                </View>
                <View  className="items-end">
                  <Text style={addBankStyles.accountNumberLabel}>
                    Account Number
                  </Text>
                  <Text style={addBankStyles.accountNumber} className="font-bold tracking-[1px]">
                    {accountNumber || "N/A"}
                  </Text>
                </View>
              </View>
              <View  className="flex-row justify-between">
                <View  className="flex-1">
                  <Text style={addBankStyles.accountNameLabel}>
                    Account Name
                  </Text>
                  <Text style={addBankStyles.accountName} className="font-semibold">
                    {accountName || "UNAVAILABLE"}
                  </Text>
                </View>
                <View  className="items-end">
                  <Text style={addBankStyles.bankLabel}>Bank</Text>
                  <Text style={addBankStyles.bankName} className="font-semibold text-right">
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
                      <View style={addBankStyles.verifyingContainer} className="flex-row items-center justify-end">
                        <Text style={addBankStyles.verifyingText} className="italic">
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
          <View  className="flex-1 justify-end">
            <Pressable

              onPress={() => setShowBankModal(false)}
             className="flex-1 bg-[rgba(0, 0, 0, 0.5)]"/>
            <View style={addBankStyles.modalContent} className="max-h-[80%px]">
              {/* Modal Handle */}
              <View style={addBankStyles.modalHandle}  className="self-center"/>

              <View style={addBankStyles.modalHeader}>
                <Text style={addBankStyles.modalTitle} className="font-semibold text-center">Select your bank</Text>
              </View>

              {/* Search Input */}
              <View style={addBankStyles.searchContainer} className="flex-row items-center">
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
                 className="flex-1"/>
              </View>

              {/* Bank List */}
              <ScrollView style={addBankStyles.bankList}>
                {isSupportedBanksLoading || isSupportedBanksFetching ? (
                  <View style={addBankStyles.bankState} className="items-center flex-row justify-center">
                    <ActivityIndicator size="small" color={colors.slate[500]} />
                    <Text style={addBankStyles.bankStateText} className="text-center">
                      Loading banks...
                    </Text>
                  </View>
                ) : supportedBanksError ? (
                  <Pressable
                    style={addBankStyles.bankState}
                    onPress={() => refetchSupportedBanks()}
                   className="items-center flex-row justify-center">
                    <Text style={addBankStyles.bankStateText} className="text-center">
                      Unable to load banks. Tap to retry.
                    </Text>
                  </Pressable>
                ) : supportedBanks.length > 0 ? (
                  supportedBanks.map((bank) => (
                    <Pressable
                      key={bank.code}
                      style={addBankStyles.bankItem}
                      onPress={() => handleSelectBank(bank)}
                     className="flex-row items-center">
                      <View
                        style={[
                          addBankStyles.radioButton,
                          selectedBank?.code === bank.code &&
                            addBankStyles.radioButtonSelected,
                        ]}
                       className="border-[2px] items-center justify-center">
                        {selectedBank?.code === bank.code && (
                          <View style={addBankStyles.radioButtonInner} />
                        )}
                      </View>
                      <Text style={addBankStyles.bankItemText}>
                        {bank.name}
                      </Text>
                    </Pressable>
                  ))
                ) : (
                  <View style={addBankStyles.bankState} className="items-center flex-row justify-center">
                    <Text style={addBankStyles.bankStateText} className="text-center">
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
    container: {},
    headerSection: {
      paddingTop: RFValue(8),
      marginBottom: RFValue(16),
    },
    title: {fontSize: RFValue(24),
color: colors.slate[650]},
    previewCard: {
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(16),
      padding: RFValue(20),
      marginBottom: RFValue(16),
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
    formSection: {
      gap: RFValue(4),
    },
    selectorContainer: {paddingVertical: RFValue(12),
borderColor: colors.slate[300],
borderRadius: RFValue(10),
backgroundColor: colors.slate[200],
paddingHorizontal: RFValue(16)},
    selectorLabel: {
      fontSize: RFValue(13),
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    confirmCloseButton: {width: RFValue(32),
height: RFValue(32),
backgroundColor: colors.background,
borderRadius: RFValue(16)},
    closeIcon: {
      width: RFValue(30),
      height: RFValue(30),
      tintColor: colors.slate[650],
    },
    selectorValue: {},
    selectorHead: {},
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
    inputWrapper: {paddingVertical: RFValue(12),
borderColor: colors.slate[300],
borderRadius: RFValue(10),
backgroundColor: colors.slate[200],
paddingHorizontal: RFValue(16)},
    inputLabel: {
      fontSize: RFValue(13),
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    inputContainer: {gap: RFValue(8)},
    textInput: {fontSize: RFValue(15),
color: colors.slate[650]},
    verifyingText: {fontSize: RFValue(13),
color: colors.slate[500]},
    verifyingContainer: {gap: RFValue(2)},
    accountNameDisplay: {gap: RFValue(4),
paddingVertical: RFValue(12),
borderColor: colors.slate[300],
borderRadius: RFValue(10),
backgroundColor: colors.slate[200],
paddingHorizontal: RFValue(12)},
    accountNameDisplayLabel: {
      fontSize: RFValue(13),
      color: colors.slate[650],
    },
    accountNameDisplayValue: {fontSize: RFValue(15),
color: colors.slate[650]},
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
    modalOverlay: {},
    modalBackdrop: {},
    modalContent: {backgroundColor: colors.background,
borderTopLeftRadius: RFValue(24),
borderTopRightRadius: RFValue(24),
paddingBottom: RFValue(20)},
    modalHandle: {width: RFValue(40),
height: RFValue(4),
backgroundColor: colors.slate[300],
borderRadius: RFValue(2),
marginTop: RFValue(12),
marginBottom: RFValue(8)},
    modalHeader: {
      padding: RFValue(20),
      paddingTop: RFValue(12),
    },
    modalTitle: {fontSize: RFValue(18),
color: colors.slate[650]},
    searchContainer: {backgroundColor: colors.slate[150],
marginHorizontal: RFValue(16),
marginBottom: RFValue(8),
paddingHorizontal: RFValue(12),
borderRadius: RFValue(8)},
    searchIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
      marginRight: RFValue(8),
    },
    searchInput: {fontSize: RFValue(15),
color: colors.slate[650],
paddingVertical: RFValue(12)},
    bankList: {
      marginTop: RFValue(8),
    },
    bankState: {gap: RFValue(8),
paddingHorizontal: RFValue(20),
paddingVertical: RFValue(20)},
    bankStateText: {color: colors.slate[500],
fontSize: RFValue(14)},
    bankItem: {paddingHorizontal: RFValue(20),
paddingVertical: RFValue(16)},
    radioButton: {width: RFValue(20),
height: RFValue(20),
borderRadius: RFValue(10),
borderColor: colors.slate[400],
marginRight: RFValue(12)},
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
