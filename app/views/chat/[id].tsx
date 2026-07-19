import { CustomBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useGetConversationMessages, useSendMessage, useChatWebSocket, WsNewMessagePayload, useGetConversations, useGetCurrentUser } from "@/hooks";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ReportBottomSheet from "../report/report";
import { SimpleSelector } from "@/components/selector";

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

// Report reasons (contactInfo is now dynamically resolved inside the component)

// Report reasons
const reportReasons = [
  "Was rude and unprofessional",
  "Unresponsive & poor communication",
  "Didn't show up for inspection",
  "Scam & suspicious behaviour",
  "Fraudulent activity & extra charges",
  "Gave out space already to someone",
  "Collected payment outside DiPlace",
];

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
  const { colors, isDarkMode } = useTheme();
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();

  // --- API hooks ---
  const { currentUser } = useGetCurrentUser();
  const { conversations } = useGetConversations();
  const { messages: apiMessages, isMessagesLoading } = useGetConversationMessages({
    conversationId,
    enabled: !!conversationId,
  });
  const { sendMessageMutation, isSendMessagePending } = useSendMessage();

  // Find other participant details dynamically
  const currentConversation = useMemo(() => {
    return conversations?.conversations?.find((c) => c.public_id === conversationId);
  }, [conversations, conversationId]);

  const otherParticipant = useMemo(() => {
    return currentConversation?.participants?.[0];
  }, [currentConversation]);

  const contactInfo = useMemo(() => {
    const displayName = otherParticipant
      ? `${otherParticipant.first_name ?? ""} ${otherParticipant.last_name ?? ""}`.trim() ||
        otherParticipant.email
      : "Chat Room";
    const avatarUri = otherParticipant?.profile_picture || "https://randomuser.me/api/portraits/men/1.jpg";
    const isVerified = otherParticipant?.status === "verified";
    
    return {
      name: displayName,
      avatar: avatarUri,
      isVerified,
    };
  }, [otherParticipant]);

  // Map API messages to the local Message shape used by the UI components
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (apiMessages && currentUser) {
      const mappedApiMessages = apiMessages.map((m) => {
        const rawDate = m.date_created || m.created_at;
        const formattedTime = rawDate
          ? new Date(rawDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";
        return {
          id: m.public_id,
          text: m.content,
          timestamp: formattedTime,
          isUser: m.sender_id === currentUser.public_id,
          type: "text" as const,
        };
      });

      setLocalMessages((prev) => {
        const apiIds = new Set(mappedApiMessages.map((m) => m.id));
        const apiTexts = new Set(mappedApiMessages.map((m) => m.text));

        // Filter out any optimistic messages that are already present in the API response
        const remainingLocal = prev.filter((m) => {
          if (apiIds.has(m.id)) return false;
          // If it's an optimistic message (no hyphen) and the text is already in the API response, remove it
          if (!m.id.includes("-") && apiTexts.has(m.text)) return false;
          return true;
        });

        return [...mappedApiMessages, ...remainingLocal];
      });
    }
  }, [apiMessages, currentUser]);

  const messages = localMessages;
  const [inputText, setInputText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // --- WebSocket (real-time incoming messages) ---
  const handleNewMessage = useCallback(
    (payload: WsNewMessagePayload) => {
      if (payload.conversation_id !== conversationId) return;

      setLocalMessages((prev) => {
        // De-duplicate: check if we already have this server message ID
        if (prev.some((m) => m.id === payload.public_id)) return prev;

        // If it's a message from the current user, try to find and replace the optimistic message
        if (payload.sender_id === currentUser?.public_id) {
          const optimisticIndex = prev.findIndex(
            (m) => m.isUser && m.text === payload.content && !m.id.includes("-")
          );
          if (optimisticIndex !== -1) {
            const next = [...prev];
            next[optimisticIndex] = {
              id: payload.public_id,
              text: payload.content,
              timestamp: new Date(payload.date_created).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isUser: true,
              type: "text" as const,
            };
            return next;
          }
        }

        // Otherwise, append the new message
        return [
          ...prev,
          {
            id: payload.public_id,
            text: payload.content,
            timestamp: new Date(payload.date_created).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isUser: payload.sender_id === currentUser?.public_id,
            type: "text" as const,
          },
        ];
      });
    },
    [conversationId, currentUser]
  );

  const { isConnected, isConnecting, sendWsMessage, markConversationRead } =
    useChatWebSocket({
      conversationId,
      onNewMessage: handleNewMessage,
      enabled: !!conversationId,
    });

  // Mark conversation as read when the screen opens and WS is connected
  useEffect(() => {
    if (isConnected && conversationId) {
      markConversationRead({ conversation_id: conversationId });
    }
  }, [isConnected, conversationId, markConversationRead]);

  // Menu states
  const [showMenu, setShowMenu] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Review states
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // Report state
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const router = useRouter();

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (inputText.trim().length === 0 || !conversationId) return;

    const draft = inputText.trim();
    const optimisticId = Date.now().toString();
    const optimisticMessage: Message = {
      id: optimisticId,
      text: draft,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isUser: true,
      replyTo: replyTo || undefined,
    };

    setLocalMessages((prev) => [...prev, optimisticMessage]);
    setInputText("");
    setReplyTo(null);

    // Try WebSocket first — instant delivery when connected
    const sentViaWs = sendWsMessage({
      conversation_id: conversationId,
      content: draft,
    });

    if (!sentViaWs) {
      // WS not ready — fall back to HTTP
      try {
        await sendMessageMutation({
          conversation_id: conversationId,
          content: draft,
        });
      } catch {
        // Roll back the optimistic message on HTTP failure too
        setLocalMessages((prev) =>
          prev.filter((m) => m.id !== optimisticId)
        );
      }
    }
  };

  const handleSubmitReview = () => {
    // Handle review submission
    console.log("Review submitted:", { rating, reviewComment });
    setShowReviewModal(false);
    setRating(0);
    setReviewComment("");
  };

  const handleSubmitReport = () => {
    // Handle report submission
    console.log("Report submitted:", selectedReport);
    setShowReportModal(false);
    setSelectedReport(null);
  };
  const reportRef = useRef<BottomSheetModal>(null);

  const handleReport = () => {
    reportRef.current?.present();
  };

  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageItem item={item} colors={colors} messages={messages} />
  );

  const renderStars = (currentRating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text
              style={[
                styles.starIcon,
                star > currentRating ? { color: colors.slate[600] } : {},
              ]}
            >
              {star <= currentRating ? "⭐" : "☆"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaViewContainer>
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
          {isDarkMode ? (
            <Image
              source={require("@/assets/icons/arrow-left-light.png")}
              style={{ width: 25, height: 20 }}
            />
          ) : (
            <Image
              source={require("@/assets/icons/arrow-left-dark.png")}
              style={{ width: 25, height: 20 }}
            />
          )}
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
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: isConnecting
                    ? "#F59E0B"
                    : isConnected
                    ? colors.success[200]
                    : colors.error[200],
                }}
              />
              <Text
                style={[styles.contactStatus, { color: colors.slate[500] }]}
              >
                {isConnecting ? "Connecting..." : isConnected ? "Live" : "Reconnecting..."}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/views/call/incomingCall")}
          >
            {isDarkMode ? (
              <Image
                source={require("@/assets/icons/calling.png")}
                style={{ height: 25, width: 25, tintColor: colors.slate[650] }}
              />
            ) : (
              <Image
                source={require("@/assets/icons/calling.png")}
                style={{ height: 25, width: 25, tintColor: colors.slate[650] }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowMenu(true)}
          >
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
            disabled={inputText.trim().length === 0 || isSendMessagePending}
          >
            {isDarkMode ? (
              <Image
                source={require("@/assets/icons/send-light.png")}
                style={{ width: 25, height: 25 }}
              />
            ) : (
              <Image
                source={require("@/assets/icons/send-dark.png")}
                style={{ width: 25, height: 25 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Three Dots Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setShowMenu(false)}
        >
          <View
            style={[
              styles.menuContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                // Handle search
              }}
            >
              <Image
                source={require("@/assets/icons/search.png")}
                style={[styles.menuIcon, { tintColor: colors.slate[650] }]}
              />
              <Text style={[styles.menuText, { color: colors.slate[650] }]}>
                Search
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                setShowReviewModal(true);
              }}
            >
              <Image
                source={require("@/assets/icons/Star - Iconly Pro.png")}
                style={[styles.menuIcon, { tintColor: colors.slate[650] }]}
              />
              <Text style={[styles.menuText, { color: colors.slate[650] }]}>
                Give a review
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                // reportRef.current?.present();
                setShowReportModal(true);
              }}
            >
              <Image
                source={require("@/assets/icons/flag.png")}
                style={[styles.menuIcon, { tintColor: colors.slate[650] }]}
              />
              <Text style={[styles.menuText, { color: colors.slate[650] }]}>
                Report this lister
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Give Review Modal */}
      <Modal
        visible={showReviewModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReviewModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowReviewModal(false)}
        >
          <Pressable
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />

            <Text style={[styles.modalTitle, { color: colors.slate[650] }]}>
              Give review
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.slate[500] }]}>
              Please provide feedback about your experience and rate the person
              who listed this property.
            </Text>

            {/* Star Rating */}
            {renderStars(rating)}

            {/* Comment Input */}
            <View style={styles.commentSection}>
              <Text style={[styles.commentLabel, { color: colors.slate[650] }]}>
                Add Comment
              </Text>
              <TextInput
                style={[
                  styles.commentInput,
                  {
                    backgroundColor: colors.slate[150],
                    borderColor: colors.slate[300],
                    color: colors.slate[650],
                  },
                ]}
                placeholder="Give your feedback..."
                placeholderTextColor={colors.slate[450]}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={reviewComment}
                onChangeText={setReviewComment}
              />
            </View>

            <AppButton title="Submit" onPress={handleSubmitReview} />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowReportModal(false)}
        >
          <Pressable
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />

            <Text style={[styles.modalTitle, { color: colors.slate[650] }]}>
              Report the lister
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.slate[500] }]}>
              Let us know what the case is with the agent/space manager.
            </Text>

            <View style={styles.reportList}>
              {reportReasons.map((reason, index) => (
                <SimpleSelector
                  title={reason}
                  isChecked={selectedReport === reason}
                  onChange={() => setSelectedReport(reason)}
                  key={index}
                />
              ))}
            </View>

            <AppButton title="Submit" onPress={handleSubmitReport} />
          </Pressable>
        </Pressable>
      </Modal>

      <CustomBottomSheet
        bottomSheetProps={{
          ref: reportRef,
          snapPoints,
          index: 2,
          enableContentPanningGesture: true,
          enableHandlePanningGesture: true,
          enablePanDownToClose: true,
        }}
      >
        <ReportBottomSheet
          type="lister"
          onSubmit={handleSubmitReport}
          onCancel={() => reportRef.current?.close()}
        />
      </CustomBottomSheet>
    </SafeAreaViewContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
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
  rentButton: {},
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
  // Menu Styles
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContainer: {
    marginTop: 60,
    marginRight: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 200,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: "85%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
  },
  // Review Modal
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  starIcon: {
    fontSize: 32,
  },
  commentSection: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  commentInput: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 120,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Report Modal
  reportList: {
    gap: 12,
    marginBottom: 24,
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  reportText: {
    flex: 1,
    fontSize: 14,
  },
});

export default ChatPage;
