import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Share,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter, useLocalSearchParams } from "expo-router";
import AppButton from "@/components/button";

const ReviewAgreement = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [isAgreed, setIsAgreed] = useState(false);

  const handleDownload = async () => {
    // Implement download functionality
    console.log("Download agreement");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Tenancy Agreement - DiPlace Platform",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleContinue = () => {
    if (isAgreed) {
      router.push({
        pathname: "/views/booking/booking-summary",
        params: params,
      });
    }
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
        <Text style={styles.headerTitle}>Review agreement</Text>
        <Text style={styles.stepIndicator}>3/4</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Review Agreement</Text>
            <Text style={styles.subtitle}>
              Before completing your booking, kindly take a moment to read
              through the agreement provided below for event space rental.
              Please review it carefully before proceeding with your
              reservation.
            </Text>
          </View>

          {/* Download Button */}
          <Pressable style={styles.downloadButton} onPress={handleDownload}>
            <Image
              source={require("@/assets/icons/Download - Iconly Pro-1.png")}
              style={styles.downloadIcon}
            />
            <Text style={styles.downloadText}>Download copy</Text>
          </Pressable>

          {/* Agreement Document */}
          <View style={styles.agreementContainer}>
            <View style={styles.agreementHeader}>
              <Image
                source={require("@/assets/icons/paper.png")}
                style={styles.documentIcon}
              />
              <View style={styles.agreementHeaderText}>
                <Text style={styles.agreementTitle}>Tenancy Agreement</Text>
                <Text style={styles.agreementSize}>2861 kb</Text>
              </View>
              <Pressable onPress={handleShare}>
                <Image
                  source={require("@/assets/icons/share.png")}
                  style={styles.shareIcon}
                />
              </Pressable>
            </View>

            <View style={styles.agreementContent}>
              <Text style={styles.agreementContentTitle}>
                Tenancy Agreement
              </Text>
              <Text style={styles.agreementText}>
                This Tenancy Agreement is made between:{"\n"}• Landlord/Agent:
                To be filled by Agent{"\n"}• Tenant: Rhee Sammy{"\n"}• Address:
                2-Bedroom Apartment, No. 12 Unity street, Lekki, Lagos{"\n"}•
                Duration: 12 Months, starting from: July 15, 2025 to July 15,
                2026{"\n"}• Rent Amount: ₦600,000 (Payable upfront){"\n\n"}
                <Text style={styles.agreementSectionTitle}>
                  1. Terms & Conditions
                </Text>
                {"\n"}• The property shall be used strictly for residential
                purposes.{"\n"}• The tenant must not sublet the property without
                written consent.{"\n"}• The tenant must maintain the property
                and is responsible for structural repairs; the tenant is
                responsible for minor maintenance.{"\n"}• Rent is non-refundable
                once tenancy begins.{"\n\n"}
                <Text style={styles.agreementSectionTitle}>
                  2. Payment Terms
                </Text>
                {"\n"}• Rent must be paid in full before move-in.{"\n"}• Late
                payment is payment in escrow, and disburse it to the landlord
                only after successful inspection and confirmation.{"\n\n"}
                <Text style={styles.agreementSectionTitle}>3. Termination</Text>
                {"\n"}• Either party must give at least 1-month notice before
                termination.{"\n"}• Early termination by the tenant may result
                in forfeiture of the deposit.{"\n"}• Non-payment of rent may
                lead to eviction.{"\n"}• Landlord may terminate due to property
                misuse, unauthorized subletting, or breach of agreement.
              </Text>
            </View>
          </View>

          {/* Agreement Checkbox */}
          <Pressable
            style={styles.checkboxContainer}
            onPress={() => setIsAgreed(!isAgreed)}
          >
            <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]}>
              {isAgreed && (
                <Image
                  source={require("@/assets/icons/Checkbox-circle-intermediate.png")}
                  style={styles.checkIcon}
                />
              )}
            </View>
            <Text style={styles.checkboxText}>
              I have read and agree to the terms of the tenancy/ event space
              agreement.
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={{ paddingBottom: RFValue(16) }}>
        <AppButton
          onPress={handleContinue}
          disabled={!isAgreed}
          title="Continue"
        />
      </View>
    </SafeAreaViewContainer>
  );
};

export default ReviewAgreement;

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
    stepIndicator: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      fontWeight: "500",
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: RFValue(20),
    },
    container: {
      flex: 1,
    },
    titleSection: {
      marginTop: RFValue(24),
      marginBottom: RFValue(24),
    },
    title: {
      fontSize: RFValue(22),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    subtitle: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      lineHeight: RFValue(20),
    },
    downloadButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      paddingVertical: RFValue(14),
      marginBottom: RFValue(24),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    downloadIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
      marginRight: RFValue(8),
    },
    downloadText: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
    agreementContainer: {
      backgroundColor: colors.slate[150],

      borderColor: colors.slate[300],
      marginBottom: RFValue(24),
      overflow: "hidden",
    },
    agreementHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: RFValue(16),
    },
    documentIcon: {
      width: RFValue(22),
      height: RFValue(22),
      tintColor: colors.slate[500],
      marginRight: RFValue(12),
    },
    agreementHeaderText: {
      flex: 1,
    },
    agreementTitle: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(2),
    },
    agreementSize: {
      fontSize: RFValue(12),
      color: colors.slate[500],
    },
    shareIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
    agreementContent: {
      padding: RFValue(20),
    },
    agreementContentTitle: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(16),
    },
    agreementText: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      lineHeight: RFValue(20),
    },
    agreementSectionTitle: {
      fontWeight: "600",
      color: colors.slate[650],
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: RFValue(24),
    },
    checkbox: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(4),
      borderWidth: 2,
      borderColor: colors.slate[400],
      marginRight: RFValue(12),
      alignItems: "center",
      justifyContent: "center",
      marginTop: RFValue(2),
    },
    checkboxChecked: {
      backgroundColor: colors.slate[650],
      borderColor: colors.slate[650],
    },
    checkIcon: {
      width: RFValue(2),
      height: RFValue(2),
    },
    checkboxText: {
      flex: 1,
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(20),
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.slate[300],
    },
    continueButton: {
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(12),
      paddingVertical: RFValue(16),
      alignItems: "center",
      justifyContent: "center",
    },
    continueButtonDisabled: {
      backgroundColor: colors.slate[300],
    },

    continueButtonTextDisabled: {
      color: colors.slate[500],
    },
  });
