import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { ColorScheme } from "@/utils";
import AppButton from "@/components/button";
import { useRouter } from "expo-router";

interface AddSpaceBottomSheetProps {
  colors: ColorScheme;
  closeSheet: () => void;
}

const AddSpaceBottomSheet: React.FC<AddSpaceBottomSheetProps> = ({
  colors,
  closeSheet,
}) => {
  const router = useRouter();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <View style={styles.dashedBorder}>
            <View style={styles.plusIconWrapper}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Add a space</Text>

        {/* Description */}
        <Text style={styles.description}>
          Add a space to connect your property with{"\n"}verified renters.
        </Text>

        {/* Continue Button */}
        <AppButton
          title="Continue"
          onPress={() => {
            closeSheet();
            router.push("/views/spaces/add-spaces");
          }}
          size="large"
          fullwidth={true}
        />
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
    handleContainer: {
      alignItems: "center",
      paddingVertical: RFValue(12),
    },
    handle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
    },
    content: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: RFValue(3),
      paddingTop: RFValue(20),
    },
    iconContainer: {
      marginBottom: RFValue(24),
    },
    dashedBorder: {
      width: RFValue(80),
      height: RFValue(80),
      borderRadius: RFValue(16),
      borderWidth: 2,
      borderColor: colors.slate[300],
      borderStyle: "dashed",
      alignItems: "center",
      justifyContent: "center",
      padding: RFValue(4),
    },
    plusIconWrapper: {
      width: "100%",
      height: "100%",
      borderRadius: RFValue(12),
      backgroundColor: colors.slate[150],
      alignItems: "center",
      justifyContent: "center",
    },
    plusIcon: {
      fontSize: RFValue(32),
      color: colors.slate[500],
      fontWeight: "300",
    },
    title: {
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(8),
      textAlign: "center",
    },
    description: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      textAlign: "center",
      lineHeight: RFValue(20),
      marginBottom: RFValue(32),
    },
    continueButton: {
      width: "100%",
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(12),
      paddingVertical: RFValue(16),
      alignItems: "center",
      justifyContent: "center",
    },
    continueButtonPressed: {
      opacity: 0.8,
    },
    continueButtonText: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: "#FFFFFF",
    },
  });

export default AddSpaceBottomSheet;
