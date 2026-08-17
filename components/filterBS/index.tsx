import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppButton from "../button";

type PropertyType = {
  id: string;
  label: string;
  icon?: any;
};

const propertyTypes: PropertyType[] = [
  { id: "Any", label: "Any" },
  {
    id: "Apartment",
    label: "Apartment",
    icon: require("@/assets/icons/bed-outline.png"),
  },
  { id: "Shop", label: "Shop", icon: require("@/assets/icons/location-1.png") },
  { id: "Office", label: "Office", icon: require("@/assets/icons/size.png") },
  {
    id: "Event center",
    label: "Event center",
    icon: require("@/assets/icons/location-1.png"),
  },
];

const defaultAmenities = [
  "Wardrobe",
  "POP ceiling",
  "Shower",
  "Prepaid meter",
  "Estate security",
  "Air conditioned",
  "Standby generator",
  "Lighting fixtures",
  "Chairs & tables",
  "Swimming pool",
  "CCTV",
  "Water heater",
];

const MIN_LIMIT = 0;
const MAX_LIMIT = 100;

type FilterBottomSheetsProps = {
  selectedType: string;
  onSelectType: (type: string) => void;
  rooms: number;
  setRooms: (val: number) => void;
  baths: number;
  setBaths: (val: number) => void;
  minBudget?: number;
  maxBudget?: number;
  onBudgetChange?: (min: number, max: number) => void;
  selectedAmenities?: string[];
  onToggleAmenity?: (amenity: string) => void;
  onPressCity: () => void;
  onPressNeighborhood: () => void;
  onClear: () => void;
  onApply: () => void;
  selectedCity?: string | null;
};

