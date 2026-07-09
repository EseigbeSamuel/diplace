import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { NotesTabs } from "@/constants/mockNotifications";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  useMyNotifications,
  useNotificationUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks";
import { NotificationItem } from "@/types";

const Notifications = () => {
  const { colors, isDarkMode } = useTheme();
  const custom = styles(colors);
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    notifications,
    isNotificationsLoading,
    refetchNotifications,
  } = useMyNotifications({
    limit: 100,
  });

  const {
    unreadCount,
    refetchUnreadCount,
  } = useNotificationUnreadCount();

  const { markReadMutation } = useMarkNotificationRead();
  const { markAllReadMutation } = useMarkAllNotificationsRead();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchNotifications(),
      refetchUnreadCount(),
    ]);
    setIsRefreshing(false);
  };

  const handleNotificationPress = async (item: NotificationItem) => {
    if (!item.is_read) {
      try {
        await markReadMutation({ notificationId: item.public_id });
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return "Recently";
    const now = Date.now();
    const then = new Date(dateString).getTime();
    const diffMs = Math.max(0, now - then);
    const minMs = 60 * 1000;
    const hourMs = 60 * minMs;
    const dayMs = 24 * hourMs;

    const days = Math.floor(diffMs / dayMs);
    if (days >= 1) {
      if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
      const months = Math.floor(days / 30);
      if (months < 12) {
        return `${months} month${months === 1 ? "" : "s"} ago`;
      }
      const years = Math.floor(months / 12);
      return `${years} year${years === 1 ? "" : "s"} ago`;
    }

    const hours = Math.floor(diffMs / hourMs);
    if (hours >= 1) {
      return `${hours} hr${hours === 1 ? "" : "s"} ago`;
    }

    const mins = Math.floor(diffMs / minMs);
    if (mins >= 1) {
      return `${mins} min${mins === 1 ? "" : "s"} ago`;
    }

    return "Just now";
  };

  const getActionText = (item: NotificationItem) => {
    const type = item.notification_type?.toLowerCase() || "";
    if (type.includes("payment")) {
      return "Download receipt";
    }
    if (type.includes("inspection")) {
      return "View schedule";
    }
    if (type.includes("booking")) {
      return "Complete booking";
    }
    return "View details";
  };

  const filteredNotes = useMemo(() => {
    const tab = activeTab.toLowerCase();
    switch (tab) {
      case "unread":
        return notifications.filter((note) => !note.is_read);

      case "previous":
        return notifications.filter((note) => note.is_read);

      case "date":
        return [...notifications].sort(
          (a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime(),
        );

      case "all":
      default:
        return notifications;
    }
  }, [activeTab, notifications]);

  return (
    <SafeAreaViewContainer>
      <SectionHeader
        title="Notification"
        rightIconView={
          unreadCount > 0 ? (
            <Pressable
              onPress={() => markAllReadMutation()}
              style={{ backgroundColor: colors.slate[150] }}
              className="px-3 py-1.5 rounded-full"
            >
              <Text
                style={{ color: colors.slate[650], fontSize: RFValue(11) }}
                className="font-semibold"
              >
                Mark all read
              </Text>
            </Pressable>
          ) : undefined
        }
      />

      <View className="mb-4">
        <FlatList
          data={NotesTabs}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-4 px-4"
          renderItem={({ item }) => {
            const isActive = activeTab.toLowerCase() === item.name.toLowerCase();
            const showBadge = item.name.toLowerCase() === "unread" && unreadCount > 0;

            return (
              <Pressable onPress={() => setActiveTab(item.name)}>
                <View
                  style={{
                    borderColor: isActive
                      ? colors.slate[650]
                      : colors.slate[300],
                    backgroundColor: isActive
                      ? colors.slate[150]
                      : "transparent",
                  }}
                  className="rounded-full py-2.5 px-4 border flex-row items-center gap-2"
                >
                  {item.icons && (
                    <Image source={item.icons} className="size-4" />
                  )}

                  <Text
                    style={{
                      color: isActive ? colors.slate[650] : colors.slate[600],
                      fontSize: RFValue(13),
                    }}
                    className="capitalize font-medium"
                  >
                    {item.name}
                  </Text>

                  {showBadge && (
                    <View
                      style={{
                        minWidth: 18,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: "red",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 4,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>
                        {unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      </View>

      <View className="flex-1 w-full">
        {isNotificationsLoading && !isRefreshing ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.slate[650]} />
          </View>
        ) : filteredNotes.length === 0 ? (
          <View className="flex-1 items-center justify-center p-6">
            <Image
              source={require("@/assets/icons/notification.png")}
              className="size-12 opacity-30 mb-2"
              style={{ tintColor: colors.slate[500] }}
            />
            <Text style={{ color: colors.slate[500] }} className="text-center font-medium">
              No notifications found
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            contentContainerClassName="gap-4 p-4 pb-10"
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            renderItem={({ item }) => {
              const isUnread = !item.is_read;
              const isBell = item.notification_type?.toLowerCase().includes("bell") || true;

              return (
                <Pressable
                  onPress={() => handleNotificationPress(item)}
                  style={[{ backgroundColor: colors.background }, custom.shadow]}
                  className="flex flex-row gap-4 p-4 rounded-2xl"
                >
                  <View className="p-3 size-[50px] flex flex-row items-center justify-center rounded-full bg-gray-100">
                    <Image
                      source={
                        isBell
                          ? require("@/assets/icons/notification.png")
                          : require("@/assets/icons/Lock.png")
                      }
                      className="size-6"
                    />
                  </View>

                  <View className="flex-1 gap-3">
                    <View>
                      <View className="flex flex-row items-center justify-between">
                        <Text style={custom.smallDark} className="font-semibold flex-1 mr-2">
                          {item.title}
                        </Text>

                        <View className="flex flex-row items-center gap-2">
                          <Text
                            style={custom.tiny}
                            className="text-xs text-gray-500"
                          >
                            {formatTimeAgo(item.date_created)}
                          </Text>
                          {isUnread && (
                            <View className="w-2.5 h-2.5 rounded-full bg-red-600" />
                          )}
                        </View>
                      </View>

                      <Text style={custom.smallDark} className="text-gray-600 mt-1">
                        {item.message || item.description || ""}
                      </Text>
                    </View>

                    <View className="flex flex-row items-center gap-2">
                      <Text
                        style={custom.smallDark}
                        className="text-primary-600 font-medium"
                      >
                        {getActionText(item)}
                      </Text>

                      {isDarkMode ? (
                        <Image
                          source={
                            getActionText(item) === "Download receipt"
                              ? require("@/assets/icons/Download - Iconly Pro.png")
                              : require("@/assets/icons/arrow-right-light.png")
                          }
                          className="size-[20px]"
                        />
                      ) : (
                        <Image
                          source={
                            getActionText(item) === "Download receipt"
                              ? require("@/assets/icons/Download - Iconly Pro.png")
                              : require("@/assets/icons/arrow-right-dark.png")
                          }
                          className="size-[20px]"
                        />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            }}
            keyExtractor={(item) => item.public_id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaViewContainer>
  );
};

export default Notifications;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    container2: { backgroundColor: colors.slate[150] },
    border: {
      borderColor: colors.slate[300],
    },
    big: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    title: {
      fontSize: RFValue(20),
      lineHeight: RFValue(28),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(16),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    small: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    smallDark: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    tiny: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[650],
    },
    shadow: {
      shadowColor: colors.slate[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
    },
  });
