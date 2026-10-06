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
        <View style={styles.badgeContainer} className="flex-row items-center">
          <Image
            source={require("@/assets/icons/Shield Done.png")}
            style={styles.badgeIcon}
          />
          <Text style={styles.badgeText} className="font-[InstrumentSansSemiBold]">DiPlace</Text>
        </View>
      );
    }

    if (prop.listing_type === "sponsored") {
      return (
        <View style={styles.hotBadgeContainer} className="flex-row items-center">
          <Image
            source={require("@/assets/icons/fire-b-fill.png")}
            style={styles.hotBadgeIcon}
          />
          <Text style={styles.hotBadgeText} className="font-[InstrumentSansSemiBold]">Hot Space</Text>
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
       className="overflow-hidden border-[1px]">
        {/* Image Container */}
        <View style={styles.imageWrap} className="relative w-[100%px]">
          <Image
            source={imageSourceFilter(prop.media?.[0]?.file_url)}

            resizeMode="cover"
           className="w-[100%px] h-[100%px]"/>

          {/* Status Overlay if Sold / Booked / Rented */}
          {isNonAvailable && (
            <View style={styles.statusOverlay} className="absolute bg-[rgba(0,0,0,0.72)]">
              <Text style={styles.statusOverlayText} className="text-[#FFFFFF] font-bold tracking-[0.5px]">
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
           className="absolute items-center justify-center shadow-color-[#000] shadow-opacity-[0.12px] shadow-radius-[4px] elevation-[3px]">
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
          <Text style={styles.bookmarkTitle} numberOfLines={2} className="font-[InstrumentSansSemiBold]">
            {prop.title}
          </Text>

          <View style={styles.bookmarkLocationRow} className="flex-row items-center">
            <Image
              source={require("@/assets/icons/location.png")}
              style={styles.locationIcon}
              resizeMode="contain"
            />
            <Text style={styles.bookmarkLocation} numberOfLines={1} className="font-[InstrumentSansRegular] flex-1">
              {locationText}
            </Text>
          </View>

          <View style={styles.bookmarkFooter} className="flex-row justify-between items-center border-t">
            <Text style={styles.bookmarkPrice} className="font-[InstrumentSansBold]">
              {formatCurrency(prop.price)}
              <Text style={styles.bookmarkPeriod} className="font-[InstrumentSansRegular]">
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
        <View key={key} style={styles.skeletonCard} className="overflow-hidden border-[1px]">
          <View style={styles.skeletonImage}  className="w-[100%px]"/>
          <View style={styles.skeletonInfo}>
            <View style={styles.skeletonTitle}  className="w-[70%px]"/>
            <View style={styles.skeletonLocation}  className="w-[45%px]"/>
            <View style={styles.skeletonFooter} className="flex-row justify-between items-center border-t">
              <View style={styles.skeletonPrice}  className="w-[35%px]"/>
              <View style={styles.skeletonBadge}  className="w-[20%px]"/>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderEmptyState = () => {
    if (debouncedQuery) {
      return (
        <View style={styles.emptyState} className="items-center justify-center">
          <View style={styles.emptyIconCircle} className="items-center justify-center">
            <Image
              source={require("@/assets/icons/search.png")}
              style={styles.emptyIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.emptyStateTitle} className="font-[InstrumentSansSemiBold] text-center">No results found</Text>
          <Text style={styles.emptyStateText} className="font-[InstrumentSansRegular] text-center">
            No bookmarks matched "{debouncedQuery}". Try another keyword.
          </Text>
          <TouchableOpacity
            style={styles.clearSearchBtn}
            onPress={() => setSearchQuery("")}
          >
            <Text style={styles.clearSearchBtnText} className="font-[InstrumentSansMedium]">Clear Search</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState} className="items-center justify-center">
        <View style={styles.emptyIconCircle} className="items-center justify-center">
          <Image
            source={require("@/assets/icons/bookmark-active-dark.png")}
            style={styles.emptyIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.emptyStateTitle} className="font-[InstrumentSansSemiBold] text-center">No bookmarks yet</Text>
        <Text style={styles.emptyStateText} className="font-[InstrumentSansRegular] text-center">
          Spaces you bookmark will be saved here so you can easily review them
          later.
        </Text>
        <View style={styles.emptyBtnWrap} className="w-[100%px]">
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
    <View style={styles.emptyState} className="items-center justify-center">
      <View style={[styles.emptyIconCircle, { backgroundColor: colors.error[100] }]} className="items-center justify-center">
        <Image
          source={require("@/assets/icons/bookmark-inactive.png")}
          style={[styles.emptyIcon, { tintColor: colors.error[200] }]}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.emptyStateTitle} className="font-[InstrumentSansSemiBold] text-center">Unable to load bookmarks</Text>
      <Text style={styles.emptyStateText} className="font-[InstrumentSansRegular] text-center">
        {bookmarksError instanceof Error
          ? bookmarksError.message
          : "Please check your network connection and try again."}
      </Text>
      <View style={styles.emptyBtnWrap} className="w-[100%px]">
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
        <View style={styles.searchBar} className="flex-row items-center border-[1px]">
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
           className="flex-1 font-[InstrumentSansRegular] py-[0px]"/>
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
          <Text style={styles.countText} className="font-[InstrumentSansMedium]">
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
              <View style={styles.footerLoader} className="items-center justify-center">
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
    searchBar: {backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100],
borderColor: colors.slate[200],
borderRadius: RFValue(12),
paddingHorizontal: RFValue(12),
height: RFValue(44),
gap: RFValue(8)},
    searchIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[450],
    },
    searchInput: {fontSize: RFValue(14),
color: colors.slate[650]},
    clearIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[450],
    },
    countText: {fontSize: RFValue(12),
color: colors.slate[500],
paddingHorizontal: RFValue(2)},
    listContent: {
      paddingBottom: RFValue(40),
      gap: RFValue(18),
    },
    bookmarkCard: {backgroundColor: colors.background,
borderRadius: RFValue(16),
borderColor: isDarkMode ? colors.slate[200] : colors.slate[100]},
    imageWrap: {height: RFValue(180),
backgroundColor: colors.slate[100]},
    bookmarkImage: {},
    statusOverlay: {top: RFValue(12),
left: RFValue(12),
paddingHorizontal: RFValue(10),
paddingVertical: RFValue(4),
borderRadius: RFValue(6)},
    statusOverlayText: {fontSize: RFValue(10)},
    bookmarkButton: {top: RFValue(12),
right: RFValue(12),
width: RFValue(36),
height: RFValue(36),
borderRadius: RFValue(18),
backgroundColor: isDarkMode ? colors.slate[200] : "#FFFFFF",
shadowOffset: { width: 0, height: 2 }},
    bookmarkIcon: {
      width: RFValue(18),
      height: RFValue(18),
    },
    bookmarkInfo: {
      padding: RFValue(14),
      gap: RFValue(6),
    },
    bookmarkTitle: {fontSize: RFValue(16),
color: colors.slate[650],
lineHeight: RFValue(22)},
    bookmarkLocationRow: {gap: RFValue(5)},
    locationIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.slate[500],
    },
    bookmarkLocation: {fontSize: RFValue(13),
color: colors.slate[500]},
    bookmarkFooter: {marginTop: RFValue(6),
paddingTop: RFValue(6),
borderTopColor: isDarkMode ? colors.slate[200] : colors.slate[100]},
    bookmarkPrice: {fontSize: RFValue(16),
color: colors.slate[650]},
    bookmarkPeriod: {fontSize: RFValue(13),
color: colors.slate[500]},
    badgeContainer: {backgroundColor: isDarkMode ? "rgba(245, 158, 11, 0.15)" : colors.warning[100],
paddingHorizontal: RFValue(8),
paddingVertical: RFValue(4),
borderRadius: RFValue(6),
gap: RFValue(4)},
    badgeIcon: {
      width: RFValue(12),
      height: RFValue(12),
      tintColor: colors.warning[300],
    },
    badgeText: {fontSize: RFValue(11),
color: colors.warning[300]},
    hotBadgeContainer: {backgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.15)" : colors.error[100],
paddingHorizontal: RFValue(8),
paddingVertical: RFValue(4),
borderRadius: RFValue(6),
gap: RFValue(4)},
    hotBadgeIcon: {
      width: RFValue(12),
      height: RFValue(12),
      tintColor: colors.error[200],
    },
    hotBadgeText: {fontSize: RFValue(11),
color: colors.error[200]},
    footerLoader: {paddingVertical: RFValue(16)},
    emptyState: {paddingVertical: RFValue(60),
paddingHorizontal: RFValue(24),
gap: RFValue(10)},
    emptyIconCircle: {width: RFValue(64),
height: RFValue(64),
borderRadius: RFValue(32),
backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100],
marginBottom: RFValue(6)},
    emptyIcon: {
      width: RFValue(28),
      height: RFValue(28),
      tintColor: colors.slate[500],
    },
    emptyStateTitle: {fontSize: RFValue(18),
color: colors.slate[650]},
    emptyStateText: {fontSize: RFValue(14),
color: colors.slate[500],
lineHeight: RFValue(20)},
    emptyBtnWrap: {marginTop: RFValue(12),
maxWidth: RFValue(200)},
    clearSearchBtn: {
      marginTop: RFValue(8),
      paddingVertical: RFValue(8),
      paddingHorizontal: RFValue(16),
      borderRadius: RFValue(8),
      backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100],
    },
    clearSearchBtnText: {fontSize: RFValue(13),
color: colors.slate[650]},
    skeletonList: {
      gap: RFValue(18),
      paddingBottom: RFValue(40),
    },
    skeletonCard: {backgroundColor: colors.background,
borderRadius: RFValue(16),
borderColor: isDarkMode ? colors.slate[200] : colors.slate[100]},
    skeletonImage: {height: RFValue(180),
backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100]},
    skeletonInfo: {
      padding: RFValue(14),
      gap: RFValue(10),
    },
    skeletonTitle: {height: RFValue(18),
borderRadius: RFValue(4),
backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100]},
    skeletonLocation: {height: RFValue(14),
borderRadius: RFValue(4),
backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100]},
    skeletonFooter: {marginTop: RFValue(4),
paddingTop: RFValue(8),
borderTopColor: isDarkMode ? colors.slate[200] : colors.slate[100]},
    skeletonPrice: {height: RFValue(18),
borderRadius: RFValue(4),
backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100]},
    skeletonBadge: {height: RFValue(18),
borderRadius: RFValue(4),
backgroundColor: isDarkMode ? colors.slate[200] : colors.slate[100]},
  });
