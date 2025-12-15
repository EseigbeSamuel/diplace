import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import {
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
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const profileStyles = styles(colors);

  const menuItems = [
    {
      icon: require("@/assets/icons/Profile - Iconly Pro.png"),
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
      icon: require("@/assets/icons/bank-light.png"),
      label: "Payment Details",
      onPress: () => {
        router.push("/views/profile/payment-details");
      },
      showArrow: true,
    },
    {
      icon: require("@/assets/icons/credit-card.png"),
      label: "Your Reviews",
      onPress: () => {
        router.push("/views/profile/your-reviews");
      },
      showArrow: true,
    },
    {
      icon: require("@/assets/icons/chat-active.png"),
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
      icon: require("@/assets/icons/Shield Done-1.png"),
      label: "Security",
      onPress: () => {
        router.push("/views/profile/security");
      },
      showArrow: true,
    },
    {
      icon: require("@/assets/icons/Discovery - Iconly Pro-1.png"),
      label: "Dark mode",
      rightElement: (
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.slate[300], true: colors.info[200] }}
          thumbColor={colors.background}
        />
      ),
    },
    {
      icon: require("@/assets/icons/Lock-fill.png"),
      label: "Support",
      onPress: () => {
        router.push("/views/profile/support");
      },
      showArrow: true,
    },
    {
      icon: require("@/assets/icons/Login - Iconly Pro-1.png"),
      label: "Log out",
      onPress: () => {},
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
              source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
              style={profileStyles.avatar}
            />
            <Pressable style={profileStyles.editBadge}>
              <Image
                source={require("@/assets/icons/Camera - Iconly Pro-1.png")}
                style={profileStyles.editIcon}
              />
            </Pressable>
          </View>

          <View style={profileStyles.profileInfo}>
            <View style={profileStyles.nameContainer}>
              <Text style={profileStyles.name}>Ibe Alex</Text>
              <Image
                source={require("@/assets/icons/badge-check-green.png")}
                style={profileStyles.verifiedIcon}
              />
            </View>

            <View style={profileStyles.contactRow}>
              <Image
                source={require("@/assets/icons/chat.png")}
                style={profileStyles.contactIcon}
              />
              <Text style={profileStyles.contactText}>ibealex@gmail.com</Text>
            </View>

            <View style={profileStyles.contactRow}>
              <Image
                source={require("@/assets/icons/calling.png")}
                style={profileStyles.contactIcon}
              />
              <Text style={profileStyles.contactText}>+234 812 721 9718</Text>
            </View>
          </View>
        </View>

        {/* Upgrade Banner */}
        <Pressable style={profileStyles.upgradeBanner}>
          <View style={profileStyles.upgradeContent}>
            <Text style={profileStyles.upgradeTitle}>
              Upgrade to Featured Agent
            </Text>
            <Text style={profileStyles.upgradeDescription}>
              Boost your visibility and attract more renters faster. Featured
              Agents earn more with priority listings.
            </Text>
          </View>
          <Image
            source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
            style={profileStyles.arrowIcon}
          />
        </Pressable>

        {/* Menu Items */}
        <View style={profileStyles.menuContainer}>
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
                <View
                  style={[
                    profileStyles.iconContainer,
                    item.isLogout && profileStyles.logoutIconContainer,
                  ]}
                >
                  <Image source={item.icon} style={profileStyles.menuIcon} />
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
                  source={require("@/assets/icons/arrow-right-light.png")}
                  style={profileStyles.chevronIcon}
                />
              ) : null}
            </Pressable>
          ))}
        </View>

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
      paddingVertical: RFValue(24),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
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
      backgroundColor: colors.info[200],
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
      tintColor: "#FFFFFF",
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
      backgroundColor: colors.info[100],
      marginHorizontal: RFValue(16),
      marginVertical: RFValue(16),
      padding: RFValue(16),
      borderRadius: RFValue(12),
      flexDirection: "row",
      alignItems: "center",
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
    menuContainer: {
      paddingHorizontal: RFValue(4),
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
    },
    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      width: RFValue(40),
      height: RFValue(40),
      borderRadius: RFValue(8),
      backgroundColor: colors.slate[200],
      alignItems: "center",
      justifyContent: "center",
      marginRight: RFValue(12),
    },
    menuIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    menuLabel: {
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    chevronIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
    shareButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(6),
      borderRadius: RFValue(6),
      backgroundColor: colors.slate[200],
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
      backgroundColor: colors.error[100],
    },
    logoutLabel: {
      color: colors.error[300],
    },
    switchButtonContainer: {
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(24),
    },
  });
