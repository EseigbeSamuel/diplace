// src/components/common/Header.tsx
import { useGetCurrentUser } from "@/hooks";
import { useTheme } from "@/contexts/themeContext";
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
  const headerStyles = styles(colors);
  const router = useRouter();

  const normalizeImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/")) return `https://diplace.api.elsoft.ng${url}`;
    return `https://diplace.api.elsoft.ng/${url}`;
  };

  const profileImageUrl = normalizeImageUrl(currentUser?.profile_picture);

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
          <View className="absolute top-0 right-0 items-center justify-center w-[18px] h-[18px] font-semibold bg-red-500 rounded-full">
            <Text className="text-xs text-white">2</Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push("/views/profile")}
          className="h-[48px] w-[48px] rounded-full"
          style={{ backgroundColor: colors.slate[150] }}
        >
          <Image
            source={
              profileImageUrl
                ? { uri: profileImageUrl }
                : require("@/assets/images/user.png")
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
