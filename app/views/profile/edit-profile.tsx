import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MediaPickerModal from "@/components/media-picker-modal";
import { useUser } from "@/contexts/user-context";
import { useGetCurrentUser, useUpdateProfile } from "@/hooks";
import { uploadAssets } from "@/services/upload";

const splitFullName = (value: string) => {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ");

  return { firstName, lastName };
};

const EditProfile = () => {
  const { colors } = useTheme();
  const { userType } = useUser();
  const { currentUser, isCurrentUserLoading } = useGetCurrentUser();
  const { updateProfileMutation, updateProfilePending } = useUpdateProfile();
  const editProfileStyles = styles(colors);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const normalizeImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `https://diplace.api.elsoft.ng${url}`;
    return `https://diplace.api.elsoft.ng/${url}`;
  };
  const profileImageUrl = normalizeImageUrl(currentUser?.profile_picture);
  const displayedImageUrl = removePhoto
    ? null
    : selectedImageUri || profileImageUrl;
  const isSaving = updateProfilePending || isUploadingPhoto;
  const currentFullName = useMemo(
    () =>
      currentUser?.full_name?.trim() ||
      `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`.trim(),
    [currentUser],
  );

  useEffect(() => {
    if (!currentUser) return;

    setFullName(currentFullName);
    setEmail(currentUser.email || "");
    setPhoneNumber(currentUser.phone_number || "");
    setCity(currentUser.address?.city || "");
    setAddress(currentUser.address?.street || "");
    setSelectedImageUri(null);
    setRemovePhoto(false);
  }, [currentUser, currentFullName]);

  const requestMediaPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow photo library access to update your profile picture.",
      );
      return false;
    }

    return true;
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow camera access to take a profile picture.",
      );
      return false;
    }

    return true;
  };

  const handleSaveChanges = async () => {
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhoneNumber = phoneNumber.trim();
    const trimmedCity = city.trim();
    const trimmedAddress = address.trim();

    if (!trimmedFullName) {
      Alert.alert("Full Name Required", "Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      Alert.alert("Email Required", "Please enter your email address.");
      return;
    }

    const { firstName, lastName } = splitFullName(trimmedFullName);
    let avatarUrl: string | null | undefined;

    try {
      if (selectedImageUri) {
        setIsUploadingPhoto(true);
        const urls = await uploadAssets(
          [
            {
              uri: selectedImageUri,
              type: "image/jpeg",
              name: "profile-picture.jpg",
            },
          ],
          "profile-picture",
        );
        avatarUrl = urls[0];
      } else if (removePhoto) {
        avatarUrl = null;
      }

      await updateProfileMutation({
        first_name: firstName,
        last_name: lastName,
        email: trimmedEmail,
        phone_number: trimmedPhoneNumber,
        user_type: userType,
        ...(avatarUrl !== undefined ? { profile_picture: avatarUrl } : {}),
        address: {
          street: trimmedAddress,
          city: trimmedCity,
          state: currentUser?.address?.state || "",
          zip_code: currentUser?.address?.zip_code || "",
          country: currentUser?.address?.country || "Nigeria",
          latitude: currentUser?.address?.latitude || 0,
          longitude: currentUser?.address?.longitude || 0,
        },
      });

      setSelectedImageUri(null);
      setRemovePhoto(false);
    } catch {
      // Toast is handled by API/upload layers.
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedImageUri(null);
    setRemovePhoto(true);
  };

  const handleCameraPress = () => {
    setShowMediaModal(true);
  };

  const handleTakePicture = async () => {
    setShowMediaModal(false);
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
      setRemovePhoto(false);
    }
  };

  const handleChoosePhoto = async () => {
    setShowMediaModal(false);
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
      setRemovePhoto(false);
    }
  };

  const handleCameraRoll = () => {
    handleChoosePhoto();
  };

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="" />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <ScrollView>
          {/* Profile Photo Section */}
          <View style={editProfileStyles.photoSection} className="items-center">
            <View style={editProfileStyles.avatarContainer} className="relative">
              <Image
                source={
                  displayedImageUrl
                    ? { uri: displayedImageUrl }
                    : require("@/assets/images/user.png")
                }
                style={editProfileStyles.avatar}
              />
              <Pressable
                style={editProfileStyles.cameraBadge}
                onPress={handleCameraPress}
               className="absolute bottom-[0px] right-[0px] items-center justify-center border-[3px]">
                <Image
                  source={require("@/assets/icons/Camera - Iconly Pro.png")}
                  style={editProfileStyles.cameraIcon}
                />
              </Pressable>
            </View>

            <Pressable onPress={handleRemovePhoto}>
              <View  className="flex-row items-center">
                <Image
                  source={require("@/assets/icons/delete.png")}
                  style={editProfileStyles.removeIcon}
                />
                <Text style={editProfileStyles.removeText} className="font-medium">Remove photo</Text>
              </View>
            </Pressable>
          </View>

          {/* Personal Information Section */}
          <View style={editProfileStyles.section}>
            {userType === "agent" && (
              <Text style={editProfileStyles.sectionTitle} className="font-semibold">
                Personal Information
              </Text>
            )}
            {/* Full Name Input */}
            <View style={editProfileStyles.inputContainer} className="flex-row items-center">
              <View style={editProfileStyles.inputIconContainer}>
                <Image
                  source={require("@/assets/icons/Profile - Iconly Pro.png")}
                  style={editProfileStyles.inputIcon}
                />
              </View>
              <View  className="flex-1">
                <Text style={editProfileStyles.inputLabel}>Full Name</Text>
                <TextInput
                  style={editProfileStyles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.slate[450]}
                 className="p-[0px] m-[0px]"/>
              </View>
            </View>

            {/* Business Name Input */}
            {userType === "agent" && (
              <View style={editProfileStyles.inputContainer} className="flex-row items-center">
                <View style={editProfileStyles.inputIconContainer}>
                  <Image
                    source={require("@/assets/icons/Work - Iconly Pro.png")}
                    style={editProfileStyles.inputIcon}
                  />
                </View>
                <View  className="flex-1">
                  <Text style={editProfileStyles.inputLabel}>
                    Business Name
                  </Text>
                  <TextInput
                    style={editProfileStyles.input}
                    value={
                      currentUser?.agent_type === "business"
                        ? currentFullName
                        : ""
                    }
                    onChangeText={() => {}}
                    placeholder="Enter your business name"
                    placeholderTextColor={colors.slate[450]}
                    editable={false}
                   className="p-[0px] m-[0px]"/>
                </View>
              </View>
            )}

            {/* Email Input */}
            <View style={editProfileStyles.inputContainer} className="flex-row items-center">
              <View style={editProfileStyles.inputIconContainer}>
                <Image
                  source={require("@/assets/icons/mail-outline-light.png")}
                  style={editProfileStyles.inputIcon}
                />
              </View>
              <View  className="flex-1">
                <Text style={editProfileStyles.inputLabel}>Email</Text>
                <TextInput
                  style={editProfileStyles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.slate[450]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                 className="p-[0px] m-[0px]"/>
              </View>
            </View>

            {/* Phone Number Input */}
            <View style={editProfileStyles.inputContainer} className="flex-row items-center">
              <View style={editProfileStyles.inputIconContainer}>
                <Image
                  source={require("@/assets/icons/calling.png")}
                  style={editProfileStyles.inputIcon}
                />
              </View>
              <View  className="flex-1">
                <Text style={editProfileStyles.inputLabel}>Phone No.</Text>
                <TextInput
                  style={editProfileStyles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.slate[450]}
                  keyboardType="phone-pad"
                 className="p-[0px] m-[0px]"/>
              </View>
            </View>
          </View>

          {/* Location Section */}
          {userType === "agent" && (
            <View style={editProfileStyles.section}>
              <Text style={editProfileStyles.sectionTitle} className="font-semibold">Location</Text>

              {/* City Input */}
              <View style={editProfileStyles.inputContainer} className="flex-row items-center">
                <View  className="flex-1">
                  <Text style={editProfileStyles.inputLabel}>City</Text>
                  <TextInput
                    style={editProfileStyles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="Enter your city"
                    placeholderTextColor={colors.slate[450]}
                   className="p-[0px] m-[0px]"/>
                </View>
              </View>

              {/* Address Input */}
              <View style={editProfileStyles.inputContainer} className="flex-row items-center">
                <View  className="flex-1">
                  <Text style={editProfileStyles.inputLabel}>Address</Text>
                  <TextInput
                    style={editProfileStyles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter your address"
                    placeholderTextColor={colors.slate[450]}
                    multiline
                   className="p-[0px] m-[0px]"/>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAwareScrollView>

      {/* Save Button */}
      <View  className="bottom-[0px] position-[fixed]">
        <AppButton
          title={isSaving ? "Saving changes..." : "Save changes"}
          onPress={handleSaveChanges}
          size="large"
          fullwidth={true}
          disabled={isSaving || isCurrentUserLoading}
        />
      </View>

      {/* Media Selection Modal */}
      <MediaPickerModal
        visible={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onCameraRoll={handleCameraRoll}
        onChoosePhoto={handleChoosePhoto}
        onTakePicture={handleTakePicture}
      />
    </SafeAreaViewContainer>
  );
};

export default EditProfile;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    photoSection: {paddingVertical: RFValue(24)},
    avatarContainer: {marginBottom: RFValue(16)},
    avatar: {
      width: RFValue(100),
      height: RFValue(100),
      borderRadius: RFValue(50),
    },
    cameraBadge: {backgroundColor: colors.slate[200],
width: RFValue(36),
height: RFValue(36),
borderRadius: RFValue(18),
borderColor: colors.background},
    cameraIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    removePhotoButton: {},
    removeIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.error[300],
      marginRight: RFValue(8),
    },
    removeText: {fontSize: RFValue(14),
color: colors.error[300]},
    section: {
      paddingTop: RFValue(24),
    },
    sectionTitle: {fontSize: RFValue(16),
color: colors.slate[650],
marginBottom: RFValue(16)},
    inputContainer: {backgroundColor: colors.slate[200],
borderRadius: RFValue(12),
padding: RFValue(16),
marginBottom: RFValue(12)},
    inputIconContainer: {
      marginRight: RFValue(12),
    },
    inputIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
    inputWrapper: {},
    inputLabel: {
      fontSize: RFValue(12),
      color: colors.slate[500],
      marginBottom: RFValue(4),
    },
    input: {fontSize: RFValue(15),
color: colors.slate[650]},
    buttonContainer: {},
    modalOverlay: {},
    modalBackdrop: {},
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingBottom: RFValue(32),
    },
    modalHeader: {paddingVertical: RFValue(20),
paddingHorizontal: RFValue(20),
borderBottomColor: colors.slate[300]},
    modalTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    mediaOptions: {paddingHorizontal: RFValue(20),
paddingTop: RFValue(32),
gap: RFValue(16)},
    mediaOption: {},
    mediaIconContainer: {width: RFValue(64),
height: RFValue(64),
borderRadius: RFValue(32),
backgroundColor: colors.slate[200],
marginBottom: RFValue(12)},
    mediaIcon: {
      width: RFValue(28),
      height: RFValue(28),
      tintColor: colors.slate[650],
    },
    mediaOptionText: {fontSize: RFValue(14),
color: colors.slate[650]},
  });
