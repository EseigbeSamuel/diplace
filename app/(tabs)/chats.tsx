import Filter from "@/components/filter";
import { AppHeader } from "@/components/header";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useGetConversations, useGetCurrentUser } from "@/hooks";
import { ConversationResponse } from "@/types";
import { ColorScheme } from "@/utils";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const filterTabs = ["All", "Unread", "Read", "Dates"];

interface ChatItemProps {
  item: ConversationResponse;
  colors: ColorScheme;
  isDarkMode: boolean;
  currentUserId?: string;
}

// Verified Badge Component
const VerifiedBadge = () => (
  <View style={styles.verifiedBadge} className="justify-center items-center rounded-[8px] w-[16px] h-[16px]">
    <Image source={require("@/assets/icons/badge-check-green.png")} />
  </View>
);

const ChatItem: React.FC<ChatItemProps> = ({ item, colors, currentUserId }) => {
  const router = useRouter();

  const otherParticipant =
    item.participants?.find((p) => p.public_id !== currentUserId) ||
    item.participants?.[0];
  const participantName = otherParticipant
    ? `${otherParticipant.first_name ?? ""} ${otherParticipant.last_name ?? ""}`.trim()
    : "";
  const displayName =
    otherParticipant?.full_name?.trim() ||
    otherParticipant?.name?.trim() ||
    participantName ||
    otherParticipant?.email ||
    "Lister";
  const avatarUri = otherParticipant?.profile_picture ?? undefined;
  const isVerified = otherParticipant?.status === "verified";
  const formattedTime = item.last_message_at
    ? new Date(item.last_message_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: colors.background }]}
      onPress={() =>
        router.push({
          pathname: "/views/chat/[id]",
          params: {
            id: item.public_id,
            recipientName: displayName,
            recipientAvatar: avatarUri || "",
            propertyId: item.property_id || "",
          },
        })
      }
     className="flex-row items-center py-[12px]">
      <View style={styles.avatarContainer} className="relative mr-[12px]">
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar}  className="w-[48px] h-[48px] rounded-[24px]"/>
        ) : (
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: colors.slate[300],
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
           className="w-[48px] h-[48px] rounded-[24px]">
            <Text
              style={{
                color: colors.slate[650],
                fontWeight: "700",
                fontSize: RFValue(16),
              }}
            >
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {(otherParticipant?.is_online ??
        otherParticipant?.status === "active") ? (
          <View
            style={[
              styles.onlineIndicator,
              {
                backgroundColor: colors.success[200],
                borderColor: colors.background,
              },
            ]}
           className="absolute bottom-[0px] right-[0px] w-[14px] h-[14px] rounded-[7px] border-[2px]"/>
        ) : null}
      </View>

      <View style={styles.chatContent} className="flex-1">
        <View style={styles.chatHeader} className="flex-row justify-between items-center mb-[4px]">
          <View style={styles.nameContainer} className="flex-row items-center flex-1 mr-[10px]">
            <Text
              style={[styles.chatName, { color: colors.slate[650] }]}
              numberOfLines={1}
             className="font-semibold mr-[6px]">
              {displayName}
            </Text>
            {isVerified && <VerifiedBadge />}
          </View>
          <Text style={[styles.chatTime, { color: colors.slate[500] }]} className="font-normal">
            {formattedTime}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text
            style={[
              styles.chatMessage,
              { color: colors.slate[500] },
              item.unread_count > 0 && {
                color: colors.slate[600],
                fontWeight: "500",
              },
            ]}
            numberOfLines={1}
           className="flex-1 mr-[10px] leading-[18px]">
            {item.last_message_preview || "No messages yet"}
          </Text>
          {item.unread_count > 0 && (
            <View
              style={[
                styles.unreadBadge,
                { backgroundColor: colors.error[200] },
              ]}
             className="items-center rounded-[10px] px-[7px] py-[3px] min-w-[20px]">
              <Text style={styles.unreadText} className="text-[white] font-semibold">{item.unread_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ChatsPage: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const { currentUser } = useGetCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { conversations, isConversationsLoading, refetchConversations } =
    useGetConversations({
      q: searchQuery || undefined,
      skip: 0,
      limit: 50,
    });

  useFocusEffect(
    useCallback(() => {
      void refetchConversations();
    }, [refetchConversations]),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchConversations();
    setIsRefreshing(false);
  };

  const agentConversations = useMemo(() => {
    const allConversations = conversations?.conversations ?? [];
    const grouped = new Map<string, ConversationResponse>();

    allConversations.forEach((conversation) => {
      const otherParticipant = conversation.participants?.find(
        (participant) => participant.public_id !== currentUser?.public_id,
      );
      const groupKey = otherParticipant?.public_id || conversation.public_id;
      const existing = grouped.get(groupKey);

      if (!existing) {
        grouped.set(groupKey, conversation);
        return;
      }

      const existingTime = new Date(existing.last_message_at || 0).getTime();
      const conversationTime = new Date(
        conversation.last_message_at || 0,
      ).getTime();
      const latest = conversationTime > existingTime ? conversation : existing;

      grouped.set(groupKey, {
        ...latest,
        unread_count: existing.unread_count + conversation.unread_count,
      });
    });

    return Array.from(grouped.values());
  }, [conversations?.conversations, currentUser?.public_id]);

  const filteredChats = agentConversations.filter((conv) => {
    if (activeFilter === "Unread") return conv.unread_count > 0;
    if (activeFilter === "Read") return conv.unread_count === 0;
    return true;
  });
  const displayedChats =
    activeFilter === "Dates"
      ? [...filteredChats].sort(
          (first, second) =>
            new Date(second.last_message_at || 0).getTime() -
            new Date(first.last_message_at || 0).getTime(),
        )
      : filteredChats;

  const renderChatItem = ({ item }: { item: ConversationResponse }) => (
    <ChatItem
      item={item}
      colors={colors}
      isDarkMode={isDarkMode}
      currentUserId={currentUser?.public_id}
    />
  );

  const renderFilterTab = (tab: string) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.filterTab,
        activeFilter === tab && [
          styles.activeFilterTab,
          {
            backgroundColor: colors.slate[200],
            borderColor: colors.slate[300],
          },
        ],
        { borderColor: colors.slate[400] },
      ]}
      onPress={() => setActiveFilter(tab)}
     className="flex-row items-center px-[16px] py-[8px] rounded-[20px] border-[1px]">
      <Text
        style={[
          styles.filterText,
          {
            color: activeFilter === tab ? colors.slate[650] : colors.slate[500],
          },
        ]}
       className="font-medium">
        {tab}
      </Text>
      {tab === "Unread" &&
        agentConversations.some((c) => c.unread_count > 0) && (
          <View
            style={[styles.filterBadge, { backgroundColor: colors.error[200] }]}
           className="items-center rounded-[8px] ml-[6px] px-[6px] py-[2px] min-w-[18px]">
            <Text style={styles.filterBadgeText} className="text-[white] font-semibold">
              {agentConversations.filter((c) => c.unread_count > 0).length}
            </Text>
          </View>
        )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaViewContainer disableBottom>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      <AppHeader title={"Chats"} />
      <View className="py-3">
        <Filter
          size="large"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer} className="flex-row mb-[15px] gap-[10px]">
        {filterTabs.map(renderFilterTab)}
      </View>

      {/* Chat List */}
      {isConversationsLoading && !isRefreshing ? (
        <View
          className="flex-1 justify-center items-center"
        >
          <ActivityIndicator size="large" color={colors.slate[650]} />
        </View>
      ) : (
        <FlatList
          data={displayedChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.public_id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatListContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.slate[650]}
            />
          }
          ListEmptyComponent={
            <View className="items-center mt-[60px]">
              <Text style={{ color: colors.slate[500], fontSize: RFValue(14) }}>
                No conversations yet.
              </Text>
            </View>
          }
         className="flex-1"/>
      )}
    </SafeAreaViewContainer>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  header: {
    // paddingHorizontal: 20,


  },
  headerContent: {



  },
  headerTitle: {fontSize: RFValue(27)},
  headerIcons: {



  },
  iconButton: {


  },
  bellIcon: {






  },
  notificationDot: {











  },
  profileButton: {

  },
  profileAvatar: {



  },
  searchContainer: {







  },
  searchIcon: {






  },
  searchInput: {
    fontSize: RFValue(16),

  },
  filterContainer: {

    // paddingHorizontal: 20,


  },
  filterTab: {






  },
  activeFilterTab: {
    // Styles applied in renderFilterTab
  },
  filterText: {
    fontSize: RFValue(14),

  },
  filterBadge: {






  },
  filterBadgeText: {

    fontSize: RFValue(11),

  },
  chatList: {

  },
  chatListContent: {

  },
  chatItem: {

    // paddingHorizontal: 20,


  },
  avatarContainer: {


  },
  avatar: {



  },
  onlineIndicator: {







  },
  chatContent: {

  },
  chatHeader: {




  },
  nameContainer: {




  },
  chatName: {
    fontSize: RFValue(16),


  },
  verifiedBadge: {





  },
  chatTime: {
    fontSize: RFValue(12),

  },
  messageContainer: {



  },
  chatMessage: {
    fontSize: RFValue(14),



  },
  unreadBadge: {





  },
  unreadText: {

    fontSize: RFValue(11),

  },
  fab: {shadowOffset: { width: 0, height: 4 }},
  fabIcon: {fontSize: RFValue(24)},
});

export default ChatsPage;
