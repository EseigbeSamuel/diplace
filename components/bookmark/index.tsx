import { useTheme } from "@/contexts/themeContext";
import { useMyBookmarks, useTogglePropertyBookmark } from "@/hooks";
import { ColorScheme } from "@/utils";
import React, { useMemo, useState } from "react";
import {
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface BookmarkButtonProps {
  id: string;
  showLabel?: boolean;
  isBookmarked?: boolean;
  disabled?: boolean;
  onToggle?: () => void;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  activeIcon?: ImageSourcePropType;
  inactiveIcon?: ImageSourcePropType;
  showToastNotification?: boolean;
}

const BookmarkButton = ({
  id,
  showLabel = false,
  isBookmarked: controlledIsBookmarked,
  disabled = false,
  onToggle: controlledOnToggle,
  size,
  containerStyle,
  iconStyle,
  activeIcon,
  inactiveIcon,
  showToastNotification = true,
}: BookmarkButtonProps) => {
  const [bookmarkOverrides, setBookmarkOverrides] = useState<
    Record<string, boolean>
  >({});
  const [bookmarkPendingIds, setBookmarkPendingIds] = useState<
    Record<string, boolean>
  >({});
  const { isDarkMode, colors } = useTheme();

  const styles = createStyles(colors);
  const isControlled = controlledIsBookmarked !== undefined;

  const { bookmarkedPropertyIds } = useMyBookmarks({ enabled: !isControlled });
  const { togglePropertyBookmarkMutation } = useTogglePropertyBookmark();

  const bookmarkedSet = useMemo(
    () => new Set(bookmarkedPropertyIds),
    [bookmarkedPropertyIds],
  );

  const isCurrentBookmarked = isControlled
    ? controlledIsBookmarked
    : (bookmarkOverrides[id] ?? bookmarkedSet.has(id));

  const isPending = !!bookmarkPendingIds[id] || disabled;

  const handleToggleBookmark = async (e?: GestureResponderEvent) => {
    e?.stopPropagation?.();
    if (isPending) return;

    if (controlledOnToggle) {
      controlledOnToggle();
      return;
    }

    const current = isCurrentBookmarked;
    setBookmarkPendingIds((prev) => ({ ...prev, [id]: true }));
    setBookmarkOverrides((prev) => ({ ...prev, [id]: !current }));

    try {
      const response = await togglePropertyBookmarkMutation({
        propertyId: id,
        notify: showToastNotification,
      });
      const next =
        response.bookmarked?.status === "added"
          ? true
          : response.bookmarked?.status === "removed"
            ? false
            : !current;
      setBookmarkOverrides((prev) => ({ ...prev, [id]: next }));
    } catch {
      setBookmarkOverrides((prev) => ({ ...prev, [id]: current }));
    } finally {
      setBookmarkPendingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const iconWidth = size ? RFValue(size) : RFValue(17);
  const iconHeight = size ? RFValue(size * 1.3) : RFValue(22);

  const resolvedActiveIcon =
    activeIcon ?? require("@/assets/icons/bookmark-light-active.png");
  const resolvedInactiveIcon =
    inactiveIcon ??
    (isDarkMode
      ? require("@/assets/icons/bookmark-inactive-white.png")
      : require("@/assets/icons/bookmark-inactive.png"));

  return (
    <TouchableOpacity
      onPress={handleToggleBookmark}
      disabled={isPending}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      className="pt-0.5 flex flex-row gap-4 items-center"
      style={containerStyle}
    >
      <Image
        source={isCurrentBookmarked ? resolvedActiveIcon : resolvedInactiveIcon}
        style={[{ height: iconHeight, width: iconWidth }, iconStyle]}
        resizeMode="contain"
      />
      {showLabel && (
        <View>
          <Text style={styles.optionsMenuText}>
            {isCurrentBookmarked ? "Bookmarked" : "Bookmark"}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default BookmarkButton;

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    optionsMenuText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
  });
