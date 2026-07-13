import { useTheme } from "@/contexts/themeContext";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface HistoryItem {
  id: string;
  dateText: string;
  status: string;
  statusColor: string;
  statusBg: string;
  title: string;
  description: string;
}

const historyGroups = [
  {
    month: "August, 2025",
    items: [
      {
        id: "1",
        dateText: "9th Aug, 2025 • Scheduled",
        status: "Inspected",
        statusColor: "#16A34A",
        statusBg: "#D1FAE5",
        title: "Inspected 2 Bedroom in-suite apartment",
        description: "You inspected 2 bedroom apartment at Rumuewhera, Port Harcourt with a renter.",
      },
      {
        id: "2",
        dateText: "9th Aug, 2025 • Booked",
        status: "Booked",
        statusColor: "#0F766E",
        statusBg: "#CCFBF1",
        title: "Booked Atraz Palace Event Hall",
        description: "You got a booking for Atraz Palace Event Hall for 17th - 19th August, 2025.",
      },
      {
        id: "3",
        dateText: "9th Aug, 2025 • Reserved",
        status: "Reserved",
        statusColor: "#2563EB",
        statusBg: "#DBEAFE",
        title: "Reserved Atraz Palace Event Hall",
        description: "You got a reservation for Atraz Palace Event Hall for 17th - 19th August, 2025.",
      },
    ],
  },
  {
    month: "July, 2025",
    items: [
      {
        id: "4",
        dateText: "28th Jul, 2025 • Cancellation",
        status: "In progress",
        statusColor: "#D97706",
        statusBg: "#FEF3C7",
        title: "Cancelled booking",
        description: "You cancelled reservation for Mini Flat in Yaba.",
      },
      {
        id: "5",
        dateText: "28th Jul, 2025 • Reported",
        status: "Reported",
        statusColor: "#4B5563",
        statusBg: "#F3F4F6",
        title: "Reported a user",
        description: "You reported a user, Sammy Kalu, for inappropriate behaviour.",
      },
      {
        id: "6",
        dateText: "28th Jul, 2025 • Cancellation",
        status: "Refunded",
        statusColor: "#16A34A",
        statusBg: "#D1FAE5",
        title: "Cancelled booking",
        description: "Renter cancelled reservation for Mini Flat in Yaba.",
      },
    ],
  },
];

const AgentHistoryCard = ({ item }: { item: HistoryItem }) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <View
      className="flex flex-row gap-3 py-3 border-b"
      style={{ borderColor: colors.slate[200] }}
    >
      {/* Icon Wrapper */}
      <View
        style={{
          width: RFValue(36),
          height: RFValue(36),
          borderRadius: RFValue(18),
          backgroundColor: colors.slate[150],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("@/assets/icons/Time.png")}
          style={{ width: 16, height: 16, tintColor: colors.slate[650] }}
        />
      </View>

      {/* Details Wrapper */}
      <View className="flex-1">
        <View className="flex flex-row items-center justify-between gap-2 mb-1.5">
          <Text style={{ fontSize: RFValue(12.5), color: colors.slate[500] }}>
            {item.dateText}
          </Text>
          <View
            style={{
              backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : item.statusBg,
              paddingHorizontal: 8,
              paddingVertical: 2.5,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: isDarkMode ? colors.slate[600] : item.statusColor,
                fontSize: RFValue(11.5),
                fontWeight: "bold",
              }}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: RFValue(15.5),
            fontWeight: "600",
            color: colors.slate[650],
            lineHeight: RFValue(20.5),
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: RFValue(13.5),
            color: colors.slate[600],
            lineHeight: RFValue(18.5),
            marginTop: 3,
          }}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );
};

const AgentActivityHistory = () => {
  const { colors } = useTheme();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {historyGroups.map((group, index) => (
        <View key={index} className="py-4">
          <Text
            style={{ color: colors.slate[650], fontSize: RFValue(18) }}
            className="font-bold mb-2"
          >
            {group.month}
          </Text>
          <View style={{ gap: RFValue(4) }}>
            {group.items.map((item) => (
              <AgentHistoryCard key={item.id} item={item} />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default AgentActivityHistory;
