import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type IdentityVerificationProps = {
  onNext: () => void;
};

type IDType = "NIN" | "BVN" | "PASSPORT" | null;

interface PersonalInfo {
  surname: string;
  firstName: string;
  middleName: string;
  dateOfBirth: string;
}

const IdentityVerificationStep = ({ onNext }: IdentityVerificationProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  const [selectedIDType, setSelectedIDType] = useState<IDType>(null);
  const [showIDTypeModal, setShowIDTypeModal] = useState(false);
  const [documentNumber, setDocumentNumber] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);

  const idTypes = [
    { id: "NIN", label: "Nat'l Identification No. (NIN)" },
    { id: "BVN", label: "Bank Verification No. (BVN)" },
    { id: "PASSPORT", label: "Int'l Passport" },
  ];

  const getIDTypeLabel = (type: IDType) => {
    const idType = idTypes.find((item) => item.id === type);
    return idType ? idType.label : "Select means of ID";
  };

  const handleSelectIDType = (type: IDType) => {
    setSelectedIDType(type);
    setShowIDTypeModal(false);
    setDocumentNumber("");
    setPersonalInfo(null);
  };

  const handleFetchData = async () => {
    if (!documentNumber) return;

    setIsFetching(true);

    // Simulate API call to fetch personal info
    setTimeout(() => {
      // Mock data - replace with actual API response
      setPersonalInfo({
        surname: "KALU",
        firstName: "SABHMY",
        middleName: "UKO",
        dateOfBirth: "28-10-1995",
      });
      setIsFetching(false);
    }, 2000);
  };

  const handleDocumentNumberChange = (text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, "");
    setDocumentNumber(cleaned);
    if (text.length == 11) {
      handleFetchData();
    }
  };

  const handleComplete = () => {
    if (selectedIDType && documentNumber && personalInfo) {
      // Save to store if needed
      onNext();
    }
  };

  const isComplete = selectedIDType && documentNumber && personalInfo;

  return (
    <View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Styles.scrollContent}
        extraScrollHeight={30}
      >
        <View style={Styles.container}>
          {/* Content */}
          <View style={Styles.contentContainer}>
            {/* ID Icon */}

            <Image
              source={require("@/assets/icons/identification 2.png")}
              style={Styles.idIcon}
              resizeMode="contain"
            />

            {/* Title and Description */}
            <View style={Styles.textContainer}>
              <Text style={Styles.headText}>Verify your identity</Text>
              <Text style={Styles.descriptionText}>
                Please select any means of identification to verify your
                account. We only crosscheck your data to be sure you are real.
              </Text>
            </View>

            {/* Select ID Type */}
            <View style={Styles.inputContainer}>
              <TouchableOpacity
                style={Styles.selectorButton}
                onPress={() => setShowIDTypeModal(true)}
              >
                <Text
                  style={[
                    Styles.selectorText,
                    !selectedIDType && Styles.selectorPlaceholder,
                  ]}
                >
                  {getIDTypeLabel(selectedIDType)}
                </Text>
                <Image
                  source={require("@/assets/icons/chevron-right.png")}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Document Number Input */}
            {selectedIDType && (
              <View style={Styles.inputContainer}>
                <TextInput
                  style={Styles.textInput}
                  placeholder="Document Number"
                  placeholderTextColor={colors.slate[400]}
                  value={documentNumber}
                  onChangeText={handleDocumentNumberChange}
                  keyboardType="numeric"
                  maxLength={11}
                />
              </View>
            )}

            {/* Fetching Indicator */}
            {isFetching && (
              <View style={Styles.fetchingContainer}>
                <ActivityIndicator size="small" color={colors.slate[650]} />
                <Text style={Styles.fetchingText}>Fetching data...</Text>
              </View>
            )}

            {/* Personal Information */}
            {personalInfo && !isFetching && (
              <View style={Styles.personalInfoContainer}>
                <Text style={Styles.sectionTitle}>Personal Information</Text>

                <View style={Styles.infoGrid}>
                  {/* Row 1 */}
                  <View style={Styles.infoRow}>
                    <View style={Styles.infoField}>
                      <Text style={Styles.infoLabel}>Surname</Text>
                      <Text style={Styles.infoValue}>
                        {personalInfo.surname}
                      </Text>
                    </View>

                    <View style={Styles.infoField}>
                      <Text style={Styles.infoLabel}>First Name</Text>
                      <Text style={Styles.infoValue}>
                        {personalInfo.firstName}
                      </Text>
                    </View>
                  </View>

                  {/* Row 2 */}
                  <View style={Styles.infoRow}>
                    <View style={Styles.infoField}>
                      <Text style={Styles.infoLabel}>Middle Name</Text>
                      <Text style={Styles.infoValue}>
                        {personalInfo.middleName}
                      </Text>
                    </View>

                    <View style={Styles.infoField}>
                      <Text style={Styles.infoLabel}>Date of birth</Text>
                      <Text style={Styles.infoValue}>
                        {personalInfo.dateOfBirth}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Complete Button */}
          <View style={Styles.buttonContainer}>
            <AppButton
              title="Complete"
              onPress={handleComplete}
              fullwidth
              size="large"
              disabled={!isComplete}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* ID Type Selection Modal */}
      <Modal
        visible={showIDTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIDTypeModal(false)}
      >
        <TouchableOpacity
          style={Styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowIDTypeModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={Styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={Styles.modalHandle} />
            <Text style={Styles.modalTitle}>
              Choose means of identification
            </Text>
            <Text style={Styles.modalDescription}>
              Select any means of identification to verify your account.
            </Text>

            <View style={Styles.idTypeOptions}>
              {idTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={Styles.idTypeOption}
                  onPress={() => handleSelectIDType(type.id as IDType)}
                >
                  <View style={Styles.radioContainer}>
                    <View
                      style={[
                        Styles.radioOuter,
                        selectedIDType === type.id && Styles.radioOuterSelected,
                      ]}
                    >
                      {selectedIDType === type.id && (
                        <View style={Styles.radioInner} />
                      )}
                    </View>
                  </View>
                  <Text style={Styles.idTypeOptionText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Security Note in Modal */}
            <View style={Styles.modalSecurityNote}>
              <Text style={Styles.modalSecurityText}>
                🔐 Your data is 100% safe. We only crosscheck your data to be
                sure you are real.
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default IdentityVerificationStep;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
    },
    container: {
      flexGrow: 1,
      justifyContent: "space-between",
      paddingBottom: RFValue(20),
    },
    contentContainer: {
      paddingTop: RFValue(40),
      gap: RFValue(8),
    },
    idIcon: {
      width: RFValue(60),
      height: RFValue(60),
      tintColor: colors.slate[650],
    },
    textContainer: {
      gap: RFValue(12),
    },
    headText: {
      fontSize: RFValue(24),
      fontWeight: "600",
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    descriptionText: {
      fontSize: RFValue(14),
      lineHeight: RFValue(22),
      color: colors.slate[600],
    },
    inputContainer: {
      gap: RFValue(8),
    },
    inputLabel: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    selectorButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    selectorText: {
      fontSize: RFValue(15),
      color: colors.slate[650],
      fontWeight: "500",
    },
    selectorPlaceholder: {
      color: colors.slate[500],
    },
    arrowIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[600],
    },
    textInput: {
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      fontSize: RFValue(15),
      color: colors.slate[650],
      fontWeight: "500",
    },
    fetchingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(12),
      paddingVertical: RFValue(8),
      justifyContent: "flex-end",
    },
    fetchingText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    personalInfoContainer: {
      gap: RFValue(20),
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    sectionTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    infoGrid: {
      gap: RFValue(16),
    },
    infoRow: {
      flexDirection: "row",
      gap: RFValue(16),
    },
    infoField: {
      flex: 1,
      gap: RFValue(6),
    },
    infoLabel: {
      fontSize: RFValue(13),
      color: colors.slate[600],
    },
    infoValue: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
    securityNote: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: RFValue(8),
      backgroundColor: colors.success[100],
      paddingVertical: RFValue(12),
      paddingHorizontal: RFValue(12),
      borderRadius: RFValue(8),
      marginTop: RFValue(8),
    },
    shieldIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.success[300],
      marginTop: RFValue(2),
    },
    securityText: {
      flex: 1,
      fontSize: RFValue(12),
      color: colors.success[300],
      lineHeight: RFValue(18),
    },
    buttonContainer: {
      marginTop: RFValue(32),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingTop: RFValue(12),
      paddingBottom: RFValue(32),
      paddingHorizontal: RFValue(20),
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginBottom: RFValue(20),
    },
    modalTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    modalDescription: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      marginBottom: RFValue(24),
    },
    idTypeOptions: {
      gap: RFValue(16),
      marginBottom: RFValue(24),
    },
    idTypeOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.background,
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    radioContainer: {
      marginRight: RFValue(12),
    },
    radioOuter: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 2,
      borderColor: colors.slate[400],
      alignItems: "center",
      justifyContent: "center",
    },
    radioOuterSelected: {
      borderColor: colors.slate[650],
    },
    radioInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    idTypeOptionText: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
      flex: 1,
    },
    modalSecurityNote: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: RFValue(8),
      paddingVertical: RFValue(12),
      paddingHorizontal: RFValue(12),
      borderRadius: RFValue(8),
    },
    shieldIconSmall: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.success[300],
      marginTop: RFValue(2),
    },
    modalSecurityText: {
      flex: 1,
      fontSize: RFValue(11),
      color: colors.slate[500],
      lineHeight: RFValue(16),
    },
  });