const FilterBottomSheets = ({
  selectedType,
  onSelectType,
  rooms,
  setRooms,
  baths,
  setBaths,
  minBudget = 10,
  maxBudget = 11,
  onBudgetChange,
  selectedAmenities = [],
  onToggleAmenity,
  onPressCity,
  onPressNeighborhood,
  onClear,
  onApply,
  selectedCity,
}: FilterBottomSheetsProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const visibleAmenities = showAllAmenities
    ? defaultAmenities
    : defaultAmenities.slice(0, 8);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Property Type */}
        <Text style={styles.sectionLabel}>Property type</Text>
        <View style={styles.pillWrap}>
          {propertyTypes.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.typePill, isSelected && styles.typePillSelected]}
                onPress={() => onSelectType(type.id)}
              >
                {type.icon ? (
                  <Image
                    source={type.icon}
                    style={[
                      styles.typePillIcon,
                      isSelected && { tintColor: colors.background },
                    ]}
                    resizeMode="contain"
                  />
                ) : null}
                <Text
                  style={[
                    styles.typePillText,
                    isSelected && styles.typePillTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Location */}
        <Text style={[styles.sectionLabel, { marginTop: RFValue(20) }]}>
          Location
        </Text>
        <TouchableOpacity style={styles.locationRow} onPress={onPressCity}>
          <Text style={styles.locationRowText}>{selectedCity || "City"}</Text>
          <Image source={require("@/assets/icons/chevron-right.png")} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.locationRow}
          onPress={onPressNeighborhood}
        >
          <Text style={styles.locationRowText}>Neighborhood</Text>
          <Image source={require("@/assets/icons/chevron-right.png")} />
        </TouchableOpacity>

        {/* Rooms / Baths */}
        <View style={styles.stepperRow}>
          <Text style={styles.stepperLabel}>No. of rooms</Text>
          <Stepper value={rooms} onChange={setRooms} colors={colors} />
        </View>
        <View style={styles.stepperRow}>
          <Text style={styles.stepperLabel}>No. of baths</Text>
          <Stepper value={baths} onChange={setBaths} colors={colors} />
        </View>

        {/* Budget */}
        <Text style={[styles.sectionLabel, { marginTop: RFValue(8) }]}>
          Budget
        </Text>
        <RangeSlider
          min={MIN_LIMIT}
          max={MAX_LIMIT}
          low={minBudget}
          high={maxBudget}
          colors={colors}
          onChange={(low, high) => onBudgetChange?.(low, high)}
        />
        <View style={styles.budgetInputsRow}>
          <View style={styles.budgetInputBox}>
            <Text style={styles.budgetInputLabel}>Minimum</Text>
            <View style={styles.budgetInputValueRow}>
              <Text style={styles.budgetCurrency}>₦</Text>
              <TextInput
                value={String(minBudget)}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const val = Number(text.replace(/[^0-9]/g, "")) || 0;
                  onBudgetChange?.(Math.min(val, maxBudget), maxBudget);
                }}
                style={styles.budgetInputValue}
              />
            </View>
          </View>
          <Text style={styles.budgetDash}>—</Text>
          <View style={styles.budgetInputBox}>
            <Text style={styles.budgetInputLabel}>Maximum</Text>
            <View style={styles.budgetInputValueRow}>
              <Text style={styles.budgetCurrency}>₦</Text>
              <TextInput
                value={String(maxBudget)}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const val = Number(text.replace(/[^0-9]/g, "")) || 0;
                  onBudgetChange?.(minBudget, Math.max(val, minBudget));
                }}
                style={styles.budgetInputValue}
              />
            </View>
          </View>
        </View>

        {/* Amenities */}
        <Text style={[styles.sectionLabel, { marginTop: RFValue(20) }]}>
          Amenities
        </Text>
        <View style={styles.pillWrap}>
          {visibleAmenities.map((amenity) => {
            const isSelected = selectedAmenities.includes(amenity);
            return (
              <TouchableOpacity
                key={amenity}
                style={[
                  styles.amenityPill,
                  isSelected && styles.amenityPillSelected,
                ]}
                onPress={() => onToggleAmenity?.(amenity)}
              >
                <Text
                  style={[
                    styles.amenityPillText,
                    isSelected && styles.amenityPillTextSelected,
                  ]}
                >
                  {amenity}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {defaultAmenities.length > 8 && (
          <Pressable
            style={styles.viewMoreRow}
            onPress={() => setShowAllAmenities((prev) => !prev)}
          >
            <Text style={styles.viewMoreText}>
              {showAllAmenities ? "View less" : "View more"}
            </Text>
            <Text style={styles.viewMoreArrow}>
              {showAllAmenities ? "←" : "→"}
            </Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
          <Text style={styles.clearButtonIcon}>✕</Text>
        </TouchableOpacity>
        <View style={styles.applyButtonWrap}>
          <AppButton title="Apply filter" onPress={onApply} />
        </View>
      </View>
    </View>
  );
};

/* ---------------- Stepper ---------------- */

const Stepper = ({
  value,
  onChange,
  colors,
}: {
  value: number;
  onChange: (val: number) => void;
  colors: ColorScheme;
}) => {
  const styles = createStyles(colors);
  return (
    <View style={styles.stepperControls}>
      <TouchableOpacity
        style={styles.stepperButton}
        onPress={() => onChange(Math.max(0, value - 1))}
      >
        <Text style={styles.stepperButtonText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.stepperValue}>{value}</Text>
      <TouchableOpacity
        style={styles.stepperButton}
        onPress={() => onChange(value + 1)}
      >
        <Text style={styles.stepperButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

/* ---------------- Dual Range Slider ---------------- */

const THUMB_SIZE = 20;

const RangeSlider = ({
  min,
  max,
  low,
  high,
  onChange,
  colors,
}: {
  min: number;
  max: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
  colors: ColorScheme;
}) => {
  const styles = createStyles(colors);
  const [trackWidth, setTrackWidth] = useState(0);

  const valueToX = (val: number) =>
    trackWidth === 0 ? 0 : ((val - min) / (max - min)) * trackWidth;

  const xToValue = (x: number) => {
    const clampedX = Math.max(0, Math.min(trackWidth, x));
    const val = min + (clampedX / trackWidth) * (max - min);
    return Math.round(val);
  };

  const onTrackLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const lowPanResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          const startX = valueToX(low);
          const newVal = xToValue(startX + gesture.dx);
          onChange(Math.min(newVal, high - 1), high);
        },
      }),
    [low, high, trackWidth],
  );

  const highPanResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          const startX = valueToX(high);
          const newVal = xToValue(startX + gesture.dx);
          onChange(low, Math.max(newVal, low + 1));
        },
      }),
    [low, high, trackWidth],
  );

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderTrack} onLayout={onTrackLayout}>
        <View style={styles.sliderTrackBg} />
        <View
          style={[
            styles.sliderTrackFill,
            {
              left: valueToX(low),
              width: Math.max(0, valueToX(high) - valueToX(low)),
            },
          ]}
        />
        <View
          {...lowPanResponder.panHandlers}
          style={[styles.sliderThumb, { left: valueToX(low) - THUMB_SIZE / 2 }]}
        />
        <View
          {...highPanResponder.panHandlers}
          style={[
            styles.sliderThumb,
            { left: valueToX(high) - THUMB_SIZE / 2 },
          ]}
        />
      </View>
    </View>
  );
};

