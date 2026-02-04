import React from "react";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";

interface MediaPickerModalProps {
  visible: boolean;
  showTakePicture?: boolean;
  onClose: () => void;
  onTakePicture?: () => void;
  onChoosePhoto: () => void;
  onCameraRoll: () => void;
}

const MediaPickerModal = ({
  visible,
  onClose,
  onTakePicture,
  onChoosePhoto,
  onCameraRoll,
  showTakePicture = true,
}: MediaPickerModalProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />

        <View style={styles.modalContent}>
          {/* Modal Handle */}
          <View style={styles.modalHandle} />

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select media from</Text>
          </View>

          {/* Media Options */}
          <View style={styles.mediaOptions}>
            {showTakePicture && (
              <Pressable style={styles.mediaOption} onPress={onTakePicture}>
                <View style={styles.mediaIconContainer}>
                  <Image
                    source={require("@/assets/icons/Camera - Iconly Pro-1.png")}
                    style={styles.mediaCameraIcon}
                  />
                </View>
                <Text style={styles.mediaOptionText}>Take picture</Text>
              </Pressable>
            )}

            <Pressable style={styles.mediaOption} onPress={onChoosePhoto}>
              <View style={styles.mediaIconContainer}>
                <Image
                  source={require("@/assets/icons/photos.png")}
                  style={styles.mediaIcon}
                />
              </View>
              <Text style={styles.mediaOptionText}>Photos</Text>
            </Pressable>

            <Pressable style={styles.mediaOption} onPress={onCameraRoll}>
              <View style={styles.mediaIconContainer}>
                <Image
                  source={require("@/assets/icons/camera-light.png")}
                  style={styles.mediaIcon}
                />
              </View>
              <Text style={styles.mediaOptionText}>Camera roll</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MediaPickerModal;

const getStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalBackdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(32),
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[500],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginVertical: RFValue(12),
    },
    modalHeader: {
      marginBottom: RFValue(24),
      alignItems: "center",
    },
    modalTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
      textAlign: "center",
    },
    mediaOptions: {
      flexDirection: "row",
      gap: RFValue(8),
    },
    mediaOption: {
      alignItems: "center",
      gap: RFValue(12),
    },
    mediaIconContainer: {
      width: RFValue(64),
      height: RFValue(64),
      borderRadius: RFValue(32),
      backgroundColor: colors.slate[150],
      alignItems: "center",
      justifyContent: "center",
    },
    mediaIcon: {
      width: RFValue(40),
      height: RFValue(40),
      borderRadius: RFValue(8),
    },
    mediaCameraIcon: {
      width: RFValue(40),
      height: RFValue(40),
      tintColor: colors.slate[650],
    },
    mediaOptionText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
      textAlign: "center",
    },
  });
