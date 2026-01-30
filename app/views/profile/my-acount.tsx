import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import ViewHeader from "@/components/view-header";

const MyAccount = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const accountStyles = styles(colors);

  const handleEditProfile = () => {
    router.push("/views/profile/edit-profile");
  };

  const handleVerifyAccount = () => {
    router.push("/onboarding/renter/steps/info");
  };

  const handleDeleteAccount = () => {
    // Show delete account confirmation dialog
    console.log("Show delete account confirmation");
  };

  return (
    <SafeAreaViewContainer>
      <ViewHeader title="My Account" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/* Edit Profile */}
          <Pressable style={accountStyles.menuItem} onPress={handleEditProfile}>
            <View style={accountStyles.menuItemLeft}>
              <Image
                source={require("@/assets/icons/edit-pencil.png")}
                style={accountStyles.menuIcon}
              />
              <Text style={accountStyles.menuText}>Edit Profile</Text>
            </View>
            <Image
              source={require("@/assets/icons/chevron-right.png")}
              style={accountStyles.chevronIcon}
            />
          </Pressable>

          {/* Verify Account */}
          <Pressable
            style={accountStyles.menuItem}
            onPress={handleVerifyAccount}
          >
            <View style={accountStyles.menuItemLeft}>
              <Image
                source={require("@/assets/icons/badge-check-1.png")}
                style={accountStyles.menuIcon}
              />
              <Text style={accountStyles.menuText}>Verify Account</Text>
            </View>
            <Pressable style={accountStyles.verifiedBadge}>
              <Image
                source={require("@/assets/icons/badge-check-green.png")}
                style={accountStyles.verifiedIcon}
              />
              <Text style={accountStyles.verifiedText}>Verified</Text>
            </Pressable>
          </Pressable>

          {/* Delete Account */}
          <Pressable
            style={accountStyles.menuItem}
            onPress={handleDeleteAccount}
          >
            <View style={accountStyles.menuItemLeft}>
              <Image
                source={require("@/assets/icons/Delete - Iconly Pro-1.png")}
                style={[accountStyles.menuIcon, accountStyles.deleteIcon]}
              />
              <Text style={accountStyles.deleteText}>Delete Account</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default MyAccount;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
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
    menuIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
      marginRight: RFValue(12),
    },
    menuText: {
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    chevronIcon: {
      tintColor: colors.slate[600],
    },
    verifiedBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.success[100],
      paddingHorizontal: RFValue(10),
      paddingVertical: RFValue(6),
      borderRadius: RFValue(60),
      gap: RFValue(4),
    },
    verifiedIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.success[300],
    },
    verifiedText: {
      fontSize: RFValue(13),
      color: colors.success[300],
      fontWeight: "500",
    },
    deleteIcon: {
      tintColor: colors.error[200],
    },
    deleteText: {
      fontSize: RFValue(15),
      color: colors.error[200],
    },
  });
