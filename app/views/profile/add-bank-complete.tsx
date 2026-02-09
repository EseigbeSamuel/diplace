import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
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

interface Bank {
  id: number;
  name: string;
}

const AddBankDetails = () => {
  const { colors } = useTheme();
  const addBankStyles = styles(colors);

  const [selectedBank, setSelectedBank] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const banks: Bank[] = [
    { id: 1, name: "Access Bank Plc" },
    { id: 2, name: "First Bank of Nigeria Plc" },
    { id: 3, name: "OPAY" },
    { id: 4, name: "Moniepoint MFB" },
    { id: 5, name: "United Bank of Africa (UBA)" },
    { id: 6, name: "Guarantee Trust Bank (GTB)" },
    { id: 7, name: "Union Bank" },
    { id: 8, name: "Keystone Bank" },
    { id: 9, name: "Eco Bank" },
    { id: 10, name: "Wema Bank" },
    { id: 11, name: "Fidelity Bank" },
    { id: 12, name: "Kuda MFB" },
  ];

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Auto-verify account when 10 digits are entered
  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank) {
      verifyAccountNumber();
    } else if (accountNumber.length < 10) {
      setAccountName("");
    }
  }, [accountNumber, selectedBank]);

  const verifyAccountNumber = async () => {
    setIsVerifying(true);
    setAccountName("");

    // Simulate API call to verify account
    setTimeout(() => {
      // Mock response - replace with actual API call
      setAccountName("IBE X ALEX");
      setIsVerifying(false);
    }, 2000);
  };

  const handleSelectBank = (bankName: string) => {
    setSelectedBank(bankName);
    setShowBankModal(false);
    setSearchQuery("");
    // Reset account name when bank changes
    setAccountName("");
  };

  const handleComplete = () => {
    if (selectedBank && accountNumber.length === 10 && accountName) {
      // Handle form submission
      console.log("Bank:", selectedBank);
      console.log("Account Number:", accountNumber);
      console.log("Account Name:", accountName);
      // Navigate back or show success message
    }
  };

  const isFormValid =
    selectedBank && accountNumber.length === 10 && accountName && !isVerifying;

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Add bank details" rightIconView={false} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={addBankStyles.container}>
          {/* Header */}
          <View style={addBankStyles.headerSection}>
            <Text style={addBankStyles.title}>Add Bank Details</Text>
            <Text style={addBankStyles.description}>
              Please link your bank account you will use to collect payments.
            </Text>
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
                <Text style={addBankStyles.accountNameLabel}>Account Name</Text>
                <Text style={addBankStyles.accountName}>
                  {accountName || "UNAVAILABLE"}
                </Text>
              </View>
              <View style={addBankStyles.bankSection}>
                <Text style={addBankStyles.bankLabel}>Bank</Text>
                <Text style={addBankStyles.bankName}>
                  {selectedBank || "UNAVAILABLE"}
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
                type="dropdown"
                label="Bank Name"
                onDropdownPress={() => setShowBankModal(true)}
                value={selectedBank}
                onChange={(text) => setSelectedBank(text.toString())}
              />

              <TextField
                label="Account Number"
                onChange={(text) => setAccountNumber(text.toString())}
                value={accountNumber}
                keyboardType="numeric"
                maxLength={10}
                editable={!!selectedBank}
              />
              {isVerifying && (
                <View style={addBankStyles.verificationSection}>
                  <Text style={addBankStyles.verifyingText}>
                    fetching name...
                  </Text>
                  <ActivityIndicator size="small" color={colors.slate[500]} />
                </View>
              )}
              {accountName && (
                <TextField
                  label="Account Name"
                  onChange={() => {}}
                  value={accountName}
                  showCancel={false}
                  editable={false}
                />
              )}
            </View>

            {/* Complete Button */}
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>

      <View style={addBankStyles.buttonContainer}>
        <AppButton
          title="Complete"
          onPress={handleComplete}
          size="large"
          variant="primary"
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
              {filteredBanks.map((bank) => (
                <Pressable
                  key={bank.id}
                  style={addBankStyles.bankItem}
                  onPress={() => handleSelectBank(bank.name)}
                >
                  <View
                    style={[
                      addBankStyles.radioButton,
                      selectedBank === bank.name &&
                        addBankStyles.radioButtonSelected,
                    ]}
                  >
                    {selectedBank === bank.name && (
                      <View style={addBankStyles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={addBankStyles.bankItemText}>{bank.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaViewContainer>
  );
};

export default AddBankDetails;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    headerSection: {
      paddingTop: RFValue(20),
      marginBottom: RFValue(24),
    },
    title: {
      fontSize: RFValue(24),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
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
      color: colors.slate[300],
      marginBottom: RFValue(4),
    },
    accountNumber: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[200],
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
      color: colors.slate[300],
      marginBottom: RFValue(4),
    },
    accountName: {
      fontSize: RFValue(14),
      fontWeight: "600",
      color: colors.slate[200],
    },
    bankSection: {
      alignItems: "flex-end",
    },
    bankLabel: {
      fontSize: RFValue(11),
      color: colors.slate[300],
      marginBottom: RFValue(4),
    },
    bankName: {
      fontSize: RFValue(12),
      fontWeight: "600",
      color: colors.slate[200],
      textAlign: "right",
    },
    formSection: {
      gap: RFValue(8),
    },
    selectorContainer: {
      paddingVertical: RFValue(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
    },
    selectorLabel: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      marginBottom: RFValue(8),
    },
    selectorValue: {
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
      tintColor: colors.slate[600],
    },
    inputWrapper: {
      paddingVertical: RFValue(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
    },
    inputLabel: {
      fontSize: RFValue(13),
      color: colors.slate[500],
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
    verificationSection: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
      justifyContent: "flex-end",
    },
    verifyingText: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      fontStyle: "italic",
    },
    accountNameDisplay: {
      gap: RFValue(4),
    },
    accountNameDisplayLabel: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    accountNameDisplayValue: {
      fontSize: RFValue(15),
      color: colors.slate[650],
      fontWeight: "600",
    },
    buttonContainer: {
      position: "fixed",
      bottom: RFValue(20),
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
