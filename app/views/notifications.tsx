import { Notification } from "@/assets/icons";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { NotesTabs } from "@/constants/mockNotifications";
import { useTheme } from "@/contexts/themeContext";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMyNotifications,
  useNotificationUnreadCount,
} from "@/hooks";
import { showToast } from "@/lib";
import { NotificationItem } from "@/types";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface ActionMeta {
  text: string;
  icon: "download" | "arrow";
  avatarKind: "d" | "bell";
  onAction: () => void;
}

const Notifications = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const custom = styles(colors, isDarkMode);
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { notifications, isNotificationsLoading, refetchNotifications } =
    useMyNotifications({
      limit: 100,
    });

  const { unreadCount, refetchUnreadCount } = useNotificationUnreadCount();

  const { markReadMutation } = useMarkNotificationRead();
  const { markAllReadMutation } = useMarkAllNotificationsRead();
  const { deleteNotificationMutation } = useDeleteNotification();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchNotifications(), refetchUnreadCount()]);
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

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDeleteNotification = (item: NotificationItem) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNotificationMutation({
                notificationId: item.public_id,
              });
            } catch (error) {
              console.error("Failed to delete notification:", error);
            }
          },
        },
      ],
    );
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "Recently";

    if (
      dateString.includes("ago") ||
      dateString.toLowerCase().includes("yesterday") ||
      dateString.includes(",")
    ) {
      return dateString;
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - date.getTime());

    if (diffMs < 60 * 1000) {
      return "Just now";
    }

    const mins = Math.floor(diffMs / (60 * 1000));
    if (mins < 60) {
      return `${mins} mins ago`;
    }

    const isToday =
      now.getDate() === date.getDate() &&
      now.getMonth() === date.getMonth() &&
      now.getFullYear() === date.getFullYear();

    if (isToday) {
      const hours = Math.floor(diffMs / (60 * 60 * 1000));
      return `${hours} hr${hours === 1 ? "" : "s"} ago`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      yesterday.getDate() === date.getDate() &&
      yesterday.getMonth() === date.getMonth() &&
      yesterday.getFullYear() === date.getFullYear();

    if (isYesterday) {
      return "Yesterday";
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const getNotificationMeta = (item: NotificationItem): ActionMeta => {
    const type = (item.notification_type || "").toLowerCase();
    const title = (item.title || "").toLowerCase();
    const explicitText = item.data?.action_text || (item as any).action;

    const navigateToTarget = (
      defaultRoute: string,
      params?: Record<string, any>,
    ) => {
      if (item.action_url) {
        if (
          item.action_url.startsWith("http://") ||
          item.action_url.startsWith("https://")
        ) {
          Linking.openURL(item.action_url).catch(() => {});
          return;
        }
        router.push(item.action_url as any);
        return;
      }
      if (params) {
        router.push({ pathname: defaultRoute as any, params });
      } else {
        router.push(defaultRoute as any);
      }
    };

    // 1. Payment successful / Receipt
    if (
      type.includes("payment") ||
      title.includes("payment") ||
      title.includes("receipt") ||
      title.includes("paid")
    ) {
      return {
        text: explicitText || "Download receipt",
        icon: "download",
        avatarKind: "d",
        onAction: () => {
          if (item.data?.receipt_url) {
            Linking.openURL(item.data.receipt_url).catch(() => {});
            return;
          }
          navigateToTarget("/views/inspection/payment-receipt");
        },
      };
    }

    // 2. Inspection scheduled
    if (type.includes("inspection") || title.includes("inspection")) {
      return {
        text: explicitText || "View schedule",
        icon: "arrow",
        avatarKind: "bell",
        onAction: () => {
          const scheduleId = item.data?.inspection_id || item.data?.booking_id;
          if (scheduleId) {
            navigateToTarget("/views/activities/activity-schedule/[index]", {
              index: scheduleId,
              role: "renter",
              status: "scheduled",
              title: item.title,
            });
          } else {
            navigateToTarget("/views/activities/todayActivity");
          }
        },
      };
    }

    // 3. Booking / Reminder
    if (
      type.includes("booking") ||
      title.includes("reminder") ||
      title.includes("booking") ||
      title.includes("space")
    ) {
      const isSchedule = title.includes("schedule");
      return {
        text:
          explicitText || (isSchedule ? "View schedule" : "Complete booking"),
        icon: "arrow",
        avatarKind: "bell",
        onAction: () => {
          if (item.data?.booking_id || item.data?.property_id) {
            navigateToTarget("/views/booking/booking-summary");
          } else {
            navigateToTarget("/(tabs)/spaces");
          }
        },
      };
    }

    // 4. Property / Listing Alert
    if (
      type.includes("property") ||
      title.includes("listing") ||
      title.includes("apartment") ||
      title.includes("alert")
    ) {
      return {
        text: explicitText || "View listing",
        icon: "arrow",
        avatarKind: "d",
        onAction: () => {
          const propertyId =
            item.data?.property_id || item.data?.listing_id || item.data?.id;
          if (propertyId) {
            navigateToTarget("/views/place-details/[id]", { id: propertyId });
          } else {
            navigateToTarget("/(tabs)/discover");
          }
        },
      };
    }

    // 5. System / App Update
    if (
      type.includes("system") ||
      title.includes("update") ||
      title.includes("app")
    ) {
      return {
        text: explicitText || "View update",
        icon: "arrow",
        avatarKind: "d",
        onAction: () => {
          if (item.action_url) {
            navigateToTarget(item.action_url);
            return;
          }
          showToast({
            type: "info",
            text1: item.title || "App Update",
            text2:
              item.message || "You are using the latest version of Diplace.",
          });
        },
      };
    }

    // 6. Review
    if (type.includes("review") || title.includes("review")) {
      return {
        text: explicitText || "Leave review",
        icon: "arrow",
        avatarKind: "bell",
        onAction: () => {
          navigateToTarget("/views/reviews/reviews");
        },
      };
    }

    // 7. Agent
    if (
      type.includes("agent") ||
      title.includes("agent") ||
      title.includes("message")
    ) {
      return {
        text: explicitText || "View message",
        icon: "arrow",
        avatarKind: "bell",
        onAction: () => {
          if (item.data?.chat_id) {
            navigateToTarget("/views/chat/[id]", { id: item.data.chat_id });
          } else {
            navigateToTarget("/(tabs)/chats");
          }
        },
      };
    }

    // 8. Promotion
    if (
      type.includes("promotion") ||
      title.includes("promo") ||
      title.includes("offer")
    ) {
      return {
        text: explicitText || "View offer",
        icon: "arrow",
        avatarKind: "d",
        onAction: () => {
          navigateToTarget("/(tabs)/discover");
        },
      };
    }

    // Fallback
    const isBellFallback = (item as any).type === "bell";
    return {
      text: explicitText || "View details",
      icon: "arrow",
      avatarKind: isBellFallback ? "bell" : "d",
      onAction: () => {
        if (item.action_url) {
          navigateToTarget(item.action_url);
        }
      },
    };
  };

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const timeA = a.date_created ? new Date(a.date_created).getTime() : 0;
      const timeB = b.date_created ? new Date(b.date_created).getTime() : 0;
      return timeB - timeA;
    });
  }, [notifications]);

  const filteredNotes = useMemo(() => {
    const tab = activeTab.toLowerCase();
    switch (tab) {
      case "unread":
        return sortedNotifications.filter((note) => !note.is_read);

      case "previous":
        return sortedNotifications.filter((note) => note.is_read);

      case "dates":
      case "date":
      case "all":
      default:
        return sortedNotifications;
    }
  }, [activeTab, sortedNotifications]);

  return (
    <SafeAreaViewContainer disableBottom>
      <SectionHeader
        title="Notifications"
        rightIconView={
          unreadCount > 0 ? (
            <Pressable
              onPress={handleMarkAllRead}
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
            const isActive =
              activeTab.toLowerCase() === item.name.toLowerCase();
            const showBadge =
              item.name.toLowerCase() === "unread" && unreadCount > 0;

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
                      style={{
                        tintColor: isActive
                          ? colors.slate[650]
                          : colors.slate[500],
                      }}
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
                        minWidth: RFValue(15),
                        height: RFValue(15),
                        borderRadius: RFValue(7.5),
                        backgroundColor: colors.error[200],
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 3,
                        marginLeft: 2,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: RFValue(8),
                          fontWeight: "bold",
                        }}
                      >
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
            {/* <Image
              source={require("@/assets/icons/notification.png")}
              className="size-12 opacity-30 mb-2"
              style={{ tintColor: colors.slate[500] }}
            /> */}
            <Notification color={colors.slate[500]} size={48} />
            <Text
              style={{ color: colors.slate[500] }}
              className="text-center font-medium"
            >
              No notifications found
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            contentContainerStyle={{
              gap: RFValue(12),
              paddingBottom: RFValue(30),
            }}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            renderItem={({ item }) => {
              const isUnread = !item.is_read;
              const meta = getNotificationMeta(item);

              return (
                <Pressable
                  onPress={() => {
                    handleNotificationPress(item);
                    meta.onAction();
                  }}
                  onLongPress={() => handleDeleteNotification(item)}
                  style={[
                    {
                      backgroundColor: isDarkMode
                        ? colors.slate[100]
                        : "#FFFFFF",
                      borderWidth: 1,
                      borderColor: isDarkMode
                        ? colors.slate[200]
                        : colors.slate[200],
                    },
                    custom.shadow,
                  ]}
                  className="flex flex-row items-start gap-3.5 p-4 rounded-2xl"
                >
                  {/* Left Icon / Avatar: 'D' letter badge or Bell icon */}
                  <View
                    style={{
                      backgroundColor: isDarkMode
                        ? colors.slate[200]
                        : colors.slate[150],
                      width: RFValue(40),
                      height: RFValue(40),
                      borderRadius: RFValue(20),
                    }}
                    className="items-center justify-center"
                  >
                    {meta.avatarKind === "d" ? (
                      <Text
                        style={{
                          color: colors.slate[650],
                          fontSize: RFValue(15),
                          fontWeight: "700",
                        }}
                      >
                        D
                      </Text>
                    ) : (
                      // <Image
                      //   source={
                      //     isDarkMode
                      //       ? require("@/assets/icons/notification-light.png")
                      //       : require("@/assets/icons/notification.png")
                      //   }
                      //   style={{
                      //     width: RFValue(18),
                      //     height: RFValue(18),
                      //     tintColor: colors.slate[650],
                      //   }}
                      //   resizeMode="contain"
                      // />
                      <Notification color={colors.slate[650]} size={18} />
                    )}
                  </View>

                  {/* Body */}
                  <View className="flex-1">
                    <View className="flex flex-row items-start justify-between">
                      <Text
                        style={custom.itemTitle}
                        className="flex-1 mr-2"
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>

                      <View className="flex flex-row items-center gap-1.5 mt-0.5">
                        <Text style={custom.itemTime}>
                          {formatTime(item.date_created || (item as any).date)}
                        </Text>
                        {isUnread && (
                          <View
                            style={{
                              width: RFValue(6.5),
                              height: RFValue(6.5),
                              borderRadius: RFValue(3.5),
                              backgroundColor: "#EF4444",
                            }}
                          />
                        )}
                      </View>
                    </View>

                    <Text style={custom.itemMessage} className="mt-1">
                      {item.message || (item as any).desc || ""}
                    </Text>

                    {/* Action link */}
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation?.();
                        handleNotificationPress(item);
                        meta.onAction();
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      className="flex flex-row items-center gap-1.5 self-start mt-2.5"
                    >
                      <Text style={custom.itemAction}>{meta.text}</Text>

                      <Image
                        source={
                          meta.icon === "download"
                            ? require("@/assets/icons/Download - Iconly Pro.png")
                            : isDarkMode
                              ? require("@/assets/icons/arrow-right-light.png")
                              : require("@/assets/icons/arrow-right-dark.png")
                        }
                        style={{
                          width: RFValue(14),
                          height: RFValue(14),
                          tintColor: colors.slate[650],
                        }}
                        resizeMode="contain"
                      />
                    </Pressable>
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
      fontSize: RFValue(13),
      fontWeight: "600",
      color: colors.slate[650],
      lineHeight: RFValue(18),
    },
    itemMessage: {
      fontSize: RFValue(11.5),
      color: colors.slate[600],
      lineHeight: RFValue(16.5),
    },
    itemAction: {
      fontSize: RFValue(12),
      fontWeight: "600",
      color: colors.slate[650],
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
