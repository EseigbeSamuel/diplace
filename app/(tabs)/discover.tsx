/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowLeft,
  ArrowRight3,
  BadgeCheck,
  CloseSquare
} from "@/assets/icons";
import Filter from "@/components/filter";
import FilterBottomSheets from "@/components/filterBS";
import { AppHeader } from "@/components/header";
import HouseCard from "@/components/housecard";
import SafeAreaViewContainer from "@/components/safeareaview";
import { categories, slider } from "@/constants/discover";
import { useTheme } from "@/contexts/themeContext";
import { useFeaturedListers, useListProperties } from "@/hooks";
import { ListPropertiesParams, PropertyListItem, PropertyType } from "@/types";
import { ColorScheme } from "@/utils";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { RFValue } from "react-native-responsive-fontsize";

const FILTER_TYPE_MAP: Record<string, PropertyType> = {
  Apartment: "apartment",
  Shop: "shop",
  Office: "office",
  "Event center": "event_centre",
};
const DEFAULT_MIN_BUDGET = 0;
const DEFAULT_MAX_BUDGET = 100;

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

const Discover = () => {
  const { colors, isDarkMode } = useTheme();
  const homeStyles = styles(colors);
  const [activeIndex, setActiveIndex] = useState(0);
  const { width } = Dimensions.get("window");
  const CARD_WIDTH = width * 0.88; // Adjusted width for the carousel cards

  // Search and filter state
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // Live property hook
  const {
    properties,
    isPropertiesLoading,
    isPropertiesFetching,
    refetchProperties,
  } = useListProperties({
    params: queryParams,
    pageSize: 50,
    enabled: true,
  });

  // Featured Listers hook (top 20 agents & owners sorted by ratings and reviews)
  const {
    featuredListers,
    isLoading: isListersLoading,
    refetch: refetchListers,
  } = useFeaturedListers();

  const formatCurrency = useCallback(
    (amount: number) =>
      `NGN ${new Intl.NumberFormat("en-NG").format(amount || 0)}`,
    [],
  );

  const formatCostFrequency = useCallback(
    (value: string) =>
      value ? value.replace(/^per_/, "").replace(/_/g, " ") : "",
    [],
  );

  const mapBadgeType = useCallback(
    (item: PropertyListItem): string | undefined => {
      if (item.is_verified) return "verified";
      if (item.listing_type === "sponsored") return "hot";
      if (item.status === "booked") return "reserved";
      return undefined;
    },
    [],
  );

  const mapToCardProps = useCallback(
    (item: PropertyListItem) => ({
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
    }),
    [formatCurrency, formatCostFrequency, mapBadgeType],
  );

  const handleOpenProperty = (propertyId: string) => {
    router.push({
      pathname: "/views/place-details/[id]",
      params: { id: propertyId },
    });
  };

  const availableProperties = useMemo(() => {
    return properties.filter((p) =>
      ["available", "approved", "active", "pending", "verified"].includes(
        p.status,
      ),
    );
  }, [properties]);

  const featuredSpacesList = useMemo(() => {
    const featuredProperties = availableProperties.filter(
      (p) => p.is_verified || p.listing_type !== "normal",
    );
    return (
      featuredProperties.length > 0 ? featuredProperties : availableProperties
    ).map(mapToCardProps);
  }, [availableProperties, mapToCardProps]);

  const discountedSpacesList = useMemo(() => {
    const sorted = [...availableProperties].sort(
      (a, b) => (a.price || 0) - (b.price || 0),
    );
    return sorted.map(mapToCardProps);
  }, [availableProperties, mapToCardProps]);

  const eventPlacesList = useMemo(() => {
    const eventProperties = availableProperties.filter(
      (p) => p.property_type === "hall" || p.property_type === "event_centre",
    );
    return (
      eventProperties.length > 0 ? eventProperties : availableProperties
    ).map(mapToCardProps);
  }, [availableProperties, mapToCardProps]);

  // Bottom sheet handlers
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

  const clear = () => {
    setType("Any");
    setRooms(0);
    setBaths(0);
    setMinBudget(DEFAULT_MIN_BUDGET);
    setMaxBudget(DEFAULT_MAX_BUDGET);
    setSelectedAmenities([]);
    setSelectedCity(null);
    setSelectedCategory(null);
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

  const handleCategoryPress = (categoryName: string) => {
    const catMap: Record<string, string> = {
      apartment: "apartment",
      shops: "shop",
      offices: "office",
      "event center": "event_centre",
    };
    const propType = catMap[categoryName.toLowerCase()];
    router.push({
      pathname: "/views/apartments",
      params: propType ? { type: propType } : undefined,
    });
  };

  const handleRefresh = () => {
    refetchProperties();
    refetchListers();
  };

  return (
    <SafeAreaViewContainer disableBottom className="flex-1">
      <AppHeader title={"Discover"} />
      <View className="py-2">
        <Filter
          size="small"
          value={searchText}
          onChangeText={setSearchText}
          onSubmit={handleSearchSubmit}
          showFilter
          onFilterPress={handleAddFilter}
        />
      </View>

      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isPropertiesFetching}
            onRefresh={handleRefresh}
            tintColor={colors.slate[650]}
          />
        }
      >
        {/* Categories */}
        <View className="flex flex-col gap-3 mt-4 mb-6">
          <Text style={homeStyles.title} className="font-semibold">
            Categories
          </Text>
          <FlatList
            data={categories}
            horizontal
            contentContainerStyle={{ gap: 8 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleCategoryPress(item.name)}
                className={`flex flex-col items-center border rounded-2xl p-4 min-w-[108px] ${
                  item.name === "apartment"
                    ? "bg-blue-50 border-blue-500"
                    : item.name === "shops"
                      ? "bg-amber-50 border-amber-500"
                      : item.name === "offices"
                        ? "bg-green-50 border-green-500"
                        : item.name === "event center"
                          ? "bg-pink-50 border-pink-500"
                          : "bg-gray-50 border-gray-300"
                }`}
              >
                <Image className="size-[28px]" source={item.icon} />
                <Text className="text-black capitalize">{item.name}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        {/* Neighborhoods */}
        <View className="flex flex-col w-full gap-3">
          <Text style={homeStyles.title} className="font-semibold">
            Neighborhoods
          </Text>
          <View className="w-full">
            <Carousel
              loop
              width={CARD_WIDTH}
              height={170}
              autoPlay
              autoPlayInterval={3000}
              data={slider}
              scrollAnimationDuration={800}
              pagingEnabled
              onProgressChange={(_, absoluteProgress) => {
                const index = Math.round(absoluteProgress) % slider.length;
                setActiveIndex(index);
              }}
              renderItem={({ item }) => (
                <View
                  key={item.id}
                  style={{
                    width: CARD_WIDTH - 16,
                    height: 154,
                    margin: 8,
                    overflow: "hidden",
                    borderRadius: 16,
                  }}
                >
                  <Image
                    source={item.image}
                    resizeMode="cover"
                    className="w-full h-full"
                    // style={StyleSheet.absoluteFill}
                  />

                  {item.location ? (
                    <BlurView
                      intensity={20}
                      tint={isDarkMode ? "dark" : "light"}
                      blurMethod="dimezisBlurViewSdk31Plus"
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        padding: 16,
                      }}
                    >
                      {isDarkMode ? (
                        <Image
                          source={require("@/assets/icons/location-white.png")}
                          className="w-4 h-4"
                        />
                      ) : (
                        <Image
                          source={require("@/assets/icons/location-black.png")}
                          className="w-4 h-4"
                        />
                      )}

                      <Text
                        className="font-semibold capitalize"
                        style={{ color: colors.slate[650] }}
                      >
                        {item.location}
                      </Text>
                    </BlurView>
                  ) : null}
                </View>
              )}
            />

            <View className="flex-row justify-center items-center mt-2">
              {slider.map((_, index) => {
                const isActive = activeIndex === index;

                return (
                  <View
                    key={index}
                    style={{
                      marginHorizontal: 4,
                      height: 10,
                      width: isActive ? 28 : 10,
                      borderRadius: 999,
                      backgroundColor: isActive
                        ? isDarkMode
                          ? "#F5F5F5"
                          : "#111111"
                        : "transparent",
                      borderWidth: isActive ? 0 : 1,
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.35)"
                        : "rgba(0,0,0,0.25)",
                    }}
                  />
                );
              })}
            </View>
          </View>
        </View>

        {/* Featured Listers */}
        <View className="flex flex-col gap-3 my-5">
          <View className="flex flex-row justify-between items-center">
            <Text style={homeStyles.title} className="font-semibold">
              Featured Listers
            </Text>
            <Pressable
              onPress={() => router.push("/views/featuredListers")}
              className="flex-row items-center gap-2"
            >
              <Text style={homeStyles.text}>View more</Text>
              {/* {isDarkMode ? (
                <Image
                  source={require("@/assets/icons/arrow-right-light.png")}
                  className="w-[20px] h-[20px]"
                />
              ) : (
                <Image
                  source={require("@/assets/icons/arrow-right-dark.png")}
                  className="w-[20px] h-[20px]"
                />
              )} */}
              <ArrowRight3 color={colors.slate[650]} />
            </Pressable>
          </View>
          {isListersLoading ? (
            <View className="py-6 items-center justify-center">
              <ActivityIndicator color={colors.slate[650]} size="small" />
            </View>
          ) : (
            <FlatList
              data={featuredListers}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
              renderItem={({ item }) => (
                <View
                  style={homeStyles.border}
                  className="flex flex-row gap-3 items-center border rounded-2xl p-3 min-w-[170px]"
                >
                  <Image
                    source={item.imageSource}
                    className="w-10 h-10 rounded-full"
                  />
                  <View>
                    <View className="flex flex-row items-center gap-1">
                      <Text
                        style={homeStyles.text}
                        className="font-medium capitalize"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      {item.isVerified && (
                        <Image
                          source={require("@/assets/icons/badge-check-green.png")}
                        />
                      )}
                    </View>

                    <View className="flex flex-row items-center gap-1">
                      <Image
                        source={require("@/assets/icons/star.png")}
                        className="size-[16px]"
                      />
                      <Text style={homeStyles.small}>{item.rating}</Text>
                      {item.reviews > 0 && (
                        <Text
                          style={homeStyles.small}
                          className="text-blue-500"
                        >
                          ({item.reviews})
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>

        {/* Featured Spaces */}
        <View className="flex flex-col gap-3 my-5">
          <View className="flex flex-row justify-between items-center">
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
          {isPropertiesLoading ? (
            <View className="flex-row gap-4 py-2">
              <SkeletonBlock width={260} height={200} borderRadius={16} />
              <SkeletonBlock width={260} height={200} borderRadius={16} />
            </View>
          ) : featuredSpacesList.length === 0 ? (
            <Text style={homeStyles.subTitle}>No featured spaces found.</Text>
          ) : (
            <FlatList
              data={featuredSpacesList}
              renderItem={({ item }) => (
                <HouseCard
                  {...item}
                  onPress={() => handleOpenProperty(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            />
          )}
        </View>

        {/* Discounted */}
        <View className="flex flex-col gap-3 my-5">
          <View className="flex flex-row justify-between items-center">
            <Text style={homeStyles.title} className="font-semibold">
              Discounted 🏷️
            </Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/views/apartments",
                  params: { section: "lowest_priced" },
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
          {isPropertiesLoading ? (
            <View className="flex-row gap-4 py-2">
              <SkeletonBlock width={260} height={200} borderRadius={16} />
              <SkeletonBlock width={260} height={200} borderRadius={16} />
            </View>
          ) : discountedSpacesList.length === 0 ? (
            <Text style={homeStyles.subTitle}>No discounted spaces found.</Text>
          ) : (
            <FlatList
              data={discountedSpacesList}
              renderItem={({ item }) => (
                <HouseCard
                  {...item}
                  onPress={() => handleOpenProperty(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            />
          )}
        </View>

        {/* Top Event Places */}
        <View className="flex flex-col gap-3 my-5 mb-10">
          <View className="flex flex-row justify-between items-center">
            <Text style={homeStyles.title} className="font-semibold">
              Top Event Places 🎉
            </Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/views/apartments",
                  params: { type: "event_centre" },
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
          {isPropertiesLoading ? (
            <View className="flex-row gap-4 py-2">
              <SkeletonBlock width={260} height={200} borderRadius={16} />
              <SkeletonBlock width={260} height={200} borderRadius={16} />
            </View>
          ) : eventPlacesList.length === 0 ? (
            <Text style={homeStyles.subTitle}>No event places found.</Text>
          ) : (
            <FlatList
              data={eventPlacesList}
              renderItem={({ item }) => (
                <HouseCard
                  {...item}
                  onPress={() => handleOpenProperty(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            />
          )}
        </View>
      </ScrollView>

      {/* Filter Bottom Sheet Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
          onPress={() => setShowFilterModal(false)}
        >
          <Pressable
            style={{
              maxHeight: "90%",
              backgroundColor: colors.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflow: "hidden",
            }}
            onPress={(event) => event.stopPropagation()}
          >
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
                setSelectedAmenities((previous) =>
                  previous.includes(amenity)
                    ? previous.filter((item) => item !== amenity)
                    : [...previous, amenity],
                )
              }
              onPressCity={openCity}
              onPressNeighborhood={() => {}}
              onClear={clear}
              onApply={apply}
              selectedCity={selectedCity}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* City Selection Modal */}
      <Modal
        visible={showCityModal}
        transparent
        animationType="slide"
        onRequestClose={handleCityClose}
      >
        <View style={homeStyles.cityModalOverlay}>
          <View style={homeStyles.cityModalSheet}>
            <View style={homeStyles.cityModalHeader}>
              <Pressable
                onPress={handleCityBack}
                style={homeStyles.cityModalBack}
              >
                {/* <Image
                  source={require("@/assets/icons/arrow-left-dark.png")}
                  style={{ width: 20, height: 20 }}
                /> */}
                <ArrowLeft color={colors.slate[650]} />
              </Pressable>
              <Text style={homeStyles.cityModalTitle}>City</Text>
              <Pressable
                onPress={handleCityClose}
                style={homeStyles.cityModalClose}
              >
                {/* <Image
                  source={require("@/assets/icons/close-contained.png")}
                  style={{ width: 14, height: 14 }}
                /> */}
                <CloseSquare color={colors.slate[650]} />
              </Pressable>
            </View>

            <View style={homeStyles.cityModalList}>
              {cities.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <Pressable
                    key={city}
                    onPress={() => handleSelectCity(city)}
                    style={[
                      homeStyles.cityOption,
                      isSelected && homeStyles.cityOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        homeStyles.cityOptionText,
                        isSelected && homeStyles.cityOptionTextSelected,
                      ]}
                    >
                      {city}
                    </Text>
                    {isSelected && (
                      // <Image
                      //   source={require("@/assets/icons/badge-check-green.png")}
                      //   style={{ width: 18, height: 18 }}
                      // />
                      <BadgeCheck size={18} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaViewContainer>
  );
};

export default Discover;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    border: {
      borderColor: colors.slate[300],
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    small: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[600],
    },
    cityModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "flex-end",
    },
    cityModalSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 36,
      minHeight: 280,
    },
    cityModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[200] || "#E2E8F0",
    },
    cityModalBack: {
      padding: 6,
    },
    cityModalTitle: {
      fontSize: RFValue(16),
      fontWeight: "700",
      color: colors.slate[650],
    },
    cityModalClose: {
      padding: 6,
    },
    cityModalList: {
      paddingTop: 16,
      gap: 10,
    },
    cityOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.slate[200] || "#E2E8F0",
      backgroundColor: colors.background,
    },
    cityOptionSelected: {
      borderColor: "#3B82F6",
      backgroundColor: "rgba(59, 130, 246, 0.06)",
    },
    cityOptionText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    cityOptionTextSelected: {
      color: "#3B82F6",
      fontWeight: "700",
    },
  });
