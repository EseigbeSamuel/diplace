import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { mockMessages } from "@/constants/mockMessages";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

// Message types
interface Message {
  id: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  type?: "text" | "property" | "system";
  replyTo?: string;
  propertyData?: {
    title: string;
    price: string;
    location: string;
    image: string;
  };
}

// Contact info
const contactInfo = {
  name: "Sarhmy Kalu",
  status: "Active now",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  isVerified: true,
};

interface MessageItemProps {
  item: Message;
  colors: ColorScheme;
  messages: Message[];
}

// System message (date separator)
const SystemMessage = ({
  text,
  colors,
}: {
  text: string;
  colors: ColorScheme;
}) => (
  <View style={styles.systemMessageContainer}>
    <Text style={[styles.systemMessageText, { color: colors.slate[500] }]}>
      {text}
    </Text>
  </View>
);

// Property card message
const PropertyMessage = ({
  item,
  colors,
}: {
  item: Message;
  colors: ColorScheme;
}) => (
  <View style={styles.propertyMessageContainer}>
    <View
      style={[
        styles.propertyContainer,
        { backgroundColor: colors.background },
        {
          shadowColor: colors.slate[400],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        },
      ]}
    >
      <View
        style={[
          styles.propertyContent,
          { borderLeftColor: colors.info[200], borderLeftWidth: 5 },
        ]}
      >
        <View>
          <Image
            source={{ uri: item.propertyData?.image }}
            style={styles.propertyImage}
          />
        </View>
        <View>
          <Text style={[styles.propertyTitle, { color: colors.slate[650] }]}>
            {item.propertyData?.title}
          </Text>
          <Text style={[styles.propertyLocation, { color: colors.slate[500] }]}>
            {item.propertyData?.location}
          </Text>
          <Text style={[styles.propertyPrice, { color: colors.slate[650] }]}>
            {item.propertyData?.price}{" "}
            <Text
              style={[styles.propertyPriceUnit, { color: colors.slate[500] }]}
            >
              / month
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.propertyActions}>
        <TouchableOpacity
          style={[
            styles.propertyButton,
            styles.viewDetailsButton,
            {
              borderColor: colors.slate[300],
              backgroundColor: colors.slate[300],
            },
          ]}
        >
          <Text
            style={[styles.propertyButtonText, { color: colors.slate[650] }]}
          >
            View details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.propertyButton,
            styles.rentButton,
            { borderWidth: 1, backgroundColor: colors.slate[650] },
          ]}
        >
          <Text
            style={[styles.propertyButtonText, { color: colors.slate[100] }]}
          >
            Hold for renter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// Reply preview component
const ReplyPreview = ({
  replyToId,
  messages,
  colors,
}: {
  replyToId: string;
  messages: Message[];
  colors: ColorScheme;
}) => {
  const replyMessage = messages.find((msg) => msg.id === replyToId);
  if (!replyMessage) return null;

  return (
    <View
      style={[
        styles.replyContainer,
        {
          borderLeftColor: colors.info[200],
          backgroundColor: colors.slate[150],
        },
      ]}
    >
      <Text style={[styles.replyText, { color: colors.slate[500] }]}>
        {replyMessage.text.length > 50
          ? `${replyMessage.text.substring(0, 50)}...`
          : replyMessage.text}
      </Text>
    </View>
  );
};

// Regular text message
const TextMessage = ({ item, colors, messages }: MessageItemProps) => (
  <View
    style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.otherMessageContainer,
    ]}
  >
    <View style={styles.messageBubbleContainer}>
      <View
        style={[
          styles.messageBubble,
          item.isUser
            ? [styles.userMessageBubble, { backgroundColor: colors.slate[250] }]
            : [
                styles.otherMessageBubble,
                { backgroundColor: colors.slate[650] },
              ],
        ]}
      >
        {item.replyTo && (
          <ReplyPreview
            replyToId={item.replyTo}
            messages={messages}
            colors={colors}
          />
        )}
        <Text
          style={[
            styles.messageText,
            { color: item.isUser ? colors.slate[650] : colors.background },
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.messageTime,
            { color: colors.slate[500] },
            item.isUser ? styles.userMessageTime : styles.otherMessageTime,
          ]}
        >
          {item.timestamp}
        </Text>
      </View>
    </View>
  </View>
);

const MessageItem: React.FC<MessageItemProps> = ({
  item,
  colors,
  messages,
}) => {
  if (item.type === "system") {
    return <SystemMessage text={item.text} colors={colors} />;
  }

  if (item.type === "property") {
    return <PropertyMessage item={item} colors={colors} />;
  }

  return <TextMessage item={item} colors={colors} messages={messages} />;
};

