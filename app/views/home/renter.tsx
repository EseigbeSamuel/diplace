import AppButton from "@/components/button";
import Filter from "@/components/filter";
import FilterBottomSheets from "@/components/filterBS";
import { AppHeader } from "@/components/header";
import HouseCard from "@/components/housecard";
import SafeAreaViewContainer from "@/components/safeareaview";
import { SimpleSelector } from "@/components/selector";
import { Tabs } from "@/constants/home";
import { useTheme } from "@/contexts/themeContext";
import { useGetCurrentUser, useListProperties } from "@/hooks";
import { ListPropertiesParams, PropertyListItem, PropertyType } from "@/types";
import { ColorScheme } from "@/utils";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

const FILTER_TYPE_MAP: Record<string, PropertyType> = {
  Apartment: "apartment",
  Shop: "shop",
  Office: "office",
  "Event center": "event_centre",
};
const DEFAULT_MIN_BUDGET = 0;
const DEFAULT_MAX_BUDGET = 999999;

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
  const [searchText, setSearchText] = useState("");
  const { currentUser } = useGetCurrentUser();

  //bottom sheet handlers
  const [type, setType] = useState("Any");
  const [rooms, setRooms] = useState(0);
  const [baths, setBaths] = useState(0);
  const [minBudget, setMinBudget] = useState(DEFAULT_MIN_BUDGET);
  const [maxBudget, setMaxBudget] = useState(DEFAULT_MAX_BUDGET);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<ListPropertiesParams>(
    {},
  );

  const queryParams = useMemo<ListPropertiesParams>(
    () => ({
      sort_by: "date_created",
      sort_order: "desc",
      ...appliedFilters,
    }),
    [appliedFilters],
  );

  const {
    properties,
    isPropertiesLoading,
    isPropertiesFetching,
    isPropertiesFetchingNextPage,
    hasMoreProperties,
    fetchMoreProperties,
    refetchProperties,
  } = useListProperties({
    params: queryParams,
    pageSize: 20,
    enabled: true,
  });

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
      Apartment: "apartment",
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

  const cities = ["Abuja", "Port Harcourt", "Lagos", "Owerri"];

  const openCity = () => {
    setShowFilterModal(false);
    setShowCityModal(true);
  };

  const handleCityBack = () => {
    setShowCityModal(false);
    setShowFilterModal(true);
  };

  const handleCityClose = () => {
    setShowCityModal(false);
    setShowFilterModal(false);
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setShowCityModal(false);
    setShowFilterModal(true);
  };

  const openNeighborhood = () => {};
  const clear = () => {
    setType("Any");
    setRooms(0);
    setBaths(0);
    setMinBudget(DEFAULT_MIN_BUDGET);
    setMaxBudget(DEFAULT_MAX_BUDGET);
    setSelectedAmenities([]);
    setSelectedCity(null);
    setAppliedFilters(searchText.trim() ? { q: searchText.trim() } : {});
  };

  const handleAddFilter = () => setShowFilterModal(true);

  const buildFilterParams = (): ListPropertiesParams => {
    const trimmedSearch = searchText.trim();
    const params: ListPropertiesParams = {};
    const mappedType = FILTER_TYPE_MAP[type];

    if (trimmedSearch) params.q = trimmedSearch;
    if (selectedCity) params.city = selectedCity;
    if (mappedType) params.property_type = mappedType;
    if (minBudget > DEFAULT_MIN_BUDGET) params.min_price = minBudget;
    if (maxBudget < DEFAULT_MAX_BUDGET && maxBudget >= minBudget) {
      params.max_price = maxBudget;
    }
    if (selectedAmenities.length > 0) {
      params.amenities_contain = selectedAmenities.join(",");
    }

    return params;
  };

  const apply = () => {
    setAppliedFilters(buildFilterParams());
    setShowFilterModal(false);
  };

  const handleSearchSubmit = (value: string) => {
    const trimmedSearch = value.trim();
    setAppliedFilters((prev) => {
      const next = { ...prev };
      if (trimmedSearch) {
        next.q = trimmedSearch;
      } else {
        delete next.q;
      }
      return next;
    });
  };

  return (
    <SafeAreaViewContainer disableBottom>
      <View className="gap-2">
        <AppHeader
          title={
            <View className="gap-2">
              <Text style={homeStyles.title} className="font-semibold">
                Welcome {currentUser?.first_name}!
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
        <Filter
          size="small"
          value={searchText}
          onChangeText={setSearchText}
          onSubmit={handleSearchSubmit}
          showFilter
          onFilterPress={handleAddFilter}
        />
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
              : (showAllNearby ? nearbyCards : nearbyCardsPreview).map(
                  (item) => (
                    <View key={`nearby-${item.id}`} className="pb-4">
                      <HouseCard
                        {...item}
                        showBookmark
                        onPress={() => handleOpenProperty(item)}
                      />
                    </View>
                  ),
                )}

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

      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable
          style={homeStyles.filterModalOverlay}
          onPress={() => setShowFilterModal(false)}
        >
          <Pressable
            style={homeStyles.filterBottomSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={homeStyles.modalHandle} />
            <FilterBottomSheets
              selectedType={type}
              onSelectType={setType}
              rooms={rooms}
              setRooms={setRooms}
              baths={baths}
              setBaths={setBaths}
              minBudget={minBudget}
              maxBudget={maxBudget}
              onBudgetChange={(min, max) => {
                setMinBudget(min);
                setMaxBudget(max);
              }}
              selectedAmenities={selectedAmenities}
              onToggleAmenity={(amenity) =>
                setSelectedAmenities((prev) =>
                  prev.includes(amenity)
                    ? prev.filter((a) => a !== amenity)
                    : [...prev, amenity],
                )
              }
              onPressCity={openCity}
              onPressNeighborhood={openNeighborhood}
              onClear={clear}
              onApply={apply}
              selectedCity={selectedCity}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* City Selection Modal */}
      {/* City Selection Modal - Bottom Sheet */}
      <Modal
        visible={showCityModal}
        transparent
        animationType="slide"
        onRequestClose={handleCityBack}
      >
        <Pressable
          style={homeStyles.cityModalOverlay}
          onPress={handleCityClose}
        >
          <Pressable
            style={homeStyles.cityBottomSheet}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={homeStyles.modalHandle} />

            <View style={homeStyles.cityModalHeader}>
              <Pressable onPress={handleCityBack}>
                <Image
                  source={require("@/assets/icons/arrow-left-light.png")}
                  style={homeStyles.cityBackIcon}
                />
              </Pressable>
              <Text style={homeStyles.cityModalTitle}>City</Text>
              <Pressable onPress={handleCityClose}>
                <Text style={homeStyles.cityCloseIcon}>✕</Text>
              </Pressable>
            </View>

            <View style={homeStyles.cityListContainer}>
              {cities.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <SimpleSelector
                    onChange={() => handleSelectCity(city)}
                    isChecked={isSelected}
                    title={city}
                    key={city}
                  />
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    filterModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    filterBottomSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      height: "90%",
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginVertical: RFValue(12),
    },
    cityModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    cityBottomSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      height: "50%",
    },
    cityModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: RFValue(16),
      paddingBottom: RFValue(16),
    },
    cityBackIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    cityModalTitle: {
      fontSize: RFValue(17),
      fontWeight: "700",
      color: colors.slate[650],
    },
    cityCloseIcon: {
      fontSize: RFValue(18),
      color: colors.slate[650],
    },
    cityListContainer: {
      paddingHorizontal: RFValue(16),
      gap: RFValue(12),
    },
    cityModalContainer: {
      flex: 1,
    },

    cityRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: RFValue(16),
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      gap: RFValue(12),
    },
    cityRadio: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 2,
      borderColor: colors.slate[400],
      alignItems: "center",
      justifyContent: "center",
    },
    cityRadioSelected: {
      borderColor: colors.slate[650],
    },
    cityRadioInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    cityRowText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
    },
  });
