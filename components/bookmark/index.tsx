import { useTheme } from "@/contexts/themeContext";
import { useMyBookmarks, useTogglePropertyBookmark } from "@/hooks";
import { ColorScheme } from "@/utils";
import React, { useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const BookmarkButton = ({
  id,
  showLabel = false,
}: {
  id: string;
  showLabel?: boolean;
}) => {
  const [bookmarkOverrides, setBookmarkOverrides] = useState<
    Record<string, boolean>
  >({});
  const [bookmarkPendingIds, setBookmarkPendingIds] = useState<
    Record<string, boolean>
  >({});
  const { isDarkMode, colors } = useTheme();

  const styles = createStyles(colors);
  const { bookmarkedPropertyIds } = useMyBookmarks({ enabled: true });
  const { togglePropertyBookmarkMutation } = useTogglePropertyBookmark();

  const bookmarkedSet = useMemo(
    () => new Set(bookmarkedPropertyIds),
    [bookmarkedPropertyIds],
  );

  const isBookmarked = (propertyId: string) =>
    bookmarkOverrides[propertyId] ?? bookmarkedSet.has(propertyId);

  const handleToggleBookmark = async (propertyId: string) => {
    if (bookmarkPendingIds[propertyId]) return;
    const current = isBookmarked(propertyId);

    setBookmarkPendingIds((prev) => ({ ...prev, [propertyId]: true }));
    setBookmarkOverrides((prev) => ({ ...prev, [propertyId]: !current }));

    try {
      const response = await togglePropertyBookmarkMutation({ propertyId });
      const next =
        response.bookmarked.status === "added"
          ? true
          : response.bookmarked.status === "removed"
            ? false
            : !current;
      setBookmarkOverrides((prev) => ({ ...prev, [propertyId]: next }));
    } catch {
      setBookmarkOverrides((prev) => ({ ...prev, [propertyId]: current }));
    } finally {
      setBookmarkPendingIds((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  const bookmarked = isBookmarked(id);

  return (
    <TouchableOpacity
      onPress={() => handleToggleBookmark(id)}
      disabled={!!bookmarkPendingIds[id]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      className="pt-0.5 flex flex-row gap-4 items-center"
    >
      <Image
        source={
          bookmarked
            ? require("@/assets/icons/bookmark-light-active.png")
            : isDarkMode
              ? require("@/assets/icons/bookmark-inactive-white.png")
              : require("@/assets/icons/bookmark-inactive.png")
        }
        style={{ height: RFValue(22), width: RFValue(17) }}
      />
      {showLabel && (
        <View>
          <Text style={styles.optionsMenuText}>Bookmark</Text>
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
