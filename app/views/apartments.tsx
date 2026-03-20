import Filter from "@/components/filter";
import HouseCard from "@/components/housecard";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import {
  useListProperties,
  useMyBookmarks,
  useTogglePropertyBookmark,
} from "@/hooks";
import { PropertyListItem } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { useTheme } from "@/contexts/themeContext";
import { RFValue } from "react-native-responsive-fontsize";
import { ColorScheme } from "@/utils";
import AppButton from "@/components/button";

const Apartments = () => {
  const { colors } = useTheme();
  const custom = styles(colors);
  const params = useLocalSearchParams<{
    section?: string;
  }>();
  const section = params.section ?? "apartments";
  const [bookmarkOverrides, setBookmarkOverrides] = useState<
    Record<string, boolean>
  >({});
  const [bookmarkPendingIds, setBookmarkPendingIds] = useState<
    Record<string, boolean>
  >({});
  const {
    properties,
    isPropertiesLoading,
    isPropertiesFetching,
    isPropertiesFetchingNextPage,
    hasMoreProperties,
    propertiesError,
    fetchMoreProperties,
    refetchProperties,
  } = useListProperties({
    params: {
      sort_by: "date_created",
      sort_order: "desc",
    },
    pageSize: 20,
    enabled: true,
  });
  const { bookmarkedPropertyIds } = useMyBookmarks({ enabled: true });
  const { togglePropertyBookmarkMutation } = useTogglePropertyBookmark();

  const formatCurrency = (amount: number) =>
    `NGN ${new Intl.NumberFormat("en-NG").format(amount || 0)}`;

  const formatCostFrequency = (value: string) =>
    value.replace(/^per_/, "").replace(/_/g, " ");

  const mapBadgeType = (item: PropertyListItem): string | undefined => {
    if (item.is_verified) return "verified";
    if (item.listing_type === "sponsored") return "hot";
    if (item.status === "booked") return "reserved";
    if (item.status === "available") return "available";
    return undefined;
  };

  const sectionTitle = useMemo(() => {
    if (section === "featured") return "Featured Space";
    if (section === "recently_added") return "Recently Added";
    if (section === "nearby") return "Spaces Nearby";
    return "Apartments";
  }, [section]);

  const sectionProperties = useMemo(() => {
    const visibleProperties = properties.filter(
      (item) => item.status === "available" || item.status === "pending",
    );

    if (section === "featured") {
      const featured = visibleProperties.filter(
        (item) => item.is_verified || item.listing_type !== "normal",
      );
      return featured.length ? featured : visibleProperties;
    }
    return visibleProperties;
  }, [properties, section]);

  const cards = useMemo(
    () =>
      sectionProperties.map((item) => ({
        id: item.public_id,
        imageSource: item.media?.[0]?.file_url
          ? { uri: item.media[0].file_url }
          : require("@/assets/images/featuredSpaceImage1.png"),
        title: item.title,
        location:
          [
            item.address?.street,
            item.address?.city,
            item.address?.state,
            item.address?.country,
          ]
            .filter(Boolean)
            .join(", ") || "Unknown location",
        price: formatCurrency(item.price),
        badgeType: mapBadgeType(item),
        duration: formatCostFrequency(item.cost_frequency),
      })),
    [sectionProperties],
  );
  const bookmarkedSet = useMemo(
    () => new Set(bookmarkedPropertyIds),
    [bookmarkedPropertyIds],
  );

  const handleLoadMore = () => {
    if (!hasMoreProperties || isPropertiesFetchingNextPage) return;
    fetchMoreProperties();
  };

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

  return (
    <SafeAreaViewContainer>
      <View>
        <SectionHeader title={sectionTitle} />
        <View className="py-4">
          <Filter size="small" />
        </View>
      </View>
      {isPropertiesLoading ? (
        <View style={custom.centerState}>
          <ActivityIndicator size="large" color={colors.slate[650]} />
          <Text style={custom.centerStateText}>Loading spaces...</Text>
        </View>
      ) : propertiesError ? (
        <View style={custom.centerState}>
          <Text style={custom.centerStateText}>Unable to load spaces.</Text>
          <View style={custom.retryWrap}>
            <AppButton title="Retry" onPress={refetchProperties} />
          </View>
        </View>
      ) : (
      <FlatList
        data={cards}
        refreshing={isPropertiesFetching && !isPropertiesFetchingNextPage}
        onRefresh={refetchProperties}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="pb-8">
            <HouseCard
              {...item}
              showBookmark
              isBookmarked={isBookmarked(item.id)}
              bookmarkDisabled={!!bookmarkPendingIds[item.id]}
              onToggleBookmark={() => handleToggleBookmark(item.id)}
              onPress={() => {
                router.push({
                  pathname: "/views/place-details/[id]",
                  params: { id: item.id },
                });
              }}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text style={custom.centerStateText}>No spaces available right now.</Text>
          </View>
        }
        ListFooterComponent={
          isPropertiesFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator size="small" color={colors.slate[650]} />
            </View>
          ) : null
        }
      />
      )}
    </SafeAreaViewContainer>
  );
};

export default Apartments;

const styles = (colors: ColorScheme) => ({
  centerState: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: RFValue(20),
    gap: RFValue(12),
  },
  centerStateText: {
    fontSize: RFValue(20),
    lineHeight: RFValue(26),
    fontFamily: "InstrumentSansSemiBold",
    color: colors.slate[650],
    textAlign: "center" as const,
  },
  retryWrap: {
    width: RFValue(140),
  },
});
