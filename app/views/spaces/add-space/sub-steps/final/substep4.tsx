import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useSpaceStore } from "@/store/useSpace";

interface Charge {
  id: string;
  title: string;
  description: string;
  value: string;
  editable: boolean;
}

interface OtherChargesSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const OtherChargesSubstep: React.FC<OtherChargesSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, spaceForm } = useSpaceStore();

  const charges = spaceForm.value.otherCharges;

  // const [charges, setCharges] = useState<Charge[]>([
  //   {
  //     id: "1",
  //     title: "Platform fee",
  //     description: "DiPlace service charge.",
  //     value: "₦2,000",
  //     editable: false,
  //   },
  //   {
  //     id: "2",
  //     title: "Agent fee",
  //     description: "Your rental commission.",
  //     value: "10%",
  //     editable: true,
  //   },
  //   {
  //     id: "3",
  //     title: "Caution fee",
  //     description: "Refundable deposit.",
  //     value: "₦50,000",
  //     editable: true,
  //   },
  //   {
  //     id: "4",
  //     title: "Service charge",
  //     description: "Recurring fee for utilities.",
  //     value: "₦6,000",
  //     editable: true,
  //   },
  // ]);

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customChargeName, setCustomChargeName] = useState("");

  const handleRemoveCharge = (id: string) => {
    setValue({ otherCharges: charges?.filter((charge) => charge.id !== id) });
  };

  const handleUpdateCharge = (id: string, newValue: string) => {
    setValue({
      otherCharges: charges?.map((charge) =>
        charge.id === id ? { ...charge, value: newValue } : charge
      ),
    });
  };

  const handleAddCustom = () => {
    if (!showCustomInput) {
      setShowCustomInput(true);
      return;
    }

    if (customChargeName) {
      const newCharge: Charge = {
        id: Date.now().toString(),
        title: customChargeName,
        description: "",
        value: "₦0",
        editable: true,
      };
      setValue({ otherCharges: [...(charges ?? []), newCharge] });
      setCustomChargeName("");
      setShowCustomInput(false);
    }
  };

  const handleCancelCustom = () => {
    setShowCustomInput(false);
    setCustomChargeName("");
  };

  const handleSkip = () => {
    onNext();
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>
          Tell us about other charges if there is any.
        </Text>

        {/* Charges List */}
        <View style={styles.chargesList}>
          {charges?.map((charge) => (
            <View key={charge.id} style={styles.chargeItem}>
              <View style={styles.chargeInfo}>
                <Text style={styles.chargeTitle}>{charge.title}</Text>
                {charge.description && (
                  <Text style={styles.chargeDescription}>
                    {charge.description}
                  </Text>
                )}
              </View>

              <View style={styles.chargeActions}>
                {charge.editable ? (
                  <TextInput
                    style={styles.chargeValueInput}
                    value={charge.value}
                    onChangeText={(text) => handleUpdateCharge(charge.id, text)}
                    placeholderTextColor={colors.slate[500]}
                  />
                ) : (
                  <Text style={[styles.chargeValueInput, { opacity: 0.5 }]}>
                    {charge.value}
                  </Text>
                )}

                <Pressable
                  style={[
                    styles.deleteButton,
                    { opacity: charge.editable ? 1 : 0.5 },
                  ]}
                  onPress={() => handleRemoveCharge(charge.id)}
                  disabled={!charge.editable}
                >
                  <Image
                    source={require("@/assets/icons/delete.png")}
                    style={styles.deleteIcon}
                  />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Custom Fee Input - Shows when Add custom is clicked */}
        {showCustomInput && (
          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.customInput}
              placeholder="Type here..."
              placeholderTextColor={colors.slate[500]}
              value={customChargeName}
              onChangeText={setCustomChargeName}
              autoFocus
            />
            <Pressable
              style={styles.closeCustomButton}
              onPress={handleCancelCustom}
            >
              <Image
                source={require("@/assets/icons/close-contained.png")}
                style={styles.closeCustomIcon}
              />
            </Pressable>
          </View>
        )}

        {/* Add Custom Button */}
        <Pressable style={styles.addCustomButton} onPress={handleAddCustom}>
          <Image
            source={require("@/assets/icons/plus.png")}
            style={styles.addIcon}
          />
          <Text style={styles.addCustomText}>Add custom</Text>
        </Pressable>
      </KeyboardAwareScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
        <View style={styles.nextButtonWrapper}>
          <AppButton title="Next" onPress={handleNext} size="medium" />
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingTop: RFValue(32),
      paddingBottom: RFValue(20),
    },
    title: {
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      lineHeight: RFValue(28),
      marginBottom: RFValue(32),
    },
    chargesList: {
      gap: RFValue(24),
      marginBottom: RFValue(24),
    },
    chargeItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: RFValue(16),
    },
    chargeInfo: {
      flex: 1,
    },
    chargeTitle: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(4),
    },
    chargeDescription: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      lineHeight: RFValue(18),
    },
    chargeActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(12),
    },
    chargeValueText: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      minWidth: RFValue(80),
      textAlign: "right",
    },
    chargeValueInput: {
      minWidth: RFValue(80),
      paddingVertical: RFValue(8),
      paddingHorizontal: RFValue(12),
      backgroundColor: colors.background,
      borderRadius: RFValue(8),
      borderWidth: 1,
      borderColor: colors.slate[300],
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      textAlign: "right",
    },
    deleteButton: {
      padding: RFValue(4),
    },
    deleteIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.error[200],
    },
    addCustomButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: RFValue(8),
      paddingVertical: RFValue(12),
    },
    addIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    addCustomText: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
    },
    customInputContainer: {
      position: "relative",
      marginBottom: RFValue(24),
    },
    customInput: {
      width: "100%",
      paddingVertical: RFValue(14),
      paddingHorizontal: RFValue(16),
      paddingRight: RFValue(40),
      backgroundColor: colors.background,
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    closeCustomButton: {
      position: "absolute",
      right: RFValue(12),
      top: "50%",
      transform: [{ translateY: -10 }],
      width: RFValue(20),
      height: RFValue(20),
      alignItems: "center",
      justifyContent: "center",
    },
    closeCustomIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[500],
    },
    bottomButtons: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: RFValue(24),
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,

      gap: RFValue(16),
    },
    skipButton: {
      paddingVertical: RFValue(14),
      paddingHorizontal: RFValue(20),
    },
    skipText: {
      fontSize: RFValue(16),
      color: colors.slate[600],
      fontWeight: "500",
    },
    nextButtonWrapper: {
      flex: 1,
    },
  });

export default OtherChargesSubstep;
