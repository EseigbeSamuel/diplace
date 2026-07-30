import React from "react";
import { View, Text, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/contexts/themeContext";

interface BookingDetailsProps {
  status: string;
  isEventCenter: boolean;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ status, isEventCenter }) => {
  const { colors } = useTheme();

  if (status === "booked" && !isEventCenter) {
    return (
      <View className="gap-3.5">
        <Text style={{ color: colors.slate[650], fontSize: RFValue(15) }} className="font-bold">
          Booking Details
        </Text>
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <Image
              source={require("@/assets/icons/contract.png")}
              className="w-5 h-5"
              style={{ tintColor: colors.slate[550] }}
            />
            <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">
              Rent - 1 Year
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <Image
              source={require("@/assets/icons/calendar.png")}
              className="w-5 h-5"
              style={{ tintColor: colors.slate[550] }}
            />
            <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">
              Move In: Fri, 20th Aug, 2025
            </Text>
          </View>
          <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Text className="text-emerald-600 font-bold text-[12px]">✓ Booked</Text>
          </View>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Image
            source={require("@/assets/icons/user.png")}
            className="w-5 h-5"
            style={{ tintColor: colors.slate[550] }}
          />
          <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">
            Occupants: 1 Adult, 0 Children
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-3.5">
      {isEventCenter && (
        <Text style={{ color: colors.slate[650], fontSize: RFValue(15) }} className="font-bold">
          Wedding & Engagement
        </Text>
      )}

      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Image
            source={require("@/assets/icons/calendar.png")}
            className="w-5 h-5"
            style={{ tintColor: colors.slate[550] }}
          />
          <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">
            {isEventCenter ? "Thu, 17 Aug - Sat, 19 Aug, 2025" : "Wed, 9th August, 2025"}
          </Text>
        </View>

        {/* Status Badge */}
        {status === "scheduled" && (
          <View className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <Text className="text-blue-600 font-bold text-[12px]">● Scheduled</Text>
          </View>
        )}
        {status === "inspected" && (
          <View className="bg-gray-100 px-3 py-1 rounded-full border border-gray-300 flex flex-row items-center gap-1">
            <Image
              source={require("@/assets/icons/badge-check-green.png")}
              className="w-3 h-3"
              style={{ tintColor: "#1C2024" }}
            />
            <Text className="text-gray-800 font-bold text-[12px]">Inspected</Text>
          </View>
        )}
        {status === "reserved" && (
          <View className="bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Text className="text-amber-600 font-bold text-[12px]">● Reserved</Text>
          </View>
        )}
        {status === "booked" && isEventCenter && (
          <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Text className="text-emerald-600 font-bold text-[12px]">✓ Booked</Text>
          </View>
        )}
      </View>

      <View className="flex flex-row items-center gap-2">
        <Image
          source={require("@/assets/icons/Time.png")}
          className="w-5 h-5"
          style={{ tintColor: colors.slate[550] }}
        />
        <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">
          {isEventCenter ? "Full work day (10 hours)" : "1PM - 3PM Afternoon slot"}
        </Text>
      </View>

      {!isEventCenter && (
        <View className="flex flex-row items-center gap-2">
          <Image source={require("@/assets/icons/money-bag.png")} className="w-5 h-5" />
          <Text style={{ color: colors.slate[600], fontSize: RFValue(14.5) }} className="font-medium">
            Fee: ₦2,000
          </Text>
        </View>
      )}
    </View>
  );
};

export default BookingDetails;
