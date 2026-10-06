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
      <View style={styles.header} className="flex-row items-center justify-between">
        <Pressable onPress={() => router.back()}>
          <Image
            source={require("@/assets/icons/arrow-left-light.png")}
            style={styles.backIcon}
          />
        </Pressable>
        <Text style={styles.headerTitle} className="font-semibold flex-1 text-center">Review agreement</Text>
        <Text style={styles.stepIndicator} className="font-medium">3/4</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View  className="flex-1">
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title} className="font-bold">Review Agreement</Text>
            <Text style={styles.subtitle}>
              Before completing your booking, kindly take a moment to read
              through the agreement provided below for event space rental.
              Please review it carefully before proceeding with your
              reservation.
            </Text>
          </View>

          {/* Download Button */}
          <Pressable style={styles.downloadButton} onPress={handleDownload} className="flex-row items-center justify-center border-[1px]">
            <Image
              source={require("@/assets/icons/Download - Iconly Pro-1.png")}
              style={styles.downloadIcon}
            />
            <Text style={styles.downloadText} className="font-semibold">Download copy</Text>
          </Pressable>

          {/* Agreement Document */}
          <View style={styles.agreementContainer} className="overflow-hidden">
            <View style={styles.agreementHeader} className="flex-row items-center">
              <Image
                source={require("@/assets/icons/paper.png")}
                style={styles.documentIcon}
              />
              <View  className="flex-1">
                <Text style={styles.agreementTitle} className="font-semibold">Tenancy Agreement</Text>
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
              <Text style={styles.agreementContentTitle} className="font-bold">
                Tenancy Agreement
              </Text>
              <Text style={styles.agreementText}>
                This Tenancy Agreement is made between:{"\n"}• Landlord/Agent:
                To be filled by Agent{"\n"}• Tenant: Rhee Sammy{"\n"}• Address:
                2-Bedroom Apartment, No. 12 Unity street, Lekki, Lagos{"\n"}•
                Duration: 12 Months, starting from: July 15, 2025 to July 15,
                2026{"\n"}• Rent Amount: ₦600,000 (Payable upfront){"\n\n"}
                <Text style={styles.agreementSectionTitle} className="font-semibold">
                  1. Terms & Conditions
                </Text>
                {"\n"}• The property shall be used strictly for residential
                purposes.{"\n"}• The tenant must not sublet the property without
                written consent.{"\n"}• The tenant must maintain the property
                and is responsible for structural repairs; the tenant is
                responsible for minor maintenance.{"\n"}• Rent is non-refundable
                once tenancy begins.{"\n\n"}
                <Text style={styles.agreementSectionTitle} className="font-semibold">
                  2. Payment Terms
                </Text>
                {"\n"}• Rent must be paid in full before move-in.{"\n"}• Late
                payment is payment in escrow, and disburse it to the landlord
                only after successful inspection and confirmation.{"\n\n"}
                <Text style={styles.agreementSectionTitle} className="font-semibold">3. Termination</Text>
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
           className="flex-row items-start">
            <View style={[styles.checkbox, isAgreed && styles.checkboxChecked]} className="border-[2px] items-center justify-center">
              {isAgreed && (
                <Image
                  source={require("@/assets/icons/Checkbox-circle-intermediate.png")}
                  style={styles.checkIcon}
                />
              )}
            </View>
            <Text style={styles.checkboxText} className="flex-1">
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
    header: {paddingVertical: RFValue(16)},
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    headerTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    stepIndicator: {fontSize: RFValue(14),
color: colors.slate[500]},
    scrollContent: {paddingBottom: RFValue(20)},
    container: {},
    titleSection: {
      marginTop: RFValue(24),
      marginBottom: RFValue(24),
    },
    title: {fontSize: RFValue(22),
color: colors.slate[650],
marginBottom: RFValue(8)},
    subtitle: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      lineHeight: RFValue(20),
    },
    downloadButton: {backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
paddingVertical: RFValue(14),
marginBottom: RFValue(24),
borderColor: colors.slate[300]},
    downloadIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
      marginRight: RFValue(8),
    },
    downloadText: {fontSize: RFValue(15),
color: colors.slate[650]},
    agreementContainer: {backgroundColor: colors.slate[150],
borderColor: colors.slate[300],
marginBottom: RFValue(24)},
    agreementHeader: {padding: RFValue(16)},
    documentIcon: {
      width: RFValue(22),
      height: RFValue(22),
      tintColor: colors.slate[500],
      marginRight: RFValue(12),
    },
    agreementHeaderText: {},
    agreementTitle: {fontSize: RFValue(15),
color: colors.slate[650],
marginBottom: RFValue(2)},
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
    agreementContentTitle: {fontSize: RFValue(18),
color: colors.slate[650],
marginBottom: RFValue(16)},
    agreementText: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      lineHeight: RFValue(20),
    },
    agreementSectionTitle: {color: colors.slate[650]},
    checkboxContainer: {marginBottom: RFValue(24)},
    checkbox: {width: RFValue(20),
height: RFValue(20),
borderRadius: RFValue(4),
borderColor: colors.slate[400],
marginRight: RFValue(12),
marginTop: RFValue(2)},
    checkboxChecked: {
      backgroundColor: colors.slate[650],
      borderColor: colors.slate[650],
    },
    checkIcon: {
      width: RFValue(2),
      height: RFValue(2),
    },
    checkboxText: {fontSize: RFValue(14),
color: colors.slate[600],
lineHeight: RFValue(20)},
    footer: {paddingHorizontal: RFValue(20),
paddingVertical: RFValue(16),
backgroundColor: colors.background,
borderTopColor: colors.slate[300]},
    continueButton: {backgroundColor: colors.slate[650],
borderRadius: RFValue(12),
paddingVertical: RFValue(16)},
    continueButtonDisabled: {
      backgroundColor: colors.slate[300],
    },

    continueButtonTextDisabled: {
      color: colors.slate[500],
    },
  });
