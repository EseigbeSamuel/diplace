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
        <View  className="flex-1">
          {/* Bank Cards List */}
          {isBanksLoading ? (
            <View style={paymentStyles.emptyState} className="items-center justify-center">
              <ActivityIndicator size="small" color={colors.slate[650]} />
            </View>
          ) : banksError ? (
            <View style={paymentStyles.emptyState} className="items-center justify-center">
              <Text style={paymentStyles.emptyStateText}>
                Unable to load bank details
              </Text>
              <Pressable onPress={() => refetchBanks()}>
                <Text style={paymentStyles.retryText} className="font-semibold">Retry</Text>
              </Pressable>
            </View>
          ) : banks.length > 0 ? (
            <View style={paymentStyles.cardsContainer}>
              {banks.map((card) => (
                <View key={card.public_id} style={paymentStyles.cardWrapper}>
                  <View style={paymentStyles.bankCard}>
                    <View style={paymentStyles.cardHeader} className="flex-row justify-between items-start">
                      <View style={paymentStyles.bankIconContainer} className="items-center justify-center">
                        <Image
                          source={require("@/assets/icons/bank-emoji.png")}
                          style={paymentStyles.bankIcon}
                        />
                      </View>
                      <View  className="items-end">
                        <Text style={paymentStyles.accountNumberLabel}>
                          Account Number
                        </Text>
                        <Text style={paymentStyles.accountNumber} className="font-bold tracking-[1px]">
                          {card.account_number}
                        </Text>
                      </View>
                    </View>
                    <View  className="flex-row justify-between">
                      <View  className="flex-1">
                        <Text style={paymentStyles.accountNameLabel}>
                          Account Name
                        </Text>
                        <Text style={paymentStyles.accountName} className="font-semibold">
                          {card.account_name}
                        </Text>
                      </View>
                      <View  className="items-end">
                        <Text style={paymentStyles.bankLabel}>Bank</Text>
                        <Text style={paymentStyles.bankName} className="font-semibold">
                          {card.bank_name}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Pressable
                    style={paymentStyles.removeButton}
                    onPress={() => handleRemoveCard(card.public_id)}
                    disabled={deleteBankPending}
                   className="flex-row items-center justify-center self-end">
                    <Image
                      source={require("@/assets/icons/delete.png")}
                      style={paymentStyles.removeIcon}
                    />
                    <Text style={paymentStyles.removeText} className="font-medium">Remove</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <View style={paymentStyles.emptyState} className="items-center justify-center">
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
    container: {},
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
      color: colors.slate[300],
      marginBottom: RFValue(4),
    },
    accountNumber: {fontSize: RFValue(20),
color: colors.slate[200]},
    cardFooter: {},
    accountNameSection: {},
    accountNameLabel: {
      fontSize: RFValue(11),
      color: colors.slate[300],
      marginBottom: RFValue(4),
    },
    accountName: {fontSize: RFValue(14),
color: colors.slate[200]},
    bankSection: {},
    bankLabel: {
      fontSize: RFValue(11),
      color: colors.slate[300],
      marginBottom: RFValue(4),
    },
    bankName: {fontSize: RFValue(12),
color: colors.slate[200]},
    removeButton: {paddingVertical: RFValue(10),
paddingHorizontal: RFValue(16)},
    removeIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.error[300],
      marginRight: RFValue(8),
    },
    removeText: {fontSize: RFValue(14),
color: colors.error[300]},
    emptyState: {paddingVertical: RFValue(60)},
    emptyStateText: {
      fontSize: RFValue(15),
      color: colors.slate[500],
    },
    retryText: {marginTop: RFValue(10),
fontSize: RFValue(14),
color: colors.slate[650]},
    buttonContainer: {
      paddingHorizontal: RFValue(5),
      paddingVertical: RFValue(20),
      backgroundColor: colors.background,
    },
  });
