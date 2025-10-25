import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";

interface BankCard {
  id: number;
  accountNumber: string;
  accountName: string;
  bank: string;
}

const PaymentDetails = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const paymentStyles = styles(colors);

  // Example bank card data - can be empty array if no cards
  const bankCards: BankCard[] = [
    {
      id: 1,
      accountNumber: "8102934980",
      accountName: "IBE X ALEX",
      bank: "ACCESS BANK PLC",
    },
  ];

  const handleAddBankDetails = () => {
    router.push("/views/profile/add-bank-complete");
  };

  const handleRemoveCard = (cardId: number) => {
    // Handle remove card logic
    console.log("Remove card:", cardId);
  };

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Payment Details" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={paymentStyles.container}>
          {/* Bank Cards List */}
          {bankCards.length > 0 ? (
            <View style={paymentStyles.cardsContainer}>
              {bankCards.map((card) => (
                <View key={card.id} style={paymentStyles.cardWrapper}>
                  <View style={paymentStyles.bankCard}>
                    <View style={paymentStyles.cardHeader}>
                      <View style={paymentStyles.bankIconContainer}>
                        <Image
                          source={require("@/assets/icons/bank-fill.png")}
                          style={paymentStyles.bankIcon}
                        />
                      </View>
                      <View style={paymentStyles.accountNumberSection}>
                        <Text style={paymentStyles.accountNumberLabel}>
                          Account Number
                        </Text>
                        <Text style={paymentStyles.accountNumber}>
                          {card.accountNumber}
                        </Text>
                      </View>
                    </View>
                    <View style={paymentStyles.cardFooter}>
                      <View style={paymentStyles.accountNameSection}>
                        <Text style={paymentStyles.accountNameLabel}>
                          Account Name
                        </Text>
                        <Text style={paymentStyles.accountName}>
                          {card.accountName}
                        </Text>
                      </View>
                      <View style={paymentStyles.bankSection}>
                        <Text style={paymentStyles.bankLabel}>Bank</Text>
                        <Text style={paymentStyles.bankName}>{card.bank}</Text>
                      </View>
                    </View>
                  </View>
                  <Pressable
                    style={paymentStyles.removeButton}
                    onPress={() => handleRemoveCard(card.id)}
                  >
                    <Image
                      source={require("@/assets/icons/delete.png")}
                      style={paymentStyles.removeIcon}
                    />
                    <Text style={paymentStyles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <View style={paymentStyles.emptyState}>
              <Text style={paymentStyles.emptyStateText}>
                No bank details added yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Bank Details Button - Fixed at bottom */}
      <View style={paymentStyles.buttonContainer}>
        <AppButton
          title="Add bank details"
          fullwidth={true}
          onPress={handleAddBankDetails}
          size="large"
          beforeIcon={require("@/assets/icons/plus.png")}
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default PaymentDetails;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: RFValue(16),
      paddingTop: RFValue(20),
    },
    cardsContainer: {
      gap: RFValue(20),
    },
    cardWrapper: {
      gap: RFValue(12),
    },
    bankCard: {
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(16),
      padding: RFValue(20),
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
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      alignItems: "center",
      justifyContent: "center",
    },
    bankIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: "#FFFFFF",
    },
    accountNumberSection: {
      alignItems: "flex-end",
    },
    accountNumberLabel: {
      fontSize: RFValue(11),
      color: "rgba(255, 255, 255, 0.7)",
      marginBottom: RFValue(4),
    },
    accountNumber: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: "#FFFFFF",
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
      color: "rgba(255, 255, 255, 0.7)",
      marginBottom: RFValue(4),
    },
    accountName: {
      fontSize: RFValue(14),
      fontWeight: "600",
      color: "#FFFFFF",
    },
    bankSection: {
      alignItems: "flex-end",
    },
    bankLabel: {
      fontSize: RFValue(11),
      color: "rgba(255, 255, 255, 0.7)",
      marginBottom: RFValue(4),
    },
    bankName: {
      fontSize: RFValue(12),
      fontWeight: "600",
      color: "#FFFFFF",
    },
    removeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: RFValue(10),
      paddingHorizontal: RFValue(16),
      alignSelf: "flex-end",
    },
    removeIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.error[300],
      marginRight: RFValue(8),
    },
    removeText: {
      fontSize: RFValue(14),
      color: colors.error[300],
      fontWeight: "500",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: RFValue(60),
    },
    emptyStateText: {
      fontSize: RFValue(15),
      color: colors.slate[500],
    },
    buttonContainer: {
      paddingHorizontal: RFValue(5),
      paddingVertical: RFValue(20),
      backgroundColor: colors.background,
      borderTopWidth: 1,
      width: "100%",
      borderTopColor: colors.slate[300],
    },
  });
