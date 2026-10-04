import { ArrowLeftUp } from "@/assets/icons";
import { BottomSheet } from "@/components/bottom-sheet";
import FilterBottomSheets from "@/components/filterBS";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { useListProperties } from "@/hooks";
import { ListPropertiesParams, PropertyListItem, PropertyType } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Search, SlidersHorizontal, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const TYPE_MAP: Record<string, PropertyType> = {
  Apartment: "apartment",
  Shop: "shop",
  Office: "office",
  "Event center": "event_centre",
};

const SearchScreen = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const initialQuery = typeof q === "string" ? q : "";
  const [searchText, setSearchText] = useState(initialQuery);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [type, setType] = useState("Any");
  const [rooms, setRooms] = useState(0);
  const [baths, setBaths] = useState(0);
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(100);
  const [amenities, setAmenities] = useState<string[]>([]);

  const params = useMemo<ListPropertiesParams>(() => {
    const next: ListPropertiesParams = {};
    if (searchText.trim()) next.q = searchText.trim();
    if (selectedCity) next.city = selectedCity;
    if (TYPE_MAP[type]) next.property_type = TYPE_MAP[type];
    if (minBudget > 0) next.min_price = minBudget;
    if (maxBudget < 100) next.max_price = maxBudget;
    if (amenities.length) next.amenities_contain = amenities.join(",");
    return next;
  }, [amenities, maxBudget, minBudget, searchText, selectedCity, type]);

  const { properties, isPropertiesLoading } = useListProperties({
    params,
    pageSize: 50,
    enabled: true,
  });

  const results = useMemo(
    () =>
      properties.filter((item) =>
        ["available", "approved", "active", "pending", "verified"].includes(
          item.status,
        ),
      ),
    [properties],
  );

  const clearFilters = () => {
    setType("Any");
    setRooms(0);
    setBaths(0);
    setMinBudget(0);
    setMaxBudget(100);
    setSelectedCity(null);
    setAmenities([]);
  };

  const toggleAmenity = (amenity: string) =>
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((item) => item !== amenity)
        : [...current, amenity],
    );

  return (
    <SafeAreaViewContainer disableBottom>
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={RFValue(18)} color={colors.slate[650]} />
        </Pressable>
        <View style={styles.searchBox}>
          <Search size={RFValue(16)} color={colors.slate[500]} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search"
            placeholderTextColor={colors.slate[400]}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {searchText ? (
            <Pressable onPress={() => setSearchText("")}>
              <X size={RFValue(16)} color={colors.slate[500]} />
            </Pressable>
          ) : null}
          <Pressable
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
          >
            <SlidersHorizontal size={RFValue(17)} color={colors.background} />
          </Pressable>
        </View>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {searchText.trim() ? `${results.length} results found` : "Top Result"}
        </Text>
      </View>

      {isPropertiesLoading ? (
        <ActivityIndicator color={colors.slate[650]} style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.public_id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ResultRow item={item} styles={styles} colors={colors} />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No spaces found.</Text>
          }
        />
      )}

      <BottomSheet
        isVisible={filterVisible}
        onClose={() => setFilterVisible(false)}
        snapPoints={[0.78, 0.92]}
        // scrollable={false}
        disablePanGesture
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
          selectedAmenities={amenities}
          onToggleAmenity={toggleAmenity}
          onPressNeighborhood={() => {}}
          onClear={clearFilters}
          onApply={() => setFilterVisible(false)}
          selectedCity={selectedCity}
          onCitySelect={setSelectedCity}
          onClose={() => setFilterVisible(false)}
        />
      </BottomSheet>
    </SafeAreaViewContainer>
  );
};

function ResultRow({
  item,
  styles,
  colors,
}: {
  item: PropertyListItem;
  styles: ReturnType<typeof createStyles>;
  colors: any;
}) {
  const image = item.media?.[0]?.file_url;
  const address = [
    item.address?.street,
    item.address?.city,
    item.address?.state,
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <View style={styles.resultRow}>
      <Image
        source={
          image
            ? { uri: image }
            : require("@/assets/images/featuredSpaceImage1.png")
        }
        style={styles.resultImage}
      />
      <View style={styles.resultInfo}>
        <Text numberOfLines={1} style={styles.resultTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.resultAddress}>
          {address || "Location unavailable"}
        </Text>
        <Text style={styles.resultPrice}>
          ₦{new Intl.NumberFormat("en-NG").format(item.price || 0)}
          <Text style={styles.frequency}>
            {" "}
            /{item.cost_frequency?.replace("per_", "")}
          </Text>
        </Text>
      </View>
      <ArrowLeftUp size={RFValue(16)} color={colors.slate[650]} />
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(8),
      marginBottom: RFValue(18),
    },
    backButton: { padding: RFValue(4) },
    searchBox: {
      flex: 1,
      height: RFValue(42),
      borderWidth: 1,
      borderColor: colors.slate[650],
      borderRadius: RFValue(22),
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: RFValue(12),
      gap: RFValue(8),
    },
    searchInput: {
      flex: 1,
      color: colors.slate[650],
      fontSize: RFValue(13),
      paddingVertical: 0,
    },
    filterButton: {
      width: RFValue(32),
      height: RFValue(32),
      marginRight: RFValue(4),
      borderRadius: RFValue(16),
      backgroundColor: colors.slate[650],
      alignItems: "center",
      justifyContent: "center",
    },
    resultsHeader: {
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[200],
      paddingBottom: RFValue(10),
    },
    resultsTitle: {
      fontSize: RFValue(14),
      fontWeight: "600",
      color: colors.slate[650],
    },
    listContent: { paddingVertical: RFValue(8), paddingBottom: RFValue(30) },
    resultRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(10),
      paddingVertical: RFValue(9),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[150],
    },
    resultImage: {
      width: RFValue(72),
      height: RFValue(58),
      borderRadius: RFValue(8),
      backgroundColor: colors.slate[150],
    },
    resultInfo: { flex: 1, gap: RFValue(3) },
    resultTitle: {
      color: colors.slate[650],
      fontSize: RFValue(13),
      fontWeight: "600",
    },
    resultAddress: { color: colors.slate[500], fontSize: RFValue(10) },
    resultPrice: {
      color: colors.slate[650],
      fontSize: RFValue(11),
      fontWeight: "700",
    },
    frequency: { color: colors.slate[500], fontWeight: "400" },
    empty: {
      textAlign: "center",
      color: colors.slate[500],
      paddingTop: RFValue(32),
    },
    loader: { marginTop: RFValue(30) },
  });

export default SearchScreen;
