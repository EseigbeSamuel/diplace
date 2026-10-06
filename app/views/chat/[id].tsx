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
  <View  className="flex-row items-center px-[16px] my-[16px]">
    <View

     className="flex-1 h-[1px]"/>
    <View

     className="rounded-[12px] px-[12px] py-[5px] mx-[10px]">
      <Text  className="text-[12px] font-medium">
        {text}
      </Text>
    </View>
    <View

     className="flex-1 h-[1px]"/>
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
  <View  className="items-start w-[100%px] my-[8px]">
    <View

     className="w-[100%px] rounded-[16px] pr-[4px] overflow-hidden max-w-[100%px] border-[1px] border-[rgba(0,0,0,0.05)]">
      <View

       className="pl-[6px] flex flex-row rounded-[6px] py-[5px]">
        <View>
          <Image
            source={
              item.propertyData?.image
                ? { uri: item.propertyData.image }
                : require("@/assets/images/diplace.jpg")
            }

           className="w-[65px] h-[70px] rounded-[10px] mr-[5px] object-cover"/>
        </View>
        <View  className="flex-1 min-w-[0px] pr-[8px]">
          <Text
            numberOfLines={2}

           className="text-[14px] font-semibold mb-[6px] leading-[20px]">
            {item.propertyData?.title}
          </Text>
          <Text  className="text-[11px] mb-[4px] leading-[16px]">
            {item.propertyData?.location}
          </Text>
          <Text  className="text-[16px] font-bold mb-[8px]">
            {item.propertyData?.price}{" "}
            <Text

             className="text-[14px] font-normal">
              / {item.propertyData?.frequency}
            </Text>
          </Text>
        </View>
      </View>
      <View  className="flex-row px-[16px] pb-[16px] gap-[8px]">
        <TouchableOpacity
          onPress={onViewDetails}

         className="flex-1 py-[10px] px-[12px] rounded-[20px] items-center border-[1px]">
          <Text

           className="text-[13px] font-medium">
            View details
          </Text>
        </TouchableOpacity>
        {showHoldForRenter && (
          <TouchableOpacity

           className="flex-1 py-[10px] px-[12px] rounded-[20px] items-center">
            <Text

             className="text-[13px] font-medium">
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

     className="pl-[12px] py-[6px] mb-[4px] border-left-[3px] border-top-left-radius-[8px] border-top-right-radius-[8px]">
      <Text  className="text-[13px] italic">
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

   className="my-[3px]">
    <TouchableOpacity
      style={styles.messageBubbleContainer}
      activeOpacity={0.85}
      onPress={() => onReply?.(item.id)}
      onLongPress={() => onReply?.(item.id)}
      delayLongPress={350}
    >
      <View

       className="px-[16px] py-[12px] rounded-[18px]">
        {item.replyTo && (
          <ReplyPreview
            replyToId={item.replyTo}
            messages={messages}
            colors={colors}
          />
        )}
        <Text

         className="text-[15px] leading-[20px]">
          {item.text}
        </Text>
        <View

         className="flex-row items-center gap-[4px] mt-[4px]">
          <Text

           className="text-[11px]">
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
      <View  className="flex-row justify-center gap-[8px] mb-[24px]">
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

       className="flex-row items-center py-[12px] border-b">
        <TouchableOpacity

          onPress={() => router.back()}
         className="pr-[12px]">
          <ArrowLeft size={24} color={colors.slate[650]} />
        </TouchableOpacity>

        <View  className="flex-1 flex-row items-center">
          <Image
            source={{ uri: contactInfo.avatar }}

           className="w-[40px] h-[40px] rounded-[20px] mr-[12px]"/>
          <View  className="flex-1">
            <View  className="flex-row items-center">
              <Text  className="text-[16px] font-semibold mr-[6px]">
                {contactInfo.name}
              </Text>
              {contactInfo.isVerified && (
                <View  className="rounded-[8px] w-[16px] h-[16px] justify-center items-center">
                  <Image
                    source={require("@/assets/icons/badge-check-green.png")}
                  />
                </View>
              )}
            </View>
            <View  className="flex-row items-center gap-[6px]">
              <View

               className="w-[8px] h-[8px] rounded-[4px]"/>
              <Text

               className="text-[12px] mt-[2px]">
                {(otherParticipant?.is_online ??
                otherParticipant?.status === "active")
                  ? "Active now"
                  : "Offline"}
              </Text>
            </View>
          </View>
        </View>

        <View  className="flex-row gap-[8px] items-center">
          <TouchableOpacity

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
           className="p-[8px]">
            <Calling size={24} color={colors.slate[650]} />
          </TouchableOpacity>
          <TouchableOpacity

            onPress={() => setShowMenu(true)}
           className="p-[8px]">
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

        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToLatest}
        onLayout={scrollToLatest}
       className="flex-1"/>

      {/* Reply Preview */}
      {replyTo && (
        <View

         className="px-[16px] py-[8px] flex-row items-center border-t">
          <View  className="flex-1">
            <Text

             className="text-[12px] font-medium mb-[2px]">
              Replying to:
            </Text>
            <Text

             className="text-[13px]">
              {messages
                .find((msg) => msg.id === replyTo)
                ?.text?.substring(0, 60)}
              ...
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setReplyTo(null)}

           className="p-[8px]">
            <Text

             className="text-[16px] font-bold">
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}

       className="py-[12px] border-t">
        <View  className="flex-row items-end rounded-[24px] px-[16px] py-[8px]">
          <TextInput

            placeholder="Message"
            placeholderTextColor={colors.slate[500]}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
           className="flex-1 text-[16px] max-h-[120px] py-[8px]"/>
          <TouchableOpacity

            onPress={sendMessage}
            disabled={inputText.trim().length === 0 || isSendMessagePending}
           className="w-[32px] h-[32px] rounded-[16px] justify-center items-center ml-[8px]">
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

          onPress={() => setShowMenu(false)}
         className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-start items-end">
          <View
            style={[
              styles.menuContainer,
              { backgroundColor: colors.background },
            ]}
           className="mt-[60px] mr-[16px] rounded-[12px] min-w-[200px] shadow-color-[#000] shadow-opacity-[0.25px] shadow-radius-[8px] elevation-[5px]">
            {!recipientIsRenter && (
              <TouchableOpacity

                onPress={() => {
                  setShowMenu(false);
                  setShowReviewModal(true);
                }}
               className="flex-row items-center py-[14px] px-[16px] gap-[12px]">
                <Star size={20} color={colors.slate[650]} />
                <Text  className="text-[15px] font-medium">
                  Give a review
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity

              onPress={() => {
                setShowMenu(false);
                // reportRef.current?.present();
                setShowReportModal(true);
              }}
             className="flex-row items-center py-[14px] px-[16px] gap-[12px]">
              <Flag size={20} color={colors.slate[650]} />
              <Text  className="text-[15px] font-medium">
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

          onPress={() => setShowReviewModal(false)}
         className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-end">
          <Pressable

            onPress={(e) => e.stopPropagation()}
           className="px-[20px] pb-[32px] max-h-[85%px] border-top-left-radius-[24px] border-top-right-radius-[24px]">
            <View   className="w-[40px] h-[4px] bg-[#ccc] rounded-[2px] my-[12px] self-center"/>

            <Text  className="text-[20px] font-bold text-center mb-[8px]">
              Give review
            </Text>
            <Text  className="text-[13px] text-center leading-[18px] mb-[24px]">
              Please provide feedback about your experience and rate the person
              who listed this property.
            </Text>

            {/* Star Rating */}
            {renderStars(rating)}

            {/* Comment Input */}
            <View  className="mb-[24px]">
              <Text  className="text-[14px] font-medium mb-[8px]">
                Add Comment
              </Text>
              <TextInput

                placeholder="Give your feedback..."
                placeholderTextColor={colors.slate[450]}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={reviewComment}
                onChangeText={setReviewComment}
               className="rounded-[12px] p-[16px] border-[1px] text-[15px] min-h-[120px]"/>
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

          onPress={() => setShowReportModal(false)}
         className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-end">
          <Pressable

            onPress={(e) => e.stopPropagation()}
           className="px-[20px] pb-[32px] max-h-[85%px] border-top-left-radius-[24px] border-top-right-radius-[24px]">
            <View   className="w-[40px] h-[4px] bg-[#ccc] rounded-[2px] my-[12px] self-center"/>

            <Text  className="text-[20px] font-bold text-center mb-[8px]">
              Report the {recipientLabel}
            </Text>
            <Text  className="text-[13px] text-center leading-[18px] mb-[24px]">
              Let us know what the case is with this {recipientLabel}.
            </Text>

            <View  className="gap-[12px] mb-[24px]">
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
  container: {},
  header: {},
  backButton: {},
  backIcon: {},
  contactInfo: {},
  contactAvatar: {},
  contactDetails: {},
  contactNameContainer: {},
  contactName: {},
  verifiedBadge: {},
  verifiedIcon: {},
  contactStatus: {},
  headerActions: {},
  headerButton: {},
  headerButtonIcon: {},
  messagesList: {},
  messagesContent: {},
  systemMessageContainer: {},
  presenceRow: {},
  presenceDot: {},
  systemMessageLine: {},
  systemMessagePill: {},
  systemMessageText: {},
  propertyMessageContainer: {},
  propertyContainer: {},
  propertyImage: {},
  propertyContent: {},
  propertyDetails: {},
  propertyTitle: {},
  propertyPrice: {},
  propertyPriceUnit: {},
  propertyLocation: {},
  propertyActions: {},
  propertyButton: {},
  viewDetailsButton: {},
  rentButton: {},
  propertyButtonText: {},
  propertyMessageTime: {},
  messageContainer: {},
  userMessageContainer: {},
  otherMessageContainer: {},
  messageBubbleContainer: {
    maxWidth: screenWidth * 0.75,
  },
  messageBubble: {},
  userMessageBubble: {},
  otherMessageBubble: {},
  messageText: {},
  messageTime: {},
  messageMeta: {},
  userMessageMeta: {},
  replyContainer: {},
  replyText: {},
  replyPreviewContainer: {},
  replyPreviewContent: {},
  replyPreviewLabel: {},
  replyPreviewText: {},
  cancelReplyButton: {},
  cancelReplyText: {},
  inputContainer: {},
  inputRow: {},
  textInput: {},
  sendButton: {},
  sendIcon: {},
  // Menu Styles
  menuOverlay: {},
  menuContainer: {shadowOffset: { width: 0, height: 2 }},
  menuItem: {},
  menuIcon: {},
  menuText: {},
  // Modal Styles
  modalOverlay: {},
  modalContent: {},
  modalHandle: {},
  modalTitle: {},
  modalSubtitle: {},
  // Review Modal
  starsContainer: {},
  starIcon: {},
  commentSection: {},
  commentLabel: {},
  commentInput: {},
  submitButton: {},
  submitButtonText: {},
  // Report Modal
  reportList: {},
  reportItem: {},
  radioButton: {},
  radioButtonInner: {},
  reportText: {},
});

export default ChatPage;
