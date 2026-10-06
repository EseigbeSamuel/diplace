import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as DocumentPicker from "expo-document-picker";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useSpaceStore } from "@/store/useSpace";
import MediaPickerModal from "@/components/media-picker-modal";

interface RentalAgreementSubstepProps {
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

const RentalAgreementSubstep: React.FC<RentalAgreementSubstepProps> = ({
  onNext,
  onSkip,
}) => {
  const { colors } = useTheme();
  const { setValue, spaceForm } = useSpaceStore();
  const styles = createStyles(colors);

  // const [uploadedFile, setUploadedFile] = useState<{
  //   name: string;
  //   size: number;
  //   uri: string;
  // } | null>(spaceForm?.rentalAgreement || null);
  const [showPicker, setShowPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        setIsUploading(true);

        // Simulate upload delay
        setTimeout(() => {
          const fileData = {
            name: file.name,
            size: file.size || 0,
            uri: file.uri,
          };
          setValue({ rentalAgreement: fileData });
          setIsUploading(false);
          setShowPicker(false);
        }, 1500);
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert("Error", "Failed to select document");
      setIsUploading(false);
    }
  };

  const handleSelectFromFiles = () => {
    handleSelectDocument();
  };

  const handleSelectFromCamera = () => {
    setShowPicker(false);
    Alert.alert("Camera", "Camera functionality would open here");
  };

  const handleRemove = () => {
    setValue({ rentalAgreement: null });
  };

