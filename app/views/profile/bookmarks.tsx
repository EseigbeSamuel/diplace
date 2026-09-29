import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import ViewHeader from "@/components/view-header";
import { useTheme } from "@/contexts/themeContext";
import { useInfiniteMyBookmarks, useTogglePropertyBookmark } from "@/hooks";
import { imageSourceFilter } from "@/lib/imageSourceFilter";
import { BookmarkItem } from "@/types";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const BookmarksScreen = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const styles = getStyles(colors, isDarkMode);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [pendingRemoveIds, setPendingRemoveIds] = useState<Set<string>>(
    new Set(),
  );
  const [optimisticHiddenIds, setOptimisticHiddenIds] = useState<Set<string>>(
    new Set(),
  );

  // Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    bookmarks,
    totalItems,
    isBookmarksLoading,
    isBookmarksFetching,
    isBookmarksFetchingNextPage,
    hasMoreBookmarks,
    bookmarksError,
    fetchMoreBookmarks,
    refetchBookmarks,
  } = useInfiniteMyBookmarks({
    params: debouncedQuery ? { q: debouncedQuery } : undefined,
    pageSize: 20,
    enabled: true,
  });

  const { togglePropertyBookmarkMutation } = useTogglePropertyBookmark();

  // Filter out any optimistically removed items
  const displayedBookmarks = useMemo(() => {
    return bookmarks.filter(
      (item) =>
        item.property?.public_id &&
        !optimisticHiddenIds.has(item.property.public_id),
    );
  }, [bookmarks, optimisticHiddenIds]);

  const handleOpenProperty = (propertyId: string) => {
    if (!propertyId) return;
    router.push({
      pathname: "/views/place-details/[id]",
      params: { id: propertyId },
    });
  };

  const handleRemoveBookmark = async (propertyId: string) => {
    if (!propertyId || pendingRemoveIds.has(propertyId)) return;

    // Optimistically mark as pending and hidden
    setPendingRemoveIds((prev) => new Set(prev).add(propertyId));
    setOptimisticHiddenIds((prev) => new Set(prev).add(propertyId));

    try {
      await togglePropertyBookmarkMutation({
        propertyId,
        notify: true,
      });
    } catch {
      // Revert optimistic removal on error
      setOptimisticHiddenIds((prev) => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
    } finally {
      setPendingRemoveIds((prev) => {
        const next = new Set(prev);
        next.delete(propertyId);
        return next;
      });
    }
  };

  const handleLoadMore = () => {
    if (!hasMoreBookmarks || isBookmarksFetchingNextPage) return;
    fetchMoreBookmarks();
  };

  const formatCurrency = (amount: number) =>
    `NGN ${new Intl.NumberFormat("en-NG").format(amount || 0)}`;

  const formatCostFrequency = (value?: string) =>
    value ? value.replace(/^per_/, "").replace(/_/g, " ") : "annum";

  const renderBadge = (item: BookmarkItem) => {
    const prop = item.property;
    if (prop.is_verified) {
      return (
        <View style={styles.badgeContainer}>
          <Image
            source={require("@/assets/icons/Shield Done.png")}
            style={styles.badgeIcon}
          />
          <Text style={styles.badgeText}>DiPlace</Text>
        </View>
      );
    }

    if (prop.listing_type === "sponsored") {
      return (
        <View style={styles.hotBadgeContainer}>
          <Image
            source={require("@/assets/icons/fire-b-fill.png")}
            style={styles.hotBadgeIcon}
          />
          <Text style={styles.hotBadgeText}>Hot Space</Text>
        </View>
      );
    }

    return null;
  };

  const renderItem = ({ item }: { item: BookmarkItem }) => {
    const prop = item.property;
    if (!prop) return null;

    const propertyId = prop.public_id;
    const isRemoving = pendingRemoveIds.has(propertyId);

    const locationText =
      [prop.address?.street, prop.address?.city, prop.address?.state]
        .filter(Boolean)
        .join(", ") || "Unknown location";

    const isNonAvailable =
      prop.status && !["available", "active", "approved"].includes(prop.status);

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => handleOpenProperty(propertyId)}
        style={styles.bookmarkCard}
      >
        {/* Image Container */}
        <View style={styles.imageWrap}>
          <Image
            source={imageSourceFilter(prop.media?.[0]?.file_url)}
            style={styles.bookmarkImage}
            resizeMode="cover"
          />

          {/* Status Overlay if Sold / Booked / Rented */}
          {isNonAvailable && (
            <View style={styles.statusOverlay}>
              <Text style={styles.statusOverlayText}>
                {prop.status.toUpperCase()}
              </Text>
            </View>
          )}

          {/* Bookmark Remove Button */}
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={(e) => {
              e.stopPropagation?.();
              handleRemoveBookmark(propertyId);
            }}
            disabled={isRemoving}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isRemoving ? (
              <ActivityIndicator size="small" color={colors.error[200]} />
            ) : (
              <Image
                source={require("@/assets/icons/bookmark-light-active.png")}
                style={styles.bookmarkIcon}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Card Info */}
        <View style={styles.bookmarkInfo}>
          <Text style={styles.bookmarkTitle} numberOfLines={2}>
            {prop.title}
          </Text>

          <View style={styles.bookmarkLocationRow}>
            <Image
              source={require("@/assets/icons/location.png")}
              style={styles.locationIcon}
              resizeMode="contain"
            />
            <Text style={styles.bookmarkLocation} numberOfLines={1}>
              {locationText}
            </Text>
          </View>

          <View style={styles.bookmarkFooter}>
            <Text style={styles.bookmarkPrice}>
              {formatCurrency(prop.price)}
              <Text style={styles.bookmarkPeriod}>
                /{formatCostFrequency(prop.cost_frequency)}
              </Text>
            </Text>

            {renderBadge(item)}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonList}>
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonInfo}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonLocation} />
            <View style={styles.skeletonFooter}>
              <View style={styles.skeletonPrice} />
              <View style={styles.skeletonBadge} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderEmptyState = () => {
    if (debouncedQuery) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Image
              source={require("@/assets/icons/search.png")}
              style={styles.emptyIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.emptyStateTitle}>No results found</Text>
          <Text style={styles.emptyStateText}>
            No bookmarks matched "{debouncedQuery}". Try another keyword.
          </Text>
          <TouchableOpacity
            style={styles.clearSearchBtn}
            onPress={() => setSearchQuery("")}
          >
            <Text style={styles.clearSearchBtnText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconCircle}>
          <Image
            source={require("@/assets/icons/bookmark-active-dark.png")}
            style={styles.emptyIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.emptyStateTitle}>No bookmarks yet</Text>
        <Text style={styles.emptyStateText}>
          Spaces you bookmark will be saved here so you can easily review them
          later.
        </Text>
        <View style={styles.emptyBtnWrap}>
          <AppButton
            title="Explore Spaces"
            onPress={() => router.push("/views/apartments")}
            size="medium"
          />
        </View>
      </View>
    );
  };

  const renderErrorState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIconCircle, { backgroundColor: colors.error[100] }]}>
        <Image
          source={require("@/assets/icons/bookmark-inactive.png")}
          style={[styles.emptyIcon, { tintColor: colors.error[200] }]}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.emptyStateTitle}>Unable to load bookmarks</Text>
      <Text style={styles.emptyStateText}>
        {bookmarksError instanceof Error
          ? bookmarksError.message
          : "Please check your network connection and try again."}
      </Text>
      <View style={styles.emptyBtnWrap}>
        <AppButton title="Retry" onPress={refetchBookmarks} size="medium" />
      </View>
    </View>
  );

  return (
    <SafeAreaViewContainer>
      {/* Header */}
      <ViewHeader title="Bookmarks" />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image
            source={require("@/assets/icons/search.png")}
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <TextInput
            placeholder="Search saved spaces..."
            placeholderTextColor={colors.slate[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image
                source={require("@/assets/icons/X-close.png")}
                style={styles.clearIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>

        {totalItems > 0 && !isBookmarksLoading && (
          <Text style={styles.countText}>
            {totalItems} {totalItems === 1 ? "saved space" : "saved spaces"}
          </Text>
        )}
      </View>

      {/* Main Content */}
      {isBookmarksLoading ? (
        renderSkeleton()
      ) : bookmarksError && displayedBookmarks.length === 0 ? (
        renderErrorState()
      ) : (
        <FlatList
          data={displayedBookmarks}
          keyExtractor={(item) => item.public_id || item.property?.public_id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              refreshing={isBookmarksFetching && !isBookmarksFetchingNextPage}
              onRefresh={refetchBookmarks}
              tintColor={colors.slate[650]}
              colors={[colors.slate[650]]}
            />
          }
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={
            isBookmarksFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.slate[650]} />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaViewContainer>
  );
};

export default BookmarksScreen;

const getStyles = (colors: ColorScheme, isDarkMode: boolean) =>
  StyleSheet.create({
    searchContainer: {
      marginBottom: RFValue(14),
      gap: RFValue(6),
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100],
      borderWidth: 1,
      borderColor: colors.slate[200],
      borderRadius: RFValue(12),
      paddingHorizontal: RFValue(12),
      height: RFValue(44),
      gap: RFValue(8),
    },
    searchIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[450],
    },
    searchInput: {
      flex: 1,
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontFamily: "InstrumentSansRegular",
      paddingVertical: 0,
    },
    clearIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[450],
    },
    countText: {
      fontSize: RFValue(12),
      color: colors.slate[500],
      fontFamily: "InstrumentSansMedium",
      paddingHorizontal: RFValue(2),
    },
    listContent: {
      paddingBottom: RFValue(40),
      gap: RFValue(18),
    },
    bookmarkCard: {
      backgroundColor: colors.background,
      borderRadius: RFValue(16),
      overflow: "hidden",
      borderWidth: 1,
      borderColor: isDarkMode ? colors.slate[200] : colors.slate[100],
    },
    imageWrap: {
      position: "relative",
      width: "100%",
      height: RFValue(180),
      backgroundColor: colors.slate[100],
    },
    bookmarkImage: {
      width: "100%",
      height: "100%",
    },
    statusOverlay: {
      position: "absolute",
      top: RFValue(12),
      left: RFValue(12),
      backgroundColor: "rgba(0,0,0,0.72)",
      paddingHorizontal: RFValue(10),
      paddingVertical: RFValue(4),
      borderRadius: RFValue(6),
    },
    statusOverlayText: {
      color: "#FFFFFF",
      fontSize: RFValue(10),
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    bookmarkButton: {
      position: "absolute",
      top: RFValue(12),
      right: RFValue(12),
      width: RFValue(36),
      height: RFValue(36),
      borderRadius: RFValue(18),
      backgroundColor: isDarkMode ? colors.slate[200] : "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 3,
    },
    bookmarkIcon: {
      width: RFValue(18),
      height: RFValue(18),
    },
    bookmarkInfo: {
      padding: RFValue(14),
      gap: RFValue(6),
    },
    bookmarkTitle: {
      fontSize: RFValue(16),
      fontFamily: "InstrumentSansSemiBold",
      color: colors.slate[650],
      lineHeight: RFValue(22),
    },
    bookmarkLocationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(5),
    },
    locationIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[500],
    },
    bookmarkLocation: {
      fontSize: RFValue(13),
      fontFamily: "InstrumentSansRegular",
      color: colors.slate[500],
      flex: 1,
    },
    bookmarkFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: RFValue(6),
      paddingTop: RFValue(6),
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? colors.slate[200] : colors.slate[100],
    },
    bookmarkPrice: {
      fontSize: RFValue(16),
      fontFamily: "InstrumentSansBold",
      color: colors.slate[650],
    },
    bookmarkPeriod: {
      fontSize: RFValue(13),
      fontFamily: "InstrumentSansRegular",
      color: colors.slate[500],
    },
    badgeContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? "rgba(245, 158, 11, 0.15)" : colors.warning[100],
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(4),
      borderRadius: RFValue(6),
      gap: RFValue(4),
    },
    badgeIcon: {
      width: RFValue(12),
      height: RFValue(12),
      tintColor: colors.warning[300],
    },
    badgeText: {
      fontSize: RFValue(11),
      fontFamily: "InstrumentSansSemiBold",
      color: colors.warning[300],
    },
    hotBadgeContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.15)" : colors.error[100],
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(4),
      borderRadius: RFValue(6),
      gap: RFValue(4),
    },
    hotBadgeIcon: {
      width: RFValue(12),
      height: RFValue(12),
      tintColor: colors.error[200],
    },
    hotBadgeText: {
      fontSize: RFValue(11),
      fontFamily: "InstrumentSansSemiBold",
      color: colors.error[200],
    },
    footerLoader: {
      paddingVertical: RFValue(16),
      alignItems: "center",
      justifyContent: "center",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: RFValue(60),
      paddingHorizontal: RFValue(24),
      gap: RFValue(10),
    },
    emptyIconCircle: {
      width: RFValue(64),
      height: RFValue(64),
      borderRadius: RFValue(32),
      backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100],
      alignItems: "center",
      justifyContent: "center",
      marginBottom: RFValue(6),
    },
    emptyIcon: {
      width: RFValue(28),
      height: RFValue(28),
      tintColor: colors.slate[500],
    },
    emptyStateTitle: {
      fontSize: RFValue(18),
      fontFamily: "InstrumentSansSemiBold",
      color: colors.slate[650],
      textAlign: "center",
    },
    emptyStateText: {
      fontSize: RFValue(14),
      fontFamily: "InstrumentSansRegular",
      color: colors.slate[500],
      textAlign: "center",
      lineHeight: RFValue(20),
    },
    emptyBtnWrap: {
      marginTop: RFValue(12),
      width: "100%",
      maxWidth: RFValue(200),
    },
    clearSearchBtn: {
      marginTop: RFValue(8),
      paddingVertical: RFValue(8),
      paddingHorizontal: RFValue(16),
      borderRadius: RFValue(8),
      backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100],
    },
    clearSearchBtnText: {
      fontSize: RFValue(13),
      fontFamily: "InstrumentSansMedium",
      color: colors.slate[650],
    },
    skeletonList: {
      gap: RFValue(18),
      paddingBottom: RFValue(40),
    },
    skeletonCard: {
      backgroundColor: colors.background,
      borderRadius: RFValue(16),
      overflow: "hidden",
      borderWidth: 1,
      borderColor: isDarkMode ? colors.slate[200] : colors.slate[100],
    },
    skeletonImage: {
      width: "100%",
      height: RFValue(180),
      backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100],
    },
    skeletonInfo: {
      padding: RFValue(14),
      gap: RFValue(10),
    },
    skeletonTitle: {
      width: "70%",
      height: RFValue(18),
      borderRadius: RFValue(4),
      backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100],
    },
    skeletonLocation: {
      width: "45%",
      height: RFValue(14),
      borderRadius: RFValue(4),
      backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100],
    },
    skeletonFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: RFValue(4),
      paddingTop: RFValue(8),
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? colors.slate[200] : colors.slate[100],
    },
    skeletonPrice: {
      width: "35%",
      height: RFValue(18),
      borderRadius: RFValue(4),
      backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100],
    },
    skeletonBadge: {
      width: "20%",
      height: RFValue(18),
      borderRadius: RFValue(4),
      backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100],
    },
  });
