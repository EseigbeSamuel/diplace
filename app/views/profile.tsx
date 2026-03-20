import MediaPickerModal from "@/components/media-picker-modal";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { useUser } from "@/contexts/user-context";
import { useGetCurrentUser, useLogout } from "@/hooks";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const Profile = () => {
  const router = useRouter();
  const { userType, setUserType } = useUser();
  const { currentUser } = useGetCurrentUser();
  const { logoutMutation, logoutMutationPending } = useLogout();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const profileStyles = styles(colors);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const normalizeImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `https://diplace.api.elsoft.ng${url}`;
    return `https://diplace.api.elsoft.ng/${url}`;
  };

  const profileImageUrl = normalizeImageUrl(currentUser?.profile_picture);
  const profileName =
    currentUser?.full_name?.trim() ||
    `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`.trim() ||
    "User";
  const profileEmail = currentUser?.email || "No email";
  const profilePhone = currentUser?.phone_number || "No phone number";

  const menuItems =
    userType === "agent"
      ? [
          {
            icon: require("@/assets/icons/user-icon.png"),
            label: "My Account",
            onPress: () => {
              router.push("/views/profile/my-acount");
            },
            showArrow: true,
          },
          {
            icon: require("@/assets/icons/money-bag.png"),
            label: "My Earnings",
            onPress: () => {
              router.push("/views/profile/my-earnings");
            },
            showArrow: true,
          },
          {
            icon: require("@/assets/icons/bank-emoji.png"),
            label: "Payment Details",
            onPress: () => {
              router.push("/views/profile/payment-details");
            },
            showArrow: true,
          },
          {
            icon: require("@/assets/icons/reviews.png"),
            label: "Your Reviews",
            onPress: () => {
              router.push("/views/profile/your-reviews");
            },
            showArrow: true,
          },
          {
            icon: require("@/assets/icons/interaction.png"),
            label: "Refer a Friend",
            onPress: () => {},
            rightElement: (
              <Pressable style={profileStyles.shareButton}>
                <Image
                  source={require("@/assets/icons/share-solid.png")}
                  style={profileStyles.smallIcon}
                />
                <Text style={profileStyles.shareText}>Share link</Text>
              </Pressable>
            ),
          },
          {
            icon: require("@/assets/icons/shield-icon.png"),
            label: "Security",
            onPress: () => {
              router.push("/views/profile/security");
            },
            showArrow: true,
          },
          {
            icon: require("@/assets/icons/brush-icon.png"),
            label: "Dark mode",
            rightElement: (
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{
                  false: colors.slate[300],
                  true: colors.info[200],
                }}
                thumbColor={colors.background}
              />
            ),
          },
          {
            icon: require("@/assets/icons/help-icon.png"),
            label: "Support",
            onPress: () => {
              router.push("/views/profile/support");
            },
            showArrow: true,
          },
          {
            icon: require("@/assets/icons/logout.png"),
            label: "Log out",
            onPress: () => {
              Alert.alert("Logout", "Are you sure you want to log out", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Log Out",
                  onPress: async () => {
                    if (logoutMutationPending) return;
                    await logoutMutation();
                    setUserType("renter");
                  },
                  style: "destructive",
                },
              ]);
            },
            isLogout: true,
          },
        ]
      : [
          {
            icon: require("@/assets/icons/user-icon.png"),
            label: "My Account",
            onPress: () => {
              router.push("/views/profile/my-acount");
            },
            showArrow: true,
          },
          {
            icon: require("@/assets/icons/bookmark-active-dark.png"),
            label: "Bookmarks",
            onPress: () => {
              router.push("/views/profile/bookmarks");
            },
            showArrow: true,
          },

          {
            icon: require("@/assets/icons/interaction.png"),
            label: "Refer a Friend",
            onPress: () => {},
            rightElement: (
              <Pressable style={profileStyles.shareButton}>
                <Image
                  source={require("@/assets/icons/share-solid.png")}
                  style={profileStyles.smallIcon}
                />
                <Text style={profileStyles.shareText}>Share link</Text>
              </Pressable>
            ),
          },
          {
            icon: require("@/assets/icons/credit-card.png"),
            label: "Card Details",
            onPress: () => {
              router.push("/views/profile/card-details");
            },
            showArrow: true,
          },
          {
            icon: require("@/assets/icons/shield-icon.png"),
            label: "Security",
            onPress: () => {
              router.push("/views/profile/security");
            },
            showArrow: true,
          },
          {
            icon: require("@/assets/icons/brush-icon.png"),
            label: "Dark mode",
            rightElement: (
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{
                  false: colors.slate[300],
                  true: colors.info[200],
                }}
                thumbColor={colors.background}
              />
            ),
          },
          {
            icon: require("@/assets/icons/help-icon.png"),
            label: "Support",
            onPress: () => {
              router.push("/views/profile/support");
            },
            showArrow: true,
          },
          {
            icon: require("@/assets/icons/logout.png"),
            label: "Log out",
            onPress: () => {
              Alert.alert("Logout", "Are you sure you want to log out", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Log Out",
                  onPress: async () => {
                    if (logoutMutationPending) return;
                    await logoutMutation();
                    setUserType("renter");
                  },
                  style: "destructive",
                },
              ]);
            },
            isLogout: true,
          },
        ];

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={profileStyles.profileHeader}>
          <View style={profileStyles.avatarContainer}>
            <Image
              source={
                profileImageUrl
                  ? { uri: profileImageUrl }
                  : require("@/assets/images/user.png")
              }
              style={profileStyles.avatar}
            />
            <Pressable
              style={profileStyles.editBadge}
              onPress={() => setShowMediaModal(true)}
            >
              <Image
                source={require("@/assets/icons/Camera - Iconly Pro.png")}
                style={profileStyles.editIcon}
              />
            </Pressable>
          </View>

          <View style={profileStyles.profileInfo}>
            <View style={profileStyles.nameContainer}>
              <Text style={profileStyles.name}>{profileName}</Text>
              <Image
                source={require("@/assets/icons/badge-check-green.png")}
                style={profileStyles.verifiedIcon}
              />
            </View>

            <View style={profileStyles.contactRow}>
              <Image
                source={require("@/assets/icons/mail-outline-light.png")}
                style={profileStyles.contactIcon}
              />
              <Text style={profileStyles.contactText}>{profileEmail}</Text>
            </View>

            <View style={profileStyles.contactRow}>
              <Image
                source={require("@/assets/icons/calling.png")}
                style={profileStyles.contactIcon}
              />
              <Text style={profileStyles.contactText}>{profilePhone}</Text>
            </View>
          </View>
        </View>

        {/* Upgrade Banner */}
        <Pressable style={profileStyles.upgradeBanner}>
          <View style={profileStyles.upgradeContent}>
            <Text style={profileStyles.upgradeTitle}>
              {userType === "agent"
                ? "Upgrade to Featured Agent"
                : "Earn as a Space Manager / Agent"}
            </Text>
            <Text style={profileStyles.upgradeDescription}>
              {userType === "agent"
                ? "Boost your visibility and attract more renters faster. Featured Agents earn more with priority listings."
                : "Become an agent or space manager, list properties and earn commissions"}
            </Text>
          </View>
          <Image
            source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
            style={profileStyles.arrowIcon}
          />
        </Pressable>

        {/* Menu Items */}
        <View>
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              style={[
                profileStyles.menuItem,
                item.isLogout && profileStyles.logoutItem,
              ]}
              onPress={item.onPress}
            >
              <View style={profileStyles.menuItemLeft}>
                <View style={[profileStyles.iconContainer]}>
                  <Image
                    source={item.icon}
                    style={[
                      profileStyles.menuIcon,
                      item.isLogout && profileStyles.logoutIconContainer,
                    ]}
                  />
                </View>
                <Text
                  style={[
                    profileStyles.menuLabel,
                    item.isLogout && profileStyles.logoutLabel,
                  ]}
                >
                  {item.label}
                </Text>
              </View>

              {item.rightElement ? (
                item.rightElement
              ) : item.showArrow ? (
                <Image
                  source={require("@/assets/icons/chevron-right.png")}
                  style={profileStyles.chevronIcon}
                />
              ) : null}
            </Pressable>
          ))}
        </View>
        <MediaPickerModal
          visible={showMediaModal}
          onClose={() => setShowMediaModal(false)}
          onCameraRoll={() => {}}
          onChoosePhoto={() => {}}
          onTakePicture={() => {}}
        />

        {/* Switch to Renter Mode Button */}
        {/* <View style={profileStyles.switchButtonContainer}>
          <AppButton
            title="Switch to Renter Mode"
            onPress={() => router.push("/(tabs)/spaces")}
            size="large"
            variant="secondary"
            beforeIcon={require("@/assets/icons/resize-bottom-right.png")}
          />
        </View> */}
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default Profile;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    profileHeader: {
      alignItems: "center",
      paddingVertical: RFValue(16),
    },
    avatarContainer: {
      position: "relative",
      marginBottom: RFValue(12),
    },
    avatar: {
      width: RFValue(80),
      height: RFValue(80),
      borderRadius: RFValue(40),
    },
    editBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: colors.slate[200],
      width: RFValue(28),
      height: RFValue(28),
      borderRadius: RFValue(14),
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: colors.background,
    },
    editIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[600],
    },
    profileInfo: {
      alignItems: "center",
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: RFValue(8),
    },
    name: {
      fontSize: RFValue(20),
      fontWeight: "600",
      color: colors.slate[650],
      marginRight: RFValue(6),
    },
    verifiedIcon: {
      width: RFValue(18),
      height: RFValue(18),
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: RFValue(4),
    },
    contactIcon: {
      width: RFValue(16),
      height: RFValue(16),
      marginRight: RFValue(8),
      tintColor: colors.slate[500],
    },
    contactText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    upgradeBanner: {
      backgroundColor: colors.slate[200],

      marginBottom: RFValue(16),
      padding: RFValue(16),
      borderRadius: RFValue(12),
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    upgradeContent: {
      flex: 1,
      marginRight: RFValue(12),
    },
    upgradeTitle: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(4),
    },
    upgradeDescription: {
      fontSize: RFValue(12),
      color: colors.slate[600],
      lineHeight: RFValue(18),
    },
    arrowIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },

    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
    },
    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      width: RFValue(40),
      height: RFValue(40),
      alignItems: "center",
      justifyContent: "center",
      marginRight: RFValue(12),
    },
    menuIcon: {
      width: RFValue(26),
      height: RFValue(26),
    },
    menuLabel: {
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    chevronIcon: {
      tintColor: colors.slate[600],
      marginRight: RFValue(4),
    },
    shareButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(6),
    },
    smallIcon: {
      width: RFValue(14),
      height: RFValue(14),
      marginRight: RFValue(6),
      tintColor: colors.slate[650],
    },
    shareText: {
      fontSize: RFValue(13),
      color: colors.slate[650],
    },
    logoutItem: {
      borderBottomWidth: 0,
    },
    logoutIconContainer: {
      tintColor: colors.error[200],
    },
    logoutLabel: {
      color: colors.error[300],
    },
    switchButtonContainer: {
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(24),
    },
  });
