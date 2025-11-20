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

const Security = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const securityStyles = styles(colors);

  const handleChangePassword = () => {
    router.push("/views/profile/change-pass");
  };

  const handleForgotPassword = () => {
    // Navigate to Forgot Password screen
    console.log("Navigate to Forgot Password");
  };

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Security" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={securityStyles.container}>
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
              source={require("@/assets/icons/arrow-right-light.png")}
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
                source={require("@/assets/icons/Lock.png")}
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
    container: {
      paddingHorizontal: RFValue(3),
      paddingTop: RFValue(20),
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
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
  });
