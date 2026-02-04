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

const Security = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const securityStyles = styles(colors);

  const handleChangePassword = () => {
    router.push("/views/profile/change-pass");
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
    console.log("Navigate to Forgot Password");
  };

  return (
    <SafeAreaViewContainer>
      <ViewHeader title="Security" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/* Change Password */}
          <Pressable
            style={securityStyles.menuItem}
            onPress={handleChangePassword}
          >
            <View style={securityStyles.menuItemLeft}>
              <Image
                source={require("@/assets/icons/Lock.png")}
                style={securityStyles.menuIcon}
              />
              <Text style={securityStyles.menuText}>Change Password</Text>
            </View>
            <Image
              source={require("@/assets/icons/chevron-right.png")}
              style={securityStyles.chevronIcon}
            />
          </Pressable>

          {/* Forgot Password */}
          <Pressable
            style={securityStyles.menuItem}
            onPress={handleForgotPassword}
          >
            <View style={securityStyles.menuItemLeft}>
              <Image
                source={require("@/assets/icons/Danger Circle - Iconly Pro.png")}
                style={securityStyles.menuIcon}
              />
              <Text style={securityStyles.menuText}>Forgot Password</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default Security;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(8),
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
  });
