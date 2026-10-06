import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Alert,
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

const MAX_MEDIA_ITEMS = 8;

const MediaUploadSubstep: React.FC<MediaUploadSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { setValue, setType, spaceForm } = useSpaceStore();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isPickingMedia, setIsPickingMedia] = useState(false);
  const media = spaceForm.value.media ?? [];

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant photo library access to upload media.",
      );
      return false;
    }
    return true;
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant camera access to record media.");
      return false;
    }
    return true;
  };

  const handleOpenMediaPicker = () => {
    if (isPickingMedia) return;
    if (media.length >= MAX_MEDIA_ITEMS) {
      Alert.alert("Media limit reached", `You can add up to ${MAX_MEDIA_ITEMS} files.`);
      return;
    }
    setShowMediaPicker(true);
  };

  const pickFromGallery = async () => {
    setShowMediaPicker(false);
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission || isPickingMedia) return;

    setIsPickingMedia(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsMultipleSelection: true,
        selectionLimit: Math.max(1, MAX_MEDIA_ITEMS - media.length),
        orderedSelection: true,
        quality: 0.7,
        allowsEditing: false,
      });

      if (!result.canceled) {
        const newMedia: MediaItem[] = result.assets.map((asset) => ({
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
          id: Math.random().toString(36).substring(7),
        }));
        setValue({ media: [...media, ...newMedia] });
      }
    } finally {
      setIsPickingMedia(false);
    }
  };

  const takePicture = async () => {
    setShowMediaPicker(false);
    const hasPermission = await requestCameraPermission();
    if (!hasPermission || isPickingMedia) return;

    setIsPickingMedia(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.7,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const newMedia: MediaItem = {
          uri: result.assets[0].uri,
          type: "image",
          id: Math.random().toString(36).substring(7),
        };
        setValue({ media: [...media, newMedia] });
      }
    } finally {
      setIsPickingMedia(false);
    }
  };

  const recordVideo = async () => {
    setShowMediaPicker(false);
    const hasPermission = await requestCameraPermission();
    if (!hasPermission || isPickingMedia) return;

    setIsPickingMedia(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["videos"],
        quality: 0.7,
      });

      if (!result.canceled) {
        const newMedia: MediaItem = {
          uri: result.assets[0].uri,
          type: "video",
          id: Math.random().toString(36).substring(7),
        };
        setValue({ media: [...media, newMedia] });
      }
    } finally {
      setIsPickingMedia(false);
    }
  };

  const removeMedia = (id: string) => {
    setValue({
      media: media.filter((item) => item.id !== id),
    });
  };

  const handleNext = () => {
    if (media.length === 0) {
      Alert.alert(
        "Upload Required",
        "Please upload at least one photo or video",
      );
      return;
    }
    onNext();
  };

  return (
    <View style={styles.container} className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title} className="font-semibold">Upload photos and videos of the space.</Text>

        {/* Gallery Section */}
        {media.length < 1 && (
            <Pressable
              style={styles.gallerySection}
              onPress={handleOpenMediaPicker}
              disabled={isPickingMedia}
             className="flex-row items-center justify-between">
              <View  className="gap-[4px]">
                <Text style={styles.galleryText} className="font-semibold">Gallery</Text>

                <View style={styles.galleryIconContainer} className="flex-row items-center">
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
        {media.length > 0 && (
            <View style={styles.uploadedHeader} className="flex-row items-center justify-between">
              <Text style={styles.uploadedCount} className="font-semibold">
                {media.length} files uploaded
              </Text>
              <Pressable
                style={styles.uploadMoreButton}
                onPress={handleOpenMediaPicker}
                disabled={isPickingMedia}
               className="flex-row items-center border-[1px]">
                <Image
                  source={require("@/assets/icons/Upload - Iconly Pro.png")}
                  style={styles.uploadIcon}
                />
                <Text style={styles.uploadMoreText} className="font-medium">Upload new</Text>
              </Pressable>
            </View>
          )}

        {/* Media Grid */}
        {media.length > 0 && (
            <View style={styles.mediaGrid} className="flex-row flex-wrap">
              {media.map((item) => (
                  <View key={item.id} style={styles.mediaItem} className="w-[31%px] overflow-hidden relative aspect-ratio-[0.75px]">
                    {item.type === "image" ? (
                      <Image
                        source={{ uri: item.uri }}

                        resizeMode="cover"
                       className="w-[100%px] h-[100%px]"/>
                    ) : (
                      <View style={styles.videoPreview} className="flex-1 items-center justify-center">
                        <Image
                          source={require("@/assets/icons/Video - Iconly Pro.png")}
                          style={styles.videoPreviewIcon}
                        />
                      </View>
                    )}
                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removeMedia(item.id)}
                     className="absolute items-center justify-center">
                      <Image
                        source={require("@/assets/icons/close-contained.png")}
                        style={styles.removeIcon}
                      />
                    </Pressable>
                    {item.type === "video" && (
                      <View style={styles.videoBadge} className="absolute bg-[rgba(0, 0, 0, 0.6)]">
                        <Image
                          source={require("@/assets/icons/Video - Iconly Pro.png")}
                          style={styles.playIcon}
                         className="tint-[#FFFFFF]"/>
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
          disabled={media.length === 0}
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
    container: {backgroundColor: colors.background},
    scrollContent: {
      paddingTop: RFValue(32),
      paddingBottom: RFValue(20),
    },
    title: {fontSize: RFValue(20),
color: colors.slate[650],
lineHeight: RFValue(28),
marginBottom: RFValue(24)},
    gallerySection: {paddingVertical: RFValue(20),
paddingHorizontal: RFValue(16),
backgroundColor: colors.slate[200],
borderRadius: RFValue(12),
marginBottom: RFValue(24)},
    galleryHeader: {},
    galleryIconContainer: {marginBottom: RFValue(8)},
    galleryIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
      marginRight: RFValue(8),
    },
    galleryText: {fontSize: RFValue(15),
color: colors.slate[650]},
    clickText: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    uploadedHeader: {marginBottom: RFValue(16)},
    uploadedCount: {fontSize: RFValue(15),
color: colors.slate[650]},
    uploadMoreButton: {paddingVertical: RFValue(8),
paddingHorizontal: RFValue(12),
backgroundColor: colors.slate[150],
borderRadius: RFValue(8),
borderColor: colors.slate[300]},
    uploadIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
      marginRight: RFValue(6),
    },
    uploadMoreText: {fontSize: RFValue(13),
color: colors.slate[650]},
    mediaGrid: {gap: RFValue(4)},
    mediaItem: {borderRadius: RFValue(12),
backgroundColor: colors.slate[200]},
    mediaImage: {},
    videoPreview: {backgroundColor: colors.slate[300]},
    videoPreviewIcon: {
      width: RFValue(32),
      height: RFValue(32),
      tintColor: colors.slate[650],
    },
    removeButton: {top: RFValue(2),
right: RFValue(0),
width: RFValue(24),
height: RFValue(24)},
    removeIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    videoBadge: {bottom: RFValue(8),
left: RFValue(8),
borderRadius: RFValue(4),
padding: RFValue(4)},
    playIcon: {width: RFValue(16),
height: RFValue(16)},
    buttonContainer: {
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
    modalOverlay: {},
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
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
    mediaOptions: {},
    mediaOption: {gap: RFValue(12)},
    mediaOptionIconContainer: {width: RFValue(60),
height: RFValue(60),
borderRadius: RFValue(30),
backgroundColor: colors.slate[150]},
    mediaOptionIcon: {
      borderRadius: RFValue(8),
      width: RFValue(48),
      height: RFValue(48),
    },
    mediaOptionText: {fontSize: RFValue(13),
color: colors.slate[650]},
  });

export default MediaUploadSubstep;
