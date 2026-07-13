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
  const custom = styles(colors, isDarkMode);
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
    <SafeAreaViewContainer disableBottom>
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
          contentContainerStyle={{ gap: RFValue(8) }}
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
                  className="rounded-full py-1.5 px-3.5 border flex-row items-center gap-1.5"
                >
                  {item.icons && (
                    <Image
                      source={item.icons}
                      className="size-3.5"
                      style={{ tintColor: isActive ? colors.slate[650] : colors.slate[500] }}
                    />
                  )}

                  <Text
                    style={{
                      color: isActive ? colors.slate[650] : colors.slate[550],
                      fontSize: RFValue(11.5),
                      fontWeight: isActive ? "600" : "500",
                    }}
                    className="capitalize"
                  >
                    {item.name}
                  </Text>

                  {showBadge && (
                    <View
                      style={{
                        minWidth: RFValue(14),
                        height: RFValue(14),
                        borderRadius: RFValue(7),
                        backgroundColor: colors.error[200],
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 2,
                        marginLeft: 2,
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: RFValue(8), fontWeight: "bold" }}>
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
            contentContainerStyle={{ gap: RFValue(12), paddingBottom: RFValue(30) }}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            renderItem={({ item }) => {
              const isUnread = !item.is_read;
              const isBell = item.notification_type?.toLowerCase().includes("bell") || true;

              return (
                <Pressable
                  onPress={() => handleNotificationPress(item)}
                  style={[
                    {
                      backgroundColor: isDarkMode ? colors.slate[100] : "#FFFFFF",
                      borderWidth: 1,
                      borderColor: isDarkMode ? colors.slate[200] : colors.slate[200],
                    },
                    custom.shadow,
                  ]}
                  className="flex flex-row gap-4 p-4 rounded-2xl"
                >
                  <View
                    style={{ backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[150] }}
                    className="size-[44px] flex flex-row items-center justify-center rounded-full"
                  >
                    <Image
                      source={
                        isBell
                          ? require("@/assets/icons/notification.png")
                          : require("@/assets/icons/Lock.png")
                      }
                      className="size-5"
                      style={{ tintColor: colors.slate[650] }}
                    />
                  </View>

                  <View className="flex-1 gap-2.5">
                    <View>
                      <View className="flex flex-row items-start justify-between">
                        <Text style={custom.itemTitle} className="flex-1 mr-2" numberOfLines={1}>
                          {item.title}
                        </Text>

                        <View className="flex flex-row items-center gap-1.5 mt-0.5">
                          <Text style={custom.itemTime}>
                            {formatTimeAgo(item.date_created)}
                          </Text>
                          {isUnread && (
                            <View className="w-2 h-2 rounded-full bg-red-500" />
                          )}
                        </View>
                      </View>

                      <Text style={custom.itemMessage}>
                        {item.message || ""}
                      </Text>
                    </View>

                    <View className="flex flex-row items-center gap-1 mt-0.5">
                      <Text style={custom.itemAction}>
                        {getActionText(item)}
                      </Text>

                      <Image
                        source={
                          getActionText(item) === "Download receipt"
                            ? require("@/assets/icons/Download - Iconly Pro.png")
                            : isDarkMode
                              ? require("@/assets/icons/arrow-right-light.png")
                              : require("@/assets/icons/arrow-right-dark.png")
                        }
                        className="size-4"
                        style={{ tintColor: isDarkMode ? colors.info[200] : colors.info[300] }}
                      />
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

const styles = (colors: ColorScheme, isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    itemTitle: {
      fontSize: RFValue(13.5),
      fontWeight: "600",
      color: colors.slate[650],
      lineHeight: RFValue(18),
    },
    itemMessage: {
      fontSize: RFValue(12),
      color: colors.slate[600],
      lineHeight: RFValue(16.5),
      marginTop: RFValue(2),
    },
    itemAction: {
      fontSize: RFValue(12.5),
      fontWeight: "600",
      color: isDarkMode ? colors.info[200] : colors.info[300],
    },
    itemTime: {
      fontSize: RFValue(10.5),
      color: colors.slate[500],
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.15 : 0.04,
      shadowRadius: 6,
      elevation: 2,
    },
  });
