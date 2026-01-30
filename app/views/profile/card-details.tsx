import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import AppButton from "@/components/button";
import TextField from "@/components/textfield";
import ViewHeader from "@/components/view-header";
import SectionHeader from "@/components/sectionheader";

type Card = {
  id: string;
  type: "mastercard" | "visa";
  lastFour: string;
  active?: boolean;
};

const cardsData: Card[] = [
  {
    id: "1",
    type: "mastercard",
    lastFour: "4564",
    active: true,
  },
  {
    id: "2",
    type: "visa",
    lastFour: "4564",
  },
];

const CardDetailsScreen = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const styles = getStyles(colors);

  const [cards, setCards] = useState<Card[]>(cardsData);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const handleAddCard = () => {
    // Handle add card logic
    setShowAddCardModal(false);
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
  };

  const getCardIcon = (type: "mastercard" | "visa") => {
    if (type === "mastercard") {
      return require("@/assets/icons/mastercard.png");
    }
    return require("@/assets/icons/credit-card emoji.png");
  };

  const formatCardNumber = (number: string) => {
    return `5236${"*".repeat(8)}${number}`;
  };

  return (
    <SafeAreaViewContainer>
      {/* Header */}
      <ViewHeader title="Card Details" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Cards List */}
          <View style={styles.cardsList}>
            {cards.map((card) => (
              <View key={card.id} style={styles.cardItem}>
                <View style={styles.cardLeft}>
                  <Image
                    source={getCardIcon(card.type)}
                    style={styles.cardTypeIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.cardNumber}>
                    {formatCardNumber(card.lastFour)}
                  </Text>
                  {card.active && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>Active</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={() => handleDeleteCard(card.id)}>
                  <Image
                    source={require("@/assets/icons/delete.png")}
                    style={styles.deleteIcon}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add New Card Button - Fixed at Bottom */}
      <View style={styles.footer}>
        <AppButton
          title="Add new card"
          onPress={() => setShowAddCardModal(true)}
          variant="primary"
          fullwidth
          beforeIcon={
            isDarkMode
              ? require("@/assets/icons/plus.png")
              : require("@/assets/icons/plus-white.png")
          }
        />
      </View>

      {/* Add Card Modal */}
      <Modal
        visible={showAddCardModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddCardModal(false)}
      >
        <Pressable
          style={styles.addCardOverlay}
          onPress={() => setShowAddCardModal(false)}
        >
          <Pressable
            style={styles.addCardSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Add new card</Text>
            <Text style={styles.modalSubtitle}>
              Fill card details to add new card.
            </Text>

            <View style={styles.formContainer}>
              {/* Card Number */}

              <TextField
                label="Card Number"
                onChange={(text) => setCardNumber(text.toString())}
                value={cardNumber}
                icon={require("@/assets/icons/Bank Card - Iconly Pro-1.png")}
                placeholder="1234 5678 1234 5678"
              />

              {/* Expiry Date and CVV */}
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <TextField
                    label="Expiry Date"
                    onChange={(text) => setExpiryDate(text.toString())}
                    value={expiryDate}
                    placeholder="1"
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <TextField
                    label="CVV"
                    onChange={(text) => setCvv(text.toString())}
                    value={cvv}
                    icon={require("@/assets/icons/Danger Circle - Iconly Pro.png")}
                    placeholder="1234 5678 1234 5678"
                  />
                </View>
              </View>

              {/* Save Button */}
              <AppButton
                title="Save"
                onPress={handleAddCard}
                disabled={!cardNumber || !expiryDate || !cvv}
              />

              {/* Security Note */}
              <View style={styles.securityNote}>
                <Text style={styles.securityNoteText}>
                  🔐 Your details is 100% secure
                </Text>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaViewContainer>
  );
};

export default CardDetailsScreen;

const getStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    header: {
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(8),
    },
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    scrollContent: {
      paddingBottom: RFValue(100),
    },
    container: {
      flex: 1,
    },
    title: {
      fontSize: RFValue(24),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(24),
    },
    cardsList: {
      gap: RFValue(12),
    },
    cardItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: RFValue(12),
      padding: RFValue(16),
    },
    cardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(4),
      flex: 1,
    },
    cardTypeIcon: {
      width: RFValue(32),
      height: RFValue(24),
      marginRight: RFValue(4),
    },
    cardNumber: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    activeBadge: {
      backgroundColor: colors.success[100],
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(4),
      borderRadius: RFValue(60),
    },
    activeBadgeText: {
      fontSize: RFValue(11),
      fontWeight: "600",
      color: colors.success[300],
    },
    deleteIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.error[200],
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
    // Add Card Modal
    addCardOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    addCardSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(32),
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginVertical: RFValue(12),
    },
    modalTitle: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[650],
      textAlign: "center",
      marginBottom: RFValue(4),
    },
    modalSubtitle: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      textAlign: "center",
      lineHeight: RFValue(18),
      marginBottom: RFValue(24),
    },
    formContainer: {
      gap: RFValue(16),
    },
    inputContainer: {
      gap: RFValue(8),
    },
    inputLabel: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      paddingHorizontal: RFValue(16),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    input: {
      flex: 1,
      fontSize: RFValue(15),
      color: colors.slate[650],
      paddingVertical: RFValue(14),
    },
    inputIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
      marginLeft: RFValue(8),
    },
    inputRow: {
      flexDirection: "row",
      gap: RFValue(12),
    },
    securityNote: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: RFValue(6),
      paddingTop: RFValue(8),
    },
    shieldIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.success[200],
    },
    securityNoteText: {
      fontSize: RFValue(12),
      color: colors.slate[600],
    },
  });
