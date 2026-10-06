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
import ViewHeader from "@/components/view-header";

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
      <ViewHeader title="Support" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={supportStyles.container}>
          {/* Chat with DrPlace on WhatsApp */}
          <Pressable
            style={supportStyles.menuItem}
            onPress={handleChatWhatsApp}
           className="flex-row items-center justify-between">
            <View style={supportStyles.menuItemLeft} className="flex-row items-center flex-1">
              <View style={supportStyles.iconContainer} className="items-center justify-center">
                <Image
                  source={require("@/assets/icons/whatsapp-icon.png")}
                  style={supportStyles.whatsappIcon}
                />
              </View>
              <Text style={supportStyles.menuText} className="flex-1">
                Chat with DrPlace on WhatsApp
              </Text>
            </View>
          </Pressable>

          {/* Send us an email */}
          <Pressable style={supportStyles.menuItem} onPress={handleSendEmail} className="flex-row items-center justify-between">
            <View style={supportStyles.menuItemLeft} className="flex-row items-center flex-1">
              <View style={supportStyles.iconContainer} className="items-center justify-center">
                <Image
                  source={require("@/assets/icons/mail-outline-light.png")}
                  style={supportStyles.menuIcon}
                />
              </View>
              <Text style={supportStyles.menuText} className="flex-1">Send us an email</Text>
            </View>
          </Pressable>

          {/* FAQs */}
          <Pressable style={supportStyles.menuItem} onPress={handleFAQs} className="flex-row items-center justify-between">
            <View style={supportStyles.menuItemLeft} className="flex-row items-center flex-1">
              <View style={supportStyles.iconContainer} className="items-center justify-center">
                <Image
                  source={require("@/assets/icons/help-chat-2.png")}
                  style={supportStyles.menuIcon}
                />
              </View>
              <Text style={supportStyles.menuText} className="flex-1">FAQs</Text>
            </View>
            <Image
              source={require("@/assets/icons/chevron-right.png")}
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
      paddingHorizontal: RFValue(3),
    },
    menuItem: {



      paddingVertical: RFValue(8),
    },
    menuItemLeft: {



    },
    iconContainer: {
      width: RFValue(40),
      height: RFValue(40),
      borderRadius: RFValue(20),
      backgroundColor: colors.slate[150],


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
    },
    menuText: {
      fontSize: RFValue(15),
      color: colors.slate[650],

    },
    chevronIcon: {
      tintColor: colors.slate[600],
    },
  });
