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
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  onConfirm,
  onCancel,
  message,
  title,
}) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  if (!visible) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="rounded-2xl px-6 py-5 w-80" style={Styles.container}>
          <Text
            className="text-lg font-semibold text-center"
            style={Styles.title}
          >
            {title}
          </Text>
          <Text className="text-neutral-300 text-sm text-center mt-2">
            {message}
          </Text>
          <View className="py-2 mt-6 gap-2 border-t border-gray-400"></View>
          <View className="flex-row justify-between gap-2">
            <View className="w-[50%]">
              <AppButton title="No" variant="secondary" onPress={onCancel} />
            </View>
            <View className="w-[50%]">
              <AppButton title="Yes" onPress={onConfirm} />
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
      backgroundColor: colors.background,
    },

    title: {
      fontSize: RFValue(20),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
  });
