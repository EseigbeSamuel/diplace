import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as ImagePicker from "expo-image-picker";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { MediaItem } from "@/types/add-space-types";
import { useSpaceStore } from "@/store/useSpace";
import MediaPickerModal from "@/components/media-picker-modal";

interface MediaUploadSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

const MediaUploadSubstep: React.FC<MediaUploadSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, setType, spaceForm } = useSpaceStore();
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera and photo library permissions to upload media"
      );
      return false;
    }
    return true;
  };

  const handleOpenMediaPicker = async () => {
    const hasPermission = await requestPermissions();
    if (hasPermission) {
      setShowMediaPicker(true);
    }
  };

  const pickFromGallery = async () => {
    setShowMediaPicker(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled) {
      const newMedia: MediaItem[] = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type === "video" ? "video" : "image",
        id: Math.random().toString(36).substring(7),
      }));
      setValue({ media: [...(spaceForm.value.media || []), ...newMedia] });
    }
  };

  const takePicture = async () => {
    setShowMediaPicker(false);

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const newMedia: MediaItem = {
        uri: result.assets[0].uri,
        type: "image",
        id: Math.random().toString(36).substring(7),
      };
      setValue({ media: [...(spaceForm.value.media || []), newMedia] });
    }
  };

  const recordVideo = async () => {
    setShowMediaPicker(false);

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newMedia: MediaItem = {
        uri: result.assets[0].uri,
        type: "video",
        id: Math.random().toString(36).substring(7),
      };
      setValue({ media: [...(spaceForm.value.media || []), newMedia] });
    }
  };

  const removeMedia = (id: string) => {
    setValue({
      media: Array.isArray(spaceForm.value.media)
        ? spaceForm.value.media.filter((item) => item.id !== id)
        : [],
    });
  };

  const handleNext = () => {
    if (!spaceForm.value.media || spaceForm.value.media.length === 0) {
      Alert.alert(
        "Upload Required",
        "Please upload at least one photo or video",
      );
      return;
    }
    onNext();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>Upload photos and videos of the space.</Text>

        {/* Gallery Section */}
        {Array.isArray(spaceForm.value.media) &&
          spaceForm.value.media.length < 1 && (
            <Pressable
              style={styles.gallerySection}
              onPress={handleOpenMediaPicker}
            >
              <View style={styles.galleryHeader}>
                <Text style={styles.galleryText}>Gallery</Text>

                <View style={styles.galleryIconContainer}>
                  <Image
                    source={require("@/assets/icons/Image - Iconly Pro.png")}
                    style={styles.galleryIcon}
                  />
                  <Text style={styles.clickText}>Click here to upload.</Text>
                </View>
              </View>
              <Image
                source={require("@/assets/icons/Upload - Iconly Pro.png")}
                className="size-7"
                style={{
                  width: RFValue(20),
                  height: RFValue(20),
                  tintColor: colors.slate[650],
                  marginRight: RFValue(6),
                }}
              />
            </Pressable>
          )}

        {/* Uploaded Media Count and Upload Button */}
        {Array.isArray(spaceForm.value.media) &&
          spaceForm.value.media.length > 0 && (
            <View style={styles.uploadedHeader}>
              <Text style={styles.uploadedCount}>
                {spaceForm.value.media.length} files uploaded
              </Text>
              <Pressable
                style={styles.uploadMoreButton}
                onPress={handleOpenMediaPicker}
              >
                <Image
                  source={require("@/assets/icons/Upload - Iconly Pro.png")}
                  style={styles.uploadIcon}
                />
                <Text style={styles.uploadMoreText}>Upload new</Text>
              </Pressable>
            </View>
          )}

        {/* Media Grid */}
        {Array.isArray(spaceForm.value.media) &&
          spaceForm.value.media.length > 0 && (
            <View style={styles.mediaGrid}>
              {Array.isArray(spaceForm.value.media) &&
                spaceForm.value.media.map((item) => (
                  <View key={item.id} style={styles.mediaItem}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.mediaImage}
                    />
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removeMedia(item.id)}
                    >
                      <Image
                        source={require("@/assets/icons/close-contained.png")}
                        style={styles.removeIcon}
                      />
                    </Pressable>
                    {item.type === "video" && (
                      <View style={styles.videoBadge}>
                        <Image
                          source={require("@/assets/icons/Video - Iconly Pro.png")}
                          style={styles.playIcon}
                        />
                      </View>
                    )}
                  </View>
                ))}
            </View>
          )}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Next"
          onPress={handleNext}
          size="large"
          fullwidth={true}
          disabled={!spaceForm.value.media || spaceForm.value.media.length === 0}
        />
      </View>

      {/* Media Picker Modal */}

      <MediaPickerModal
        visible={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onCameraRoll={recordVideo}
        onChoosePhoto={pickFromGallery}
        onTakePicture={takePicture}
      />
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
      marginBottom: RFValue(24),
    },
    gallerySection: {
      paddingVertical: RFValue(20),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
      marginBottom: RFValue(24),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    galleryHeader: {
      gap: 4,
    },
    galleryIconContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: RFValue(8),
    },
    galleryIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
      marginRight: RFValue(8),
    },
    galleryText: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
    clickText: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    uploadedHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: RFValue(16),
    },
    uploadedCount: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
    uploadMoreButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: RFValue(8),
      paddingHorizontal: RFValue(12),
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(8),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    uploadIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
      marginRight: RFValue(6),
    },
    uploadMoreText: {
      fontSize: RFValue(13),
      fontWeight: "500",
      color: colors.slate[650],
    },
    mediaGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: RFValue(4),
    },
    mediaItem: {
      width: "31%",
      aspectRatio: 0.75,
      borderRadius: RFValue(12),
      overflow: "hidden",
      position: "relative",
      backgroundColor: colors.slate[200],
    },
    mediaImage: {
      width: "100%",
      height: "100%",
    },
    removeButton: {
      position: "absolute",
      top: RFValue(2),
      right: RFValue(0),
      width: RFValue(24),
      height: RFValue(24),
      alignItems: "center",
      justifyContent: "center",
    },
    removeIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    videoBadge: {
      position: "absolute",
      bottom: RFValue(8),
      left: RFValue(8),
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderRadius: RFValue(4),
      padding: RFValue(4),
    },
    playIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: "#FFFFFF",
    },
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
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
      paddingHorizontal: RFValue(20),
      paddingTop: RFValue(12),
      paddingBottom: RFValue(32),
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
      textAlign: "center",
      marginBottom: RFValue(24),
    },
    mediaOptions: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    mediaOption: {
      alignItems: "center",
      gap: RFValue(12),
    },
    mediaOptionIconContainer: {
      width: RFValue(60),
      height: RFValue(60),
      borderRadius: RFValue(30),
      backgroundColor: colors.slate[150],
      alignItems: "center",
      justifyContent: "center",
    },
    mediaOptionIcon: {
      borderRadius: RFValue(8),
      width: RFValue(48),
      height: RFValue(48),
    },
    mediaOptionText: {
      fontSize: RFValue(13),
      color: colors.slate[650],
      fontWeight: "500",
    },
  });

export default MediaUploadSubstep;
