import React from "react";
import { View, Text, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/contexts/themeContext";
import { BookingDetailResponse, InspectionDetailResponse } from "@/types";

interface BookingDetailsProps {
  status: string;
  data?: InspectionDetailResponse | BookingDetailResponse;
}

/** Format a date string like "2026-09-07" → "Mon, 7th Sep, 2026" */
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const STATUS_BADGE: Record<
  string,
  { label: string; textClass: string; containerClass: string }
> = {
  scheduled: {
    label: "● Scheduled",
    textClass: "text-blue-600 font-bold text-[12px]",
    containerClass: "bg-blue-50 px-3 py-1 rounded-full border border-blue-200",
  },
  inspected: {
    label: "✓ Inspected",
    textClass: "text-gray-800 font-bold text-[12px]",
    containerClass:
      "bg-gray-100 px-3 py-1 rounded-full border border-gray-300",
  },
  reserved: {
    label: "● Reserved",
    textClass: "text-amber-600 font-bold text-[12px]",
    containerClass:
      "bg-amber-50 px-3 py-1 rounded-full border border-amber-200",
  },
  booked: {
    label: "✓ Booked",
    textClass: "text-emerald-600 font-bold text-[12px]",
    containerClass:
      "bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200",
  },
  pending: {
    label: "● Pending",
    textClass: "text-amber-600 font-bold text-[12px]",
    containerClass:
      "bg-amber-50 px-3 py-1 rounded-full border border-amber-200",
  },
};

const BookingDetails: React.FC<BookingDetailsProps> = ({ status, data }) => {
  const { colors } = useTheme();

  // ── Inspection (scheduled / inspected) ─────────────────────────────────────
  const isInspection = status === "scheduled" || status === "inspected";

  if (isInspection) {
    const inspection = data as InspectionDetailResponse | undefined;
    const badge = STATUS_BADGE[status] ?? STATUS_BADGE["scheduled"];

    return (
      <View className="gap-3.5">
        <Text
          style={{ color: colors.slate[650], fontSize: RFValue(15) }}
          className="font-bold"
        >
          Inspection Details
        </Text>

        {/* Date row */}
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <Image
              source={require("@/assets/icons/calendar.png")}
              className="w-5 h-5"
              style={{ tintColor: colors.slate[550] }}
            />
            <Text
              style={{ color: colors.slate[600], fontSize: RFValue(14.5) }}
              className="font-medium"
            >
              {formatDate(inspection?.inspection_date)}
            </Text>
          </View>

          {/* Status badge */}
          <View className={badge.containerClass}>
            <Text className={badge.textClass}>{badge.label}</Text>
          </View>
        </View>

        {/* Time slot */}
        {inspection?.time_slot ? (
          <View className="flex flex-row items-center gap-2">
            <Image
              source={require("@/assets/icons/Time.png")}
              className="w-5 h-5"
              style={{ tintColor: colors.slate[550] }}
            />
            <Text
              style={{ color: colors.slate[600], fontSize: RFValue(14.5) }}
              className="font-medium"
            >
              {inspection.time_slot}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  // ── Booking (reserved / booked) ─────────────────────────────────────────────
  const booking = data as BookingDetailResponse | undefined;
  const badge = STATUS_BADGE[booking?.status ?? status] ?? STATUS_BADGE["booked"];
  const firstSchedule = booking?.payment_schedules?.[0];

  return (
    <View className="gap-3.5">
      <Text
        style={{ color: colors.slate[650], fontSize: RFValue(15) }}
        className="font-bold"
      >
        Booking Details
      </Text>

      {/* Type row */}
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Image
            source={require("@/assets/icons/contract.png")}
            className="w-5 h-5"
            style={{ tintColor: colors.slate[550] }}
          />
          <Text
            style={{ color: colors.slate[600], fontSize: RFValue(14.5) }}
            className="font-medium"
          >
            {firstSchedule?.installment_type
              ? `${firstSchedule.installment_type.charAt(0).toUpperCase()}${firstSchedule.installment_type.slice(1)} payment`
              : "Booking"}
          </Text>
        </View>

        {/* Status badge */}
        <View className={badge.containerClass}>
          <Text className={badge.textClass}>{badge.label}</Text>
        </View>
      </View>

      {/* Due date / move-in */}
      {firstSchedule?.due_date ? (
        <View className="flex flex-row items-center gap-2">
          <Image
            source={require("@/assets/icons/calendar.png")}
            className="w-5 h-5"
            style={{ tintColor: colors.slate[550] }}
          />
          <Text
            style={{ color: colors.slate[600], fontSize: RFValue(14.5) }}
            className="font-medium"
          >
            Due: {formatDate(firstSchedule.due_date)}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default BookingDetails;
