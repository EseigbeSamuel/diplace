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

  // Mock receipt data
  const receiptData = {
    referenceNumber: "024700124746",
    dateTime: "05 Aug 2025, 09:34 AM",
    paymentMethod: "Credit card",
    totalAmount: "₦1,256,000.00",
  };

  const handleContactManager = () => {
    // Navigate to chat or contact screen
    router.push("/views/");
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment receipt</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Success Card */}
          <View style={styles.successCard}>
            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <Image
                source={require("@/assets/icons/checkbox-checked.png")}
                style={styles.successIcon}
              />
            </View>

            {/* Success Message */}
            <Text style={styles.successTitle}>Payment Success 🎉</Text>
            <Text style={styles.successMessage}>
              Your payment has been successfully processed!
            </Text>

            {/* Receipt Details */}
            <View style={styles.receiptDetails}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Reference number</Text>
                <Text style={styles.receiptValue}>
                  {receiptData.referenceNumber}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Date & time</Text>
                <Text style={styles.receiptValue}>{receiptData.dateTime}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Payment method</Text>
                <Text style={styles.receiptValue}>
                  {receiptData.paymentMethod}
                </Text>
              </View>

              <View style={styles.receiptDivider} />

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Total Amount</Text>
                <Text style={styles.receiptTotalValue}>
                  {receiptData.totalAmount}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Pressable style={styles.actionButton} onPress={handleDownload}>
                <Image
                  source={require("@/assets/icons/Download - Iconly Pro.png")}
                  style={styles.actionIcon}
                />
                <Text style={styles.actionText}>Download</Text>
              </Pressable>

              <View style={styles.actionDivider} />

              <Pressable style={styles.actionButton} onPress={handleShare}>
                <Image
                  source={require("@/assets/icons/share.png")}
                  style={styles.actionIcon}
                />
                <Text style={styles.actionText}>Share</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(24),
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
      paddingBottom: RFValue(80),
    },
    container: {
      flex: 1,
    },
    successCard: {
      backgroundColor: colors.background,
      borderRadius: RFValue(20),
      paddingVertical: RFValue(24),
      paddingHorizontal: RFValue(16),
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    successIconContainer: {
      width: RFValue(80),
      height: RFValue(80),
      borderRadius: RFValue(40),
      backgroundColor: colors.success[100],
      alignItems: "center",
      justifyContent: "center",
      marginBottom: RFValue(20),
    },
    successIcon: {
      width: RFValue(48),
      height: RFValue(48),
      tintColor: colors.success[200],
    },
    successTitle: {
      fontSize: RFValue(22),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    successMessage: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      textAlign: "center",
      marginBottom: RFValue(32),
    },
    receiptDetails: {
      width: "100%",
      gap: RFValue(16),
      marginBottom: RFValue(24),
    },
    receiptRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    receiptLabel: {
      fontSize: RFValue(14),
      color: colors.slate[500],
    },
    receiptValue: {
      fontSize: RFValue(14),
      fontWeight: "600",
      color: colors.slate[650],
    },
    receiptTotalValue: {
      fontSize: RFValue(16),
      fontWeight: "700",
      color: colors.slate[650],
    },
    receiptDivider: {
      height: 1,
      backgroundColor: colors.slate[300],
    },
    actionButtons: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: RFValue(8),
      paddingVertical: RFValue(12),
    },
    actionDivider: {
      width: 1,
      height: RFValue(24),
      backgroundColor: colors.slate[300],
    },
    actionIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[600],
    },
    actionText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
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

      gap: RFValue(8),
    },
  });
