import { CustomBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
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

type timeslot = {
  id: string;
  label: string;
};
const timeslotDB: timeslot[] = [
  { id: "morning", label: "10AM - 12PM (Morning slot)" },
  { id: "afternoon", label: "1PM - 3PM (Afternoon slot)" },
  { id: "evening", label: "4PM - 6PM (Evening slot)" },
];

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

  const openDatePicker = useRef<BottomSheetModal>(null);

  const openInspection = useRef<BottomSheetModal>(null);
  const openTimeSlot = useRef<BottomSheetModal>(null);
  const router = useRouter();

  const handleOpenInspection = () => {
    openInspection.current?.present();
  };
  const handleOpenTimeSlot = () => {
    openTimeSlot.current?.present();
  };

  const snapPoints = useMemo(() => ["75%", "90%"], []);

  const formatReadableDate = (
    dateString: string | null | undefined
  ): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
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
      <CustomBottomSheet
        bottomSheetProps={{
          ref: openInspection,
          snapPoints,
        }}
      >
        <View className="flex flex-col gap-5 ">
          <View>
            <Text
              className="font-semibold text-center "
              style={homeStyles.title2}
            >
              Schedule an Inspection
            </Text>
            <Text className=" text-center " style={homeStyles.subTitlegray}>
              Pick a convenient time to inspect this space in person. A small
              inspection fee may apply, payable before confirmation.
            </Text>
          </View>

          <View>
            <TouchableOpacity
              className="border border-gray-300 dark:border-gray-600 p-4 mt-6 rounded-2xl flex-row w-full justify-between"
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                className="text-base dark:text-white"
                style={homeStyles.text}
              >
                {selectedDate
                  ? formatReadableDate(selectedDate)
                  : "Select Inspection Date"}
              </Text>

              {isDarkMode ? (
                <Image source={require("@/assets/icons/calender-white.png")} />
              ) : (
                <Image source={require("@/assets/icons/calender-dark.png")} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-gray-300 dark:border-gray-600 p-4 mt-6 rounded-2xl flex-row w-full justify-between"
              onPress={handleOpenTimeSlot}
            >
              <Text className="text-base dark:text-white">
                {selectedTime ? selectedTime.label : "Choose Time Slot"}
              </Text>
              <Image source={require("@/assets/icons/angle.png")} />
            </TouchableOpacity>
          </View>

          <View className="flex flex-row w-full justify-between ">
            <Text style={homeStyles.text}>inspection fee: </Text>
            <Text style={homeStyles.title2} className="font-semibold ">
              $1000
            </Text>
          </View>
          <View className="py-3 border-t border-gray-300 mt-2 flex-col flex gap-5">
            <Text style={homeStyles.small} className="italic text-center">
              🔐 Fee is held by DiPlace and only released after a successful
              inspection. Refunded if canceled or not completed.
            </Text>

            <View className="flex flex-col gap-5">
              <AppButton
                title="Schedule Inspection"
                onPress={() => {
                  router.push("/views/inspection/inspectionPayment");
                  openInspection.current?.dismiss();
                }}
                size="large"
                disabled={!selectedTime}
              />
              <Text style={homeStyles.text} className="font-medium text-center">
                Skip & Proceed to Book Now
              </Text>
            </View>
          </View>
        </View>
      </CustomBottomSheet>

      {/* DATE PICKER MODAL */}

      <Modal visible={showDatePicker} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="w-[88%] rounded-3xl bg-white dark:bg-gray-900 p-5">
            <Text className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Select date
            </Text>

            <Text className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {selectedDate ? formatReadableDate(selectedDate) : "—"}
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
                <Text className="text-gray-600 dark:text-gray-300 text-base mr-6">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setShowDatePicker(false);
                }}
              >
                <Text className="text-blue-600 dark:text-blue-400 text-base font-semibold">
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time slot */}
      <CustomBottomSheet
        bottomSheetProps={{
          ref: openTimeSlot,
          snapPoints,
        }}
      >
        <View className="flex flex-col gap-10">
          <View>
            <Text style={homeStyles.title2} className="text-center">
              Choose Time Slot
            </Text>
            <Text style={homeStyles.subTitlegray} className="text-center">
              Pick a convenient time for you from the agent’s available time
              slot.
            </Text>
          </View>
          <View>
            <FlatList
              data={timeslotDB}
              keyExtractor={(item) => item.id}
              contentContainerClassName="gap-3"
              renderItem={({ item }) => {
                const isSelected = selectedTime?.id === item.id;

                return (
                  <TouchableOpacity
                    style={homeStyles.border}
                    className="border p-4 rounded-2xl"
                    onPress={() => {
                      setSelectedTime(item);
                      openTimeSlot.current?.dismiss();
                    }}
                  >
                    <View className="flex-row items-center">
                      {/* Radio circle */}
                      <View
                        style={
                          isSelected ? homeStyles.border2 : homeStyles.border
                        }
                        className={`h-5 w-5 rounded-full border-2 items-center justify-center mr-3 
                            `}
                      >
                        {isSelected && (
                          <View
                            style={{ backgroundColor: colors.slate?.[650] }}
                            className="h-2.5 w-2.5 rounded-full "
                          />
                        )}
                      </View>

                      <Text
                        style={homeStyles.subTitlegray}
                        className="text-base"
                      >
                        {item.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </CustomBottomSheet>
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
