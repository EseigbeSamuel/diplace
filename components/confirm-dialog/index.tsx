import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "../button";

type ConfirmDialogProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  title: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "secondary" | "tertiary" | "danger";
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  onConfirm,
  onCancel,
  message,
  title,
  confirmText = "Yes",
  cancelText = "No",
  confirmVariant = "primary",
  confirmDisabled = false,
  cancelDisabled = false,
}) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View style={Styles.container}>
          <Text style={Styles.title}>{title}</Text>
          <Text style={Styles.message}>{message}</Text>
          <View style={Styles.divider} />

          <View style={Styles.buttonRow}>
            <View style={Styles.buttonWrap}>
              <AppButton
                title={cancelText}
                variant="secondary"
                onPress={onCancel}
                disabled={cancelDisabled}
              />
            </View>
            <View style={Styles.buttonWrap}>
              <AppButton
                title={confirmText}
                variant={confirmVariant}
                onPress={onConfirm}
                disabled={confirmDisabled}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDialog;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      width: "86%",
      maxWidth: RFValue(300),
      borderRadius: RFValue(16),
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(20),
      backgroundColor: colors.background,
    },
    title: {
      fontSize: RFValue(20),
      lineHeight: RFValue(24),
      fontFamily: "InstrumentSansSemiBold",
      color: colors.slate[650],
      textAlign: "center",
    },
    message: {
      marginTop: RFValue(8),
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
      textAlign: "center",
    },
    divider: {
      marginTop: RFValue(18),
      marginBottom: RFValue(10),
      borderTopWidth: 1,
      borderTopColor: colors.slate[300],
    },
    buttonRow: {
      flexDirection: "row",
      gap: RFValue(8),
      justifyContent: "center",
    },
    buttonWrap: {
      width: "48%",
    },
  });
