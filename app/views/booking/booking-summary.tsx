import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter, useLocalSearchParams } from "expo-router";
import AppButton from "@/components/button";

const BookingSummary = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showFullPaymentModal, setShowFullPaymentModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Mock data - would come from params in production
  const bookingData = {
    totalAmount: "₦1,256,000.00",
    propertyName: "Atraz Palace Event Hall",
    propertyLocation: "GRA Phase II, Port Harcourt",
    propertyPrice: "₦400,000/day",
    propertyImage: require("@/assets/images/featuredSpaceImage1.png"),
    rentDays: 3,
    rentAmount: "₦1,200,000.00",
    cautionFee: "₦50,000.00",
    platformFee: "₦6,000.00",
    renterName: params.fullName || "Rhema Generation Inc.",
    renterOccupation: params.occupation || "Event Planner",
    renterEmail: params.email || "info@rgworld.com",
    renterPhone: params.phoneNumber || "+234-810-293-4980",
    eventType: params.eventType || "Wedding & Engagement",
    eventDates: "Thu. 17 Aug. - Sat. 19 Aug. 2025",
    eventDuration: "Full work day (8 hours)",
    reservationFee: "₦251,200.00", // 20% of total
  };

  const handleConfirmPayment = () => {
    setShowFullPaymentModal(true);
  };

  const handleReserveNow = () => {
    setShowReserveModal(true);
  };

  const handlePaymentRoute = (type: string) => {
    router.push({
      pathname: "/views/booking/payment",
      params: {
        type,
        amount:
          type === "reserve"
            ? bookingData.reservationFee
            : bookingData.totalAmount,
      },
    });
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
        <Text style={styles.headerTitle}>Booking summary</Text>
        <Text style={styles.stepIndicator}>4/4</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Total Amount Card */}
          <View style={styles.totalAmountCard}>
            <Text style={styles.totalAmountLabel}>Total Amount Payable</Text>
            <View style={styles.totalAmountRow}>
              <Text style={styles.totalAmount}>{bookingData.totalAmount}</Text>
              <Image
                source={require("@/assets/icons/money-bag.png")}
                style={styles.moneyBagIcon}
              />
            </View>
          </View>

          {/* Property Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Info</Text>
            <View style={styles.propertyCard}>
              <Image
                source={bookingData.propertyImage}
                style={styles.propertyImage}
              />
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyName}>
                  {bookingData.propertyName}
                </Text>
                <Text style={styles.propertyLocation}>
                  {bookingData.propertyLocation}
                </Text>
                <Text style={styles.propertyPrice}>
                  {bookingData.propertyPrice}
                </Text>
              </View>
            </View>
          </View>

          {/* Cost Breakdown Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cost Breakdown</Text>
            <View style={styles.breakdownCard}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  Rent ({bookingData.rentDays} days)
                </Text>
                <Text style={styles.breakdownValue}>
                  {bookingData.rentAmount}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  Caution fee (refundable)
                </Text>
                <Text style={styles.breakdownValue}>
                  {bookingData.cautionFee}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  DiPlace Platform fee (0.5%)
                </Text>
                <Text style={styles.breakdownValue}>
                  {bookingData.platformFee}
                </Text>
              </View>
              <View style={styles.breakdownDivider} />
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownTotalLabel}>Total Amount</Text>
                <Text style={styles.breakdownTotalValue}>
                  {bookingData.totalAmount}
                </Text>
              </View>
            </View>
          </View>

          {/* Renter's Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Renter's Information</Text>
              <Pressable
                onPress={() => router.push("/views/booking/renters-info")}
              >
                <Image
                  source={require("@/assets/icons/edit-pencil.png")}
                  style={styles.editIcon}
                />
              </Pressable>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoName}>{bookingData.renterName}</Text>
              <Text style={styles.infoOccupation}>
                {bookingData.renterOccupation}
              </Text>
              <Text style={styles.infoContact}>
                {bookingData.renterEmail} | {bookingData.renterPhone}
              </Text>
            </View>
          </View>

          {/* Event Details Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Event Details</Text>
              <Pressable
                onPress={() => router.push("/views/booking/event-details")}
              >
                <Image
                  source={require("@/assets/icons/edit-pencil.png")}
                  style={styles.editIcon}
                />
              </Pressable>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.eventType}>{bookingData.eventType}</Text>
              <View style={styles.eventDetailRow}>
                <Image
                  source={require("@/assets/icons/calendar.png")}
                  style={styles.eventIcon}
                />
                <Text style={styles.eventDetail}>
                  Event Date: {bookingData.eventDates}
                </Text>
              </View>
              <View style={styles.eventDetailRow}>
                <Image
                  source={require("@/assets/icons/clock.png")}
                  style={styles.eventIcon}
                />
                <Text style={styles.eventDetail}>
                  Duration: {bookingData.eventDuration}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <AppButton
          onPress={handleConfirmPayment}
          title="Confirm & Pay in Full"
        />
        <AppButton
          onPress={handleReserveNow}
          title="Reserve with Partial Payment"
          variant="secondary"
        />
      </View>

      {/* Reserve Modal - Bottom Sheet */}
      <Modal
        visible={showReserveModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReserveModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowReserveModal(false)}
        >
          <Pressable
            style={styles.modalBottomSheet}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <View style={styles.modalHandle} />

            {/* Header */}
            <Text style={styles.modalHeaderTitle}>Reserve space</Text>
            <Text style={styles.modalHeaderSubtitle}>
              Make partial payment to reserve this space
            </Text>

            {/* Content */}
            <View style={styles.modalBody}>
              <Text style={styles.modalBodyTitle}>Secure this space</Text>
              <Text style={styles.modalBodyText}>
                Secure your event space with just{" "}
                <Text style={styles.modalBodyBold}>20% reservation fee.</Text>{" "}
                Pay the balance at least 7 days before your event.{" "}
                <Text style={styles.modalLink}>Cancellation policy</Text> still
                applies.
              </Text>

              {/* Reservation Fee */}
              <View style={styles.reservationFeeContainer}>
                <Text style={styles.reservationFeeLabel}>Reservation fee:</Text>
                <Text style={styles.reservationFeeAmount}>
                  {bookingData.reservationFee}
                </Text>
              </View>

              {/* Terms Checkbox */}
              <Pressable
                style={styles.termsContainer}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              >
                <View style={styles.checkbox}>
                  {agreedToTerms && <View style={styles.checkboxChecked} />}
                </View>
                <Text style={styles.termsText}>
                  I have read and agree to the{" "}
                  <Text style={styles.modalLink}>
                    terms of service and cancellation policy
                  </Text>
                  .
                </Text>
              </Pressable>

              {/* Make Payment Button */}
              <AppButton
                onPress={() => {
                  setShowReserveModal(false);
                  handlePaymentRoute("reserve");
                }}
                title="Make Payment"
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showFullPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFullPaymentModal(false)}
      >
        <View style={styles.centerModalOverlay}>
          <View style={styles.centerModalContent}>
            <Text style={styles.centerModalTitle}>
              Can't pay full now? Reserve instead!
            </Text>
            <Text style={styles.centerModalMessage}>
              You can secure this space by paying a small 20% reservation fee
              and pay the rest later; at least 7 days before your event.
              Cancellation policy still applies.
            </Text>

            <View style={styles.centerModalFooter}>
              <AppButton
                onPress={() => {
                  setShowFullPaymentModal(false);
                  handlePaymentRoute("full");
                }}
                title="Confirm with Full Payment"
              />
              <AppButton
                onPress={() => {
                  setShowFullPaymentModal(false);
                  setShowReserveModal(true);
                }}
                title="Reserve Now"
                variant="secondary"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaViewContainer>
  );
};

