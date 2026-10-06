import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AppButton from "@/components/button";
import { useTheme } from "@/contexts/themeContext";
import { useSpaceStore } from "@/store/useSpace";
import { ColorScheme } from "@/utils";
import { LocationData } from "@/types/add-space-types";
import {
  GOOGLE_MAPS_API_KEY,
  HAS_GOOGLE_MAPS_API_KEY,
} from "@/constants/google";

interface LocationPickerSubstepProps {
  onNext: () => void;
  onPrev: () => void;
}

interface PlaceSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const LocationPickerSubstep: React.FC<LocationPickerSubstepProps> = ({
  onNext,
  onPrev,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const mapRef = useRef<any>(null);
  const { setValue, spaceForm } = useSpaceStore();

  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [tempLocationData, setTempLocationData] = useState<LocationData | null>(
    null
  );

  const [region, setRegion] = useState({
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Debounce timer for search
  const searchTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (spaceForm.value.location) {
      setSelectedLocation(spaceForm.value.location);
      setRegion((prev) => ({
        ...prev,
        latitude: spaceForm.value.location!.latitude,
        longitude: spaceForm.value.location!.longitude,
      }));
    }
  }, [spaceForm.value.location]);

  // Fetch place suggestions from Google Places API
  const fetchPlaceSuggestions = async (query: string) => {
    if (!HAS_GOOGLE_MAPS_API_KEY) {
      setSuggestions([]);
      return;
    }
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&key=${GOOGLE_MAPS_API_KEY}&components=country:ng`
      );

      const data = await response.json();

      if (data.predictions) {
        setSuggestions(data.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching place suggestions:", error);
      Alert.alert("Error", "Failed to fetch location suggestions");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Handle search query change with debounce
  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      fetchPlaceSuggestions(text);
    }, 500);
  };

  // Get place details from Google Places API
  const getPlaceDetails = async (placeId: string) => {
    if (!HAS_GOOGLE_MAPS_API_KEY) {
      return null;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_components,geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.result) {
        const { address_components, geometry, formatted_address } = data.result;

        // Extract location components
        let city = "";
        let state = "";
        let country = "";
        let postalCode = "";

        address_components.forEach((component: any) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
          if (component.types.includes("postal_code")) {
            postalCode = component.long_name;
          }
        });

        const locationData: LocationData = {
          address: formatted_address,
          city: city || "N/A",
          state: state || "N/A",
          postalCode: postalCode || "N/A",
          country: country || "N/A",
          latitude: geometry.location.lat,
          longitude: geometry.location.lng,
        };

        return locationData;
      }

      return null;
    } catch (error) {
      console.error("Error fetching place details:", error);
      Alert.alert("Error", "Failed to fetch location details");
      return null;
    }
  };

  const handleSearchOpen = () => {
    setSearchModalVisible(true);
  };

  const handleSelectSearchResult = async (suggestion: PlaceSuggestion) => {
    setSearchModalVisible(false);

    // Get full place details
    const locationData = await getPlaceDetails(suggestion.place_id);

    if (locationData) {
      setTempLocationData(locationData);

      // Animate map to selected location
      const newRegion = {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);

      // Show confirm modal
      setConfirmModalVisible(true);
    }
  };

  const handleUseLiveLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature"
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];

        const locationData: LocationData = {
          address: `${place.name || ""} ${place.street || ""}, ${
            place.city || ""
          }`,
          city: place.city || "N/A",
          state: place.region || "N/A",
          postalCode: place.postalCode || "N/A",
          country: place.country || "N/A",
          latitude,
          longitude,
        };

        setTempLocationData(locationData);

        // Animate map to current location
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);

        setSearchModalVisible(false);
        setConfirmModalVisible(true);
      }
    } catch (error) {
      console.error("Error getting live location:", error);
      Alert.alert("Error", "Failed to get your current location");
    }
  };

  const handleUseAddressEntered = async () => {
    if (!searchQuery) {
      Alert.alert("Error", "Please enter an address");
      return;
    }

    // Geocode the entered address
    try {
      const geocode = await Location.geocodeAsync(searchQuery);

      if (geocode.length > 0) {
        const { latitude, longitude } = geocode[0];

        // Reverse geocode to get full details
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocode.length > 0) {
          const place = reverseGeocode[0];

          const locationData: LocationData = {
            address: searchQuery,
            city: place.city || "N/A",
            state: place.region || "N/A",
            postalCode: place.postalCode || "N/A",
            country: place.country || "N/A",
            latitude,
            longitude,
          };

          setTempLocationData(locationData);

          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(newRegion);

          setSearchModalVisible(false);
          setConfirmModalVisible(true);
        }
      } else {
        Alert.alert("Error", "Could not find this address");
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      Alert.alert("Error", "Failed to process the address");
    }
  };

  const handleConfirmLocation = () => {
    if (tempLocationData) {
      setSelectedLocation(tempLocationData);
      setValue({ location: tempLocationData });
      setConfirmModalVisible(false);
    }
  };

  const handleNext = () => {
    if (selectedLocation) {
      onNext();
    } else {
      Alert.alert("Location Required", "Please select a location to continue");
    }
  };

  return (
    <View style={styles.container} className="flex-1">
      {/* Map */}
      <View  className="flex-1 relative">
        <Pressable style={styles.searchInput} onPress={handleSearchOpen} className="flex-row items-center w-[95%px] border-[1px] absolute top-[80px] z-[10] self-center shadow-color-[#000] shadow-opacity-[0.05px] shadow-radius-[4px] elevation-[2px]">
          <Image
            source={require("@/assets/icons/location-black.png")}
            style={styles.locationIcon}
          />
          <Text
            style={[
              styles.searchInputText,
              selectedLocation && styles.searchInputTextFilled,
            ]}
            numberOfLines={1}
           className="flex-1">
            {selectedLocation?.address || "Enter the address"}
          </Text>
        </Pressable>
        {HAS_GOOGLE_MAPS_API_KEY ? (
          <MapView
            ref={mapRef}

            initialRegion={{
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            }}
            showsUserLocation
            showsMyLocationButton={false}
           className="flex-1">
            {selectedLocation && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                }}
                title={selectedLocation.address}
              />
            )}
          </MapView>
        ) : (
          <View style={styles.mapFallback} className="flex-1 items-center justify-center">
            <Text style={styles.mapFallbackText} className="text-center">
              Map disabled. Add Google API key to enable.
            </Text>
          </View>
        )}

        {/* Search Input Overlay */}
        <View style={styles.searchOverlay} className="absolute top-[0px] left-[0px] right-[0px]">
          <Text style={styles.title} className="font-semibold">Where is this property located?</Text>
        </View>
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Next"
          onPress={handleNext}
          size="large"
          fullwidth={true}
          disabled={!selectedLocation}
        />
      </View>

      {/* Search Modal */}
      <Modal
        visible={searchModalVisible}
        animationType="slide"
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
         className="flex-1">
          {/* Modal Header */}
          <View style={styles.modalHeader} className="flex-row items-center w-[75%px] justify-between">
            <Pressable
              onPress={() => setSearchModalVisible(false)}
              style={styles.closeButton}
             className="items-center justify-center">
              <Image
                source={require("@/assets/icons/X-close.png")}
                style={styles.closeIcon}
              />
            </Pressable>
            <Text style={styles.modalTitle} className="text-xl font-bold self-center">
              Your location
            </Text>
          </View>

          {/* Search Input */}
          <View style={styles.modalSearchContainer}>
            <View style={styles.modalSearchInput} className="flex-row items-center border-[1px]">
              <Image
                source={require("@/assets/icons/location-black.png")}
                style={styles.searchIconSmall}
              />
              <TextInput
                style={styles.modalTextInput}
                placeholder="Search"
                placeholderTextColor={colors.slate[500]}
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
                autoFocus
               className="flex-1"/>
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Image
                    source={require("@/assets/icons/close-contained.png")}
                    style={styles.clearIcon}
                  />
                </Pressable>
              )}
            </View>
          </View>

          {/* Live Location Button */}
          <Pressable
            style={styles.liveLocationButton}
            onPress={handleUseLiveLocation}
           className="flex-row items-center border-b">
            <Image
              source={require("@/assets/icons/Map.png")}
              style={styles.liveLocationIcon}
            />
            <Text style={styles.liveLocationText} className="font-medium">Use live location</Text>
          </Pressable>

          {!HAS_GOOGLE_MAPS_API_KEY && (
            <View style={styles.noResultsContainer} className="items-center">
              <Text style={styles.noResultsText} className="text-center">
                Search suggestions unavailable. You can still use live location
                or enter a full address.
              </Text>
            </View>
          )}

          {/* Use Address Entered Link */}
          {searchQuery.length > 0 && (
            <Pressable
              style={styles.useAddressLink}
              onPress={handleUseAddressEntered}
             className="flex-row items-center border-b">
              <Text style={styles.useAddressText} className="font-medium">Use the address entered</Text>
              <Image
                source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
                style={styles.arrowIcon}
              />
            </Pressable>
          )}

          {/* Search Results */}
          <ScrollView  className="flex-1">
            {isLoadingSuggestions && (
              <View style={styles.loadingContainer} className="items-center">
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            )}

            {!isLoadingSuggestions &&
              suggestions.map((suggestion) => (
                <Pressable
                  key={suggestion.place_id}
                  style={styles.resultItem}
                  onPress={() => handleSelectSearchResult(suggestion)}
                 className="flex-row items-center border-b">
                  <Image
                    source={require("@/assets/icons/location.png")}
                    style={styles.resultIcon}
                  />
                  <View  className="flex-1">
                    <Text style={styles.resultAddress} className="font-semibold">
                      {suggestion.structured_formatting.main_text}
                    </Text>
                    <Text style={styles.resultDetails}>
                      {suggestion.structured_formatting.secondary_text}
                    </Text>
                  </View>
                  <Image
                    source={require("@/assets/icons/arrow-right-dark.png")}
                    style={styles.resultArrow}
                  />
                </Pressable>
              ))}

            {!isLoadingSuggestions &&
              suggestions.length === 0 &&
              searchQuery.length >= 3 &&
              HAS_GOOGLE_MAPS_API_KEY && (
                <View style={styles.noResultsContainer} className="items-center">
                  <Text style={styles.noResultsText} className="text-center">
                    No locations found. Try a different search term.
                  </Text>
                </View>
              )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Confirm Location Modal */}
      <Modal
        visible={confirmModalVisible}
        animationType="slide"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.confirmModalContainer} className="flex-1">
          {/* Close Button */}

          <ScrollView contentContainerStyle={styles.confirmContent}>
            <Pressable
              onPress={() => setConfirmModalVisible(false)}
              style={styles.confirmCloseButton}
             className="absolute items-center justify-center z-[10]">
              <Image
                source={require("@/assets/icons/X-close.png")}
                style={styles.closeIcon}
              />
            </Pressable>
            <Text style={styles.confirmTitle} className="font-bold">Confirm location</Text>

            {/* Location Details */}
            {tempLocationData && (
              <View style={styles.detailsContainer} className="gap-[12px]">
                <View style={styles.detailRow} className="flex-row items-center justify-between border-[1px]">
                  <View>
                    <Text style={styles.detailLabel}>Country</Text>
                    <Text style={styles.detailValue} className="font-medium flex-1">
                      {tempLocationData.country}
                    </Text>
                  </View>
                  <Image source={require("@/assets/icons/chevron-right.png")} />
                </View>

                <View style={styles.detailRow} className="flex-row items-center justify-between border-[1px]">
                  <View>
                    <Text style={styles.detailLabel}>State / Province</Text>
                    <Text style={styles.detailValue} className="font-medium flex-1">
                      {tempLocationData.state}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow} className="flex-row items-center justify-between border-[1px]">
                  <View>
                    <Text style={styles.detailLabel}>Postal Code</Text>
                    <Text style={styles.detailValue} className="font-medium flex-1">
                      {tempLocationData.postalCode}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow} className="flex-row items-center justify-between border-[1px]">
                  <View>
                    <Text style={styles.detailLabel}>City / Town</Text>
                    <Text style={styles.detailValue} className="font-medium flex-1">
                      {tempLocationData.city}
                    </Text>
                  </View>
                </View>

                <View style={[styles.detailRow, styles.addressRow]} className="flex-row items-center justify-between border-[1px] flex-col items-start">
                  <Text style={styles.detailLabel}>Address</Text>
                  <Text style={styles.addressValue} className="font-medium">
                    {tempLocationData.address}
                  </Text>
                </View>
              </View>
            )}

            {/* Map Preview */}
            {tempLocationData && (
              <View style={styles.mapPreview} className="overflow-hidden">
                {HAS_GOOGLE_MAPS_API_KEY ? (
                  <MapView

                    region={{
                      latitude: tempLocationData.latitude,
                      longitude: tempLocationData.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                   className="flex-1">
                    <Marker
                      coordinate={{
                        latitude: tempLocationData.latitude,
                        longitude: tempLocationData.longitude,
                      }}
                    />
                  </MapView>
                ) : (
                  <View style={styles.mapFallback} className="flex-1 items-center justify-center">
                    <Text style={styles.mapFallbackText} className="text-center">
                      Map disabled. Add Google API key to enable.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Confirm Button */}
          <View style={styles.confirmButtonContainer}>
            <AppButton
              title="Confirm"
              onPress={handleConfirmLocation}
              size="large"
              fullwidth={true}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {backgroundColor: colors.background},
    mapContainer: {},
    map: {},
    mapFallback: {backgroundColor: colors.slate[150],
paddingHorizontal: RFValue(16)},
    mapFallbackText: {fontSize: RFValue(14),
color: colors.slate[600]},
    searchOverlay: {paddingHorizontal: RFValue(4),
paddingTop: RFValue(20),
backgroundColor: colors.background},
    title: {fontSize: RFValue(20),
color: colors.slate[650],
marginBottom: RFValue(16)},
    searchInput: {paddingVertical: RFValue(14),
paddingHorizontal: RFValue(16),
backgroundColor: colors.background,
borderRadius: RFValue(24),
borderColor: colors.slate[300],
shadowOffset: { width: 0, height: 2 }},
    locationIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
      marginRight: RFValue(10),
    },
    searchInputText: {fontSize: RFValue(15),
color: colors.slate[500]},
    searchInputTextFilled: {
      color: colors.slate[650],
    },
    buttonContainer: {
      paddingHorizontal: RFValue(4),
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
    },
    modalContainer: {backgroundColor: colors.background},
    modalHeader: {paddingHorizontal: RFValue(16),
paddingVertical: RFValue(16)},
    closeButton: {width: RFValue(32),
height: RFValue(32),
marginRight: RFValue(12)},
    closeIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[650],
    },
    modalTitle: {fontSize: RFValue(20),
lineHeight: RFValue(32),
color: colors.slate[650]},
    modalSearchContainer: {
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(16),
    },
    modalSearchInput: {paddingVertical: RFValue(8),
paddingHorizontal: RFValue(16),
backgroundColor: colors.slate[150],
borderRadius: RFValue(30),
borderColor: colors.slate[300]},
    searchIconSmall: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
      marginRight: RFValue(10),
    },
    modalTextInput: {fontSize: RFValue(15),
color: colors.slate[650]},
    clearIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[500],
    },
    liveLocationButton: {paddingHorizontal: RFValue(16),
paddingVertical: RFValue(12),
borderBottomColor: colors.slate[300]},
    liveLocationIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
      marginRight: RFValue(12),
    },
    liveLocationText: {fontSize: RFValue(15),
color: colors.slate[650]},
    useAddressLink: {paddingHorizontal: RFValue(16),
paddingVertical: RFValue(12),
borderBottomColor: colors.slate[300]},
    useAddressText: {fontSize: RFValue(14),
color: colors.info[200],
marginRight: RFValue(6)},
    arrowIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: colors.info[200],
    },
    resultsContainer: {},
    resultItem: {paddingHorizontal: RFValue(16),
paddingVertical: RFValue(16),
borderBottomColor: colors.slate[300]},
    resultIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[600],
      marginRight: RFValue(12),
    },
    resultTextContainer: {},
    resultAddress: {fontSize: RFValue(15),
color: colors.slate[650],
marginBottom: RFValue(4)},
    resultDetails: {
      fontSize: RFValue(13),
      color: colors.slate[600],
    },
    resultArrow: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    loadingContainer: {padding: RFValue(20)},
    loadingText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    noResultsContainer: {padding: RFValue(20)},
    noResultsText: {fontSize: RFValue(14),
color: colors.slate[600]},
    confirmModalContainer: {backgroundColor: colors.background},
    confirmCloseButton: {top: RFValue(16),
left: RFValue(16),
width: RFValue(32),
height: RFValue(32),
backgroundColor: colors.background,
borderRadius: RFValue(16)},
    confirmContent: {
      paddingHorizontal: RFValue(16),
      paddingTop: RFValue(60),
    },
    confirmTitle: {fontSize: RFValue(24),
color: colors.slate[650],
marginBottom: RFValue(24)},
    detailsContainer: {marginBottom: RFValue(24)},
    detailRow: {paddingVertical: RFValue(8),
backgroundColor: colors.slate[200],
paddingHorizontal: RFValue(12),
borderRadius: RFValue(16),
borderColor: colors.slate[300]},
    detailLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    detailValue: {fontSize: RFValue(15),
color: colors.slate[650],
marginRight: RFValue(8)},
    chevronIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    addressRow: {},
    addressValue: {fontSize: RFValue(15),
color: colors.slate[650]},
    mapPreview: {height: RFValue(200),
borderRadius: RFValue(12),
marginBottom: RFValue(16)},
    mapPreviewMap: {},
    confirmButtonContainer: {
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(16),
      backgroundColor: colors.background,
      borderTopColor: colors.slate[300],
    },
  });

export default LocationPickerSubstep;
