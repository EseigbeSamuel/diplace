import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface BookingItem {
  id: string;
  month: string;
  day: string;
  dueText?: string;
  title: string;
  location: string;
  isNew?: boolean;
  status: "scheduled" | "reserved" | "booked" | "inspected" | "cancelled";
}

const agentBookings: BookingItem[] = [
  {
    id: "1",
    month: "Aug",
    day: "09",
    title: "2 Bedroom in-suite apartment",
    location: "Rumuehwhera, Port Harcourt",
    isNew: true,
    status: "scheduled",
  },
  {
    id: "2",
    month: "Aug",
    day: "02",
    title: "2 Bedroom in-suite apartment",
    location: "Rumuehwhera, Port Harcourt",
    status: "scheduled",
  },
  {
    id: "3",
    month: "Aug",
    day: "25",
    dueText: "Due: 10th Aug, 2025",
    title: "Atraz Palace Event Hall",
    location: "GRA Phase II, Port Harcourt",
    isNew: true,
    status: "reserved",
  },
  {
    id: "4",
    month: "Aug",
    day: "23",
    dueText: "Due: 10th Aug, 2025",
    title: "Atraz Palace Event Hall",
    location: "GRA Phase II, Port Harcourt",
    status: "reserved",
  },
  {
    id: "5",
    month: "Aug",
    day: "25",
    title: "Atraz Palace Event Hall",
    location: "GRA Phase II, Port Harcourt",
    isNew: true,
    status: "booked",
  },
  {
    id: "6",
    month: "Aug",
    day: "23",
    title: "Self contain studio apartment",
    location: "Onukem Street, Ikeja, Lagos",
    status: "booked",
  },
  {
    id: "7",
    month: "Aug",
    day: "02",
    title: "2 Bedroom in-suite apartment",
    location: "Rumuehwhera, Port Harcourt",
    status: "inspected",
  },
];

const AgentBookingCard = ({
  month,
  day,
  dueText,
  title,
  location,
  isNew,
  onPress,
}: {
  month: string;
  day: string;
  dueText?: string;
  title: string;
  location: string;
  isNew?: boolean;
  onPress?: () => void;
}) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      className="flex flex-row items-center gap-4 py-3"
    >
      {/* Left Column: Date Badge */}
      <View
        style={{
          width: RFValue(44),
          height: RFValue(46),
          borderRadius: RFValue(10),
          borderWidth: 1,
          borderColor: colors.slate[300],
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDarkMode ? colors.slate[100] : "#FFFFFF",
        }}
      >
        <Text
          style={{
            fontSize: RFValue(11),
            color: colors.slate[500],
            textTransform: "uppercase",
          }}
          className="font-semibold"
        >
          {month}
        </Text>
        <Text
          style={{
            fontSize: RFValue(16.5),
            fontWeight: "bold",
            color: colors.slate[650],
            marginTop: -2,
          }}
        >
          {day}
        </Text>
      </View>

      {/* Center Column: Text Details */}
      <View className="flex-1 justify-center">
        {dueText && (
          <Text
            style={{
              fontSize: RFValue(12),
              color: colors.slate[500],
              marginBottom: 1,
            }}
            className="font-medium"
          >
            {dueText}
          </Text>
        )}
        <Text
          style={{
            fontSize: RFValue(16),
            fontWeight: "600",
            color: colors.slate[650],
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: RFValue(13.5),
            color: colors.slate[500],
            marginTop: 1,
          }}
          numberOfLines={1}
        >
          {location}
        </Text>
      </View>

      {/* Right Column: Badges & Arrow */}
      <View className="flex flex-row items-center gap-2">
        {isNew && (
          <View
            style={{
              backgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#EF4444",
                fontSize: RFValue(10.5),
                fontWeight: "bold",
              }}
            >
              NEW
            </Text>
          </View>
        )}

        <Image
          source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
          className="w-4 h-4"
          style={{ tintColor: colors.slate[550] }}
        />
      </View>
    </Pressable>
  );
};