  const handlePreview = () => {
    if (spaceForm.value.rentalAgreement) {
      Alert.alert(
        "Preview",
        `Preview: ${spaceForm.value.rentalAgreement.name}`
      );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <View style={styles.container} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title} className="font-bold">Upload rental agreement</Text>
        <Text style={styles.description}>
          Upload any rental agreement for the use of this space. Please review
          it carefully before proceeding. You can skip this step if you don't
          have any.
        </Text>

        {spaceForm.value.rentalAgreement && (
          <TouchableOpacity
            style={styles.uploadDocumentButton}
            onPress={() => setShowPicker(true)}
           className="flex-row items-center justify-end">
            <Image
              source={require("@/assets/icons/Upload - Iconly Pro.png")}
              style={styles.uploadIconSmall}
              resizeMode="contain"
            />
            <Text style={styles.uploadDocumentText} className="font-medium">Upload document</Text>
          </TouchableOpacity>
        )}

        <View style={styles.uploadSection}>
          <View style={styles.uploadHeader} className="flex-row justify-between items-center">
            <View className="gap-[6px]">
              <Text style={styles.uploadLabel} className="font-semibold">Rental Agreement</Text>
              {!spaceForm.value.rentalAgreement && !isUploading && (
                <View style={styles.placeholderContainer} className="flex-row items-center">
                  <Image
                    source={require("@/assets/icons/paper.png")}
                    style={styles.fileIconSmall}
                    resizeMode="contain"
                  />
                  <Text style={styles.placeholderText}>
                    No file uploaded yet.
                  </Text>
                </View>
              )}
              {spaceForm.value.rentalAgreement && (
                <View style={styles.fileInfo} className="flex-row items-center">
                  <Image
                    source={require("@/assets/icons/paper.png")}
                    style={styles.fileIconSmall}
                    resizeMode="contain"
                  />
                  <View  className="flex-1">
                    <Text style={styles.fileSize}>
                      Uploaded:{" "}
                      {formatFileSize(spaceForm.value.rentalAgreement.size)}
                    </Text>
                  </View>
                </View>
              )}
              {isUploading && (
                <View style={styles.uploadingContainer} className="flex-row items-center">
                  <ActivityIndicator color={"green"} />
                  <Text style={styles.uploadingText}>Uploading...</Text>
                </View>
              )}
            </View>
            {!spaceForm.value.rentalAgreement && (
              <TouchableOpacity
                style={styles.uploadIconButton}
                onPress={() => setShowPicker(true)}
              >
                <Image
                  source={require("@/assets/icons/Upload - Iconly Pro.png")}
                  style={styles.uploadIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
            {spaceForm.value.rentalAgreement && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handlePreview}
               className="flex-row items-center justify-between">
                <Text style={styles.previewText} className="font-medium">Preview</Text>
                <Image
                  source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
                  style={styles.chevronIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>

          {spaceForm.value.rentalAgreement && (
            <View style={styles.fileContainer}>
              <View style={styles.fileActions}>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={handleRemove}
                 className="flex-row items-center justify-end">
                  <Image
                    source={require("@/assets/icons/delete.png")}
                    style={styles.trashIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.removeText} className="font-medium">Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons} className="absolute bottom-[0px] left-[0px] right-[0px] flex-row">
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipText} className="font-medium">Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            !spaceForm.value.rentalAgreement && styles.nextButtonDisabled,
          ]}
          onPress={onNext}
          disabled={!spaceForm.value.rentalAgreement}
         className="flex-1 items-center justify-center">
          <Text
            style={[
              styles.nextText,
              !spaceForm.value.rentalAgreement && styles.nextTextDisabled,
            ]}
           className="font-semibold">
            Next
          </Text>
        </TouchableOpacity>
      </View>

      <MediaPickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onCameraRoll={handleSelectFromCamera}
        onChoosePhoto={handleSelectFromFiles}
        showTakePicture={false}
      />
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {backgroundColor: colors.background},
    scrollContent: {
      paddingVertical: RFValue(20),
      paddingBottom: RFValue(100),
    },
    title: {fontSize: RFValue(24),
color: colors.slate[650],
marginBottom: RFValue(12)},
    description: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(22),
      marginBottom: RFValue(24),
    },
    uploadSection: {
      gap: RFValue(12),
    },
    uploadHeader: {backgroundColor: colors.slate[200],
paddingHorizontal: RFValue(12),
paddingVertical: RFValue(12),
borderRadius: RFValue(8)},
    uploadLabel: {fontSize: RFValue(15),
color: colors.slate[650]},
    uploadIconButton: {
      padding: RFValue(8),
    },
    uploadIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    uploadIconSmall: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    fileIconSmall: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    loaderIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    chevronIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    trashIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.error[200],
    },
    placeholderContainer: {gap: RFValue(8)},
    placeholderText: {
      fontSize: RFValue(14),
      color: colors.slate[500],
    },
    uploadingContainer: {gap: RFValue(8),
paddingVertical: RFValue(16)},
    uploadingText: {
      fontSize: RFValue(14),
      color: colors.slate[500],
    },
    fileContainer: {
      gap: RFValue(12),
    },
    fileInfo: {gap: RFValue(12)},
    fileDetails: {},
    fileName: {fontSize: RFValue(14),
color: colors.slate[650],
marginBottom: RFValue(4)},
    fileSize: {
      fontSize: RFValue(12),
      color: colors.slate[500],
    },
    fileActions: {
      gap: RFValue(12),
    },
    actionButton: {paddingVertical: RFValue(12)},
    previewText: {fontSize: RFValue(14),
color: colors.slate[650]},
    removeButton: {gap: RFValue(8),
paddingVertical: RFValue(8)},
    removeText: {fontSize: RFValue(14),
color: colors.error[200]},
    uploadDocumentButton: {gap: RFValue(8),
marginBottom: RFValue(24)},
    uploadDocumentText: {fontSize: RFValue(14),
color: colors.slate[650]},
    bottomButtons: {gap: RFValue(16),
paddingHorizontal: RFValue(20),
paddingVertical: RFValue(16)},
    skipButton: {
      paddingVertical: RFValue(14),
      paddingHorizontal: RFValue(24),
    },
    skipText: {fontSize: RFValue(16),
color: colors.slate[600]},
    nextButton: {backgroundColor: colors.slate[650],
borderRadius: RFValue(24),
paddingVertical: RFValue(14)},
    nextButtonDisabled: {
      backgroundColor: colors.slate[300],
    },
    nextText: {fontSize: RFValue(16),
color: colors.background},
    nextTextDisabled: {
      color: colors.slate[500],
    },
    modalOverlay: {},
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingTop: RFValue(12),
      paddingBottom: RFValue(32),
    },
    modalHandle: {width: RFValue(40),
height: RFValue(4),
backgroundColor: colors.slate[300],
borderRadius: RFValue(2),
marginBottom: RFValue(20)},
    modalTitle: {fontSize: RFValue(18),
color: colors.slate[650],
marginBottom: RFValue(24)},
    optionsContainer: {paddingHorizontal: RFValue(20),
gap: RFValue(22)},
    optionButton: {gap: RFValue(12)},
    optionIconBlue: {},
    optionIconOrange: {},
    optionImage: {
      width: RFValue(48),
      height: RFValue(48),
    },
    optionText: {fontSize: RFValue(14),
color: colors.slate[650]},
  });

export default RentalAgreementSubstep;
