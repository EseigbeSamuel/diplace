import { BottomSheet, useBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface AddSpaceBottomSheetProps {
  colors: ColorScheme;
  closeSheet: () => void;
}

const AddSpaceBottomSheet: React.FC<AddSpaceBottomSheetProps> = ({
  colors,
  closeSheet,
}) => {
  const router = useRouter();
  const testSheet = useBottomSheet();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        {/* Icon Container */}
        <View style={styles.iconContainer}>
          <View style={styles.dashedBorder}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open test bottom sheet"
              onPress={testSheet.open}
              style={styles.plusIconWrapper}
            >
              <Text style={styles.plusIcon}>+</Text>
            </Pressable>
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
      <BottomSheet
        isVisible={testSheet.isVisible}
        onClose={testSheet.close}
        snapPoints={[0.3, 0.6]}
        title="Test bottom sheet"
      >
        <View style={{ padding: RFValue(16) }}>
          <AppButton
            title="Close"
            onPress={testSheet.close}
            size="large"
            fullwidth={true}
          />
        </View>
      </BottomSheet>
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