const AgentActiveActivity = () => {
  const { colors, isDarkMode } = useTheme();
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  const filterTabs = [
    { id: "all", name: "All" },
    { id: "scheduled", name: "Scheduled", badge: 1 },
    { id: "reserved", name: "Reserved", badge: 1 },
    { id: "booked", name: "Booked" },
    { id: "inspected", name: "Inspected" },
    { id: "cancelled", name: "Cancelled" },
  ];

  const handleCardPress = (item: BookingItem) => {
    router.push({
      pathname: "/views/activities/activity-schedule/[index]",
      params: { index: item.id, status: item.status, title: item.title },
    });
  };

  const scheduledList = useMemo(
    () => agentBookings.filter((b) => b.status === "scheduled"),
    []
  );
  const reservedList = useMemo(
    () => agentBookings.filter((b) => b.status === "reserved"),
    []
  );
  const bookedList = useMemo(
    () => agentBookings.filter((b) => b.status === "booked"),
    []
  );
  const inspectedList = useMemo(
    () => agentBookings.filter((b) => b.status === "inspected"),
    []
  );
  const cancelledList = useMemo(
    () => agentBookings.filter((b) => b.status === "cancelled"),
    []
  );

  const renderSection = (title: string, list: BookingItem[]) => {
    if (list.length === 0) return null;
    return (
      <View className="mb-6">
        <Text
          style={{
            color: colors.slate[650],
            fontSize: RFValue(18),
            fontWeight: "700",
            marginBottom: RFValue(8),
          }}
        >
          {title}
        </Text>
        <View style={{ gap: RFValue(6) }}>
          {list.map((item) => (
            <AgentBookingCard
              key={item.id}
              month={item.month}
              day={item.day}
              dueText={item.dueText}
              title={item.title}
              location={item.location}
              isNew={item.isNew}
              onPress={() => handleCardPress(item)}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Horizontal Filter Tabs */}
      <View className="my-4">
        <FlatList
          data={filterTabs}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: RFValue(8) }}
          renderItem={({ item }) => {
            const isActive = activeFilter === item.id;
            return (
              <Pressable onPress={() => setActiveFilter(item.id)}>
                <View
                  style={{
                    borderColor: isActive
                      ? colors.slate[650]
                      : colors.slate[300],
                    backgroundColor: isActive
                      ? colors.slate[150]
                      : "transparent",
                  }}
                  className="rounded-full py-1.5 px-3.5 border flex-row items-center gap-1.5"
                >
                  <Text
                    style={{
                      color: isActive ? colors.slate[650] : colors.slate[550],
                      fontSize: RFValue(11.5),
                      fontWeight: isActive ? "600" : "500",
                    }}
                  >
                    {item.name}
                  </Text>
                  {item.badge && (
                    <View
                      style={{
                        minWidth: RFValue(14),
                        height: RFValue(14),
                        borderRadius: RFValue(7),
                        backgroundColor: colors.error[200],
                        alignItems: "center",
                        justifyContent: "center",
                        paddingHorizontal: 2,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: RFValue(8),
                          fontWeight: "bold",
                        }}
                      >
                        {item.badge}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Today's Activity Card (Visible only in "All" view) */}
      {activeFilter === "all" && (
        <View
          style={{
            borderColor: colors.slate[250],
            backgroundColor: isDarkMode ? colors.slate[100] : colors.slate[150],
            borderWidth: 1,
          }}
          className="flex flex-col gap-3 p-4 rounded-2xl mb-6"
        >
          <View className="flex flex-row gap-4 items-start">
            <Image
              source={require("@/assets/icons/calender-dark.png")}
              className="w-9 h-9"
              style={{ tintColor: colors.slate[650] }}
            />
            <View className="flex-1 gap-1">
              <Text
                style={{ color: colors.slate[650], fontSize: RFValue(16) }}
                className="font-bold"
              >
                Today’s Activity
              </Text>
              <Text
                style={{ color: colors.slate[600], fontSize: RFValue(14), lineHeight: RFValue(19) }}
                className="font-medium"
              >
                You have (4) activity lined up for you today. Check them out now.
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center justify-between mt-1 pt-2 border-t border-dashed" style={{ borderColor: colors.slate[250] }}>
            {/* Avatar Stack */}
            <View className="flex flex-row items-center gap-1.5">
              <Text style={{ fontSize: RFValue(13), color: colors.slate[550] }}>With:</Text>
              <View className="flex flex-row items-center">
                <Image
                  source={require("@/assets/images/sammy.jpg")}
                  style={{
                    width: RFValue(20),
                    height: RFValue(20),
                    borderRadius: RFValue(10),
                    borderWidth: 1.5,
                    borderColor: isDarkMode ? colors.slate[100] : colors.slate[150],
                  }}
                />
                <Image
                  source={require("@/assets/images/user.png")}
                  style={{
                    width: RFValue(20),
                    height: RFValue(20),
                    borderRadius: RFValue(10),
                    borderWidth: 1.5,
                    borderColor: isDarkMode ? colors.slate[100] : colors.slate[150],
                    marginLeft: -RFValue(6),
                  }}
                />
                <View
                  style={{
                    width: RFValue(20),
                    height: RFValue(20),
                    borderRadius: RFValue(10),
                    backgroundColor: colors.slate[250],
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1.5,
                    borderColor: isDarkMode ? colors.slate[100] : colors.slate[150],
                    marginLeft: -RFValue(6),
                  }}
                >
                  <Text style={{ fontSize: RFValue(9.5), color: colors.slate[550], fontWeight: "bold" }}>
                    +2
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => router.push("/views/activities/activity-schedule/today")}
              className="flex flex-row items-center gap-1"
            >
              <Text style={{ color: colors.slate[650], fontSize: RFValue(14) }} className="font-semibold">
                View schedule
              </Text>
              <Image
                source={require("@/assets/icons/arrow-right-up-outline-dark.png")}
                className="w-3.5 h-3.5"
                style={{ tintColor: colors.slate[650] }}
              />
            </Pressable>
          </View>
        </View>
      )}

      {/* Render Lists based on filters */}
      {activeFilter === "all" && (
        <View>
          {renderSection("Scheduled", scheduledList)}
          {renderSection("Reserved", reservedList)}
          {renderSection("Booked", bookedList)}
          {renderSection("Inspected", inspectedList)}
        </View>
      )}

      {activeFilter === "scheduled" && renderSection("Scheduled", scheduledList)}
      {activeFilter === "reserved" && renderSection("Reserved", reservedList)}
      {activeFilter === "booked" && renderSection("Booked", bookedList)}
      {activeFilter === "inspected" && renderSection("Inspected", inspectedList)}
      {activeFilter === "cancelled" && (
        <View className="py-10 items-center justify-center">
          <Text style={{ color: colors.slate[550], fontSize: RFValue(13) }}>
            No cancelled bookings found
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default AgentActiveActivity;
