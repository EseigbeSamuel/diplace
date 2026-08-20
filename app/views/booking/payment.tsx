import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { useInitiateBookingPayment } from "@/hooks";
import { ColorScheme } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  Linking,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type PaymentMethod = "card" | "bank" | "ussd" | null;

const PaymentScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string>>();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const {
    initiateBookingPaymentMutation,
    isInitiateBookingPaymentPending,
  } = useInitiateBookingPayment();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [creditData, setCreditData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  });

  const amount = params.amount || "₦0";
  const amountValue = Number(params.amountValue) || 0;
  const isPartialPayment = params.type === "reserve";
  const isInspection = params.type === "inspection";

  const initiatePayment = async (paymentMethod: Exclude<PaymentMethod, null>) => {
    if (!params.relatedId) return;

    const payment = await initiateBookingPaymentMutation({
      related_id: params.relatedId,
      purpose: params.purpose || "booking_fee",
      gateway: "flutterwave",
      amount: amountValue,
      currency: "NGN",
    });

    if (payment.payment_link) {
      await Linking.openURL(payment.payment_link);
    }

    router.push({
      pathname: "/views/booking/payment-success",
      params: {
        txRef: payment.tx_ref,
        gateway: payment.gateway,
        paymentMethod,
        amount,
      },
    });
  };

  const handleMakePayment = () => {
    if (selectedPaymentMethod === "card") {
      setShowCardModal(true);
    } else if (selectedPaymentMethod === "bank") {
      setShowBankModal(true);
    } else if (selectedPaymentMethod === "ussd") {
      initiatePayment("ussd");
    }
  };

  const handleCardPayment = () => {
    setShowCardModal(false);
    initiatePayment("card");
  };

  const handleBankTransfer = () => {
    setShowBankModal(false);
    initiatePayment("bank");
  };

  return (
    <SafeAreaViewContainer>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Image
            source={require("@/assets/icons/arrow-left-light.png")}
            style={styles.backIcon}
          />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isInspection
            ? "Pay for inspection"
            : !isPartialPayment
              ? "Pay for space"
              : "Reserve space"}
        </Text>
        <View style={{ width: RFValue(20) }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Amount Card */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Amount Payable</Text>
            <View style={styles.amountRow}>
              <Text style={styles.amount}>{amount}</Text>
              <Image
                source={require("@/assets/icons/money-bag.png")}
                style={styles.moneyBagIcon}
              />
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentMethodsSection}>
            <Text style={styles.sectionTitle}>Pay via</Text>

            {/* Credit/Debit Card */}
            <Pressable
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === "card" &&
                  styles.paymentMethodCardSelected,
              ]}
              onPress={() => setSelectedPaymentMethod("card")}
            >
              <View style={styles.paymentMethodLeft}>
                <Image
                  source={require("@/assets/icons/credit-card.png")}
                  style={styles.paymentMethodIcon}
                />
                <Text style={styles.paymentMethodText}>Credit/Debit card</Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPaymentMethod === "card" &&
                    styles.radioButtonSelected,
                ]}
              >
                {selectedPaymentMethod === "card" && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </Pressable>

            {/* Bank Transfer */}
            <Pressable
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === "bank" &&
                  styles.paymentMethodCardSelected,
              ]}
              onPress={() => setSelectedPaymentMethod("bank")}
            >
              <View style={styles.paymentMethodLeft}>
                <Image
                  source={require("@/assets/icons/bank-emoji.png")}
                  style={styles.paymentMethodIcon}
                />
                <Text style={styles.paymentMethodText}>Bank transfer</Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPaymentMethod === "bank" &&
                    styles.radioButtonSelected,
                ]}
              >
                {selectedPaymentMethod === "bank" && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </Pressable>

            {/* USSD */}
            <Pressable
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === "ussd" &&
                  styles.paymentMethodCardSelected,
              ]}
              onPress={() => setSelectedPaymentMethod("ussd")}
            >
              <View style={styles.paymentMethodLeft}>
                <Image
                  source={require("@/assets/icons/phone emoji.png")}
                  style={styles.paymentMethodIcon}
                />
                <Text style={styles.paymentMethodText}>USSD</Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPaymentMethod === "ussd" &&
                    styles.radioButtonSelected,
                ]}
              >
                {selectedPaymentMethod === "ussd" && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton
          onPress={handleMakePayment}
          title={isInitiateBookingPaymentPending ? "Initializing Payment..." : "Make Payment"}
          disabled={!selectedPaymentMethod || isInitiateBookingPaymentPending}
        />
        <View style={styles.securePaymentNote}>
          <Text style={styles.securePaymentText}>
            🔐 Your payment is 100% secure. Funds are held safely until
            inspection is confirmed.
          </Text>
        </View>
      </View>

      {/* Card Payment Modal */}
      <Modal
        visible={showCardModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCardModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCardModal(false)}
        >
          <Pressable
            style={styles.modalBottomSheet}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <View style={styles.modalHandle} />

            {/* Header */}
            <Text style={styles.modalHeaderTitle}>Pay with card</Text>
            <Text style={styles.modalHeaderSubtitle}>
              Fill card details to complete transaction
            </Text>

            {/* Card Form */}
            <View style={styles.modalBody}>
              {/* Card Number */}

              <TextField
                label="Card Number"
                onChange={(text) =>
                  setCreditData({ ...creditData, cardNumber: text.toString() })
                }
                value={creditData.cardNumber}
                icon={require("@/assets/icons/Bank Card - Iconly Pro-1.png")}
              />

              {/* Expiry and CVV */}
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <TextField
                    label="Expiry Date"
                    onChange={(text) =>
                      setCreditData({
                        ...creditData,
                        expiryDate: text.toString(),
                      })
                    }
                    value={creditData.expiryDate}
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <TextField
                    label="CVV"
                    onChange={(text) =>
                      setCreditData({ ...creditData, cvv: text.toString() })
                    }
                    value={creditData.cvv}
                    icon={require("@/assets/icons/Danger Circle - Iconly Pro.png")}
                  />
                </View>
              </View>

              {/* Save Card Toggle */}
              <View style={styles.saveCardContainer}>
                <Text style={styles.saveCardText}>Save card details</Text>

                <Switch
                  trackColor={{
                    false: colors.slate[300],
                    true: colors.success[200],
                  }}
                  thumbColor={
                    creditData.saveCard ? colors.slate[200] : colors.slate[500]
                  }
                  ios_backgroundColor={colors.slate[300]}
                  onValueChange={(value) =>
                    setCreditData({ ...creditData, saveCard: value })
                  }
                  value={creditData.saveCard}
                />
              </View>

              {/* Confirm Button */}
              <AppButton
                onPress={handleCardPayment}
                title={isInitiateBookingPaymentPending ? "Initializing Payment..." : `Confirm & Pay (${amount})`}
                disabled={
                  isInitiateBookingPaymentPending ||
                  !creditData.cardNumber ||
                  !creditData.expiryDate ||
                  !creditData.cvv
                }
              />

              {/* Secure Note */}
              <View style={styles.securePaymentNote}>
                <Text style={styles.securePaymentText}>
                  🔐 Your payment is 100% secure. Funds are held safely until
                  inspection is confirmed.
                </Text>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Bank Transfer Modal */}
      <Modal
        visible={showBankModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBankModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowBankModal(false)}
        >
          <Pressable
            style={styles.modalBottomSheet}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <View style={styles.modalHandle} />

            {/* Header */}
            <Text style={styles.modalHeaderTitle}>Pay via bank transfer</Text>
            <Text style={styles.modalHeaderSubtitle}>
              Transfer to the bank details below to complete transaction.
            </Text>

            {/* Bank Details */}
            <View style={styles.modalBody}>
              {/* Account Name */}
              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Account Name</Text>
                <Text style={styles.bankDetailValue}>
                  Paystack/DiPlace Technologies
                </Text>
              </View>

              {/* Account Number */}
              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Account Number</Text>
                <View style={styles.bankDetailValueRow}>
                  <Text style={styles.bankDetailValue}>8102934980</Text>
                  <Pressable style={styles.copyButton}>
                    <Image
                      source={require("@/assets/icons/copy-linear.png")}
                      style={styles.copyIcon}
                    />
                    <Text style={styles.copyText}>copy</Text>
                  </Pressable>
                </View>
              </View>

              {/* Bank Name */}
              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Bank Name</Text>
                <Text style={styles.bankDetailValue}>Wema Bank Plc</Text>
              </View>

              {/* Timer Notice */}
              <View style={styles.timerNotice}>
                <Text style={styles.timerText}>
                  You have{" "}
                  <Text style={styles.timerHighlight}>9:59 minutes</Text> to
                  complete your transfer. This page will be confirmed in this
                  period.
                </Text>
              </View>

              {/* Confirm Button */}
              <AppButton
                onPress={handleBankTransfer}
                title={isInitiateBookingPaymentPending ? "Initializing Payment..." : `I've sent the money (${amount})`}
                disabled={isInitiateBookingPaymentPending}
              />

              {/* Secure Note */}
              <View style={styles.securePaymentNote}>
                <Text style={styles.securePaymentText}>
                  🔐 Your payment is 100% secure. Funds are held safely until
                  inspection is confirmed.
                </Text>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaViewContainer>
  );
};

