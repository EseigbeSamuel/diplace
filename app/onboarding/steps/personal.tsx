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
import TextField from "@/components/textfield";
import { SimpleSelector } from "@/components/selector";

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
        <View style={Styles.container} className="flex-1 justify-between">
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
              <Text style={Styles.headText} className="font-semibold">Personal Data</Text>
              <Text style={Styles.descriptionText}>
                Complete your KYC by providing your location and bank details.
              </Text>
            </View>

            {/* Business Name Toggle */}
            <View style={Styles.toggleContainer} className="flex-row items-center justify-between">
              <View style={Styles.toggleLabelContainer} className="flex-1">
                <Text style={Styles.toggleLabel} className="font-medium">Use business name</Text>
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
            <View style={Styles.inputContainer} className="gap-[1px] border-[1px]">
              <Text style={Styles.inputLabel}>Full Name</Text>
              <Text style={Styles.inputText}>Ibe Bassey-Ekong Alex</Text>
            </View>

            {/* Location Section */}
            <View style={Styles.sectionContainer}>
              <View  className="flex-row items-center justify-between">
                <Text style={Styles.sectionTitle} className="font-semibold">Location</Text>
                <TouchableOpacity
                  style={Styles.liveLocationButton}
                  onPress={handleUseLiveLocation}
                  disabled={isLoadingLocation}
                 className="flex-row items-center">
                  <Image
                    source={require("@/assets/icons/Map.png")}
                    style={Styles.locationIcon}
                    resizeMode="contain"
                  />
                  <Text style={Styles.liveLocationText} className="font-medium">
                    {isLoadingLocation
                      ? "Getting location..."
                      : "Use live location"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* City Selector */}

              <TextField
                label="City"
                value={selectedCity}
                onChange={(text) => setSelectedCity(text.toString())}
                type="dropdown"
                onDropdownPress={() => setShowCityModal(true)}
              />

              {/* Address Input */}

              <TextField
                label="Address"
                value={address}
                onChange={(text) => setAddress(text.toString())}
              />
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

          activeOpacity={1}
          onPress={() => setShowCityModal(false)}
         className="flex-1 bg-[rgba(0, 0, 0, 0.5)] justify-end">
          <TouchableOpacity
            activeOpacity={1}
            style={Styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={Styles.modalHandle}  className="self-center"/>
            <Text style={Styles.modalTitle} className="font-semibold text-center">City</Text>

            <View style={Styles.cityOptions}>
              {cities.map((city) => (
                <SimpleSelector
                  isChecked={selectedCity === city}
                  onChange={() => handleSelectCity(city)}
                  title={city}
                  key={city}
                />
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
    scrollContent: {},
    container: {paddingBottom: RFValue(20)},
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
      tintColor: colors.slate[650],
    },
    textContainer: {
      gap: RFValue(8),
    },
    headText: {fontSize: RFValue(24),
lineHeight: RFValue(32),
color: colors.slate[650]},
    descriptionText: {
      fontSize: RFValue(14),
      lineHeight: RFValue(22),
      color: colors.slate[600],
    },
    toggleContainer: {paddingVertical: RFValue(8)},
    toggleLabelContainer: {gap: RFValue(4)},
    toggleLabel: {fontSize: RFValue(15),
color: colors.slate[650]},
    toggleSubtext: {
      fontSize: RFValue(12),
      color: colors.slate[500],
    },
    inputContainer: {paddingVertical: RFValue(8),
paddingHorizontal: RFValue(8),
backgroundColor: colors.slate[200],
borderRadius: RFValue(12),
borderColor: colors.slate[300]},
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
    sectionHeader: {},
    sectionTitle: {fontSize: RFValue(16),
color: colors.slate[650]},
    liveLocationButton: {gap: RFValue(6)},
    locationIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    liveLocationText: {fontSize: RFValue(14),
color: colors.slate[650]},
    selectorButton: {paddingVertical: RFValue(16)},
    selectorText: {fontSize: RFValue(15),
color: colors.slate[650]},
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
    modalOverlay: {},
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingTop: RFValue(12),
      paddingBottom: RFValue(32),
      paddingHorizontal: RFValue(20),
    },
    modalHandle: {width: RFValue(40),
height: RFValue(4),
backgroundColor: colors.slate[300],
borderRadius: RFValue(2),
marginBottom: RFValue(20)},
    modalTitle: {fontSize: RFValue(18),
color: colors.slate[650],
marginBottom: RFValue(24)},
    cityOptions: {
      gap: RFValue(16),
    },
    cityOption: {paddingVertical: RFValue(16),
paddingHorizontal: RFValue(16),
backgroundColor: colors.background,
borderRadius: RFValue(12),
borderColor: colors.slate[300]},
    radioContainer: {
      marginRight: RFValue(12),
    },
    radioOuter: {width: RFValue(20),
height: RFValue(20),
borderRadius: RFValue(10),
borderColor: colors.slate[400]},
    radioOuterSelected: {
      borderColor: colors.slate[650],
    },
    radioInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    cityOptionText: {fontSize: RFValue(15),
color: colors.slate[650]},
  });
