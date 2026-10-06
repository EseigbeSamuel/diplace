import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import ViewHeader from "@/components/view-header";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

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
    return require("@/assets/icons/credit-card.png");
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
        <View  className="flex-1">
          {/* Cards List */}
          <View style={styles.cardsList}>
            {cards.map((card) => (
              <View key={card.id} style={styles.cardItem} className="flex-row items-center justify-between">
                <View style={styles.cardLeft} className="flex-row items-center flex-1">
                  <Image
                    source={getCardIcon(card.type)}
                    style={styles.cardTypeIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.cardNumber} className="font-medium">
                    {formatCardNumber(card.lastFour)}
                  </Text>
                  {card.active && (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText} className="font-semibold">Active</Text>
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
      <View style={styles.footer} className="absolute bottom-[0px] left-[0px] right-[0px]">
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

          onPress={() => setShowAddCardModal(false)}
         className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-end">
          <Pressable
            style={styles.addCardSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle}  className="self-center"/>

            <Text style={styles.modalTitle} className="font-bold text-center">Add new card</Text>
            <Text style={styles.modalSubtitle} className="text-center">
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
              <View style={styles.inputRow} className="flex-row">
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
              <View style={styles.securityNote} className="flex-row items-center justify-center">
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
    container: {},
    title: {fontSize: RFValue(24),
color: colors.slate[650],
marginBottom: RFValue(24)},
    cardsList: {
      gap: RFValue(12),
    },
    cardItem: {borderRadius: RFValue(12),
padding: RFValue(16)},
    cardLeft: {gap: RFValue(4)},
    cardTypeIcon: {
      width: RFValue(32),
      height: RFValue(24),
      marginRight: RFValue(4),
    },
    cardNumber: {fontSize: RFValue(14),
color: colors.slate[650]},
    activeBadge: {
      backgroundColor: colors.success[100],
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(4),
      borderRadius: RFValue(60),
    },
    activeBadgeText: {fontSize: RFValue(11),
color: colors.success[300]},
    deleteIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.error[200],
    },
    footer: {paddingHorizontal: RFValue(20),
paddingVertical: RFValue(16),
backgroundColor: colors.background},
    // Add Card Modal
    addCardOverlay: {},
    addCardSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(32),
    },
    modalHandle: {width: RFValue(40),
height: RFValue(4),
backgroundColor: colors.slate[300],
borderRadius: RFValue(2),
marginVertical: RFValue(12)},
    modalTitle: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(4)},
    modalSubtitle: {fontSize: RFValue(13),
color: colors.slate[500],
lineHeight: RFValue(18),
marginBottom: RFValue(24)},
    formContainer: {
      gap: RFValue(16),
    },
    inputContainer: {
      gap: RFValue(8),
    },
    inputLabel: {fontSize: RFValue(14),
color: colors.slate[650]},
    inputWrapper: {backgroundColor: colors.slate[150],
borderRadius: RFValue(12),
paddingHorizontal: RFValue(16),
borderColor: colors.slate[300]},
    input: {fontSize: RFValue(15),
color: colors.slate[650],
paddingVertical: RFValue(14)},
    inputIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
      marginLeft: RFValue(8),
    },
    inputRow: {gap: RFValue(12)},
    securityNote: {gap: RFValue(6),
paddingTop: RFValue(8)},
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