export default PaymentScreen;

const getStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
    },
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    headerTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
      flex: 1,
      textAlign: "center",
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: RFValue(160),
    },
    container: {
      flex: 1,
    },
    amountCard: {
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(16),
      paddingVertical: RFValue(20),
      paddingHorizontal: RFValue(16),
      marginTop: RFValue(20),
      marginBottom: RFValue(24),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    amountLabel: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      marginBottom: RFValue(8),
    },
    amountRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    amount: {
      fontSize: RFValue(24),
      fontWeight: "700",
      color: colors.slate[650],
    },
    moneyBagIcon: {
      width: RFValue(28),
      height: RFValue(28),
    },
    paymentMethodsSection: {
      marginBottom: RFValue(24),
      marginTop: RFValue(8),
      paddingTop: RFValue(16),

      borderTopWidth: 1,
      borderTopColor: colors.slate[300],
    },
    sectionTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(16),
    },
    paymentMethodCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.background,
      borderRadius: RFValue(12),
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(8),
      marginBottom: RFValue(12),
    },
    paymentMethodCardSelected: {
      borderColor: colors.slate[500],
    },
    paymentMethodLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(12),
    },
    paymentMethodIcon: {
      width: RFValue(24),
      height: RFValue(24),
    },
    paymentMethodText: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
    },
    radioButton: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 2,
      borderColor: colors.slate[400],
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
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: RFValue(20),
      paddingTop: RFValue(16),
      paddingBottom: RFValue(24),
      backgroundColor: colors.background,
    },
    securePaymentNote: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: RFValue(8),
      marginTop: RFValue(12),
      justifyContent: "center",
    },
    shieldIcon: {
      width: RFValue(16),
      height: RFValue(16),
      marginTop: RFValue(2),
    },
    securePaymentText: {
      flex: 1,
      fontSize: RFValue(12),
      color: colors.slate[500],
      lineHeight: RFValue(16),
      textAlign: "center",
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalBottomSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingTop: RFValue(12),
      paddingBottom: RFValue(32),
      maxHeight: "90%",
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginBottom: RFValue(20),
    },
    modalHeaderTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
      textAlign: "center",
      marginBottom: RFValue(4),
    },
    modalHeaderSubtitle: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      textAlign: "center",
      marginBottom: RFValue(24),
    },
    modalBody: {
      gap: RFValue(16),
    },
    inputContainer: {
      gap: RFValue(8),
    },
    inputLabel: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(14),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    inputPlaceholder: {
      fontSize: RFValue(14),
      color: colors.slate[500],
    },
    inputIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[500],
    },
    inputRow: {
      flexDirection: "row",
      gap: RFValue(12),
    },
    saveCardContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    saveCardText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    toggle: {
      width: RFValue(44),
      height: RFValue(24),
      borderRadius: RFValue(12),
      backgroundColor: colors.success[200],
      padding: RFValue(2),
      justifyContent: "center",
      alignItems: "flex-end",
    },
    bankDetailItem: {
      gap: RFValue(8),
    },
    bankDetailLabel: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    bankDetailValue: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
    bankDetailValueRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(2),
    },
    copyButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(4),
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(4),
    },
    copyIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[550],
    },
    copyText: {
      fontSize: RFValue(13),
      color: colors.slate[550],
      fontWeight: "500",
    },
    timerNotice: {
      borderRadius: RFValue(12),
      paddingVertical: RFValue(12),
      textAlign: "center",
    },
    timerText: {
      fontSize: RFValue(13),
      color: colors.slate[650],
      lineHeight: RFValue(18),
      textAlign: "center",
    },
    timerHighlight: {
      fontWeight: "700",
      color: colors.error[200],
    },
  });
