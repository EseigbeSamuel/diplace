import { CustomBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import Filter from "@/components/filter";
import FilterBottomSheets from "@/components/filterBS";
import { AppHeader } from "@/components/header";
import HouseCard from "@/components/housecard";
import SafeAreaViewContainer from "@/components/safeareaview";
import { Tabs } from "@/constants/home";
import { useTheme } from "@/contexts/themeContext";
import {
  useListProperties,
  useMyBookmarks,
  useTogglePropertyBookmark,
} from "@/hooks";
import { PropertyListItem } from "@/types";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";

type PropertyCardItem = {
  id: string;
  imageSource: { uri: string } | number;
  title: string;
  location: string;
  price: string;
  badgeType?: string;
  duration: string;
};

function SkeletonBlock({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: {
  width?: number | `${number}%` | "100%";
  height?: number;
  borderRadius?: number;
  style?: any;
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "rgba(148, 163, 184, 0.22)",
        },
        style,
      ]}
    />
  );
}

export default function RenterHome() {
  const { colors, isDarkMode } = useTheme();
  const homeStyles = styles(colors);
  const [activeTab, setActiveTab] = useState("All");
  const [showAllNearby, setShowAllNearby] = useState(false);
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
    return undefined;
  };

  const mapToCardData = (items: PropertyListItem[]): PropertyCardItem[] =>
    items.map((item) => ({
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
    }));

  const availableProperties = useMemo(
    () =>
      properties.filter(
        (item) => item.status === "available" || item.status === "pending",
      ),
    [properties],
  );

  const featuredSource = useMemo(() => {
    const featured = availableProperties.filter(
      (item) => item.is_verified || item.listing_type !== "normal",
    );
    return featured.length ? featured : availableProperties;
  }, [availableProperties]);

  const featuredCards = useMemo(
    () => mapToCardData(featuredSource.slice(0, 8)),
    [featuredSource],
  );

  const nearbySource = useMemo(() => {
    if (activeTab === "All") return availableProperties;

    const tabMap: Record<string, PropertyListItem["property_type"]> = {
      Appartment: "apartment",
      Shops: "shop",
      Offices: "office",
      "Event centers": "event_centre",
    };

    const mappedType = tabMap[activeTab];
    if (!mappedType) return availableProperties;
    return availableProperties.filter(
      (item) => item.property_type === mappedType,
    );
  }, [availableProperties, activeTab]);

  const nearbyCards = useMemo(
    () => mapToCardData(nearbySource),
    [nearbySource],
  );
  const nearbyCardsPreview = useMemo(
    () => nearbyCards.slice(0, 10),
    [nearbyCards],
  );
  const recentlyAddedCards = useMemo(
    () => mapToCardData(availableProperties.slice(0, 10)),
    [availableProperties],
  );
  const recommendedCards = useMemo(() => nearbyCards, [nearbyCards]);
  const canViewMoreNearby = nearbyCards.length > 10 && !showAllNearby;
  const bookmarkedSet = useMemo(
    () => new Set(bookmarkedPropertyIds),
    [bookmarkedPropertyIds],
  );

  useEffect(() => {
    setShowAllNearby(false);
  }, [activeTab]);

  const handleOpenProperty = (property: PropertyCardItem) => {
    router.push({
      pathname: "/views/place-details/[id]",
      params: { id: property.id },
    });
  };

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

  //bottom sheet handlers
  const [type, setType] = useState("Any");
  const [rooms, setRooms] = useState(0);
  const [baths, setBaths] = useState(0);

  const openCity = () => {};
  const openNeighborhood = () => {};
  const clear = () => {
    setType("Any");
    setRooms(0);
    setBaths(0);
  };

  const apply = () => {
    addFilterRef.current?.dismiss();
  };
  const addFilterRef = useRef<BottomSheetModal>(null);

  const anim = useSharedValue(0);

  const handleAddFilter = () => {
    addFilterRef.current?.present();
  };

  const snapPoints = useMemo(() => ["25%", "50%", "75%", "90%"], []);

  return (
    <SafeAreaViewContainer>
      <View className="gap-2">
        <AppHeader
          title={
            <View className="gap-2">
              <Text style={homeStyles.title} className="font-semibold">
                Welcome Sarhmy!
              </Text>
              <Pressable
                onPress={() => router.push("/views/location")}
                className="flex-row items-center gap-2"
              >
                <Image source={require("@/assets/icons/location.png")} />
                <Text style={homeStyles.subTitle}>
                  14 Amadi Str, Rumuewhera
                </Text>
                <Image source={require("@/assets/icons/angle.png")} />
              </Pressable>
            </View>
          }
        />
        <Filter size="small" showFilter onFilterPress={handleAddFilter} />
      </View>

      <FlatList
        data={Tabs}
        contentContainerStyle={{ gap: 8 }}
        renderItem={({ item }) => (
          <View className="h-[60px] my-4">
            <AppButton
              title={item.name}
              size="small"
              onPress={() => setActiveTab(item.name)}
              variant={activeTab === item.name ? "primary" : "tertiary"}
            />
          </View>
        )}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={recommendedCards}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshing={isPropertiesFetching && !isPropertiesFetchingNextPage}
        onRefresh={refetchProperties}
        ListHeaderComponent={
          <>
            <View className="pt-[38px] pb-4 flex-row justify-between">
              <Text style={homeStyles.title} className="font-semibold">
                Featured Space 🔥
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/views/apartments",
                    params: { section: "featured" },
                  })
                }
                className="flex-row items-center gap-2"
              >
                <Text style={homeStyles.text}>View More</Text>
                {isDarkMode ? (
                  <Image
                    source={require("@/assets/icons/arrow-right-light.png")}
                    className="w-[20px] h-[20px]"
                  />
                ) : (
                  <Image
                    source={require("@/assets/icons/arrow-right-dark.png")}
                    className="w-[20px] h-[20px]"
                  />
                )}
              </Pressable>
            </View>

            <FlatList
              data={featuredCards}
              renderItem={({ item }) => (
                <HouseCard
                  {...item}
                  showBookmark
                  isBookmarked={isBookmarked(item.id)}
                  bookmarkDisabled={!!bookmarkPendingIds[item.id]}
                  onToggleBookmark={() => handleToggleBookmark(item.id)}
                  onPress={() => handleOpenProperty(item)}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
              ListEmptyComponent={
                isPropertiesLoading ? (
                  <View className="flex-row gap-4 py-1">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <View
                        key={`featured-skeleton-${index}`}
                        className="w-[280px] rounded-3xl p-4"
                        style={{ backgroundColor: colors.slate[150] }}
                      >
                        <SkeletonBlock height={130} borderRadius={20} />
                        <SkeletonBlock
                          width="70%"
                          height={18}
                          borderRadius={8}
                          style={{ marginTop: 14 }}
                        />
                        <SkeletonBlock
                          width="50%"
                          height={14}
                          borderRadius={8}
                          style={{ marginTop: 8 }}
                        />
                      </View>
                    ))}
                  </View>
                ) : null
              }
            />

            <Text style={homeStyles.title} className="pt-8 pb-4 font-semibold">
              Spaces Nearby 📍
            </Text>

            {isPropertiesLoading
              ? Array.from({ length: 2 }).map((_, index) => (
                  <View
                    key={`nearby-skeleton-${index}`}
                    className="rounded-3xl p-4 pb-6 mb-4"
                    style={{ backgroundColor: colors.slate[150] }}
                  >
                    <SkeletonBlock height={150} borderRadius={20} />
                    <SkeletonBlock
                      width="72%"
                      height={18}
                      style={{ marginTop: 12 }}
                    />
                    <SkeletonBlock
                      width="48%"
                      height={14}
                      style={{ marginTop: 8 }}
                    />
                    <SkeletonBlock
                      width="38%"
                      height={14}
                      style={{ marginTop: 8 }}
                    />
                  </View>
                ))
              : (showAllNearby ? nearbyCards : nearbyCardsPreview).map((item) => (
                  <View key={`nearby-${item.id}`} className="pb-4">
                    <HouseCard
                      {...item}
                      showBookmark
                      isBookmarked={isBookmarked(item.id)}
                      bookmarkDisabled={!!bookmarkPendingIds[item.id]}
                      onToggleBookmark={() => handleToggleBookmark(item.id)}
                      onPress={() => handleOpenProperty(item)}
                    />
                  </View>
                ))}

            {canViewMoreNearby ? (
              <View className="pb-6">
                <AppButton
                  title="View More"
                  variant="primary"
                  onPress={() => setShowAllNearby(true)}
                />
              </View>
            ) : null}

            <View className="pt-2 pb-4 flex-row justify-between">
              <Text style={homeStyles.title} className="font-semibold">
                Recently Added 🆕
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/views/apartments",
                    params: { section: "recently_added" },
                  })
                }
                className="flex-row items-center gap-2"
              >
                <Text style={homeStyles.text}>View More</Text>
                {isDarkMode ? (
                  <Image
                    source={require("@/assets/icons/arrow-right-light.png")}
                    className="w-[20px] h-[20px]"
                  />
                ) : (
                  <Image
                    source={require("@/assets/icons/arrow-right-dark.png")}
                    className="w-[20px] h-[20px]"
                  />
                )}
              </Pressable>
            </View>

            <FlatList
              data={recentlyAddedCards}
              renderItem={({ item }) => (
                <HouseCard
                  {...item}
                  showBookmark
                  isBookmarked={isBookmarked(item.id)}
                  bookmarkDisabled={!!bookmarkPendingIds[item.id]}
                  onToggleBookmark={() => handleToggleBookmark(item.id)}
                  onPress={() => handleOpenProperty(item)}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
              ListEmptyComponent={
                isPropertiesLoading ? (
                  <View className="flex-row gap-4 py-1">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <View
                        key={`recent-skeleton-${index}`}
                        className="w-[280px] rounded-3xl p-4"
                        style={{ backgroundColor: colors.slate[150] }}
                      >
                        <SkeletonBlock height={130} borderRadius={20} />
                        <SkeletonBlock
                          width="66%"
                          height={18}
                          style={{ marginTop: 14 }}
                        />
                        <SkeletonBlock
                          width="46%"
                          height={14}
                          style={{ marginTop: 8 }}
                        />
                      </View>
                    ))}
                  </View>
                ) : null
              }
            />

            <Text style={homeStyles.title} className="pt-8 pb-4 font-semibold">
              Recommended 👍
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View className="pb-8">
            <HouseCard
              {...item}
              showBookmark
              isBookmarked={isBookmarked(item.id)}
              bookmarkDisabled={!!bookmarkPendingIds[item.id]}
              onToggleBookmark={() => handleToggleBookmark(item.id)}
              onPress={() => handleOpenProperty(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="py-8 items-center">
            {isPropertiesLoading ? (
              <View className="w-full gap-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <View
                    key={`recommended-skeleton-${index}`}
                    className="rounded-3xl p-4"
                    style={{ backgroundColor: colors.slate[150] }}
                  >
                    <SkeletonBlock height={150} borderRadius={20} />
                    <SkeletonBlock
                      width="72%"
                      height={18}
                      style={{ marginTop: 12 }}
                    />
                    <SkeletonBlock
                      width="48%"
                      height={14}
                      style={{ marginTop: 8 }}
                    />
                    <SkeletonBlock
                      width="35%"
                      height={14}
                      style={{ marginTop: 8 }}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <Text style={homeStyles.text}>No spaces available yet.</Text>
            )}
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

      {/* Filter Bottom Sheet */}

      <CustomBottomSheet
        bottomSheetProps={{
          ref: addFilterRef,
          snapPoints,
          index: -1,
          enableContentPanningGesture: true,
          enableHandlePanningGesture: true,
          enablePanDownToClose: true,
        }}
      >
        <FilterBottomSheets
          selectedType={type}
          onSelectType={setType}
          rooms={rooms}
          setRooms={setRooms}
          baths={baths}
          setBaths={setBaths}
          onPressCity={openCity}
          onPressNeighborhood={openNeighborhood}
          onClear={clear}
          onApply={apply}
        />
      </CustomBottomSheet>
    </SafeAreaViewContainer>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
  });
