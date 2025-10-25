import React from "react";
import {
  Image,
  Linking,
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

const Support = () => {
  const { colors } = useTheme();
  const supportStyles = styles(colors);

  const handleChatWhatsApp = () => {
    // Open WhatsApp with specific number
    const phoneNumber = "2348127219718"; // Replace with your support number
    const message = "Hello, I need help with DrPlace";
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.log("WhatsApp is not installed");
          // Fallback to web WhatsApp
          Linking.openURL(
            `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
          );
        }
      })
      .catch((err) => console.error("Error opening WhatsApp:", err));
  };

  const handleSendEmail = () => {
    // Open email client
    const email = "support@drplace.com"; // Replace with your support email
    const subject = "Support Request";
    const body = "Hello DrPlace Support Team,\n\n";
    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch((err) =>
      console.error("Error opening email client:", err)
    );
  };

  const handleFAQs = () => {
    // Navigate to FAQs screen or open FAQ page
    console.log("Navigate to FAQs");
  };

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Support" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={supportStyles.container}>
          {/* Chat with DrPlace on WhatsApp */}
          <Pressable
            style={supportStyles.menuItem}
            onPress={handleChatWhatsApp}
          >
            <View style={supportStyles.menuItemLeft}>
              <View style={supportStyles.iconContainer}>
                <Image
                  source={require("@/assets/icons/Wallet - Iconly Pro-1.png")}
                  style={supportStyles.whatsappIcon}
                />
              </View>
              <Text style={supportStyles.menuText}>
                Chat with DrPlace on WhatsApp
              </Text>
            </View>
          </Pressable>

          {/* Send us an email */}
          <Pressable style={supportStyles.menuItem} onPress={handleSendEmail}>
            <View style={supportStyles.menuItemLeft}>
              <View style={supportStyles.iconContainer}>
                <Image
                  source={require("@/assets/icons/mail-outline-light.png")}
                  style={supportStyles.menuIcon}
                />
              </View>
              <Text style={supportStyles.menuText}>Send us an email</Text>
            </View>
          </Pressable>

          {/* FAQs */}
          <Pressable style={supportStyles.menuItem} onPress={handleFAQs}>
            <View style={supportStyles.menuItemLeft}>
              <View style={supportStyles.iconContainer}>
                <Image
                  source={require("@/assets/icons/chat.png")}
                  style={supportStyles.menuIcon}
                />
              </View>
              <Text style={supportStyles.menuText}>FAQs</Text>
            </View>
            <Image
              source={require("@/assets/icons/arrow-right-light.png")}
              style={supportStyles.chevronIcon}
            />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default Support;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: RFValue(16),
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
      flex: 1,
    },
    iconContainer: {
      width: RFValue(40),
      height: RFValue(40),
      borderRadius: RFValue(20),
      backgroundColor: colors.slate[150],
      alignItems: "center",
      justifyContent: "center",
      marginRight: RFValue(12),
    },
    menuIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    whatsappIcon: {
      width: RFValue(22),
      height: RFValue(22),
      tintColor: "#25D366", // WhatsApp green color
    },
    menuText: {
      fontSize: RFValue(15),
      color: colors.slate[650],
      flex: 1,
    },
    chevronIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
  });
