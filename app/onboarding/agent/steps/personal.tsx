import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as Location from "expo-location";
import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";

type PersonalDataProps = {
  onNext: () => void;
};

const PersonalDataStep = ({ onNext }: PersonalDataProps) => {
  const { colors } = useTheme();
  const Styles = styles(colors);

  const [useBusinessName, setUseBusinessName] = useState(false);
  const [fullName, setFullName] = useState("Ibe Bassey-Ekong Alex");
  const [selectedCity, setSelectedCity] = useState("");
  const [address, setAddress] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const cities = ["Abuja", "Port Harcourt", "Lagos", "Owerri"];

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setShowCityModal(false);
  };

  const handleUseLiveLocation = async () => {
    setIsLoadingLocation(true);

    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is needed to use live location."
        );
        setIsLoadingLocation(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});

      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const addressData = reverseGeocode[0];

        // Set city
        if (addressData.city) {
          setSelectedCity(addressData.city);
        }

        // Set full address
        const fullAddress = [
          addressData.street,
          addressData.streetNumber,
          addressData.district,
          addressData.city,
          addressData.region,
        ]
          .filter(Boolean)
          .join(", ");

        setAddress(fullAddress || "Location detected");
      }

      setIsLoadingLocation(false);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get your location. Please try again.");
      setIsLoadingLocation(false);
    }
  };

  const handleContinue = () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    if (!selectedCity) {
      Alert.alert("Error", "Please select a city");
      return;
    }

    if (!address.trim()) {
      Alert.alert("Error", "Please enter your address");
      return;
    }

    // Save data and proceed
    onNext();
  };

  const isFormValid = fullName.trim() && selectedCity && address.trim();

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={Styles.scrollContent}
      >
        <View style={Styles.container}>
          {/* Content */}
          <View style={Styles.contentContainer}>
            {/* User Icon */}
            <View style={Styles.iconContainer}>
              <Image
                source={require("@/assets/icons/Profile - Iconly Pro.png")}
                style={Styles.userIcon}
                resizeMode="contain"
              />
            </View>

            {/* Title and Description */}
            <View style={Styles.textContainer}>
              <Text style={Styles.headText}>Personal Data</Text>
              <Text style={Styles.descriptionText}>
                Complete your KYC by providing your location and bank details.
              </Text>
            </View>

            {/* Business Name Toggle */}
            <View style={Styles.toggleContainer}>
              <View style={Styles.toggleLabelContainer}>
                <Text style={Styles.toggleLabel}>Use business name</Text>
                <Text style={Styles.toggleSubtext}>
                  If you are listing for a business.
                </Text>
              </View>
              <Switch
                value={useBusinessName}
                onValueChange={setUseBusinessName}
                trackColor={{
                  false: colors.slate[300],
                  true: colors.success[200],
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Full Name Input */}
            <View style={Styles.inputContainer}>
              <Text style={Styles.inputLabel}>Full Name</Text>
              <Text style={Styles.inputText}>Ibe Bassey-Ekong Alex</Text>
            </View>

            {/* Location Section */}
            <View style={Styles.sectionContainer}>
              <View style={Styles.sectionHeader}>
                <Text style={Styles.sectionTitle}>Location</Text>
                <TouchableOpacity
                  style={Styles.liveLocationButton}
                  onPress={handleUseLiveLocation}
                  disabled={isLoadingLocation}
                >
                  <Image
                    source={require("@/assets/icons/Map.png")}
                    style={Styles.locationIcon}
                    resizeMode="contain"
                  />
                  <Text style={Styles.liveLocationText}>
                    {isLoadingLocation
                      ? "Getting location..."
                      : "Use live location"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* City Selector */}
              <View style={Styles.inputContainer}>
                {selectedCity && <Text style={Styles.inputLabel}>City</Text>}
                <TouchableOpacity
                  style={Styles.selectorButton}
                  onPress={() => setShowCityModal(true)}
                >
                  <Text
                    style={[
                      Styles.selectorText,
                      !selectedCity && Styles.selectorPlaceholder,
                    ]}
                  >
                    {selectedCity || "City"}
                  </Text>
                  <Image
                    source={require("@/assets/icons/chevron-right.png")}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Address Input */}
              <View style={Styles.inputContainer}>
                <Text style={Styles.inputLabel}>Address</Text>
                <TextInput
                  style={[Styles.textInput, Styles.addressInput]}
                  placeholder="Enter your address"
                  placeholderTextColor={colors.slate[400]}
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <View style={Styles.buttonContainer}>
            <AppButton
              title="Continue"
              onPress={handleContinue}
              fullwidth
              size="large"
              disabled={!isFormValid}
            />
          </View>
        </View>
      </ScrollView>

      {/* City Selection Modal */}
      <Modal
        visible={showCityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCityModal(false)}
      >
        <TouchableOpacity
          style={Styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCityModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={Styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={Styles.modalHandle} />
            <Text style={Styles.modalTitle}>City</Text>

            <View style={Styles.cityOptions}>
              {cities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={Styles.cityOption}
                  onPress={() => handleSelectCity(city)}
                >
                  <View style={Styles.radioContainer}>
                    <View
                      style={[
                        Styles.radioOuter,
                        selectedCity === city && Styles.radioOuterSelected,
                      ]}
                    >
                      {selectedCity === city && (
                        <View style={Styles.radioInner} />
                      )}
                    </View>
                  </View>
                  <Text style={Styles.cityOptionText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PersonalDataStep;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      justifyContent: "space-between",
      paddingBottom: RFValue(20),
    },
    contentContainer: {
      paddingTop: RFValue(40),
      gap: RFValue(20),
    },
    iconContainer: {
      height: RFValue(60),
      width: RFValue(60),
    },
    userIcon: {
      width: RFValue(60),
      height: RFValue(60),
    },
    textContainer: {
      gap: RFValue(8),
    },
    headText: {
      fontSize: RFValue(24),
      fontWeight: "600",
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    descriptionText: {
      fontSize: RFValue(14),
      lineHeight: RFValue(22),
      color: colors.slate[600],
    },
    toggleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(8),
    },
    toggleLabelContainer: {
      flex: 1,
      gap: RFValue(4),
    },
    toggleLabel: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
    },
    toggleSubtext: {
      fontSize: RFValue(12),
      color: colors.slate[500],
    },
    inputContainer: {
      gap: 1,
      paddingVertical: RFValue(8),
      paddingHorizontal: RFValue(8),
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    inputLabel: {
      fontSize: RFValue(14),

      color: colors.slate[500],
    },
    inputText: {
      fontSize: RFValue(16),
      color: colors.slate[600],
    },
    textInput: {
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    addressInput: {
      minHeight: RFValue(80),
    },
    sectionContainer: {
      gap: RFValue(16),
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sectionTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    liveLocationButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
    },
    locationIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    liveLocationText: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
    },
    selectorButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
    },
    selectorText: {
      fontSize: RFValue(15),
      color: colors.slate[650],
      fontWeight: "500",
    },
    selectorPlaceholder: {
      color: colors.slate[500],
    },
    arrowIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[600],
    },
    buttonContainer: {
      marginTop: RFValue(32),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingTop: RFValue(12),
      paddingBottom: RFValue(32),
      paddingHorizontal: RFValue(20),
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginBottom: RFValue(20),
    },
    modalTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(24),
    },
    cityOptions: {
      gap: RFValue(16),
    },
    cityOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      backgroundColor: colors.background,
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    radioContainer: {
      marginRight: RFValue(12),
    },
    radioOuter: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 2,
      borderColor: colors.slate[400],
      alignItems: "center",
      justifyContent: "center",
    },
    radioOuterSelected: {
      borderColor: colors.slate[650],
    },
    radioInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    cityOptionText: {
      fontSize: RFValue(15),
      fontWeight: "500",
      color: colors.slate[650],
      flex: 1,
    },
  });
