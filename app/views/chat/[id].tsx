import { ArrowLeft, Calling, Flag, More, Send, Star } from "@/assets/icons";
import { BottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { SimpleSelector } from "@/components/selector";
import { useTheme } from "@/contexts/themeContext";
import {
  useChatWebSocket,
  useGetConversationMessages,
  useGetConversations,
  useGetCurrentUser,
  useGetPropertyDetails,
  useSendMessage,
  WsNewMessagePayload,
} from "@/hooks";
import { ColorScheme } from "@/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, CheckCheck } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const { width: screenWidth } = Dimensions.get("window");

// Message types
interface Message {
  id: string;
  text: string;
  timestamp: string;
  dateKey?: string;
  isUser: boolean;
  deliveryStatus?: "sent" | "seen" | "read";
  type?: "text" | "property" | "system";
  replyTo?: string;
  propertyData?: {
    propertyId?: string;
    title: string;
    price: string;
    frequency: string;
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

const getDateKey = (date?: string) =>
  date ? new Date(date).toISOString().slice(0, 10) : "unknown";

const formatDateLabel = (dateKey: string) => {
  if (dateKey === "unknown") return "Date unavailable";
  const date = new Date(`${dateKey}T12:00:00`);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

interface MessageItemProps {
  item: Message;
  colors: ColorScheme;
  messages: Message[];
  onReply?: (messageId: string) => void;
  showHoldForRenter?: boolean;
  onViewDetails?: () => void;
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
    <View
      style={[styles.systemMessageLine, { backgroundColor: colors.slate[250] }]}
    />
    <View
      style={[styles.systemMessagePill, { backgroundColor: colors.slate[150] }]}
    >
      <Text style={[styles.systemMessageText, { color: colors.slate[500] }]}>
        {text}
      </Text>
    </View>
    <View
      style={[styles.systemMessageLine, { backgroundColor: colors.slate[250] }]}
    />
  </View>
);

// Property card message
const PropertyMessage = ({
  item,
  colors,
  showHoldForRenter,
  onViewDetails,
}: {
  item: Message;
  colors: ColorScheme;
  showHoldForRenter: boolean;
  onViewDetails?: () => void;
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
            source={
              item.propertyData?.image
                ? { uri: item.propertyData.image }
                : require("@/assets/images/diplace.jpg")
            }
            style={styles.propertyImage}
          />
        </View>
        <View style={styles.propertyDetails}>
          <Text
            numberOfLines={2}
            style={[styles.propertyTitle, { color: colors.slate[650] }]}
          >
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
              / {item.propertyData?.frequency}
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.propertyActions}>
        <TouchableOpacity
          onPress={onViewDetails}
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
        {showHoldForRenter && (
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
        )}
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
const TextMessage = ({ item, colors, messages, onReply }: MessageItemProps) => (
  <View
    style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.otherMessageContainer,
    ]}
  >
    <TouchableOpacity
      style={styles.messageBubbleContainer}
      activeOpacity={0.85}
      onPress={() => onReply?.(item.id)}
      onLongPress={() => onReply?.(item.id)}
      delayLongPress={350}
    >
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
        <View
          style={[styles.messageMeta, item.isUser && styles.userMessageMeta]}
        >
          <Text
            style={[
              styles.messageTime,
              { color: item.isUser ? colors.slate[500] : colors.slate[300] },
            ]}
          >
            {item.timestamp}
          </Text>
          {item.isUser &&
            (item.deliveryStatus === "read" ? (
              <CheckCheck
                size={15}
                color={colors.info[200]}
                strokeWidth={2.5}
              />
            ) : item.deliveryStatus === "seen" ? (
              <CheckCheck
                size={15}
                color={colors.slate[500]}
                strokeWidth={2.5}
              />
            ) : (
              <Check size={15} color={colors.slate[500]} strokeWidth={2.5} />
            ))}
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

const MessageItem: React.FC<MessageItemProps> = ({
  item,
  colors,
  messages,
  onReply,
  showHoldForRenter,
  onViewDetails,
}) => {
  if (item.type === "system") {
    return <SystemMessage text={item.text} colors={colors} />;
  }

  if (item.type === "property") {
    return (
      <PropertyMessage
        item={item}
        colors={colors}
        showHoldForRenter={showHoldForRenter ?? false}
        onViewDetails={onViewDetails}
      />
    );
  }

  return (
    <TextMessage
      item={item}
      colors={colors}
      messages={messages}
      onReply={onReply}
    />
  );
};

const ChatPage = () => {
  const { colors, isDarkMode } = useTheme();
  const {
    id: conversationId,
    recipientName,
    recipientAvatar,
    propertyId,
  } = useLocalSearchParams<{
    id: string;
    recipientName?: string;
    recipientAvatar?: string;
    propertyId?: string;
  }>();

  // --- API hooks ---
  const { currentUser } = useGetCurrentUser();
  const { conversations } = useGetConversations();
  const currentConversation = useMemo(() => {
    return conversations?.conversations?.find(
      (c) => c.public_id === conversationId,
    );
  }, [conversations, conversationId]);
  const conversationPropertyId = propertyId || currentConversation?.property_id;
  const { propertyDetails } = useGetPropertyDetails({
    propertyId: conversationPropertyId,
    enabled: !!conversationPropertyId,
  });
  const { messages: apiMessages, isMessagesLoading } =
    useGetConversationMessages({
      conversationId,
      enabled: !!conversationId,
    });
  const { sendMessageMutation, isSendMessagePending } = useSendMessage();

  // Find other participant details dynamically
  const otherParticipant = useMemo(() => {
    const participants = currentConversation?.participants ?? [];
    return (
      participants.find(
        (participant) => participant.public_id !== currentUser?.public_id,
      ) ?? participants[0]
    );
  }, [currentConversation, currentUser]);

  const contactInfo = useMemo(() => {
    const participantName = otherParticipant
      ? `${otherParticipant.first_name ?? ""} ${otherParticipant.last_name ?? ""}`.trim()
      : "";
    const displayName =
      otherParticipant?.full_name?.trim() ||
      otherParticipant?.name?.trim() ||
      participantName ||
      otherParticipant?.email ||
      recipientName ||
      "Chat Room";
    const avatarUri =
      otherParticipant?.profile_picture ||
      recipientAvatar ||
      "https://randomuser.me/api/portraits/men/1.jpg";
    const isVerified = otherParticipant?.status === "verified";

    return {
      name: displayName,
      avatar: avatarUri,
      isVerified,
    };
  }, [otherParticipant, recipientName, recipientAvatar]);

  const recipientIsRenter = otherParticipant?.user_type === "renter";
  const recipientLabel = recipientIsRenter ? "renter" : "lister";
  const isAgentView = currentUser?.user_type === "agent";

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
          dateKey: getDateKey(rawDate),
          timestamp: formattedTime,
          isUser: m.sender_id === currentUser.public_id,
          replyTo: m.reply_to_message_id || undefined,
          deliveryStatus: (m.is_read || m.read_at
            ? "read"
            : m.delivered_at
              ? "seen"
              : "sent") as Message["deliveryStatus"],
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

  const propertyMessage = useMemo<Message | null>(() => {
    if (!propertyDetails) return null;

    const location = [
      propertyDetails.address?.street,
      propertyDetails.address?.city,
      propertyDetails.address?.state,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      id: `property-${propertyDetails.public_id}`,
      text: "",
      timestamp: "",
      isUser: false,
      type: "property",
      propertyData: {
        propertyId: propertyDetails.public_id,
        title: propertyDetails.title,
        price: `₦${propertyDetails.price.toLocaleString()}`,
        frequency: propertyDetails.cost_frequency
          .replace(/^per_/, "")
          .replace(/_/g, " "),
        location:
          location ||
          propertyDetails.address?.country ||
          "Location unavailable",
        image: propertyDetails.media?.[0]?.file_url || "",
      },
    };
  }, [propertyDetails]);

  const messagesWithDateMarkers = useMemo(() => {
    const result: Message[] = [];
    let lastDateKey: string | undefined;

    messages.forEach((message) => {
      if (message.dateKey !== lastDateKey) {
        lastDateKey = message.dateKey;
        result.push({
          id: `date-${message.dateKey ?? "unknown"}`,
          text: formatDateLabel(message.dateKey ?? "unknown"),
          timestamp: "",
          isUser: false,
          type: "system",
        });

        if (propertyMessage && result.length === 1) {
          result.push(propertyMessage);
        }
      }
      result.push(message);
    });

    if (propertyMessage && result.length === 0) {
      result.push(propertyMessage);
    }

    return result;
  }, [messages, propertyMessage]);

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
            (m) =>
              m.isUser && m.text === payload.content && !m.id.includes("-"),
          );
          if (optimisticIndex !== -1) {
            const next = [...prev];
            next[optimisticIndex] = {
              id: payload.public_id,
              text: payload.content,
              dateKey: getDateKey(payload.date_created),
              timestamp: new Date(payload.date_created).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isUser: true,
              replyTo: prev[optimisticIndex].replyTo,
              deliveryStatus: "seen",
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
            dateKey: getDateKey(payload.date_created),
            timestamp: new Date(payload.date_created).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isUser: payload.sender_id === currentUser?.public_id,
            replyTo: payload.reply_to_message_id || undefined,
            deliveryStatus:
              payload.sender_id === currentUser?.public_id
                ? ("seen" as const)
                : undefined,
            type: "text" as const,
          },
        ];
      });
    },
    [conversationId, currentUser],
  );

  const { isConnected, sendWsMessage, markConversationRead } = useChatWebSocket(
    {
      conversationId,
      onNewMessage: handleNewMessage,
      enabled: !!conversationId,
    },
  );

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

  const scrollToLatest = useCallback(() => {
    if (!messages.length) return;

    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages.length]);

  // Scroll after the new message has been laid out, not before FlatList measures it.
  useEffect(() => {
    scrollToLatest();
  }, [messages.length, messagesWithDateMarkers.length, scrollToLatest]);

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
      dateKey: getDateKey(new Date().toISOString()),
      isUser: true,
      deliveryStatus: "sent",
      replyTo: replyTo || undefined,
    };

    setLocalMessages((prev) => [...prev, optimisticMessage]);
    setInputText("");
    setReplyTo(null);

    // Try WebSocket first — instant delivery when connected
    const sentViaWs = sendWsMessage({
      conversation_id: conversationId,
      content: draft,
      reply_to_message_id: replyTo || undefined,
    });

    if (!sentViaWs) {
      // WS not ready — fall back to HTTP
      try {
        await sendMessageMutation({
          conversation_id: conversationId,
          content: draft,
          reply_to_message_id: replyTo || undefined,
        });
      } catch {
        // Roll back the optimistic message on HTTP failure too
        setLocalMessages((prev) => prev.filter((m) => m.id !== optimisticId));
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
  const [isReportSheetVisible, setIsReportSheetVisible] = useState(false);

  const handleReport = () => {
    setIsReportSheetVisible(true);
  };

  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageItem
      item={item}
      colors={colors}
      messages={messages}
      onReply={setReplyTo}
      showHoldForRenter={isAgentView}
      onViewDetails={() =>
        propertyMessage?.propertyData?.propertyId
          ? router.push({
              pathname: "/views/place-details/[id]",
              params: { id: propertyMessage.propertyData.propertyId },
            })
          : undefined
      }
    />
  );

  const renderStars = (currentRating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Star
              size={28}
              color={
                star <= currentRating ? colors.warning[200] : colors.slate[400]
              }
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaViewContainer>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

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
          <ArrowLeft size={24} color={colors.slate[650]} />
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
            <View style={styles.presenceRow}>
              <View
                style={[
                  styles.presenceDot,
                  {
                    backgroundColor:
                      (otherParticipant?.is_online ??
                      otherParticipant?.status === "active")
                        ? colors.success[200]
                        : colors.slate[400],
                  },
                ]}
              />
              <Text
                style={[styles.contactStatus, { color: colors.slate[500] }]}
              >
                {(otherParticipant?.is_online ??
                otherParticipant?.status === "active")
                  ? "Active now"
                  : "Offline"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() =>
              router.push({
                pathname: "/views/call",
                params: {
                  conversationId,
                  callerName: contactInfo.name,
                  callerAvatar: contactInfo.avatar,
                  mode: "outgoing",
                },
              })
            }
          >
            <Calling size={24} color={colors.slate[650]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowMenu(true)}
          >
            <More size={24} color={colors.slate[650]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messagesWithDateMarkers}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToLatest}
        onLayout={scrollToLatest}
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
            <Send size={22} color={colors.slate[500]} />
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
            {!recipientIsRenter && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  setShowReviewModal(true);
                }}
              >
                <Star size={20} color={colors.slate[650]} />
                <Text style={[styles.menuText, { color: colors.slate[650] }]}>
                  Give a review
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                // reportRef.current?.present();
                setShowReportModal(true);
              }}
            >
              <Flag size={20} color={colors.slate[650]} />
              <Text style={[styles.menuText, { color: colors.slate[650] }]}>
                Report {recipientLabel}
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
              Report the {recipientLabel}
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.slate[500] }]}>
              Let us know what the case is with this {recipientLabel}.
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

      <BottomSheet
        isVisible={isReportSheetVisible}
        onClose={() => setIsReportSheetVisible(false)}
        snapPoints={snapPoints}
      >
        <ReportBottomSheet
          type="lister"
          onSubmit={handleSubmitReport}
          onCancel={() => setIsReportSheetVisible(false)}
        />
      </BottomSheet>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  presenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  presenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  systemMessageLine: {
    flex: 1,
    height: 1,
  },
  systemMessagePill: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  systemMessageText: {
    fontSize: 12,
    fontWeight: "500",
  },
  propertyMessageContainer: {
    alignItems: "flex-start",
    width: "100%",
    marginVertical: 8,
  },
  propertyContainer: {
    width: "100%",
    borderRadius: 16,
    paddingRight: 4,
    overflow: "hidden",
    maxWidth: "100%",
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
  propertyDetails: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
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
  },
  messageMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  userMessageMeta: {
    justifyContent: "flex-end",
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
