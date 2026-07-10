import Filter from "@/components/filter";
import { AppHeader } from "@/components/header";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useGetConversations } from "@/hooks";
import { ConversationResponse } from "@/types";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
}

// Verified Badge Component
const VerifiedBadge = () => (
  <View style={styles.verifiedBadge}>
    <Image source={require("@/assets/icons/badge-check-green.png")} />
  </View>
);

const ChatItem: React.FC<ChatItemProps> = ({ item, colors }) => {
  const router = useRouter();

  const otherParticipant = item.participants?.[0];
  const displayName = otherParticipant
    ? `${otherParticipant.first_name ?? ""} ${otherParticipant.last_name ?? ""}`.trim() ||
      otherParticipant.email
    : "Unknown";
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
        router.push({ pathname: "/views/chat/[id]", params: { id: item.public_id } })
      }
    >
      <View style={styles.avatarContainer}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.slate[300], justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Text style={{ color: colors.slate[650], fontWeight: "700", fontSize: RFValue(16) }}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <View style={styles.nameContainer}>
            <Text
              style={[styles.chatName, { color: colors.slate[650] }]}
              numberOfLines={1}
            >
              {displayName}
            </Text>
            {isVerified && <VerifiedBadge />}
          </View>
          <Text style={[styles.chatTime, { color: colors.slate[500] }]}>
            {formattedTime}
          </Text>
        </View>

        <View style={styles.messageContainer}>
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
          >
            {item.last_message_preview || "No messages yet"}
          </Text>
          {item.unread_count > 0 && (
            <View
              style={[
                styles.unreadBadge,
                { backgroundColor: colors.error[200] },
              ]}
            >
              <Text style={styles.unreadText}>{item.unread_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ChatsPage: React.FC = () => {
  const { colors, isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { conversations, isConversationsLoading } = useGetConversations({
    q: searchQuery || undefined,
    skip: 0,
    limit: 50,
  });

  const allConversations = conversations?.conversations ?? [];

  const filteredChats = allConversations.filter((conv) => {
    if (activeFilter === "Unread") return conv.unread_count > 0;
    if (activeFilter === "Read") return conv.unread_count === 0;
    return true;
  });

  const renderChatItem = ({ item }: { item: ConversationResponse }) => (
    <ChatItem item={item} colors={colors} isDarkMode={isDarkMode} />
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
    >
      <Text
        style={[
          styles.filterText,
          {
            color: activeFilter === tab ? colors.slate[650] : colors.slate[500],
          },
        ]}
      >
        {tab}
      </Text>
      {tab === "Unread" && allConversations.some((c) => c.unread_count > 0) && (
        <View
          style={[styles.filterBadge, { backgroundColor: colors.error[200] }]}
        >
          <Text style={styles.filterBadgeText}>
            {allConversations.filter((c) => c.unread_count > 0).length}
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
        <Filter size="large" />
      </View>

      <View style={styles.filterContainer}>
        {filterTabs.map(renderFilterTab)}
      </View>

      {/* Chat List */}
      {isConversationsLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.slate[650]} />
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.public_id}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatListContent}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Text style={{ color: colors.slate[500], fontSize: RFValue(14) }}>
                No conversations yet.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaViewContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    // paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: RFValue(27),
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconButton: {
    position: "relative",
    padding: 8,
  },
  bellIcon: {
    width: 24,
    height: 24,
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 17,
  },
  notificationDot: {
    position: "absolute",
    top: 1,
    right: 6,
    height: 18,
    width: 18,
    padding: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: "100%",
  },
  profileButton: {
    position: "relative",
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 40,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  searchInput: {
    fontSize: RFValue(16),
    flex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    // paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  activeFilterTab: {
    // Styles applied in renderFilterTab
  },
  filterText: {
    fontSize: RFValue(14),
    fontWeight: "500",
  },
  filterBadge: {
    borderRadius: 8,
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: "center",
  },
  filterBadgeText: {
    color: "white",
    fontSize: RFValue(11),
    fontWeight: "600",
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: "row",
    // paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  chatName: {
    fontSize: RFValue(16),
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
  chatTime: {
    fontSize: RFValue(12),
    fontWeight: "400",
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMessage: {
    fontSize: RFValue(14),
    flex: 1,
    marginRight: 10,
    lineHeight: 18,
  },
  unreadBadge: {
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    minWidth: 20,
    alignItems: "center",
  },
  unreadText: {
    color: "white",
    fontSize: RFValue(11),
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabIcon: {
    color: "white",
    fontSize: RFValue(24),
    fontWeight: "300",
  },
});

export default ChatsPage;
