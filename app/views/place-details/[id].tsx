import AppButton from "@/components/button";
import InspectionBottomSheet from "@/components/place-details/inspection-bottomsheet";
import TimeslotBottomSheet from "@/components/place-details/timeslot-bottomshet";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import {
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
import { RFValue } from "react-native-responsive-fontsize";

const Placedetails = () => {
  const { colors, isDarkMode } = useTheme();
  const homeStyles = styles(colors);
  const listItems = ["Wardrobe", "2 Bethroom"];
  const [selectedTime, setSelectedTime] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const openTimeSlot = useRef<BottomSheetModal>(null);

  const openInspection = useRef<BottomSheetModal>(null);

  const formatReadableDate = (
    dateString: string | Date | null | undefined
  ): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleOpenTimeSlot = () => {
    openTimeSlot.current?.present();
  };

  const handleOpenInspection = () => {
    openInspection.current?.present();
  };

  return (
    <SafeAreaViewContainer>
      <SectionHeader
        title=""
        rightIconSource={require("@/assets/icons/more-2-line.png")}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            height: RFValue(380),
          }}
          className="w-full rounded-lg"
        >
          <Image
            className="w-full h-full"
            source={require("@/assets/images/idViewImage.png")}
          />
        </View>
        <View className="flex flex-row justify-between pt-4">
          <Text style={homeStyles.title} className="w-[70%]">
            2 Bedroom in-suite apartment
          </Text>
          <Text style={[homeStyles.title, { fontWeight: 600 }]}>₦600,000</Text>
        </View>
        <View className="flex flex-row justify-between py-4">
          <View className="flex gap-1 flex-row items-center w-[70%]">
            <Image
              source={require("@/assets/icons/location-black.png")}
              className="w-6 h-6"
            />
            <Text style={homeStyles.subTitlegray}>
              Road 13, Tony Estate, Rumuewhera, Port Harcourt
            </Text>
          </View>
          <Text style={homeStyles.subTitlegray}>/annum</Text>
        </View>
        <View className="px-3 py-2 border-t border-b border-gray-300">
          <Text
            style={{ color: colors.slate[600] }}
            className="py-2 italic text-center"
          >
            ⚠️ Heads up! The price you see is for the space only. Agent fees and
            other charges may apply.
          </Text>
        </View>
        <View className="flex flex-row py-4 border-b border-gray-300 justify-evenly">
          <View className="flex items-center justify-center">
            <Image
              source={require("@/assets/icons/bed-outline.png")}
              className="w-6 h-6"
            />
            <Text style={{ color: colors.slate[650] }}>2 Bedrooms</Text>
          </View>
          <View className="flex items-center justify-center">
            <Image
              source={require("@/assets/icons/bath.png")}
              className="w-6 h-6"
            />
            <Text style={{ color: colors.slate[650] }}>2 Baths</Text>
          </View>
          <View className="flex items-center justify-center">
            <Image
              source={require("@/assets/icons/bath.png")}
              className="w-6 h-6"
            />
            <Text style={{ color: colors.slate[650] }}>10 by 12ft</Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between py-3">
          <Text className="font-semibold" style={homeStyles.title}>
            Listed by
          </Text>
          <Text style={{ color: colors.slate[650] }} className="">
            Pushed 2 days ago
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
              <Image source={require("@/assets/icons/badge-check-green.png")} />
            </Text>
            <Text
              style={{ color: colors.slate[650] }}
              className="flex flex-row gap-2"
            >
              <Image
                source={require("@/assets/icons/star.png")}
                className="w-4 h-4"
              />{" "}
              4.5 <Text className="text-blue-500">(15 reviews)</Text>
            </Text>
          </View>
          <View className="flex flex-row gap-3">
            <View className="w-14 flex items-center justify-center h-14 rounded-[999px] bg-gray-400 ">
              <Image
                source={require("@/assets/icons/calling.png")}
                className="w-6 h-6"
              />
            </View>
            <View className="w-14 flex items-center justify-center h-14 rounded-[999px] bg-gray-400 ">
              <Image
                source={require("@/assets/icons/calling.png")}
                className="w-6 h-6"
              />
            </View>
          </View>
        </View>
        <View className="py-3 border-b border-gray-300">
          <Text style={homeStyles.title} className="pb-2">
            About this space
          </Text>
          <Text style={{ color: colors.slate[650] }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus, ipsa consequatur excepturi in ab nemo est porro hic,
            ad, maxime at. Odio, sunt. Necessitatibus similique eos quod
            molestias iste ipsa?
          </Text>
          <Text className="py-2" style={homeStyles.title}>
            Amentities
          </Text>
          {listItems.map((item, index) => (
            <Text
              key={index}
              style={{ color: colors.slate[650] }}
            >{`\u2022 ${item}`}</Text>
          ))}
        </View>
        <View className="py-3 border-b border-gray-300">
          <Text style={homeStyles.title} className="pb-2">
            Location
          </Text>
          <Text style={{ color: colors.slate[650] }}>
            Road 2, Tony Estate, Port Harcourt
          </Text>
        </View>

        <View className="py-3 border-b border-gray-300">
          <Text style={homeStyles.title} className="pb-2 font-semibold">
            Cost Breakdown
          </Text>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Space rent</Text>
            <Text
              style={{ color: colors.slate[650] }}
              className="font-semibold"
            >
              N600,000.00
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Caution fee</Text>
            <Text
              style={{ color: colors.slate[650] }}
              className="font-semibold"
            >
              ₦50,000.00
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Agent fee (10%)</Text>
            <Text
              style={{ color: colors.slate[650] }}
              className="font-semibold"
            >
              ₦60,000.00
            </Text>
          </View>
          <View className="flex flex-row justify-between py-2">
            <Text style={homeStyles.gray}>Platform fee (1%)</Text>
            <Text
              style={{ color: colors.slate[650] }}
              className="font-semibold"
            >
              ₦6,000.00
            </Text>
          </View>
        </View>
        <View className="flex flex-row justify-between py-3 border-b border-gray-300">
          <Text
            style={{ color: colors.slate[650], fontSize: RFValue(16) }}
            className="font-medium"
          >
            Total Payable
          </Text>
          <Text style={homeStyles.title} className="font-semibold">
            N716,000.10
          </Text>
        </View>

        <Pressable className="flex flex-row items-center gap-3 py-4">
          <Image
            source={require("@/assets/icons/flag-red.png")}
            className="w-6 h-6"
          />
          <Text style={{ color: colors.error[200] }}>Report listing</Text>
        </Pressable>
      </ScrollView>
      <View className="flex flex-col gap-3 py-4">
        <AppButton
          title="Book Now"
          onPress={handleOpenInspection}
          size="large"
        />
        <AppButton
          title="Virtual Tour"
          onPress={() => {}}
          size="large"
          variant="tertiary"
          beforeIcon={require("@/assets/icons/Video - Iconly Pro.png")}
        />
      </View>

      {/* inspection */}

      <InspectionBottomSheet
        handleOpenTimeSlot={handleOpenTimeSlot}
        openInspection={openInspection}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        setShowDatePicker={setShowDatePicker}
        showDatePicker={showDatePicker}
      />
      {/* DATE PICKER MODAL */}
      <TimeslotBottomSheet
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        openTimeSlot={openTimeSlot}
      />

      <Modal visible={showDatePicker} transparent animationType="fade">
        <View className="items-center justify-center flex-1 bg-black/30">
          <View
            style={{ backgroundColor: colors.background }}
            className="w-[88%] rounded-3xl p-5"
          >
            <Text style={{ color: colors.slate[600] }} className="mb-2 text-sm">
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

            {/* BOTTOM BUTTONS */}
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

      {/* Time slot */}
    </SafeAreaViewContainer>
  );
};

export default Placedetails;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    gray: {
      color: colors.slate[600],
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
    },
    titlegray: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[600],
    },
    subTitlegray: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    title2: {
      fontSize: RFValue(20),
      lineHeight: RFValue(28),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(16),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    small: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[600],
    },
    border: {
      borderColor: colors.slate[300],
      backgroundAttachment: colors.slate[150],
    },
    border2: {
      borderColor: colors.slate[650],
    },
  });
