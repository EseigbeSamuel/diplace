import AppButton from "@/components/button";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { useBankNameInquiry, useCreateBank, useSupportedBanks } from "@/hooks";
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

type props = {
  onNext: () => void;
};

const AddBankDetails = ({ onNext }: props) => {
  const { colors } = useTheme();
  const addBankStyles = styles(colors);
  const { bankNameInquiryMutation, bankNameInquiryPending } =
    useBankNameInquiry();
  const { createBankMutation, createBankPending } = useCreateBank();

  const [selectedBank, setSelectedBank] = useState<SupportedBank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("savings");
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
  const isSubmitting = createBankPending;

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
      setAccountType(response.account_type || "savings");
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

  const handleComplete = async () => {
    if (!selectedBank || accountNumber.length !== 10 || !accountName) return;

    await createBankMutation({
      bank_name: selectedBank.name,
      account_number: accountNumber,
      account_name: accountName,
      account_type: accountType,
    });
    onNext();
  };

  const isFormValid =
    !!selectedBank &&
    accountNumber.length === 10 &&
    !!accountName &&
    !isVerifying &&
    !isSubmitting;

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View  className="flex-1">
          {/* Header */}
          <View style={addBankStyles.headerSection}>
            <View style={addBankStyles.iconContainer} className="items-center justify-center">
              <Image
                source={require("@/assets/icons/bank-light.png")}
                style={addBankStyles.headIcon}
              />
            </View>
            <Text style={addBankStyles.title} className="font-bold">Bank Details</Text>
            <Text style={addBankStyles.description}>
              Please link your bank account you will use to collect payments.
            </Text>
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
                <Text style={addBankStyles.accountNameLabel}>Account Name</Text>
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
            <View>
              {/* Bank Name Selector */}

              <TextField
                label="Bank Name"
                value={selectedBank?.name || ""}
                type="dropdown"
                onDropdownPress={() => setShowBankModal(true)}
                onChange={() => {}}
              />

              {/* Account Number Input */}
              <View>
                <TextField
                  label="Account Number"
                  value={accountNumber}
                  onChange={(text) =>
                    setAccountNumber(text.toString().replace(/\D/g, ""))
                  }
                  keyboardType="numeric"
                  maxLength={10}
                  editable={!!selectedBank && !isSubmitting}
                />
                {isVerifying && (
                  <View style={addBankStyles.verifyingContainer} className="flex-row items-center text-right grow">
                    <Text style={addBankStyles.verifyingText} className="italic">
                      fetching name...
                    </Text>
                    <ActivityIndicator size="small" color={colors.slate[500]} />
                  </View>
                )}

                {/* Verifying/Account Name Display */}
                {accountNumber.length === 10 && !isVerifying && (
                  <TextField
                    label="Account Name"
                    value={accountName}
                    onChange={(text) => setAccountName(text.toString())}
                    editable={false}
                  />
                )}
              </View>
            </View>

            {/* Complete Button */}
            <View style={addBankStyles.buttonContainer}>
              <AppButton
                title="Complete"
                onPress={handleComplete}
                size="large"
                variant={isFormValid ? "primary" : "secondary"}
                disabled={!isFormValid}
                fullwidth
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>

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
                  <Text style={addBankStyles.bankItemText}>{bank.name}</Text>
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
  );
};

export default AddBankDetails;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {},
    headerSection: {
      paddingTop: RFValue(20),
      marginBottom: RFValue(24),
    },
    iconContainer: {width: RFValue(60),
height: RFValue(60),
borderRadius: RFValue(12)},
    headIcon: {
      width: RFValue(60),
      height: RFValue(60),
      tintColor: colors.slate[650],
    },
    title: {fontSize: RFValue(24),
color: colors.slate[650],
marginBottom: RFValue(8)},
    description: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      lineHeight: RFValue(20),
    },
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

    selectorContainer: {paddingVertical: RFValue(16),
backgroundColor: colors.slate[200],
paddingHorizontal: RFValue(12),
borderRadius: RFValue(16),
borderColor: colors.slate[300]},
    selectorLabel: {
      fontSize: RFValue(13),
      color: colors.slate[600],
    },
    selectorValue: {},
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
    inputLabel: {
      fontSize: RFValue(13),
      color: colors.slate[600],
    },
    inputContainer: {paddingVertical: RFValue(16),
backgroundColor: colors.slate[200],
paddingHorizontal: RFValue(12),
borderRadius: RFValue(16),
borderColor: colors.slate[300]},
    textInput: {fontSize: RFValue(15),
color: colors.slate[650]},
    verificationSection: {marginTop: RFValue(12),
paddingVertical: RFValue(16),
backgroundColor: colors.slate[200],
paddingHorizontal: RFValue(12),
borderRadius: RFValue(16),
borderColor: colors.slate[300]},
    verifyingContainer: {marginTop: RFValue(8)},
    verifyingText: {fontSize: RFValue(13),
color: colors.slate[600]},
    accountNameDisplay: {
      gap: RFValue(4),
    },
    accountNameDisplayLabel: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    accountNameDisplayValue: {fontSize: RFValue(15),
color: colors.slate[650]},
    buttonContainer: {
      marginTop: RFValue(32),
      marginBottom: RFValue(40),
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
