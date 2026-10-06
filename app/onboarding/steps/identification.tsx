import AppButton from "@/components/button";
import { SimpleSelector } from "@/components/selector";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { useCompleteVerification, useInitiateVerification } from "@/hooks";
import { ColorScheme } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

type IdentityVerificationProps = {
  onNext: () => void;
};

type IDType = "nin" | "bvn" | null;
type ConfirmationData = Record<string, unknown>;

const idTypes: { id: Exclude<IDType, null>; label: string }[] = [
  { id: "nin", label: "Nat'l Identification No. (NIN)" },
  { id: "bvn", label: "Bank Verification No. (BVN)" },
];

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const prettifyKey = (key: string) =>
  key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const IdentityVerificationStep = ({ onNext }: IdentityVerificationProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const { initiateVerificationMutation, initiateVerificationPending } =
    useInitiateVerification();
  const { completeVerificationMutation, completeVerificationPending } =
    useCompleteVerification();

  const [selectedIDType, setSelectedIDType] = useState<IDType>(null);
  const [showIDTypeModal, setShowIDTypeModal] = useState(false);
  const [documentNumber, setDocumentNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [confirmationData, setConfirmationData] =
    useState<ConfirmationData | null>(null);
  const lastFetchedRef = useRef("");
  const isFetching = initiateVerificationPending;
  const isCompleting = completeVerificationPending;
  const confirmationEntries = Object.entries(confirmationData ?? {});

  const getIDTypeLabel = (type: IDType) => {
    const idType = idTypes.find((item) => item.id === type);
    return idType ? idType.label : "";
  };

  const resetVerification = () => {
    setVerificationId("");
    setConfirmationData(null);
    lastFetchedRef.current = "";
  };

  const handleSelectIDType = (type: IDType) => {
    setSelectedIDType(type);
    setShowIDTypeModal(false);
    setDocumentNumber("");
    resetVerification();
  };

  const handleFetchData = async () => {
    if (!selectedIDType || documentNumber.length !== 11) return;

    const requestKey = `${selectedIDType}:${documentNumber}`;
    if (lastFetchedRef.current === requestKey || isFetching) return;

    lastFetchedRef.current = requestKey;
    setVerificationId("");
    setConfirmationData(null);

    try {
      const response = await initiateVerificationMutation({
        verification_type: selectedIDType,
        value: documentNumber,
      });
      const data =
        response.data_to_confirm ??
        (response.fetched_data ? { fetched_data: response.fetched_data } : {});

      setVerificationId(response.public_id);
      setConfirmationData(data);
    } catch {
      lastFetchedRef.current = "";
    }
  };

  useEffect(() => {
    if (documentNumber.length === 11 && selectedIDType) {
      handleFetchData();
    }
  }, [documentNumber, selectedIDType]);

  const handleDocumentNumberChange = (text: string) => {
    setDocumentNumber(text.replace(/\D/g, "").slice(0, 11));
    setVerificationId("");
    setConfirmationData(null);
    lastFetchedRef.current = "";
  };

  const handleComplete = async () => {
    if (!selectedIDType || !verificationId || !confirmationData) return;

    try {
      await completeVerificationMutation({
        verification_id: verificationId,
        confirm_data: true,
      });
      onNext();
    } catch {}
  };

  const isComplete =
    !!selectedIDType &&
    documentNumber.length === 11 &&
    !!verificationId &&
    !!confirmationData &&
    !isFetching &&
    !isCompleting;

  return (
    <View  className="flex-1">
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Styles.scrollContent}
        extraScrollHeight={30}
      >
        <View style={Styles.container} className="grow justify-between">
          <View style={Styles.contentContainer}>
            <Image
              source={require("@/assets/icons/identification 2.png")}
              style={Styles.idIcon}
              resizeMode="contain"
            />

            <View style={Styles.textContainer}>
              <Text style={Styles.headText} className="font-semibold">Verify your identity</Text>
              <Text style={Styles.descriptionText}>
                Select NIN or BVN. We will fetch your details for confirmation
                before completing verification.
              </Text>
            </View>

            <TextField
              label="Select means of ID"
              value={getIDTypeLabel(selectedIDType)}
              onChange={() => {}}
              onDropdownPress={() => setShowIDTypeModal(true)}
              type="dropdown"
            />

            {selectedIDType && (
              <TextField
                label={`${selectedIDType.toUpperCase()} Number`}
                value={documentNumber}
                onChange={(text) => handleDocumentNumberChange(text.toString())}
                keyboardType="numeric"
                maxLength={11}
                editable={!isFetching && !isCompleting}
              />
            )}

            {isFetching && (
              <View style={Styles.fetchingContainer} className="flex-row items-center justify-end">
                <ActivityIndicator size="small" color={colors.slate[650]} />
                <Text style={Styles.fetchingText}>Fetching data...</Text>
              </View>
            )}

            {confirmationData && !isFetching && (
              <View style={Styles.personalInfoContainer} className="border-[1px]">
                <Text style={Styles.sectionTitle} className="font-semibold">Confirm your information</Text>
                {confirmationEntries.length > 0 ? (
                  <View style={Styles.infoGrid}>
                    {confirmationEntries.map(([key, value]) => (
                      <View key={key} style={Styles.infoField}>
                        <Text style={Styles.infoLabel}>{prettifyKey(key)}</Text>
                        <Text style={Styles.infoValue} className="font-semibold">
                          {formatValue(value)}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={Styles.infoValue} className="font-semibold">
                    Your details were fetched successfully. Please confirm to
                    continue.
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={Styles.buttonContainer}>
        <AppButton
          title={isCompleting ? "Confirming..." : "Confirm and continue"}
          onPress={handleComplete}
          fullwidth
          size="large"
          disabled={!isComplete}
        />
      </View>

      <Modal
        visible={showIDTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIDTypeModal(false)}
      >
        <TouchableOpacity

          activeOpacity={1}
          onPress={() => setShowIDTypeModal(false)}
         className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-end">
          <TouchableOpacity
            activeOpacity={1}
            style={Styles.modalContent}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={Styles.modalHandle}  className="self-center"/>
            <Text style={Styles.modalTitle} className="font-semibold">
              Choose means of identification
            </Text>
            <Text style={Styles.modalDescription}>
              Select NIN or BVN to verify your account.
            </Text>

            <View style={Styles.idTypeOptions}>
              {idTypes.map((type) => (
                <SimpleSelector
                  key={type.id}
                  isChecked={selectedIDType === type.id}
                  onChange={() => handleSelectIDType(type.id)}
                  title={type.label}
                />
              ))}
            </View>

            <View style={Styles.modalSecurityNote}>
              <Text style={Styles.modalSecurityText}>
                Your data is safe. We only crosscheck your data to be sure you
                are real.
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
    root: {},
    scrollContent: {},
    container: {paddingBottom: RFValue(20)},
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
    headText: {fontSize: RFValue(24),
lineHeight: RFValue(32),
color: colors.slate[650]},
    descriptionText: {
      fontSize: RFValue(14),
      lineHeight: RFValue(22),
      color: colors.slate[600],
    },
    fetchingContainer: {gap: RFValue(12),
paddingVertical: RFValue(8)},
    fetchingText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    personalInfoContainer: {gap: RFValue(16),
paddingVertical: RFValue(16),
paddingHorizontal: RFValue(16),
backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
borderColor: colors.slate[300]},
    sectionTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    infoGrid: {
      gap: RFValue(14),
    },
    infoField: {
      gap: RFValue(6),
    },
    infoLabel: {
      fontSize: RFValue(13),
      color: colors.slate[600],
    },
    infoValue: {fontSize: RFValue(15),
color: colors.slate[650],
lineHeight: RFValue(22)},
    buttonContainer: {
      marginTop: RFValue(24),
    },
    modalOverlay: {},
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingTop: RFValue(12),
      paddingBottom: RFValue(32),
      paddingHorizontal: RFValue(20),
    },
    modalHandle: {width: RFValue(40),
height: RFValue(4),
backgroundColor: colors.slate[300],
borderRadius: RFValue(2),
marginBottom: RFValue(20)},
    modalTitle: {fontSize: RFValue(18),
color: colors.slate[650],
marginBottom: RFValue(8)},
    modalDescription: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      marginBottom: RFValue(24),
    },
    idTypeOptions: {
      gap: RFValue(16),
      marginBottom: RFValue(24),
    },
    modalSecurityNote: {
      paddingVertical: RFValue(12),
      paddingHorizontal: RFValue(12),
      borderRadius: RFValue(8),
    },
    modalSecurityText: {
      fontSize: RFValue(11),
      color: colors.slate[500],
      lineHeight: RFValue(16),
    },
  });
