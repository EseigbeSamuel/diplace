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
        <View style={receiptStyles.headerContent} className="flex-row items-center justify-center relative">
          <Text style={receiptStyles.headerTitle} className="font-semibold">Payment receipt</Text>
          <Pressable onPress={onClose} style={receiptStyles.closeButton} className="absolute">
            <Image
              source={require("@/assets/icons/X-close.png")}
              style={receiptStyles.closeIcon}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={receiptStyles.container} className="flex-1">
          {/* Receipt Card with Notches */}
          <View style={receiptStyles.receiptCard} className="relative overflow-[visible] shadow-color-[#000] shadow-opacity-[0.1px] shadow-radius-[8px] elevation-[5px]">
            {/* Left Notches */}
            <View style={receiptStyles.notchLeft}  className="absolute top-[50%px] border-[1px] z-[1]"/>

            {/* Right Notches */}
            <View style={receiptStyles.notchRight}  className="absolute top-[50%px] border-[1px] z-[1]"/>

            {/* Card Content */}
            <View style={receiptStyles.cardContent}>
              {/* Success Icon */}
              <View style={receiptStyles.successSection} className="items-center">
                <View style={receiptStyles.successIconContainer} className="items-center justify-center border-[1px]">
                  <Image
                    source={require("@/assets/icons/tick-circle.png")}
                    style={receiptStyles.successIcon}
                  />
                </View>
                <Text style={receiptStyles.successTitle} className="font-bold">
                  Payment Received 🎉
                </Text>
                <Text style={receiptStyles.successSubtitle} className="text-center">
                  You have successfully received a payment
                </Text>
              </View>

              {/* Receipt Details */}
              <View style={receiptStyles.detailsSection}>
                {/* Reference Number */}
                <View  className="flex-row justify-between items-start">
                  <Text style={receiptStyles.detailLabel}>
                    Reference number
                  </Text>
                  <Text style={receiptStyles.detailValue} className="font-medium text-right">
                    {receipt.referenceNumber}
                  </Text>
                </View>

                {/* Date & Time */}
                <View  className="flex-row justify-between items-start">
                  <Text style={receiptStyles.detailLabel}>Date & time</Text>
                  <Text style={receiptStyles.detailValue} className="font-medium text-right">
                    {receipt.dateTime}
                  </Text>
                </View>

                {/* Description */}
                <View  className="flex-row justify-between items-start">
                  <Text style={receiptStyles.detailLabel}>Description</Text>
                  <Text style={receiptStyles.detailValue} className="font-medium text-right">
                    {receipt.description}
                  </Text>
                </View>

                {/* Divider */}
                <View style={receiptStyles.divider}  className="h-[1px]"/>

                {/* Property */}
                <View  className="flex-row justify-between items-start">
                  <Text style={receiptStyles.detailLabel}>Property</Text>
                  <View  className="items-end">
                    <Text style={receiptStyles.propertyName} className="font-medium text-right">
                      {receipt.property}
                    </Text>
                    <Text style={receiptStyles.propertyAddress} className="text-right">
                      {receipt.propertyAddress}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={receiptStyles.divider}  className="h-[1px]"/>

                {/* Paid to */}
                <View  className="flex-row justify-between items-start">
                  <Text style={receiptStyles.detailLabel}>Paid to</Text>
                  <View  className="flex-1 items-end">
                    <Text style={receiptStyles.paidToName} className="font-medium text-right">
                      {receipt.paidTo}
                    </Text>
                    <Text style={receiptStyles.bankName} className="text-right">
                      {receipt.accountNumber}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={receiptStyles.divider}  className="h-[1px]"/>

                {/* Total Amount */}
                <View style={receiptStyles.totalRow} className="flex-row justify-between items-center">
                  <Text style={receiptStyles.totalLabel} className="font-semibold">Total Amount</Text>
                  <Text style={receiptStyles.totalAmount} className="font-bold">
                    {receipt.totalAmount}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={receiptStyles.actionButtons} className="flex-row justify-center">
                <Pressable
                  style={receiptStyles.actionButton}
                  onPress={handleDownload}
                 className="flex-row items-center justify-center flex-1">
                  <Image
                    source={require("@/assets/icons/Download - Iconly Pro-1.png")}
                    style={receiptStyles.actionIcon}
                  />
                  <Text style={receiptStyles.actionText} className="font-medium">Download</Text>
                </Pressable>

                <Pressable
                  style={receiptStyles.actionButton}
                  onPress={handleShare}
                 className="flex-row items-center justify-center flex-1">
                  <Image
                    source={require("@/assets/icons/share-solid.png")}
                    style={receiptStyles.actionIcon}
                  />
                  <Text style={receiptStyles.actionText} className="font-medium">Share</Text>
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
    headerContent: {paddingVertical: RFValue(16)},
    headerTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    closeButton: {right: RFValue(8),
padding: RFValue(4)},
    closeIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    container: {paddingTop: RFValue(24),
paddingHorizontal: RFValue(3),
paddingBottom: RFValue(40)},
    receiptCard: {backgroundColor: colors.background,
borderRadius: RFValue(16),
shadowOffset: {
        width: 0,
        height: 2,
      }},
    notchLeft: {left: -RFValue(10),
width: RFValue(20),
height: RFValue(20),
borderRadius: RFValue(30),
backgroundColor: colors.slate[150],
marginTop: -RFValue(10),
borderColor: colors.slate[300]},
    notchRight: {right: -RFValue(10),
width: RFValue(20),
height: RFValue(20),
borderRadius: RFValue(10),
backgroundColor: colors.slate[150],
borderColor: colors.slate[300],
marginTop: -RFValue(10)},
    cardContent: {
      paddingVertical: RFValue(24),
      paddingHorizontal: RFValue(16),
    },
    successSection: {marginBottom: RFValue(32)},
    successIconContainer: {width: RFValue(60),
height: RFValue(60),
borderRadius: RFValue(30),
backgroundColor: colors.success[100],
marginBottom: RFValue(16),
borderColor: colors.success[200]},
    successIcon: {
      width: RFValue(32),
      height: RFValue(32),
      tintColor: colors.success[300],
    },
    successTitle: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(8)},
    successSubtitle: {fontSize: RFValue(14),
color: colors.slate[500]},
    detailsSection: {
      gap: RFValue(16),
    },
    detailRow: {},
    detailLabel: {
      fontSize: RFValue(14),
      color: colors.slate[500],
    },
    detailValue: {fontSize: RFValue(14),
color: colors.slate[650]},
    propertySection: {},
    propertyContent: {},
    propertyName: {fontSize: RFValue(14),
color: colors.slate[650]},
    propertyAddress: {fontSize: RFValue(13),
color: colors.slate[500],
marginTop: RFValue(2)},
    paidToSection: {},
    paidToContent: {},
    paidToName: {fontSize: RFValue(14),
color: colors.slate[650]},
    bankName: {fontSize: RFValue(13),
color: colors.slate[500],
marginTop: RFValue(2)},
    divider: {backgroundColor: colors.slate[300],
marginVertical: RFValue(8)},
    totalRow: {paddingTop: RFValue(8)},
    totalLabel: {fontSize: RFValue(16),
color: colors.slate[650]},
    totalAmount: {fontSize: RFValue(20),
color: colors.slate[650]},
    actionButtons: {gap: RFValue(16),
marginTop: RFValue(32)},
    actionButton: {gap: RFValue(8),
paddingHorizontal: RFValue(24),
paddingVertical: RFValue(12),
borderRadius: RFValue(8),
backgroundColor: colors.slate[150]},
    actionIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    actionText: {fontSize: RFValue(14),
color: colors.slate[650]},
  });