const ChatPage = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const router = useRouter();

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isUser: true,
      replyTo: replyTo || undefined,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");
    setReplyTo(null);

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        "Thanks for your message!",
        "I'll get back to you shortly.",
        "Let me check on that for you.",
        "That sounds great!",
        "I understand your concern.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isUser: false,
      };

      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageItem item={item} colors={colors} messages={messages} />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.slate[200],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={require("@/assets/icons/arrow-left-dark.png")}
            style={{ width: 25, height: 20 }}
          />
        </TouchableOpacity>

        <View style={styles.contactInfo}>
          <Image
            source={{ uri: contactInfo.avatar }}
            style={styles.contactAvatar}
          />
          <View style={styles.contactDetails}>
            <View style={styles.contactNameContainer}>
              <Text style={[styles.contactName, { color: colors.slate[650] }]}>
                {contactInfo.name}
              </Text>
              {contactInfo.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Image
                    source={require("@/assets/icons/badge-check-green.png")}
                  />
                </View>
              )}
            </View>
            <Text
              style={[styles.contactStatus, { color: colors.success[200] }]}
            >
              {contactInfo.status}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Image
              source={require("@/assets/icons/phone-keypad.png")}
              style={{ height: 25, width: 25 }}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text
              style={[styles.headerButtonIcon, { color: colors.slate[650] }]}
            >
              ⋮
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Reply Preview */}
      {replyTo && (
        <View
          style={[
            styles.replyPreviewContainer,
            {
              backgroundColor: colors.slate[100],
              borderTopColor: colors.slate[200],
            },
          ]}
        >
          <View style={styles.replyPreviewContent}>
            <Text
              style={[styles.replyPreviewLabel, { color: colors.slate[500] }]}
            >
              Replying to:
            </Text>
            <Text
              style={[styles.replyPreviewText, { color: colors.slate[650] }]}
            >
              {messages
                .find((msg) => msg.id === replyTo)
                ?.text?.substring(0, 60)}
              ...
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setReplyTo(null)}
            style={styles.cancelReplyButton}
          >
            <Text
              style={[styles.cancelReplyText, { color: colors.slate[500] }]}
            >
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.slate[200],
          },
        ]}
      >
        <View style={[styles.inputRow, { backgroundColor: colors.slate[150] }]}>
          <TextInput
            style={[styles.textInput, { color: colors.slate[650] }]}
            placeholder="Message"
            placeholderTextColor={colors.slate[500]}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton]}
            onPress={sendMessage}
            disabled={inputText.trim().length === 0}
          >
            <Image
              source={require("@/assets/icons/Send - Iconly Pro.png")}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    paddingRight: 12,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: "600",
  },
  contactInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 6,
  },
  verifiedBadge: {
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedIcon: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  contactStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonIcon: {
    fontSize: 20,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  systemMessageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  systemMessageText: {
    fontSize: 12,
    fontWeight: "500",
  },
  propertyMessageContainer: {
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  propertyContainer: {
    borderRadius: 16,
    paddingRight: 4,
    overflow: "hidden",
    maxWidth: screenWidth * 1.75,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  propertyImage: {
    width: 65,
    height: 70,
    borderRadius: 10,
    resizeMode: "cover",
    marginRight: 5,
  },
  propertyContent: {
    paddingLeft: 6,
    display: "flex",
    flexDirection: "row",
    paddingBlock: 5,
    borderRadius: 6,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 20,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  propertyPriceUnit: {
    fontSize: 14,
    fontWeight: "400",
  },
  propertyLocation: {
    fontSize: 11,
    marginBottom: 4,
    lineHeight: 16,
  },
  propertyActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  propertyButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  viewDetailsButton: {
    borderWidth: 1,
  },
  rentButton: {
    // Background color set inline
  },
  propertyButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  propertyMessageTime: {
    fontSize: 11,
    marginTop: 4,
    marginLeft: 8,
  },
  messageContainer: {
    marginHorizontal: 16,
    marginVertical: 3,
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
  },
  messageBubbleContainer: {
    maxWidth: screenWidth * 0.75,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userMessageBubble: {
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 2,
  },
  userMessageTime: {
    textAlign: "right",
  },
  otherMessageTime: {
    textAlign: "left",
  },
  replyContainer: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 6,
    marginBottom: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  replyText: {
    fontSize: 13,
    fontStyle: "italic",
  },
  replyPreviewContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  replyPreviewContent: {
    flex: 1,
  },
  replyPreviewLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  replyPreviewText: {
    fontSize: 13,
  },
  cancelReplyButton: {
    padding: 8,
  },
  cancelReplyText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendIcon: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ChatPage;
