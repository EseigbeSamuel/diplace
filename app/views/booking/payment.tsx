import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { useInitiateBookingPayment } from "@/hooks";
import { BookingPaymentPurpose } from "@/types";
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

const PAYMENT_PURPOSES: BookingPaymentPurpose[] = [
  "inspection_fee",
  "booking_rent",
  "booking_deposit",
  "booking_balance",
  "service_charge",
  "promotion_fee",
  "subscription_fee",
];

const resolvePaymentPurpose = (
  purpose: string | undefined,
  type: string | undefined
): BookingPaymentPurpose => {
  if (purpose && PAYMENT_PURPOSES.includes(purpose as BookingPaymentPurpose)) {
    return purpose as BookingPaymentPurpose;
  }

  if (type === "inspection") return "inspection_fee";
  if (type === "reserve") return "booking_deposit";

  return "booking_rent";
};

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
      purpose: resolvePaymentPurpose(params.purpose, params.type),
      gateway: "bachs",
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
      <View style={styles.header} className="flex-row items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <Image
            source={require("@/assets/icons/arrow-left-light.png")}
            style={styles.backIcon}
          />
        </Pressable>
        <Text style={styles.headerTitle} className="font-semibold flex-1 text-center">
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
        <View  className="flex-1">
          {/* Amount Card */}
          <View style={styles.amountCard} className="border-[1px]">
            <Text style={styles.amountLabel}>Amount Payable</Text>
            <View  className="flex-row items-center justify-between">
              <Text style={styles.amount} className="font-bold">{amount}</Text>
              <Image
                source={require("@/assets/icons/money-bag.png")}
                style={styles.moneyBagIcon}
              />
            </View>
          </View>

          {/* Payment Methods */}
          <View style={styles.paymentMethodsSection} className="border-t">
            <Text style={styles.sectionTitle} className="font-semibold">Pay via</Text>

            {/* Credit/Debit Card */}
            <Pressable
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === "card" &&
                  styles.paymentMethodCardSelected,
              ]}
              onPress={() => setSelectedPaymentMethod("card")}
             className="flex-row items-center justify-between">
              <View style={styles.paymentMethodLeft} className="flex-row items-center">
                <Image
                  source={require("@/assets/icons/credit-card.png")}
                  style={styles.paymentMethodIcon}
                />
                <Text style={styles.paymentMethodText} className="font-medium">Credit/Debit card</Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPaymentMethod === "card" &&
                    styles.radioButtonSelected,
                ]}
               className="border-[2px] items-center justify-center">
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
             className="flex-row items-center justify-between">
              <View style={styles.paymentMethodLeft} className="flex-row items-center">
                <Image
                  source={require("@/assets/icons/bank-emoji.png")}
                  style={styles.paymentMethodIcon}
                />
                <Text style={styles.paymentMethodText} className="font-medium">Bank transfer</Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPaymentMethod === "bank" &&
                    styles.radioButtonSelected,
                ]}
               className="border-[2px] items-center justify-center">
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
             className="flex-row items-center justify-between">
              <View style={styles.paymentMethodLeft} className="flex-row items-center">
                <Image
                  source={require("@/assets/icons/phone emoji.png")}
                  style={styles.paymentMethodIcon}
                />
                <Text style={styles.paymentMethodText} className="font-medium">USSD</Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPaymentMethod === "ussd" &&
                    styles.radioButtonSelected,
                ]}
               className="border-[2px] items-center justify-center">
                {selectedPaymentMethod === "ussd" && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer} className="absolute bottom-[0px] left-[0px] right-[0px]">
        <AppButton
          onPress={handleMakePayment}
          title={isInitiateBookingPaymentPending ? "Initializing Payment..." : "Make Payment"}
          disabled={!selectedPaymentMethod || isInitiateBookingPaymentPending}
        />
        <View style={styles.securePaymentNote} className="flex-row items-start justify-center">
          <Text style={styles.securePaymentText} className="flex-1 text-center">
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

          onPress={() => setShowCardModal(false)}
         className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-end">
          <Pressable
            style={styles.modalBottomSheet}
            onPress={(e) => e.stopPropagation()}
           className="max-h-[90%px]">
            {/* Handle Bar */}
            <View style={styles.modalHandle}  className="self-center"/>

            {/* Header */}
            <Text style={styles.modalHeaderTitle} className="font-semibold text-center">Pay with card</Text>
            <Text style={styles.modalHeaderSubtitle} className="text-center">
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
              <View style={styles.inputRow} className="flex-row">
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
              <View  className="flex-row items-center justify-between">
                <Text style={styles.saveCardText} className="font-medium">Save card details</Text>

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
              <View style={styles.securePaymentNote} className="flex-row items-start justify-center">
                <Text style={styles.securePaymentText} className="flex-1 text-center">
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

          onPress={() => setShowBankModal(false)}
         className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-end">
          <Pressable
            style={styles.modalBottomSheet}
            onPress={(e) => e.stopPropagation()}
           className="max-h-[90%px]">
            {/* Handle Bar */}
            <View style={styles.modalHandle}  className="self-center"/>

            {/* Header */}
            <Text style={styles.modalHeaderTitle} className="font-semibold text-center">Pay via bank transfer</Text>
            <Text style={styles.modalHeaderSubtitle} className="text-center">
              Transfer to the bank details below to complete transaction.
            </Text>

            {/* Bank Details */}
            <View style={styles.modalBody}>
              {/* Account Name */}
              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Account Name</Text>
                <Text style={styles.bankDetailValue} className="font-semibold">
                  Paystack/DiPlace Technologies
                </Text>
              </View>

              {/* Account Number */}
              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Account Number</Text>
                <View style={styles.bankDetailValueRow} className="flex-row items-center">
                  <Text style={styles.bankDetailValue} className="font-semibold">8102934980</Text>
                  <Pressable style={styles.copyButton} className="flex-row items-center">
                    <Image
                      source={require("@/assets/icons/copy-linear.png")}
                      style={styles.copyIcon}
                    />
                    <Text style={styles.copyText} className="font-medium">copy</Text>
                  </Pressable>
                </View>
              </View>

              {/* Bank Name */}
              <View style={styles.bankDetailItem}>
                <Text style={styles.bankDetailLabel}>Bank Name</Text>
                <Text style={styles.bankDetailValue} className="font-semibold">Wema Bank Plc</Text>
              </View>

              {/* Timer Notice */}
              <View style={styles.timerNotice} className="text-center">
                <Text style={styles.timerText} className="text-center">
                  You have{" "}
                  <Text style={styles.timerHighlight} className="font-bold">9:59 minutes</Text> to
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
              <View style={styles.securePaymentNote} className="flex-row items-start justify-center">
                <Text style={styles.securePaymentText} className="flex-1 text-center">
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
    header: {paddingVertical: RFValue(16)},
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    headerTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    scrollContent: {paddingBottom: RFValue(160)},
    container: {},
    amountCard: {backgroundColor: colors.slate[150],
borderRadius: RFValue(16),
paddingVertical: RFValue(20),
paddingHorizontal: RFValue(16),
marginTop: RFValue(20),
marginBottom: RFValue(24),
borderColor: colors.slate[300]},
    amountLabel: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      marginBottom: RFValue(8),
    },
    amountRow: {},
    amount: {fontSize: RFValue(24),
color: colors.slate[650]},
    moneyBagIcon: {
      width: RFValue(28),
      height: RFValue(28),
    },
    paymentMethodsSection: {marginBottom: RFValue(24),
marginTop: RFValue(8),
paddingTop: RFValue(16),
borderTopColor: colors.slate[300]},
    sectionTitle: {fontSize: RFValue(16),
color: colors.slate[650],
marginBottom: RFValue(16)},
    paymentMethodCard: {backgroundColor: colors.background,
borderRadius: RFValue(12),
paddingVertical: RFValue(16),
paddingHorizontal: RFValue(8),
marginBottom: RFValue(12)},
    paymentMethodCardSelected: {
      borderColor: colors.slate[500],
    },
    paymentMethodLeft: {gap: RFValue(12)},
    paymentMethodIcon: {
      width: RFValue(24),
      height: RFValue(24),
    },
    paymentMethodText: {fontSize: RFValue(15),
color: colors.slate[650]},
    radioButton: {width: RFValue(20),
height: RFValue(20),
borderRadius: RFValue(10),
borderColor: colors.slate[400]},
    radioButtonSelected: {
      borderColor: colors.slate[650],
    },
    radioButtonInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    footer: {paddingHorizontal: RFValue(20),
paddingTop: RFValue(16),
paddingBottom: RFValue(24),
backgroundColor: colors.background},
    securePaymentNote: {gap: RFValue(8),
marginTop: RFValue(12)},
    shieldIcon: {
      width: RFValue(16),
      height: RFValue(16),
      marginTop: RFValue(2),
    },
    securePaymentText: {fontSize: RFValue(12),
color: colors.slate[500],
lineHeight: RFValue(16)},
    // Modal Styles
    modalOverlay: {},
    modalBottomSheet: {backgroundColor: colors.background,
borderTopLeftRadius: RFValue(24),
borderTopRightRadius: RFValue(24),
paddingHorizontal: RFValue(20),
paddingTop: RFValue(12),
paddingBottom: RFValue(32)},
    modalHandle: {width: RFValue(40),
height: RFValue(4),
backgroundColor: colors.slate[300],
borderRadius: RFValue(2),
marginBottom: RFValue(20)},
    modalHeaderTitle: {fontSize: RFValue(18),
color: colors.slate[650],
marginBottom: RFValue(4)},
    modalHeaderSubtitle: {fontSize: RFValue(13),
color: colors.slate[500],
marginBottom: RFValue(24)},
    modalBody: {
      gap: RFValue(16),
    },
    inputContainer: {
      gap: RFValue(8),
    },
    inputLabel: {fontSize: RFValue(14),
color: colors.slate[650]},
    inputWrapper: {backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
paddingHorizontal: RFValue(16),
paddingVertical: RFValue(14),
borderColor: colors.slate[300]},
    inputPlaceholder: {
      fontSize: RFValue(14),
      color: colors.slate[500],
    },
    inputIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[500],
    },
    inputRow: {gap: RFValue(12)},
    saveCardContainer: {},
    saveCardText: {fontSize: RFValue(14),
color: colors.slate[650]},
    toggle: {width: RFValue(44),
height: RFValue(24),
borderRadius: RFValue(12),
backgroundColor: colors.success[200],
padding: RFValue(2)},
    bankDetailItem: {
      gap: RFValue(8),
    },
    bankDetailLabel: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    bankDetailValue: {fontSize: RFValue(15),
color: colors.slate[650]},
    bankDetailValueRow: {gap: RFValue(2)},
    copyButton: {gap: RFValue(4),
paddingHorizontal: RFValue(8),
paddingVertical: RFValue(4)},
    copyIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[550],
    },
    copyText: {fontSize: RFValue(13),
color: colors.slate[550]},
    timerNotice: {borderRadius: RFValue(12),
paddingVertical: RFValue(12)},
    timerText: {fontSize: RFValue(13),
color: colors.slate[650],
lineHeight: RFValue(18)},
    timerHighlight: {color: colors.error[200]},
  });
