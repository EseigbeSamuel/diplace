// src/components/common/Header.tsx
import { useTheme } from "@/contexts/themeContext";
import { useGetCurrentUser, useNotificationUnreadCount } from "@/hooks";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface HeaderProps {
  title: string | React.ReactNode;
}

export const AppHeader = (props: HeaderProps) => {
  const { colors, isDarkMode } = useTheme();
  const { currentUser } = useGetCurrentUser();
  const { unreadCount } = useNotificationUnreadCount();
  const headerStyles = styles(colors);
  const router = useRouter();

  return (
    <View style={headerStyles.container} className="flex-row justify-between">
      {typeof props.title === "string" ? (
        <Text style={headerStyles.title} className="text-2xl font-bold">
          {props.title}
        </Text>
      ) : (
        props.title
      )}

      <View className="flex-row items-end gap-2">
        <View
          style={{ backgroundColor: colors.slate[150] }}
          className="h-[48px] w-[48px] rounded-full relative justify-center items-center"
        >
          <Pressable onPress={() => router.push("/views/notifications")}>
            <Image
              source={
                isDarkMode
                  ? require("@/assets/icons/notification-light.png")
                  : require("@/assets/icons/notification.png")
              }
            />
          </Pressable>
          {unreadCount > 0 && (
            <View
              style={{ backgroundColor: colors.error[200] }}
              className="absolute -top-1 -right-1 items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full"
            >
              <Text className="text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </View>
        <Pressable
          onPress={() => router.push("/views/profile")}
          className="h-[48px] w-[48px] rounded-full"
          style={{ backgroundColor: colors.slate[150] }}
        >
          <Image
            source={
              currentUser?.profile_picture &&
              currentUser?.profile_picture?.length > 6
                ? { uri: currentUser?.profile_picture }
                : require("@/assets/images/sammy.jpg")
            }
            className="h-[48px] w-[48px] rounded-full"
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = (colors: ColorScheme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      color: colors.slate[650],
    },
    title: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
  });
};