export default BookingSummary;

const getStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
    },
    stepIndicator: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      fontWeight: "500",
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
    moreIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: RFValue(120),
    },
    container: {
      flex: 1,
    },
    totalAmountCard: {
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(16),
      padding: RFValue(20),
      marginTop: RFValue(20),
      marginBottom: RFValue(24),
    },
    totalAmountLabel: {
      fontSize: RFValue(13),
      color: colors.slate[450],
      marginBottom: RFValue(8),
    },
    totalAmountRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    totalAmount: {
      fontSize: RFValue(28),
      fontWeight: "700",
      color: colors.slate[200],
    },
    moneyBagIcon: {
      width: RFValue(32),
      height: RFValue(32),
    },
    section: {
      marginBottom: RFValue(24),
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: RFValue(12),
    },
    sectionTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(12),
    },
    editIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[500],
    },
    propertyCard: {
      flexDirection: "row",
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      padding: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    propertyImage: {
      width: RFValue(80),
      height: RFValue(80),
      borderRadius: RFValue(8),
      marginRight: RFValue(12),
    },
    propertyInfo: {
      flex: 1,
      justifyContent: "center",
    },
    propertyName: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(4),
    },
    propertyLocation: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      marginBottom: RFValue(6),
    },
    propertyPrice: {
      fontSize: RFValue(14),
      fontWeight: "600",
      color: colors.slate[650],
    },
    breakdownCard: {
      paddingVertical: RFValue(9),
    },
    breakdownRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: RFValue(12),
    },
    breakdownLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    breakdownValue: {
      fontSize: RFValue(14),
      fontWeight: "600",
      color: colors.slate[650],
    },
    breakdownDivider: {
      height: 1,
      backgroundColor: colors.slate[300],
      marginVertical: RFValue(8),
    },
    breakdownTotalLabel: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
    breakdownTotalValue: {
      fontSize: RFValue(16),
      fontWeight: "700",
      color: colors.slate[650],
    },
    infoCard: {
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      padding: RFValue(16),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    infoName: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(4),
    },
    infoOccupation: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      marginBottom: RFValue(4),
    },
    infoContact: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      marginBottom: RFValue(6),
    },
    eventType: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(12),
    },
    eventDetailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: RFValue(8),
    },
    eventIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
      marginRight: RFValue(8),
    },
    eventDetail: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
      display: "flex",
      flexDirection: "column",
      gap: RFValue(8),
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
    modalBodyTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    modalBodyText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(20),
    },
    modalBodyBold: {
      fontWeight: "600",
      color: colors.slate[650],
    },
    modalLink: {
      color: colors.info[200],
      textDecorationLine: "underline",
    },
    centerModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: RFValue(20),
    },
    centerModalContent: {
      backgroundColor: colors.background,
      borderRadius: RFValue(20),
      padding: RFValue(24),
      width: "100%",
      maxWidth: RFValue(400),
    },
    centerModalTitle: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(12),
      textAlign: "center",
    },
    centerModalMessage: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(20),
      textAlign: "center",
      marginBottom: RFValue(24),
    },
    centerModalFooter: {
      display: "flex",
      flexDirection: "column",
      gap: RFValue(8),
    },
    reservationFeeContainer: {
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      padding: RFValue(16),
      borderWidth: 1,
      borderColor: colors.slate[300],
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    reservationFeeLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    reservationFeeAmount: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
    },
    termsContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: RFValue(10),
    },
    checkbox: {
      width: RFValue(18),
      height: RFValue(18),
      borderWidth: 1.5,
      borderColor: colors.slate[400],
      borderRadius: RFValue(4),
      marginTop: RFValue(2),
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: {
      width: RFValue(10),
      height: RFValue(10),
      backgroundColor: colors.info[200],
      borderRadius: RFValue(2),
    },
    termsText: {
      flex: 1,
      fontSize: RFValue(13),
      color: colors.slate[600],
      lineHeight: RFValue(18),
    },
  });
