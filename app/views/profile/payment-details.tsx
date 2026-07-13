import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import ViewHeader from "@/components/view-header";
import { useTheme } from "@/contexts/themeContext";
import { useDeleteBank, useGetUserBanks } from "@/hooks";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const PaymentDetails = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const paymentStyles = styles(colors);
  const { banks, isBanksLoading, banksError, refetchBanks } = useGetUserBanks();
  const { deleteBankMutation, deleteBankPending } = useDeleteBank();

  const handleAddBankDetails = () => {
    router.push("/views/profile/add-bank-complete");
  };

  const handleRemoveCard = (bankId: string) => {
    Alert.alert("Remove Bank", "Remove this bank account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          if (deleteBankPending) return;
          await deleteBankMutation({ bankId });
        },
      },
    ]);
  };

  return (
    <SafeAreaViewContainer>
      <ViewHeader title="Payment Details" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={paymentStyles.container}>
          {/* Bank Cards List */}
          {isBanksLoading ? (
            <View style={paymentStyles.emptyState}>
              <ActivityIndicator size="small" color={colors.slate[650]} />
            </View>
          ) : banksError ? (
            <View style={paymentStyles.emptyState}>
              <Text style={paymentStyles.emptyStateText}>
                Unable to load bank details
              </Text>
              <Pressable onPress={() => refetchBanks()}>
                <Text style={paymentStyles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : banks.length > 0 ? (
            <View style={paymentStyles.cardsContainer}>
              {banks.map((card) => (
                <View key={card.public_id} style={paymentStyles.cardWrapper}>
                  <View style={paymentStyles.bankCard}>
                    <View style={paymentStyles.cardHeader}>
                      <View style={paymentStyles.bankIconContainer}>
                        <Image
                          source={require("@/assets/icons/bank-emoji.png")}
                          style={paymentStyles.bankIcon}
                        />
                      </View>
                      <View style={paymentStyles.accountNumberSection}>
                        <Text style={paymentStyles.accountNumberLabel}>
                          Account Number
                        </Text>
                        <Text style={paymentStyles.accountNumber}>
                          {card.account_number}
                        </Text>
                      </View>
                    </View>
                    <View style={paymentStyles.cardFooter}>
                      <View style={paymentStyles.accountNameSection}>
                        <Text style={paymentStyles.accountNameLabel}>
                          Account Name
                        </Text>
                        <Text style={paymentStyles.accountName}>
                          {card.account_name}
                        </Text>
                      </View>
                      <View style={paymentStyles.bankSection}>
                        <Text style={paymentStyles.bankLabel}>Bank</Text>
                        <Text style={paymentStyles.bankName}>
                          {card.bank_name}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Pressable
                    style={paymentStyles.removeButton}
                    onPress={() => handleRemoveCard(card.public_id)}
                    disabled={deleteBankPending}
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
    retryText: {
      marginTop: RFValue(10),
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "600",
    },
    buttonContainer: {
      paddingHorizontal: RFValue(5),
      paddingVertical: RFValue(20),
      backgroundColor: colors.background,
    },
  });
