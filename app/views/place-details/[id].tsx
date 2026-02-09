import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { useSpaceStore } from "@/store/useSpace";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import MapView, { Marker } from "react-native-maps";
import { RFValue } from "react-native-responsive-fontsize";

type timeslot = {
  id: string;
  label: string;
};

const timeslotDB: timeslot[] = [
  { id: "morning", label: "10AM - 12PM (Morning slot)" },
  { id: "afternoon", label: "1PM - 3PM (Afternoon slot)" },
  { id: "evening", label: "4PM - 6PM (Evening slot)" },
];

const { width } = Dimensions.get("window");
const HAS_GOOGLE_KEY = !!process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

const Placedetails = () => {
  const { colors, isDarkMode } = useTheme();
  const { spaceForm } = useSpaceStore();
  const styles = createStyles(colors);

  const [selectedTime, setSelectedTime] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [enlargeMapVisible, setEnlargeMapVisible] = useState(false);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const router = useRouter();
  const galleryScrollRef = useRef<ScrollView>(null);

  const costBreakdown = [
    {
      id: "0",
      title: `Space rent (${spaceForm.value.rentalCost?.rentDuration})`,
      description: "",
      value: spaceForm.value.rentalCost?.rentalCost || "",
      editable: true,
    },
  ].concat(spaceForm.value.otherCharges || []);

  const totalPackage = costBreakdown.reduce((sum, item) => {
    const amount = Number(item.value.toString().replace(/[^0-9]/g, "")) || 0;
    return sum + amount;
  }, 0);

  const formatReadableDate = (
    dateString: string | Date | null | undefined,
  ): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const toProperCase = (t?: string | null) =>
    t ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() : "";

  const formatType = (type: string | null) => {
    switch (type) {
      case "apartment":
        return "Apartment";
      case "event":
        return "Event center";
      case "shop":
        return "Shop";
      case "office":
        return "Office";
      default:
        return "Apartment";
    }
  };

  const spaceData = {
    location: {
      address: "Road 2, Tony Estate, Rumuewhere, Port Harcourt",
      coordinates: { latitude: 4.8156, longitude: 7.0498 },
    },
    gallery: [
      require("@/assets/images/SpacesNearbyImage1.png"),
      require("@/assets/images/SpacesNearbyImage2.png"),
      require("@/assets/images/featuredSpaceImage1.png"),
      require("@/assets/images/SpacesNearbyImage1.png"),
      require("@/assets/images/SpacesNearbyImage2.png"),
    ],
  };

  const amenities = [
    "Full Air Conditioning coverage",
    "Standby Generator",
    "Stage platform",
    "Changing rooms",
    "Sound system & DJ setup",
    "About 500 Chairs & 300 Tables",
    "Spot lighting fixtures",
    "Restrooms",
  ];

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentImageIndex(index);
  };

  return (
    <View style={styles.mainContainer}>
      <SectionHeader
        title=""
        rightIconSource={require("@/assets/icons/more-2-line.png")}
      />
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Main Image */}
          <View style={styles.imageContainer}>
            {spaceForm.value.media && spaceForm.value.media.length > 0 ? (
              <Image
                source={{ uri: spaceForm.value.media[0]?.uri }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            ) : (
              <View>
                <Image
                  source={spaceData.gallery[0]}
                  style={styles.mainImage}
                  resizeMode="cover"
                />
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setShowGalleryModal(true)}
                  >
                    <Text style={styles.actionButtonText}>GALLERY</Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      router.push({
                        pathname: "/views/streetview",
                        params: {
                          lat: spaceForm.value.location?.latitude,
                          lng: spaceForm.value.location?.longitude,
                        },
                      })
                    }
                  >
                    <Text style={styles.actionButtonText}>STREET VIEW</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Bookmark Icon */}
            <TouchableOpacity style={styles.bookmarkButton}>
              <Image
                source={require("@/assets/icons/bookmark-active-dark.png")}
                style={styles.bookmarkIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Gallery and Street View Buttons - Below Image */}

          {/* Property Info Card */}
          <View style={styles.propertyCard}>
            <View style={styles.propertyTitleRow}>
              <Text style={styles.propertyTitle}>
                {spaceForm.value.description?.title ||
                  "2 Bedroom in-suite apartment"}
              </Text>
              <Text style={styles.priceText}>
                ₦{spaceForm.value.rentalCost?.rentalCost || "60000"}
              </Text>
            </View>

            <View style={styles.locationRow}>
              <Image
                source={require("@/assets/icons/location-1.png")}
                style={styles.locationIcon}
                resizeMode="contain"
              />
              <Text style={styles.addressText}>
                {spaceForm.value?.location?.address ||
                  "Road 2, Tony Estate, Rumuewhere, Port Harcourt"}
              </Text>
            </View>

            <Text style={styles.priceUnit}>
              /{spaceForm.value.rentalCost?.rentDuration || "annum"}
            </Text>

            <View className="px-3 py-2 border-t border-b border-gray-300">
              <Text
                style={{ color: colors.slate[600] }}
                className="py-2 italic text-center"
              >
                ⚠️ Heads up! The price you see is for the space only. Agent fees
                and other charges may apply.
              </Text>
            </View>

            {/* Property Features */}
            <View style={styles.featuresRow}>
              <View style={styles.featureItem}>
                <Image
                  source={
                    spaceForm.type === "event"
                      ? require("@/assets/icons/location-1.png")
                      : require("@/assets/icons/bed-outline.png")
                  }
                  style={styles.featureIcon}
                  resizeMode="contain"
                />
                <Text style={styles.featureText}>
                  {spaceForm.type === "event"
                    ? toProperCase(spaceForm.value.eventSpace)
                    : spaceForm.value.capacity?.rooms || "2"}{" "}
                  {spaceForm.type !== "event" ? "Bedrooms" : ""}
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Image
                  source={
                    spaceForm.type === "event"
                      ? require("@/assets/icons/electricity.png")
                      : require("@/assets/icons/bath.png")
                  }
                  style={styles.featureIcon}
                  resizeMode="contain"
                />
                <Text style={styles.featureText}>
                  {spaceForm.type === "event"
                    ? "Generator"
                    : `${spaceForm.value.capacity?.bathrooms || "2"} Baths`}
                </Text>
              </View>

              <View style={styles.featureItem}>
                <Image
                  source={require("@/assets/icons/size.png")}
                  style={styles.featureIcon}
                  resizeMode="contain"
                />
                <Text style={styles.featureText}>
                  {spaceForm.type === "event"
                    ? spaceForm.value.capacity?.caps
                    : spaceForm.value.capacity?.roomSize || "10 by 12ft"}
                </Text>
              </View>
            </View>
          </View>

          {/* Listed by Section */}
          <View
            className="flex flex-row items-center justify-between py-3"
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Listed by</Text>
            <Text style={{ color: colors.slate[500] }} className="">
              Posted 2days ago
            </Text>
          </View>
          <View className="flex flex-row gap-2 py-3 border-b border-gray-300">
            <View
              style={{ height: RFValue(48), width: RFValue(48) }}
              className="bg-gray-300 rounded-full"
            ></View>
            <View className="w-[50%]">
              <Text
                style={{ color: colors.slate[650], fontSize: RFValue(16) }}
                className="font-medium"
              >
                Ibe Alex{" "}
                <Image
                  source={require("@/assets/icons/badge-check-green.png")}
                />
              </Text>
              <Pressable
                className="flex flex-row gap-2"
                onPress={() => router.push("/views/reviews/reviews")}
              >
                <Text style={{ color: colors.slate[650] }}>⭐ 4.5 </Text>
                <Text style={{ color: colors.info[200] }}>(15 reviews)</Text>
              </Pressable>
            </View>
            <View className="flex flex-row gap-3">
              <TouchableOpacity className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <Image
                  source={require("@/assets/icons/chat-active.png")}
                  className="w-5 h-5"
                />
              </TouchableOpacity>
              <TouchableOpacity className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <Image
                  source={require("@/assets/icons/calling.png")}
                  className="w-5 h-5"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this space</Text>
            <Text style={styles.aboutText}>
              Atraz Palace is a premium 500 capacity event space perfect for
              weddings, conferences, parties, and special occasions. With
              elegant interiors, ample parking, and flexible seating
              arrangements, it offers a seamless experience for both hosts and
              guests. The hall is fully air-conditioned, generator-powered, and
              located in a secure, accessible area.
            </Text>
          </View>

          {/* Amenities Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            {amenities?.map((amenity, index) => (
              <View key={index} style={styles.amenityRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationAddress}>
              {spaceData.location.address}
            </Text>

            <View style={styles.mapContainer}>
              {HAS_GOOGLE_KEY ? (
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: spaceForm.value.location?.latitude ?? 4.8156,
                    longitude: spaceForm.value.location?.longitude ?? 7.0498,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: spaceForm.value.location?.latitude ?? 4.8156,
                      longitude: spaceForm.value.location?.longitude ?? 7.0498,
                    }}
                  />
                </MapView>
              ) : (
                <View style={styles.mapFallback}>
                  <Text style={styles.mapFallbackText}>
                    Map disabled. Add Google API key to enable.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.streetViewButton}
                onPress={() =>
                  router.push({
                    pathname: "/views/streetview",
                    params: {
                      lat: spaceForm.value.location?.latitude,
                      lng: spaceForm.value.location?.longitude,
                    },
                  })
                }
              >
                <Image
                  source={require("@/assets/icons/Streetview-solid.png")}
                  style={styles.streetViewIcon}
                  resizeMode="contain"
                />
                <Text style={styles.streetViewText}>Street view</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fullscreenButton}
                onPress={() => {
                  setEnlargeMapVisible(true);
                  setShowLocationSheet(true);
                }}
              >
                <Image
                  source={require("@/assets/icons/expand.png")}
                  style={styles.expandViewIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Cost Breakdown Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cost Breakdown</Text>

            <View style={styles.costBreakdownContainer}>
              {costBreakdown.map((item, index) => (
                <View key={index} style={styles.costRow}>
                  <Text style={styles.costLabel}>{item.title}</Text>
                  <Text style={styles.costAmount}>{item.value}</Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <Text style={styles.totalAmount}>{totalPackage}</Text>
              </View>
            </View>
            <Pressable className="flex flex-row items-center gap-3 py-4">
              <Image
                source={require("@/assets/icons/flag-red.png")}
                className="w-6 h-6"
              />
              <Text style={{ color: colors.error[200] }}>Report listing</Text>
            </Pressable>
          </View>

          {/* Complete Button */}
          <View style={styles.completeButtonContainer}>
            <AppButton
              title="Book Now"
              onPress={() => setShowInspectionModal(true)}
              size="large"
              fullwidth={true}
            />
            <AppButton
              title="Virtual Tour"
              onPress={() => {}}
              size="large"
              variant="secondary"
              beforeIcon={require("@/assets/icons/Video - Iconly Pro.png")}
            />
          </View>
        </ScrollView>

        {/* Gallery Modal */}
        <Modal
          visible={showGalleryModal}
          animationType="slide"
          onRequestClose={() => setShowGalleryModal(false)}
        >
          <SafeAreaViewContainer>
            <View style={styles.galleryModalContainer}>
              {/* Header */}
              <View style={styles.galleryModalHeader}>
                <Pressable onPress={() => setShowGalleryModal(false)}>
                  <Image
                    source={require("@/assets/icons/arrow-left-light.png")}
                    style={styles.backIcon}
                  />
                </Pressable>
                <View style={styles.galleryTitleContainer}>
                  <Text style={styles.galleryModalTitle}>Gallery</Text>
                  <Text style={styles.galleryPhotoCount}>
                    {spaceData.gallery.length} Photos
                  </Text>
                </View>
                <View style={styles.galleryHeaderIcons}>
                  <TouchableOpacity>
                    <Image
                      source={require("@/assets/icons/share.png")}
                      style={styles.headerIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image
                      source={require("@/assets/icons/bookmark-active-dark.png")}
                      style={styles.headerIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Main Gallery Slider */}
              <ScrollView
                ref={galleryScrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.gallerySlider}
              >
                {spaceData.gallery.map((image, index) => (
                  <Image
                    key={index}
                    source={image}
                    style={styles.gallerySlideImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {/* Dots Indicator */}
              <View style={styles.dotsContainer}>
                {spaceData.gallery.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentImageIndex === index && styles.dotActive,
                    ]}
                  />
                ))}
              </View>

              {/* Thumbnails */}
              <View style={styles.thumbnailsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.thumbnailsScroll}
                >
                  {spaceData.gallery.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setCurrentImageIndex(index);
                        galleryScrollRef.current?.scrollTo({
                          x: width * index,
                          animated: true,
                        });
                      }}
                      style={[
                        styles.thumbnail,
                        currentImageIndex === index && styles.thumbnailActive,
                      ]}
                    >
                      <Image
                        source={image}
                        style={styles.thumbnailImage}
                        resizeMode="cover"
                      />
                      {index === 3 && (
                        <View style={styles.thumbnailOverlay}>
                          <Text style={styles.thumbnailOverlayText}>+7</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Take Virtual Tour Button */}
              <View style={styles.virtualTourContainer}>
                <AppButton
                  title="Take Virtual Tour"
                  onPress={() => {}}
                  variant="secondary"
                />
              </View>
            </View>
          </SafeAreaViewContainer>
        </Modal>

        {/* Inspection Modal - Bottom Sheet */}
        <Modal
          visible={showInspectionModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowInspectionModal(false)}
        >
          <Pressable
            style={styles.inspectionModalOverlay}
            onPress={() => setShowInspectionModal(false)}
          >
            <Pressable
              style={styles.inspectionBottomSheet}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <View style={styles.modalHandle} />

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.inspectionModalBody}>
                  <Text style={styles.inspectionModalTitle}>
                    Schedule an inspection
                  </Text>
                  <Text style={styles.inspectionModalSubtitle}>
                    Pick a convenient time to inspect this space in person. A
                    small inspection fee may apply, payable before confirmation.
                  </Text>

                  {/* <Text style={styles.inputLabel}>Select inspection date</Text> */}
                  <TouchableOpacity
                    style={styles.inspectionInput}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text
                      style={[
                        styles.inspectionInputText,
                        !selectedDate && styles.inspectionInputPlaceholder,
                      ]}
                    >
                      {selectedDate
                        ? formatReadableDate(selectedDate)
                        : "Select inspection date"}
                    </Text>
                    <Image
                      source={require("@/assets/icons/calendar.png")}
                      style={styles.inspectionInputIcon}
                    />
                  </TouchableOpacity>

                  {/* <Text style={styles.inputLabel}>Choose time slot</Text> */}
                  <TouchableOpacity
                    style={styles.inspectionInput}
                    onPress={() => setShowTimeSlotModal(true)}
                  >
                    <Text
                      style={[
                        styles.inspectionInputText,
                        !selectedTime && styles.inspectionInputPlaceholder,
                      ]}
                    >
                      {selectedTime ? selectedTime.label : "Select time"}
                    </Text>
                    <Image
                      source={require("@/assets/icons/chevron-right.png")}
                      // style={styles.chevronIcon}
                    />
                  </TouchableOpacity>

                  <View style={styles.inspectionFeeRow}>
                    <Text style={styles.inspectionFeeLabel}>
                      Inspection fee:
                    </Text>
                    <Text style={styles.inspectionFeeAmount}>₦1,000</Text>
                  </View>

                  {/* Security Note */}
                  <View style={styles.inspectionNote}>
                    <Text style={styles.inspectionNoteText}>
                      🔐 Fee is held by DiPlace and only released after a
                      successful inspection. Refunded if canceled or not
                      completed.
                    </Text>
                  </View>

                  {/* Buttons */}
                  <View style={styles.inspectionButtons}>
                    <AppButton
                      title="Schedule Inspection"
                      onPress={() => {
                        setShowInspectionModal(false);
                        router.push({
                          pathname: "/views/booking/payment",
                          params: { type: "inspection", amount: "₦1,000" },
                        });
                      }}
                      disabled={!selectedTime || !selectedDate}
                    />
                    <AppButton
                      title="Skip & Proceed to Book Now"
                      onPress={() => {
                        setShowInspectionModal(false);
                        router.push("/views/booking/renters-info");
                      }}
                      variant="tertiary"
                    />
                  </View>
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Date Picker Modal */}
        <Modal visible={showDatePicker} transparent animationType="fade">
          <View className="items-center justify-center flex-1 bg-black/30">
            <View
              style={{ backgroundColor: colors.background }}
              className="w-[88%] rounded-3xl p-5"
            >
              <Text
                style={{ color: colors.slate[600] }}
                className="mb-2 text-sm"
              >
                Select date
              </Text>

              <Text
                style={{ color: colors.slate[650] }}
                className="mb-4 text-2xl font-semibold"
              >
                {selectedDate
                  ? formatReadableDate(selectedDate)
                  : formatReadableDate(new Date())}
              </Text>

              <View className="h-[1px] bg-gray-200 dark:bg-gray-700 mb-4" />

              <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markingType={"custom"}
                markedDates={
                  selectedDate
                    ? {
                        [selectedDate]: {
                          customStyles: {
                            container: {
                              borderWidth: 2,
                              borderColor: "#000",
                              borderRadius: 999,
                            },
                            text: {
                              color: "#000",
                              fontWeight: "600",
                            },
                          },
                        },
                      }
                    : {}
                }
                theme={{
                  backgroundColor: isDarkMode ? "#181818" : "#FCFCFC",
                  calendarBackground: isDarkMode ? "#181818" : "#FCFCFC",
                  textSectionTitleColor: "#9ca3af",
                  monthTextColor: isDarkMode ? "#ffffff" : "#000000",
                  textMonthFontWeight: "600",
                  textMonthFontSize: 16,
                  dayTextColor: isDarkMode ? "#e5e7eb" : "#000000",
                  textDayFontSize: 15,
                  arrowColor: "#000",
                  todayTextColor: "#000",
                }}
                style={{ borderRadius: 20, paddingBottom: 10 }}
              />

              <View className="flex-row justify-end mt-3">
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text className="mr-6 text-base text-gray-600 dark:text-gray-300">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setShowDatePicker(false);
                  }}
                >
                  <Text className="text-base font-semibold text-blue-600 dark:text-blue-400">
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Time Slot Modal */}
        <Modal
          visible={showTimeSlotModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTimeSlotModal(false)}
        >
          <Pressable
            style={styles.timeSlotModalOverlay}
            onPress={() => setShowTimeSlotModal(false)}
          >
            <Pressable
              style={styles.timeSlotBottomSheet}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHandle} />

              <Text style={styles.timeSlotModalTitle}>Choose time slot</Text>
              <Text style={styles.timeSlotModalSubtitle}>
                Pick a convenient time for you from the agent's available time
                slot.
              </Text>

              <View style={styles.timeSlotList}>
                {timeslotDB.map((item) => {
                  const isSelected = selectedTime?.id === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.timeSlotItem}
                      onPress={() => {
                        setSelectedTime(item);
                        setShowTimeSlotModal(false);
                      }}
                    >
                      <View
                        style={[
                          styles.timeSlotRadio,
                          isSelected && styles.timeSlotRadioSelected,
                        ]}
                      >
                        {isSelected && (
                          <View style={styles.timeSlotRadioInner} />
                        )}
                      </View>
                      <Text style={styles.timeSlotItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* ENLARGED MAP MODAL */}
        <Modal
          visible={enlargeMapVisible}
          animationType="slide"
          onRequestClose={() => {
            setShowLocationSheet(false);
            setEnlargeMapVisible(false);
          }}
        >
          <View style={styles.fullMapContainer}>
            {HAS_GOOGLE_KEY ? (
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: spaceForm.value.location?.latitude ?? 4.8156,
                  longitude: spaceForm.value.location?.longitude ?? 7.0498,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: spaceForm.value.location?.latitude ?? 4.8156,
                    longitude: spaceForm.value.location?.longitude ?? 7.0498,
                  }}
                />
              </MapView>
            ) : (
              <View style={styles.mapFallback}>
                <Text style={styles.mapFallbackText}>
                  Map disabled. Add Google API key to enable.
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.fullStreetViewButton}
              onPress={() =>
                router.push({
                  pathname: "/views/streetview",
                  params: {
                    lat: spaceForm.value.location?.latitude,
                    lng: spaceForm.value.location?.longitude,
                  },
                })
              }
            >
              <Image
                source={require("@/assets/icons/Streetview-solid.png")}
                style={styles.streetViewIcon}
              />
              <Text style={styles.streetViewText}>Street view</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.fullscreenButton]}
              onPress={() => {
                setShowLocationSheet(false);
                setEnlargeMapVisible(false);
              }}
            >
              <Image
                source={require("@/assets/icons/collapse.png")}
                style={styles.expandViewIcon}
              />
            </TouchableOpacity>

            {showLocationSheet && (
              <Pressable
                style={styles.bottomSheetOverlay}
                onPress={() => setShowLocationSheet(false)}
              >
                <Pressable style={styles.bottomSheetContainer}>
                  <View style={styles.bottomSheetHandle} />
                  <View style={styles.bottomSheetContent}>
                    <Text style={styles.bottomSheetTitle}>Location</Text>
                    <Text style={styles.bottomSheetAddress}>
                      {spaceForm.value?.location?.address ||
                        "Road 2, Tony Estate, Rumuewhere, Port Harcourt"}
                    </Text>
                  </View>
                </Pressable>
              </Pressable>
            )}
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Placedetails;

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    scrollContent: {
      paddingVertical: RFValue(20),
    },
    mainContainer: {
      flex: 1,
      paddingBottom: RFValue(50),
      paddingTop: RFValue(24),
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingHorizontal: RFValue(16),
    },
    imageContainer: {
      width: "100%",
      height: RFValue(250),
      marginBottom: RFValue(12),
      position: "relative",
    },
    mainImage: {
      width: "100%",
      height: "100%",
      borderRadius: RFValue(12),
    },
    bookmarkButton: {
      position: "absolute",
      top: RFValue(12),
      right: RFValue(12),
      width: RFValue(36),
      height: RFValue(36),
      borderRadius: RFValue(18),
      backgroundColor: "FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    divider: {
      width: 2,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      marginVertical: RFValue(8),
    },
    bookmarkIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    actionButtons: {
      flexDirection: "row",
      gap: RFValue(8),
      marginBottom: RFValue(20),
      position: "absolute",
      bottom: -RFValue(20),
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      color: "#FFFFFF",
      borderBottomEndRadius: RFValue(12),
      borderBottomStartRadius: RFValue(12),
    },
    actionButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: RFValue(12),

      gap: RFValue(8),
    },
    actionButtonIcon: {
      width: RFValue(18),
      height: RFValue(18),
      tintColor: colors.slate[650],
    },
    actionButtonText: {
      fontSize: RFValue(13),
      fontWeight: "600",
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    propertyCard: {
      marginBottom: RFValue(24),
    },
    propertyTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: RFValue(8),
    },
    propertyTitle: {
      fontSize: RFValue(16),
      fontWeight: "700",
      color: colors.slate[650],
      flex: 1,
      marginRight: RFValue(12),
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
      marginBottom: RFValue(8),
    },
    locationIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    addressText: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      flex: 1,
    },
    priceText: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
    },
    priceUnit: {
      fontSize: RFValue(13),
      fontWeight: "400",
      color: colors.slate[500],
      marginBottom: RFValue(12),
    },
    featuresRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: RFValue(20),
      borderTopWidth: 1,
      borderTopColor: colors.slate[350],
    },
    featureItem: {
      alignItems: "center",
      gap: RFValue(8),
    },
    featureIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[600],
    },
    featureText: {
      fontSize: RFValue(13),
      color: colors.slate[600],
      fontWeight: "500",
    },
    section: {
      paddingVertical: RFValue(16),
      borderTopColor: colors.slate[350],
      borderTopWidth: 1,
    },
    sectionTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(12),
    },
    aboutText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(22),
    },
    amenityRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: RFValue(8),
    },
    bullet: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      marginRight: RFValue(8),
      marginTop: RFValue(2),
    },
    amenityText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      flex: 1,
    },
    locationAddress: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      marginBottom: RFValue(16),
    },
    mapContainer: {
      width: "100%",
      height: RFValue(250),
      borderRadius: RFValue(12),
      overflow: "hidden",
      position: "relative",
    },
    mapFallback: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.slate[150],
      paddingHorizontal: RFValue(16),
    },
    mapFallbackText: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      textAlign: "center",
    },
    fullMapContainer: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      position: "relative",
    },
    streetViewButton: {
      position: "absolute",
      bottom: RFValue(12),
      right: RFValue(12),
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.slate[550],
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(8),
      borderRadius: RFValue(20),
      gap: RFValue(6),
    },
    fullStreetViewButton: {
      position: "absolute",
      bottom: RFValue(150),
      right: RFValue(12),
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.slate[550],
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(8),
      borderRadius: RFValue(20),
      gap: RFValue(6),
    },
    fullscreenButton: {
      position: "absolute",
      top: RFValue(12),
      right: RFValue(12),
      backgroundColor: colors.slate[100],
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(12),
      borderRadius: RFValue(30),
    },
    expandViewIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[650],
    },
    streetViewIcon: {
      width: RFValue(14),
      height: RFValue(14),
      tintColor: "#FFFFFF",
    },
    streetViewText: {
      fontSize: RFValue(12),
      fontWeight: "500",
      color: "#FFFFFF",
    },
    bottomSheetOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: "flex-end",
    },
    bottomSheetContainer: {
      backgroundColor: "#FFFFFF",
      borderTopLeftRadius: RFValue(20),
      borderTopRightRadius: RFValue(20),
      minHeight: "15%",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 10,
    },
    bottomSheetHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginTop: RFValue(12),
    },
    bottomSheetContent: {
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(16),
    },
    bottomSheetTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(12),
    },
    bottomSheetAddress: {
      fontSize: RFValue(14),
      color: colors.slate[600],
      lineHeight: RFValue(22),
    },
    costBreakdownContainer: {
      borderRadius: RFValue(12),
    },
    costRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: RFValue(16),
    },
    costLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    costAmount: {
      fontSize: RFValue(14),
      fontWeight: "600",
      color: colors.slate[650],
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: RFValue(16),
      borderTopWidth: 1,
      borderTopColor: colors.slate[300],
    },
    totalLabel: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    totalAmount: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
    },
    completeButtonContainer: {
      marginTop: RFValue(8),
      display: "flex",
      gap: RFValue(8),
    },
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    // Gallery Modal
    galleryModalContainer: {
      flex: 1,
    },
    galleryModalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: RFValue(16),
      paddingHorizontal: RFValue(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
    },
    galleryTitleContainer: {
      flex: 1,
      alignItems: "center",
    },
    galleryModalTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
    },
    galleryPhotoCount: {
      fontSize: RFValue(12),
      color: colors.slate[500],
    },
    galleryHeaderIcons: {
      flexDirection: "row",
      gap: RFValue(16),
    },
    headerIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    gallerySlider: {
      flex: 1,
    },
    gallerySlideImage: {
      width: width,
      height: "100%",
    },
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: RFValue(16),
      gap: RFValue(6),
    },
    dot: {
      width: RFValue(6),
      height: RFValue(6),
      borderRadius: RFValue(3),
      backgroundColor: colors.slate[300],
    },
    dotActive: {
      backgroundColor: colors.slate[650],
      width: RFValue(20),
    },
    thumbnailsContainer: {
      paddingHorizontal: RFValue(16),
      marginBottom: RFValue(16),
    },
    thumbnailsScroll: {
      gap: RFValue(8),
    },
    thumbnail: {
      width: RFValue(70),
      height: RFValue(70),
      borderRadius: RFValue(8),
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "transparent",
      position: "relative",
    },
    thumbnailActive: {
      borderColor: colors.slate[650],
    },
    thumbnailImage: {
      width: "100%",
      height: "100%",
    },
    thumbnailOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      alignItems: "center",
      justifyContent: "center",
    },
    thumbnailOverlayText: {
      color: "#FFFFFF",
      fontSize: RFValue(16),
      fontWeight: "700",
    },
    virtualTourContainer: {
      paddingHorizontal: RFValue(16),
      paddingBottom: RFValue(20),
    },
    // Inspection Modal - Bottom Sheet
    inspectionModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    inspectionBottomSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(32),
      maxHeight: "85%",
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      backgroundColor: colors.slate[300],
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginVertical: RFValue(12),
    },
    inspectionModalBody: {
      gap: RFValue(10),
    },
    inspectionModalTitle: {
      fontSize: RFValue(20),
      fontWeight: "700",
      color: colors.slate[650],
      textAlign: "center",
      marginBottom: RFValue(4),
    },
    inspectionModalSubtitle: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      textAlign: "center",
      lineHeight: RFValue(18),
      marginBottom: RFValue(8),
    },
    inputLabel: {
      fontSize: RFValue(14),
      fontWeight: "500",
      color: colors.slate[650],
      marginBottom: RFValue(8),
    },
    inspectionInput: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      padding: RFValue(16),
      borderWidth: 1,
      borderColor: colors.slate[300],
    },
    inspectionInputText: {
      flex: 1,
      fontSize: RFValue(15),
      color: colors.slate[650],
    },
    inspectionInputPlaceholder: {
      color: colors.slate[450],
    },
    inspectionInputIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[500],
    },
    chevronIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[500],
    },
    inspectionFeeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: RFValue(16),
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.slate[300],
    },
    inspectionFeeLabel: {
      fontSize: RFValue(14),
      color: colors.slate[600],
    },
    inspectionFeeAmount: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
    },
    inspectionNote: {
      flexDirection: "row",
      gap: RFValue(8),
      padding: RFValue(12),
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
    },
    shieldIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.success[200],
      marginTop: RFValue(2),
    },
    inspectionNoteText: {
      flex: 1,
      fontSize: RFValue(12),
      color: colors.slate[600],
      lineHeight: RFValue(16),
      textAlign: "center",
    },
    inspectionButtons: {
      gap: RFValue(12),
    },
    // Time Slot Modal
    timeSlotModalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    timeSlotBottomSheet: {
      backgroundColor: colors.background,
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(32),
    },
    timeSlotModalTitle: {
      fontSize: RFValue(18),
      fontWeight: "700",
      color: colors.slate[650],
      textAlign: "center",
      marginBottom: RFValue(4),
    },
    timeSlotModalSubtitle: {
      fontSize: RFValue(13),
      color: colors.slate[500],
      textAlign: "center",
      lineHeight: RFValue(18),
      marginBottom: RFValue(20),
    },
    timeSlotList: {
      gap: RFValue(12),
    },
    timeSlotItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: RFValue(16),
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.slate[300],
      gap: RFValue(12),
    },
    timeSlotRadio: {
      width: RFValue(20),
      height: RFValue(20),
      borderRadius: RFValue(10),
      borderWidth: 2,
      borderColor: colors.slate[400],
      alignItems: "center",
      justifyContent: "center",
    },
    timeSlotRadioSelected: {
      borderColor: colors.slate[650],
    },
    timeSlotRadioInner: {
      width: RFValue(10),
      height: RFValue(10),
      borderRadius: RFValue(5),
      backgroundColor: colors.slate[650],
    },
    timeSlotItemText: {
      flex: 1,
      fontSize: RFValue(14),
      color: colors.slate[650],
    },
  });
