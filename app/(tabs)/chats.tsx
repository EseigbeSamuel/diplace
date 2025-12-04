import { mockChats } from "@/constants/mockChats";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const filterTabs = ["All", "Unread", "Read", "Dates"];

interface ChatItemProps {
  item: (typeof mockChats)[0];
  colors: ColorScheme;
}

// Notification Bell Icon Component
const BellIcon = ({ color }: { color: string }) => (
  <View style={[styles.bellIcon, { backgroundColor: color }]}>
    <Image source={require("@/assets/icons/notification.png")} />
  </View>
);

// Verified Badge Component
const VerifiedBadge = () => (
  <View style={styles.verifiedBadge}>
    <Image source={require("@/assets/icons/badge-check-green.png")} />
  </View>
);

const ChatItem: React.FC<ChatItemProps> = ({ item, colors }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[styles.chatItem, { backgroundColor: colors.background }]}
      onPress={() => router.push("/views/chat/[id]")}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && (
          <View
            style={[
              styles.onlineIndicator,
              {
                backgroundColor: colors.success[200],
                borderColor: colors.background,
              },
            ]}
          />
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <View style={styles.nameContainer}>
            <Text
              style={[styles.chatName, { color: colors.slate[650] }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {item.isVerified && <VerifiedBadge />}
          </View>
          <Text style={[styles.chatTime, { color: colors.slate[500] }]}>
            {item.time}
          </Text>
        </View>

        <View style={styles.messageContainer}>
          <Text
            style={[
              styles.chatMessage,
              { color: colors.slate[500] },
              item.unread > 0 && {
                color: colors.slate[600],
                fontWeight: "500",
              },
            ]}
            numberOfLines={1}
          >
            {item.message || "No messages yet"}
          </Text>
          {item.unread > 0 && (
            <View
              style={[
                styles.unreadBadge,
                { backgroundColor: colors.error[200] },
              ]}
            >
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ChatsPage: React.FC = () => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredChats = mockChats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Unread") return matchesSearch && chat.unread > 0;
    if (activeFilter === "Read") return matchesSearch && chat.unread === 0;
    return matchesSearch;
  });

  const renderChatItem = ({ item }: { item: (typeof mockChats)[0] }) => (
    <ChatItem item={item} colors={colors} />
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
      {tab === "Unread" && mockChats.some((chat) => chat.unread > 0) && (
        <View
          style={[styles.filterBadge, { backgroundColor: colors.error[200] }]}
        >
          <Text style={styles.filterBadgeText}>
            {mockChats.filter((chat) => chat.unread > 0).length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.slate[650] }]}>
            Chats
          </Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <BellIcon color={colors.slate[400]} />
              <View
                style={[
                  styles.notificationDot,
                  { backgroundColor: colors.error[200] },
                ]}
              >
                <Text style={{ color: "white" }}>5</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/10.jpg",
                }}
                style={styles.profileAvatar}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View
        style={[styles.searchContainer, { backgroundColor: colors.slate[200] }]}
      >
        <View style={[styles.searchIcon]}>
          <Image
            source={require("@/assets/icons/search.png")}
            style={{ width: 38, height: 38 }}
          />
        </View>
        <TextInput
          style={[styles.searchInput, { color: colors.slate[650] }]}
          placeholder="Search"
          placeholderTextColor={colors.slate[500]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filterTabs.map(renderFilterTab)}
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatListContent}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.slate[650] }]}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
