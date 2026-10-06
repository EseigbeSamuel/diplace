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
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter, useLocalSearchParams } from "expo-router";
import AppButton from "@/components/button";

const PaymentSuccessScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const receiptData = {
    referenceNumber: params.txRef || "Pending confirmation",
    dateTime: new Date().toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    paymentMethod: params.paymentMethod || params.gateway || "Flutterwave",
    totalAmount: params.amount || "₦0",
  };

  const handleContactManager = () => {
    // Navigate to chat or contact screen
    router.push("/");
  };

  const handleBackHome = () => {
    router.push("/");
  };

  const handleDownload = () => {
    // Handle receipt download
    console.log("Download receipt");
  };

  const handleShare = () => {
    // Handle receipt share
    console.log("Share receipt");
  };

  return (
    <SafeAreaViewContainer>
      {/* Header */}
      <View style={styles.header} className="flex-row items-center justify-between">
        <Text style={styles.headerTitle} className="font-semibold flex-1 text-center">Payment receipt</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View  className="flex-1">
          {/* Success Card */}
          <View style={styles.successCard} className="items-center border-[1px]">
            {/* Success Icon */}
            <View style={styles.successIconContainer} className="items-center justify-center">
              <Image
                source={require("@/assets/icons/checkbox-checked.png")}
                style={styles.successIcon}
              />
            </View>

            {/* Success Message */}
            <Text style={styles.successTitle} className="font-bold">Payment Success 🎉</Text>
            <Text style={styles.successMessage} className="text-center">
              Your payment has been successfully processed!
            </Text>

            {/* Receipt Details */}
            <View style={styles.receiptDetails} className="w-[100%px]">
              <View  className="flex-row justify-between items-center">
                <Text style={styles.receiptLabel}>Reference number</Text>
                <Text style={styles.receiptValue} className="font-semibold">
                  {receiptData.referenceNumber}
                </Text>
              </View>

              <View  className="flex-row justify-between items-center">
                <Text style={styles.receiptLabel}>Date & time</Text>
                <Text style={styles.receiptValue} className="font-semibold">{receiptData.dateTime}</Text>
              </View>

              <View  className="flex-row justify-between items-center">
                <Text style={styles.receiptLabel}>Payment method</Text>
                <Text style={styles.receiptValue} className="font-semibold">
                  {receiptData.paymentMethod}
                </Text>
              </View>

              <View style={styles.receiptDivider}  className="h-[1px]"/>

              <View  className="flex-row justify-between items-center">
                <Text style={styles.receiptLabel}>Total Amount</Text>
                <Text style={styles.receiptTotalValue} className="font-bold">
                  {receiptData.totalAmount}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View  className="flex-row items-center w-[100%px]">
              <Pressable style={styles.actionButton} onPress={handleDownload} className="flex-1 flex-row items-center justify-center">
                <Image
                  source={require("@/assets/icons/Download - Iconly Pro.png")}
                  style={styles.actionIcon}
                />
                <Text style={styles.actionText} className="font-medium">Download</Text>
              </Pressable>

              <View style={styles.actionDivider}  className="w-[1px]"/>

              <Pressable style={styles.actionButton} onPress={handleShare} className="flex-1 flex-row items-center justify-center">
                <Image
                  source={require("@/assets/icons/share.png")}
                  style={styles.actionIcon}
                />
                <Text style={styles.actionText} className="font-medium">Share</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer} className="absolute bottom-[0px] left-[0px] right-[0px]">
        <AppButton
          onPress={handleContactManager}
          title="Contact Space Manager"
        />
        <AppButton
          onPress={handleBackHome}
          title="Back Home"
          variant="secondary"
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default PaymentSuccessScreen;

const getStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    header: {paddingVertical: RFValue(24)},
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    headerTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    scrollContent: {paddingBottom: RFValue(80)},
    container: {},
    successCard: {backgroundColor: colors.background,
borderRadius: RFValue(20),
paddingVertical: RFValue(24),
paddingHorizontal: RFValue(16),
borderColor: colors.slate[300]},
    successIconContainer: {width: RFValue(80),
height: RFValue(80),
borderRadius: RFValue(40),
backgroundColor: colors.success[100],
marginBottom: RFValue(20)},
    successIcon: {
      width: RFValue(48),
      height: RFValue(48),
      tintColor: colors.success[200],
    },
    successTitle: {fontSize: RFValue(22),
color: colors.slate[650],
marginBottom: RFValue(8)},
    successMessage: {fontSize: RFValue(14),
color: colors.slate[500],
marginBottom: RFValue(32)},
    receiptDetails: {gap: RFValue(16),
marginBottom: RFValue(24)},
    receiptRow: {},
    receiptLabel: {
      fontSize: RFValue(14),
      color: colors.slate[500],
    },
    receiptValue: {fontSize: RFValue(14),
color: colors.slate[650]},
    receiptTotalValue: {fontSize: RFValue(16),
color: colors.slate[650]},
    receiptDivider: {backgroundColor: colors.slate[300]},
    actionButtons: {},
    actionButton: {gap: RFValue(8),
paddingVertical: RFValue(12)},
    actionDivider: {height: RFValue(24),
backgroundColor: colors.slate[300]},
    actionIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[600],
    },
    actionText: {fontSize: RFValue(14),
color: colors.slate[650]},
    footer: {paddingHorizontal: RFValue(20),
paddingTop: RFValue(16),
paddingBottom: RFValue(24),
backgroundColor: colors.background,
gap: RFValue(8)},
  });