export default FilterBottomSheets;

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(16),
    },
    headerTitle: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
    },
    scrollContent: {
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(20),
    },
    sectionLabel: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
      marginBottom: RFValue(12),
    },
    pillWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: RFValue(10),
    },
    typePill: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(10),
      borderRadius: RFValue(24),
      borderWidth: 1,
      borderColor: colors.slate[300],
      backgroundColor: colors.background,
    },
    typePillSelected: {
      backgroundColor: colors.slate[650],
      borderColor: colors.slate[650],
    },
    typePillIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[600],
    },
    typePillText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
    },
    typePillTextSelected: {
      color: colors.background,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(16),
      marginBottom: RFValue(12),
    },
    locationRowText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
    },
    chevronIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    stepperRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: RFValue(14),
      borderTopWidth: 1,
      borderTopColor: colors.slate[200],
    },
    stepperLabel: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
    },
    stepperControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(20),
    },
    stepperButton: {
      width: RFValue(32),
      height: RFValue(32),
      borderRadius: RFValue(16),
      borderWidth: 1,
      borderColor: colors.slate[300],
      alignItems: "center",
      justifyContent: "center",
    },
    stepperButtonText: {
      fontSize: RFValue(18),
      color: colors.slate[650],
      fontWeight: "500",
    },
    stepperValue: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      minWidth: RFValue(16),
      textAlign: "center",
    },
    sliderContainer: {
      paddingVertical: RFValue(20),
      paddingHorizontal: RFValue(4),
    },
    sliderTrack: {
      height: RFValue(4),
      justifyContent: "center",
      position: "relative",
    },
    sliderTrackBg: {
      height: RFValue(4),
      borderRadius: RFValue(2),
      backgroundColor: colors.slate[200],
      width: "100%",
    },
    sliderTrackFill: {
      position: "absolute",
      height: RFValue(4),
      borderRadius: RFValue(2),
      backgroundColor: colors.slate[650],
    },
    sliderThumb: {
      position: "absolute",
      width: THUMB_SIZE,
      height: THUMB_SIZE,
      borderRadius: THUMB_SIZE / 2,
      backgroundColor: colors.slate[650],
      borderWidth: 3,
      borderColor: colors.background,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    budgetInputsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(10),
      marginTop: RFValue(4),
    },
    budgetInputBox: {
      flex: 1,
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      paddingHorizontal: RFValue(14),
      paddingVertical: RFValue(10),
    },
    budgetInputLabel: {
      fontSize: RFValue(12),
      color: colors.slate[500],
      marginBottom: RFValue(2),
    },
    budgetInputValueRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    budgetCurrency: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      marginRight: RFValue(4),
    },
    budgetInputValue: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
      padding: 0,
      flex: 1,
    },
    budgetDash: {
      fontSize: RFValue(14),
      color: colors.slate[500],
    },
    amenityPill: {
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(10),
      borderRadius: RFValue(24),
      borderWidth: 1,
      borderColor: colors.slate[300],
      backgroundColor: colors.background,
    },
    amenityPillSelected: {
      backgroundColor: colors.slate[650],
      borderColor: colors.slate[650],
    },
    amenityPillText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
    },
    amenityPillTextSelected: {
      color: colors.background,
    },
    viewMoreRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
      marginTop: RFValue(16),
    },
    viewMoreText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
    },
    viewMoreArrow: {
      fontSize: RFValue(14),
      color: colors.slate[650],
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(16),
      paddingHorizontal: RFValue(20),
      paddingTop: RFValue(12),
      paddingBottom: RFValue(20),
      borderTopWidth: 1,
      borderTopColor: colors.slate[200],
    },
    clearButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
    },
    clearButtonText: {
      fontSize: RFValue(15),
      color: colors.slate[650],
      fontWeight: "500",
    },
    clearButtonIcon: {
      fontSize: RFValue(14),
      color: colors.slate[650],
    },
    applyButtonWrap: {
      flex: 1,
    },
  });
