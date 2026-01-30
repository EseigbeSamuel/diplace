import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MediaPickerModal from "@/components/media-picker-modal";
import { useUser } from "@/contexts/user-context";

const EditProfile = () => {
  const { colors } = useTheme();
  const { userType } = useUser();
  const editProfileStyles = styles(colors);

  // Form state
  const [fullName, setFullName] = useState("Ibe Alex");
  const [businessName, setBusinessName] = useState("Atraz Palace");
  const [email, setEmail] = useState("ibealex@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState("+234-810-293-4980");
  const [city, setCity] = useState("Port Harcourt");
  const [address, setAddress] = useState(
    "15 Orukeri Street, Rumuibekwe, Port Harc..."
  );
  const [showMediaModal, setShowMediaModal] = useState(false);

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log("Saving changes...");
  };

  const handleRemovePhoto = () => {
    // Handle remove photo logic here
    console.log("Removing photo...");
  };

  const handleCityPress = () => {
    // Navigate to city selection screen
    console.log("Opening city selector...");
  };

  const handleCameraPress = () => {
    setShowMediaModal(true);
  };

  const handleTakePicture = () => {
    setShowMediaModal(false);
    // Open camera to take picture
    console.log("Opening camera...");
  };

  const handleChoosePhoto = () => {
    setShowMediaModal(false);
    // Open photo library
    console.log("Opening photo library...");
  };

  const handleCameraRoll = () => {
    setShowMediaModal(false);
    // Open camera roll
    console.log("Opening camera roll...");
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
          <View style={editProfileStyles.photoSection}>
            <View style={editProfileStyles.avatarContainer}>
              <Image
                source={require("@/assets/images/sammy.jpg")}
                style={editProfileStyles.avatar}
              />
              <Pressable
                style={editProfileStyles.cameraBadge}
                onPress={handleCameraPress}
              >
                <Image
                  source={require("@/assets/icons/Camera - Iconly Pro.png")}
                  style={editProfileStyles.cameraIcon}
                />
              </Pressable>
            </View>

            <Pressable onPress={handleRemovePhoto}>
              <View style={editProfileStyles.removePhotoButton}>
                <Image
                  source={require("@/assets/icons/delete.png")}
                  style={editProfileStyles.removeIcon}
                />
                <Text style={editProfileStyles.removeText}>Remove photo</Text>
              </View>
            </Pressable>
          </View>

          {/* Personal Information Section */}
          <View style={editProfileStyles.section}>
            {userType === "owner" && (
              <Text style={editProfileStyles.sectionTitle}>
                Personal Information
              </Text>
            )}
            {/* Full Name Input */}
            <View style={editProfileStyles.inputContainer}>
              <View style={editProfileStyles.inputIconContainer}>
                <Image
                  source={require("@/assets/icons/Profile - Iconly Pro.png")}
                  style={editProfileStyles.inputIcon}
                />
              </View>
              <View style={editProfileStyles.inputWrapper}>
                <Text style={editProfileStyles.inputLabel}>Full Name</Text>
                <TextInput
                  style={editProfileStyles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.slate[450]}
                />
              </View>
            </View>

            {/* Business Name Input */}
            {userType === "owner" && (
              <View style={editProfileStyles.inputContainer}>
                <View style={editProfileStyles.inputIconContainer}>
                  <Image
                    source={require("@/assets/icons/Work - Iconly Pro.png")}
                    style={editProfileStyles.inputIcon}
                  />
                </View>
                <View style={editProfileStyles.inputWrapper}>
                  <Text style={editProfileStyles.inputLabel}>
                    Business Name
                  </Text>
                  <TextInput
                    style={editProfileStyles.input}
                    value={businessName}
                    onChangeText={setBusinessName}
                    placeholder="Enter your business name"
                    placeholderTextColor={colors.slate[450]}
                  />
                </View>
              </View>
            )}

            {/* Email Input */}
            <View style={editProfileStyles.inputContainer}>
              <View style={editProfileStyles.inputIconContainer}>
                <Image
                  source={require("@/assets/icons/mail-outline-light.png")}
                  style={editProfileStyles.inputIcon}
                />
              </View>
              <View style={editProfileStyles.inputWrapper}>
                <Text style={editProfileStyles.inputLabel}>Email</Text>
                <TextInput
                  style={editProfileStyles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.slate[450]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Phone Number Input */}
            <View style={editProfileStyles.inputContainer}>
              <View style={editProfileStyles.inputIconContainer}>
                <Image
                  source={require("@/assets/icons/calling.png")}
                  style={editProfileStyles.inputIcon}
                />
              </View>
              <View style={editProfileStyles.inputWrapper}>
                <Text style={editProfileStyles.inputLabel}>Phone No.</Text>
                <TextInput
                  style={editProfileStyles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter your phone number"
                  placeholderTextColor={colors.slate[450]}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Location Section */}
          {userType === "owner" && (
            <View style={editProfileStyles.section}>
              <Text style={editProfileStyles.sectionTitle}>Location</Text>

              {/* City Selector */}
              <Pressable
                style={editProfileStyles.inputContainer}
                onPress={handleCityPress}
              >
                <View style={editProfileStyles.inputWrapper}>
                  <Text style={editProfileStyles.inputLabel}>City</Text>
                  <View style={editProfileStyles.selectableInput}>
                    <Text style={editProfileStyles.selectableText}>{city}</Text>
                    <Image
                      source={require("@/assets/icons/chevron-right.png")}
                      style={editProfileStyles.chevronIcon}
                    />
                  </View>
                </View>
              </Pressable>

              {/* Address Input */}
              <View style={editProfileStyles.inputContainer}>
                <View style={editProfileStyles.inputWrapper}>
                  <Text style={editProfileStyles.inputLabel}>Address</Text>
                  <TextInput
                    style={editProfileStyles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter your address"
                    placeholderTextColor={colors.slate[450]}
                    multiline
                  />
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAwareScrollView>

      {/* Save Button */}
      <View style={editProfileStyles.buttonContainer}>
        <AppButton
          title="Save changes"
          onPress={handleSaveChanges}
          size="large"
          fullwidth={true}
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
    photoSection: {
      alignItems: "center",
      paddingVertical: RFValue(24),
    },
    avatarContainer: {
      position: "relative",
      marginBottom: RFValue(16),
    },
    avatar: {
      width: RFValue(100),
      height: RFValue(100),
      borderRadius: RFValue(50),
    },
    cameraBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: colors.slate[200],
      width: RFValue(36),
      height: RFValue(36),
      borderRadius: RFValue(18),
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: colors.background,
    },
    cameraIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    removePhotoButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    removeIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.error[300],
      marginRight: RFValue(8),
    },
    removeText: {
      fontSize: RFValue(14),
      color: colors.error[300],
      fontWeight: "500",
    },
    section: {
      paddingTop: RFValue(24),
    },
    sectionTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(16),
    },
    inputContainer: {
      flexDirection: "row",
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
      padding: RFValue(16),
      marginBottom: RFValue(12),
      alignItems: "center",
    },
    inputIconContainer: {
      marginRight: RFValue(12),
    },
    inputIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
    inputWrapper: {
      flex: 1,
    },
    inputLabel: {
      fontSize: RFValue(12),
      color: colors.slate[500],
      marginBottom: RFValue(4),
    },
    input: {
      fontSize: RFValue(15),
      color: colors.slate[650],
      padding: 0,
      margin: 0,
    },
    selectableInput: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    selectableText: {
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    chevronIcon: {
      tintColor: colors.slate[600],
    },
    buttonContainer: {
      position: "fixed",
      bottom: 0,
      paddingBottom: RFValue(30),
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingBottom: RFValue(32),
    },
    modalHeader: {
      paddingVertical: RFValue(20),
      paddingHorizontal: RFValue(20),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
    },
    modalTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
      textAlign: "center",
    },
    mediaOptions: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: RFValue(20),
      paddingTop: RFValue(32),
      gap: RFValue(16),
    },
    mediaOption: {
      alignItems: "center",
      flex: 1,
    },
    mediaIconContainer: {
      width: RFValue(64),
      height: RFValue(64),
      borderRadius: RFValue(32),
      backgroundColor: colors.slate[200],
      alignItems: "center",
      justifyContent: "center",
      marginBottom: RFValue(12),
    },
    mediaIcon: {
      width: RFValue(28),
      height: RFValue(28),
      tintColor: colors.slate[650],
    },
    mediaOptionText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
    },
  });
