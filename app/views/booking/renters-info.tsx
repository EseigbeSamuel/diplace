import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import AppButton from "@/components/button";
import TextField from "@/components/textfield";

const RentersInformation = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [fullName, setFullName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+234");

  const isFormValid = fullName && occupation && email && phoneNumber;

  const handleContinue = () => {
    if (isFormValid) {
      router.push({
        pathname: "/views/booking/event-details",
        params: {
          ...params,
          fullName,
          occupation,
          email,
          phoneNumber: `${countryCode} ${phoneNumber}`,
        },
      });
    }
  };

  return (
    <SafeAreaViewContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
       className="flex-1">
        {/* Header */}
        <View style={styles.header} className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Image
              source={require("@/assets/icons/arrow-left-light.png")}
              style={styles.backIcon}
            />
          </Pressable>
          <Text style={styles.headerTitle} className="font-semibold flex-1 text-center">Tenant's information</Text>
          <Text style={styles.stepIndicator} className="font-medium">1/4</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View  className="flex-1">
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title} className="font-bold">Tenant's Information</Text>
              <Text style={styles.subtitle}>
                Let us know who is booking this space.
              </Text>
            </View>

            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel} className="font-semibold">Personal Information</Text>

              {/* Full Name / Organization Input */}

              <TextField
                label="Full Name / Organization"
                value={fullName}
                onChange={(text) => setFullName(text.toString())}
                placeholder="Rhema Generation Inc."
                icon={require("@/assets/icons/Profile - Iconly Pro.png")}
              />
              <TextField
                label="Occupation"
                value={occupation}
                onChange={(text) => setOccupation(text.toString())}
                placeholder="Event Planner"
                icon={require("@/assets/icons/Work - Iconly Pro.png")}
              />
            </View>

            {/* Contact Details Section */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel} className="font-semibold">Contact Details</Text>

              <TextField
                label="Email"
                value={email}
                onChange={(text) => setEmail(text.toString())}
                placeholder="info@rgworld.com"
                icon={require("@/assets/icons/mail-outline-light.png")}
              />

              <TextField
                type="phone"
                label="Phone No."
                value={phoneNumber}
                onChange={(text) => setPhoneNumber(text.toString())}
                countryCode={countryCode}
                onCountryCodeChange={setCountryCode}
              />
            </View>
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View className="">
          <AppButton
            title="Continue"
            onPress={handleContinue}
            disabled={!isFormValid}
            fullwidth
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaViewContainer>
  );
};

export default RentersInformation;

const getStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    flex: {paddingBottom: RFValue(16)},
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
    scrollContent: {},
    container: {},
    titleSection: {
      marginTop: RFValue(16),
      marginBottom: RFValue(32),
    },
    title: {fontSize: RFValue(22),
color: colors.slate[650],
marginBottom: RFValue(8)},
    subtitle: {
      fontSize: RFValue(14),
      color: colors.slate[500],
      lineHeight: RFValue(20),
    },
    section: {
      marginBottom: RFValue(32),
    },
    sectionLabel: {fontSize: RFValue(15),
color: colors.slate[650],
marginBottom: RFValue(16)},
    inputContainer: {backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
paddingHorizontal: RFValue(16),
paddingVertical: RFValue(16),
marginBottom: RFValue(16),
borderColor: colors.slate[300]},
    inputIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[550],
      marginRight: RFValue(12),
    },
    inputWrapper: {},
    inputLabel: {
      fontSize: RFValue(12),
      color: colors.slate[500],
      marginBottom: RFValue(6),
    },
    input: {fontSize: RFValue(15),
color: colors.slate[650]},
    phoneInputWrapper: {},
    countryCodeContainer: {},
    flagIcon: {
      width: RFValue(20),
      height: RFValue(20),
      marginRight: RFValue(6),
    },
    countryCode: {fontSize: RFValue(15),
color: colors.slate[650],
marginRight: RFValue(4)},
    chevronIcon: {
      width: RFValue(12),
      height: RFValue(12),
      tintColor: colors.slate[500],
    },
    phoneDivider: {height: RFValue(20),
backgroundColor: colors.slate[300],
marginHorizontal: RFValue(12)},
    phoneInput: {fontSize: RFValue(15),
color: colors.slate[650]},
    footer: {paddingHorizontal: RFValue(20),
paddingVertical: RFValue(16),
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
