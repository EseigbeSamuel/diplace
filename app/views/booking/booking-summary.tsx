import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useCreateBooking } from "@/hooks";
import { BookingPropertyType } from "@/types";
import { ColorScheme } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const BookingSummary = () => {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string>>();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { createBookingMutation, isCreateBookingPending } = useCreateBooking();

  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showFullPaymentModal, setShowFullPaymentModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const formatMoney = (value: number) =>
    `₦${new Intl.NumberFormat("en-NG").format(value)}`;

  const amountValue = Number(params.amountValue) || 0;
  const reservationAmount = Math.round(amountValue * 0.2);

  const bookingData = {
    totalAmount: params.totalAmount || formatMoney(amountValue),
    propertyName: params.propertyName || "Property",
    propertyLocation: params.propertyLocation || "",
    propertyPrice: params.propertyPrice || params.rentAmount || formatMoney(0),
    propertyImage: params.propertyImage
      ? { uri: params.propertyImage }
      : require("@/assets/images/featuredSpaceImage1.png"),
    rentDays: Number(params.numberOfDays || params.rentDays) || 1,
    rentAmount: params.rentAmount || params.propertyPrice || formatMoney(0),
    cautionFee: params.cautionFee || formatMoney(0),
    platformFee: params.platformFee || formatMoney(0),
    renterName: params.fullName || "",
    renterOccupation: params.occupation || "",
    renterEmail: params.email || "",
    renterPhone: params.phoneNumber || "",
    eventType: params.eventType || "Booking",
    eventDates:
      params.startDate && params.endDate
        ? `${params.startDate} - ${params.endDate}`
        : params.startDate || "",
    eventDuration: params.duration ? `${params.duration} hours` : "",
    reservationFee: formatMoney(reservationAmount),
    reservationAmount,
  };

  const handleConfirmPayment = () => {
    setShowFullPaymentModal(true);
  };

  const handleReserveNow = () => {
    setShowReserveModal(true);
  };

  const handlePaymentRoute = async (type: string) => {
    const booking = await createBookingMutation({
      property_id: params.propertyId || "",
      agreed_to_terms: true,
      details: {
        type: (params.propertyType || "apartment") as BookingPropertyType,
        full_name: bookingData.renterName,
        occupation: bookingData.renterOccupation,
        email: bookingData.renterEmail,
        phone: bookingData.renterPhone,
        rent_duration: bookingData.rentDays,
        move_in_date: params.startDate || new Date().toISOString().slice(0, 10),
        adults: Number(params.adults) || 1,
        children: Number(params.children) || 0,
        other_details: params.notes || "",
      },
    });

    const paymentAmount =
      type === "reserve" ? bookingData.reservationAmount : amountValue;

    router.push({
      pathname: "/views/booking/payment",
      params: {
        type,
        amount:
          type === "reserve"
            ? bookingData.reservationFee
            : bookingData.totalAmount,
        amountValue: String(paymentAmount),
        relatedId: booking.public_id,
        purpose: type === "reserve" ? "booking_deposit" : "booking_rent",
      },
    });
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
        <Text style={styles.headerTitle} className="font-semibold flex-1 text-center">Booking summary</Text>
        <Text style={styles.stepIndicator} className="font-medium">4/4</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View  className="flex-1">
          {/* Total Amount Card */}
          <View style={styles.totalAmountCard}>
            <Text style={styles.totalAmountLabel}>Total Amount Payable</Text>
            <View  className="flex-row items-center justify-between">
              <Text style={styles.totalAmount} className="font-bold">{bookingData.totalAmount}</Text>
              <Image
                source={require("@/assets/icons/money-bag.png")}
                style={styles.moneyBagIcon}
              />
            </View>
          </View>

          {/* Property Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle} className="font-semibold">Property Info</Text>
            <View style={styles.propertyCard} className="flex-row border-[1px]">
              <Image
                source={
                  bookingData.propertyImage.uri.length > 8
                    ? bookingData.propertyImage
                    : {
                        uri: require("@/assets/images/diplace.jpg"),
                      }
                }
                style={styles.propertyImage}
              />
              <View  className="flex-1 justify-center">
                <Text style={styles.propertyName} className="font-semibold">
                  {bookingData.propertyName}
                </Text>
                <Text style={styles.propertyLocation}>
                  {bookingData.propertyLocation}
                </Text>
                <Text style={styles.propertyPrice} className="font-semibold">
                  {bookingData.propertyPrice}
                </Text>
              </View>
            </View>
          </View>

          {/* Cost Breakdown Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle} className="font-semibold">Cost Breakdown</Text>
            <View style={styles.breakdownCard}>
              <View style={styles.breakdownRow} className="flex-row justify-between items-center">
                <Text style={styles.breakdownLabel}>
                  Rent ({bookingData.rentDays} days)
                </Text>
                <Text style={styles.breakdownValue} className="font-semibold">
                  {bookingData.rentAmount}
                </Text>
              </View>
              <View style={styles.breakdownRow} className="flex-row justify-between items-center">
                <Text style={styles.breakdownLabel}>
                  Caution fee (refundable)
                </Text>
                <Text style={styles.breakdownValue} className="font-semibold">
                  {bookingData.cautionFee}
                </Text>
              </View>
              <View style={styles.breakdownRow} className="flex-row justify-between items-center">
                <Text style={styles.breakdownLabel}>
                  DiPlace Platform fee (0.5%)
                </Text>
                <Text style={styles.breakdownValue} className="font-semibold">
                  {bookingData.platformFee}
                </Text>
              </View>
              <View style={styles.breakdownDivider}  className="h-[1px]"/>
              <View style={styles.breakdownRow} className="flex-row justify-between items-center">
                <Text style={styles.breakdownTotalLabel} className="font-semibold">Total Amount</Text>
                <Text style={styles.breakdownTotalValue} className="font-bold">
                  {bookingData.totalAmount}
                </Text>
              </View>
            </View>
          </View>

          {/* Renter's Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader} className="flex-row items-center justify-between">
              <Text style={styles.sectionTitle} className="font-semibold">Renter's Information</Text>
              <Pressable
                onPress={() => router.push("/views/booking/renters-info")}
              >
                <Image
                  source={require("@/assets/icons/edit-pencil.png")}
                  style={styles.editIcon}
                />
              </Pressable>
            </View>
            <View style={styles.infoCard} className="border-[1px]">
              <Text style={styles.infoName} className="font-semibold">{bookingData.renterName}</Text>
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
            <View style={styles.sectionHeader} className="flex-row items-center justify-between">
              <Text style={styles.sectionTitle} className="font-semibold">Event Details</Text>
              <Pressable
                onPress={() => router.push("/views/booking/event-details")}
              >
                <Image
                  source={require("@/assets/icons/edit-pencil.png")}
                  style={styles.editIcon}
                />
              </Pressable>
            </View>
            <View style={styles.infoCard} className="border-[1px]">
              <Text style={styles.eventType} className="font-semibold">{bookingData.eventType}</Text>
              <View style={styles.eventDetailRow} className="flex-row items-center">
                <Image
                  source={require("@/assets/icons/calendar.png")}
                  style={styles.eventIcon}
                />
                <Text style={styles.eventDetail}>
                  Event Date: {bookingData.eventDates}
                </Text>
              </View>
              <View style={styles.eventDetailRow} className="flex-row items-center">
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
      <View style={styles.footer} className="absolute bottom-[0px] left-[0px] right-[0px] flex flex-col">
        <AppButton
          onPress={handleConfirmPayment}
          title={
            isCreateBookingPending
              ? "Creating Booking..."
              : "Confirm & Pay in Full"
          }
          disabled={isCreateBookingPending}
        />
        <AppButton
          onPress={handleReserveNow}
          title={
            isCreateBookingPending
              ? "Creating Booking..."
              : "Reserve with Partial Payment"
          }
          variant="secondary"
          disabled={isCreateBookingPending}
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

          onPress={() => setShowReserveModal(false)}
         className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-end">
          <Pressable
            style={styles.modalBottomSheet}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <View style={styles.modalHandle}  className="self-center"/>

            {/* Header */}
            <Text style={styles.modalHeaderTitle} className="font-semibold text-center">Reserve space</Text>
            <Text style={styles.modalHeaderSubtitle} className="text-center">
              Make partial payment to reserve this space
            </Text>

            {/* Content */}
            <View style={styles.modalBody}>
              <Text style={styles.modalBodyTitle} className="font-semibold">Secure this space</Text>
              <Text style={styles.modalBodyText}>
                Secure your event space with just{" "}
                <Text style={styles.modalBodyBold} className="font-semibold">20% reservation fee.</Text>{" "}
                Pay the balance at least 7 days before your event.{" "}
                <Text style={styles.modalLink} className="underline">Cancellation policy</Text> still
                applies.
              </Text>

              {/* Reservation Fee */}
              <View style={styles.reservationFeeContainer} className="border-[1px] flex-row justify-between items-center">
                <Text style={styles.reservationFeeLabel}>Reservation fee:</Text>
                <Text style={styles.reservationFeeAmount} className="font-bold">
                  {bookingData.reservationFee}
                </Text>
              </View>

              {/* Terms Checkbox */}
              <Pressable
                style={styles.termsContainer}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
               className="flex-row items-start">
                <View style={styles.checkbox} className="border-[1.5px] items-center justify-center">
                  {agreedToTerms && <View style={styles.checkboxChecked} />}
                </View>
                <Text style={styles.termsText} className="flex-1">
                  I have read and agree to the{" "}
                  <Text style={styles.modalLink} className="underline">
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
                title={
                  isCreateBookingPending
                    ? "Creating Booking..."
                    : "Make Payment"
                }
                disabled={!agreedToTerms || isCreateBookingPending}
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
        <View style={styles.centerModalOverlay} className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-center items-center">
          <View style={styles.centerModalContent} className="w-[100%px]">
            <Text style={styles.centerModalTitle} className="font-bold text-center">
              Can't pay full now? Reserve instead!
            </Text>
            <Text style={styles.centerModalMessage} className="text-center">
              You can secure this space by paying a small 20% reservation fee
              and pay the rest later; at least 7 days before your event.
              Cancellation policy still applies.
            </Text>

            <View style={styles.centerModalFooter} className="flex flex-col">
              <AppButton
                onPress={() => {
                  setShowFullPaymentModal(false);
                  handlePaymentRoute("full");
                }}
                title={
                  isCreateBookingPending
                    ? "Creating Booking..."
                    : "Confirm with Full Payment"
                }
                disabled={isCreateBookingPending}
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
    header: {paddingVertical: RFValue(16)},
    stepIndicator: {fontSize: RFValue(14),
color: colors.slate[500]},
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    headerTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    moreIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    scrollContent: {paddingBottom: RFValue(120)},
    container: {},
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
    totalAmountRow: {},
    totalAmount: {fontSize: RFValue(28),
color: colors.slate[200]},
    moneyBagIcon: {
      width: RFValue(32),
      height: RFValue(32),
    },
    section: {
      marginBottom: RFValue(24),
    },
    sectionHeader: {marginBottom: RFValue(12)},
    sectionTitle: {fontSize: RFValue(16),
color: colors.slate[650],
marginBottom: RFValue(12)},
    editIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[500],
    },
    propertyCard: {backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
padding: RFValue(12),
borderColor: colors.slate[300]},
    propertyImage: {
      width: RFValue(80),
      height: RFValue(80),
      borderRadius: RFValue(8),
      marginRight: RFValue(12),
    },
    propertyInfo: {},
    propertyName: {fontSize: RFValue(15),
color: colors.slate[650],
marginBottom: RFValue(4)},
    propertyLocation: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      marginBottom: RFValue(6),
    },
    propertyPrice: {fontSize: RFValue(14),
color: colors.slate[650]},
    breakdownCard: {
      paddingVertical: RFValue(9),
    },
    breakdownRow: {marginBottom: RFValue(12)},
    breakdownLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    breakdownValue: {fontSize: RFValue(14),
color: colors.slate[650]},
    breakdownDivider: {backgroundColor: colors.slate[300],
marginVertical: RFValue(8)},
    breakdownTotalLabel: {fontSize: RFValue(15),
color: colors.slate[650]},
    breakdownTotalValue: {fontSize: RFValue(16),
color: colors.slate[650]},
    infoCard: {backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
padding: RFValue(16),
borderColor: colors.slate[300]},
    infoName: {fontSize: RFValue(15),
color: colors.slate[650],
marginBottom: RFValue(4)},
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
    eventType: {fontSize: RFValue(15),
color: colors.slate[650],
marginBottom: RFValue(12)},
    eventDetailRow: {marginBottom: RFValue(8)},
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
    footer: {paddingHorizontal: RFValue(20),
paddingVertical: RFValue(16),
backgroundColor: colors.background,
gap: RFValue(8)},
    // Modal Styles
    modalOverlay: {},
    modalBottomSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingTop: RFValue(12),
      paddingBottom: RFValue(32),
    },
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
    modalBodyTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    modalBodyText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(20),
    },
    modalBodyBold: {color: colors.slate[650]},
    modalLink: {color: colors.info[200]},
    centerModalOverlay: {paddingHorizontal: RFValue(20)},
    centerModalContent: {backgroundColor: colors.background,
borderRadius: RFValue(20),
padding: RFValue(24),
maxWidth: RFValue(400)},
    centerModalTitle: {fontSize: RFValue(18),
color: colors.slate[650],
marginBottom: RFValue(12)},
    centerModalMessage: {fontSize: RFValue(14),
color: colors.slate[600],
lineHeight: RFValue(20),
marginBottom: RFValue(24)},
    centerModalFooter: {gap: RFValue(8)},
    reservationFeeContainer: {backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
padding: RFValue(16),
borderColor: colors.slate[300]},
    reservationFeeLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    reservationFeeAmount: {fontSize: RFValue(18),
color: colors.slate[650]},
    termsContainer: {gap: RFValue(10)},
    checkbox: {width: RFValue(18),
height: RFValue(18),
borderColor: colors.slate[400],
borderRadius: RFValue(4),
marginTop: RFValue(2)},
    checkboxChecked: {
      width: RFValue(10),
      height: RFValue(10),
      backgroundColor: colors.info[200],
      borderRadius: RFValue(2),
    },
    termsText: {fontSize: RFValue(13),
color: colors.slate[600],
lineHeight: RFValue(18)},
  });
