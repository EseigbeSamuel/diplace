import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";

interface PaymentReceiptProps {
  receiptData?: {
    referenceNumber: string;
    dateTime: string;
    description: string;
    property: string;
    propertyAddress: string;
    paidTo: string;
    accountNumber: string;
    totalAmount: string;
  };
  onClose?: () => void;
}

const PaymentReceipt = ({ receiptData, onClose }: PaymentReceiptProps) => {
  const { colors } = useTheme();
  const receiptStyles = styles(colors);

  // Default receipt data
  const receipt = receiptData || {
    referenceNumber: "02470013417146",
    dateTime: "05 Aug 2025, 10:34 AM",
    description: "Payment for Inspection",
    property: "2 Bedroom in-suite apartment",
    propertyAddress: "Rumuakwera, Port Harcourt",
    paidTo: "Ibe Alex | 8102934980",
    accountNumber: "First Bank Plc",
    totalAmount: "₦1,000.00",
  };

  const handleDownload = () => {
    // Handle download receipt as PDF or image
    console.log("Downloading receipt...");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Payment Receipt\n\nReference: ${receipt.referenceNumber}\nAmount: ${receipt.totalAmount}\nDate: ${receipt.dateTime}`,
        title: "Payment Receipt",
      });
    } catch (error) {
      console.error("Error sharing receipt:", error);
    }
  };

  return (
    <SafeAreaViewContainer>
      {/* Custom Header */}
      <View style={receiptStyles.header}>
        <View style={receiptStyles.headerContent}>
          <Text style={receiptStyles.headerTitle}>Payment receipt</Text>
          <Pressable onPress={onClose} style={receiptStyles.closeButton}>
            <Image
              source={require("@/assets/icons/X-close.png")}
              style={receiptStyles.closeIcon}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={receiptStyles.container}>
          {/* Receipt Card with Notches */}
          <View style={receiptStyles.receiptCard}>
            {/* Left Notches */}
            <View style={receiptStyles.notchLeft} />

            {/* Right Notches */}
            <View style={receiptStyles.notchRight} />

            {/* Card Content */}
            <View style={receiptStyles.cardContent}>
              {/* Success Icon */}
              <View style={receiptStyles.successSection}>
                <View style={receiptStyles.successIconContainer}>
                  <Image
                    source={require("@/assets/icons/tick-circle.png")}
                    style={receiptStyles.successIcon}
                  />
                </View>
                <Text style={receiptStyles.successTitle}>
                  Payment Received 🎉
                </Text>
                <Text style={receiptStyles.successSubtitle}>
                  You have successfully received a payment
                </Text>
              </View>

              {/* Receipt Details */}
              <View style={receiptStyles.detailsSection}>
                {/* Reference Number */}
                <View style={receiptStyles.detailRow}>
                  <Text style={receiptStyles.detailLabel}>
                    Reference number
                  </Text>
                  <Text style={receiptStyles.detailValue}>
                    {receipt.referenceNumber}
                  </Text>
                </View>

                {/* Date & Time */}
                <View style={receiptStyles.detailRow}>
                  <Text style={receiptStyles.detailLabel}>Date & time</Text>
                  <Text style={receiptStyles.detailValue}>
                    {receipt.dateTime}
                  </Text>
                </View>

                {/* Description */}
                <View style={receiptStyles.detailRow}>
                  <Text style={receiptStyles.detailLabel}>Description</Text>
                  <Text style={receiptStyles.detailValue}>
                    {receipt.description}
                  </Text>
                </View>

                {/* Divider */}
                <View style={receiptStyles.divider} />

                {/* Property */}
                <View style={receiptStyles.propertySection}>
                  <Text style={receiptStyles.detailLabel}>Property</Text>
                  <View style={receiptStyles.propertyContent}>
                    <Text style={receiptStyles.propertyName}>
                      {receipt.property}
                    </Text>
                    <Text style={receiptStyles.propertyAddress}>
                      {receipt.propertyAddress}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={receiptStyles.divider} />

                {/* Paid to */}
                <View style={receiptStyles.paidToSection}>
                  <Text style={receiptStyles.detailLabel}>Paid to</Text>
                  <View style={receiptStyles.paidToContent}>
                    <Text style={receiptStyles.paidToName}>
                      {receipt.paidTo}
                    </Text>
                    <Text style={receiptStyles.bankName}>
                      {receipt.accountNumber}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={receiptStyles.divider} />

                {/* Total Amount */}
                <View style={receiptStyles.totalRow}>
                  <Text style={receiptStyles.totalLabel}>Total Amount</Text>
                  <Text style={receiptStyles.totalAmount}>
                    {receipt.totalAmount}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={receiptStyles.actionButtons}>
                <Pressable
                  style={receiptStyles.actionButton}
                  onPress={handleDownload}
                >
                  <Image
                    source={require("@/assets/icons/Download - Iconly Pro-1.png")}
                    style={receiptStyles.actionIcon}
                  />
                  <Text style={receiptStyles.actionText}>Download</Text>
                </Pressable>

                <Pressable
                  style={receiptStyles.actionButton}
                  onPress={handleShare}
                >
                  <Image
                    source={require("@/assets/icons/share-solid.png")}
                    style={receiptStyles.actionIcon}
                  />
                  <Text style={receiptStyles.actionText}>Share</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default PaymentReceipt;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    header: {
      backgroundColor: colors.background,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: RFValue(16),
      position: "relative",
    },
    headerTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    closeButton: {
      position: "absolute",
      right: RFValue(8),
      padding: RFValue(4),
    },
    closeIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    container: {
      flex: 1,
      paddingTop: RFValue(24),
      paddingHorizontal: RFValue(3),
      paddingBottom: RFValue(40),
    },
    receiptCard: {
      backgroundColor: colors.background,
      borderRadius: RFValue(16),
      position: "relative",
      overflow: "visible",
      // Shadow for card
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    notchLeft: {
      position: "absolute",
      left: -RFValue(10),
      top: "50%",
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(30),
      backgroundColor: colors.slate[150],
      marginTop: -RFValue(10),
      borderWidth: 1,
      borderColor: colors.slate[300],
      zIndex: 1,
    },
    notchRight: {
      position: "absolute",
      right: -RFValue(10),
      top: "50%",
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      backgroundColor: colors.slate[150],

      borderWidth: 1,
      borderColor: colors.slate[300],
      marginTop: -RFValue(10),
      zIndex: 1,
    },
    cardContent: {
      paddingVertical: RFValue(24),
      paddingHorizontal: RFValue(16),
    },
    successSection: {
      alignItems: "center",
      marginBottom: RFValue(32),
    },
    successIconContainer: {
      width: RFValue(60),
      height: RFValue(60),
      borderRadius: RFValue(30),
      backgroundColor: colors.success[100],
      alignItems: "center",
      justifyContent: "center",
      marginBottom: RFValue(16),

      borderWidth: 1,
      borderColor: colors.success[200],
    },
    successIcon: {
      width: RFValue(32),
      height: RFValue(32),
      tintColor: colors.success[300],
    },
    successTitle: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    successSubtitle: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      textAlign: "center",
    },
    detailsSection: {
      gap: RFValue(16),
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    detailLabel: {
      fontSize: RFValue(14),
      color: colors.slate[500],
    },
    detailValue: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
      textAlign: "right",
    },
    propertySection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    propertyContent: {
      alignItems: "flex-end",
    },
    propertyName: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
      textAlign: "right",
    },
    propertyAddress: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      textAlign: "right",
      marginTop: RFValue(2),
    },
    paidToSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    paidToContent: {
      flex: 1,
      alignItems: "flex-end",
    },
    paidToName: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
      textAlign: "right",
    },
    bankName: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      textAlign: "right",
      marginTop: RFValue(2),
    },
    divider: {
      height: 1,
      backgroundColor: colors.slate[300],
      marginVertical: RFValue(8),
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: RFValue(8),
    },
    totalLabel: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    totalAmount: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[650],
    },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "center",
      gap: RFValue(16),
      marginTop: RFValue(32),
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: RFValue(8),
      paddingHorizontal: RFValue(24),
      paddingVertical: RFValue(12),
      borderRadius: RFValue(8),
      backgroundColor: colors.slate[150],
      flex: 1,
    },
    actionIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    actionText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
  });
