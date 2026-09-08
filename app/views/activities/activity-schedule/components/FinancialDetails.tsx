import React from "react";
import { View, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "@/contexts/themeContext";
import { ActivityPropertyDetail, PaymentSchedule } from "@/types";

interface FinancialDetailsProps {
  role: string;
  status: string;
  property?: ActivityPropertyDetail;
  paymentSchedules?: PaymentSchedule[];
}

const formatCurrency = (amount: number): string =>
  `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

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

const FinancialDetails: React.FC<FinancialDetailsProps> = ({
  role,
  status,
  property,
  paymentSchedules,
}) => {
  const { colors } = useTheme();

  // Show for reserved/booked statuses that have financial data
  const hasPaymentSchedules = paymentSchedules && paymentSchedules.length > 0;
  const hasFees = property?.fees;

  if (!hasPaymentSchedules && !hasFees) return null;

  // For booking statuses only
  if (status !== "reserved" && status !== "booked") return null;

  const paidSchedules = paymentSchedules?.filter(
    (s) => s.schedule_status === "paid"
  ) ?? [];
  const pendingSchedules = paymentSchedules?.filter(
    (s) => s.schedule_status === "pending"
  ) ?? [];
  const firstPending = pendingSchedules[0];
  const totalPaid = paidSchedules.reduce((sum, s) => sum + s.amount, 0);
  const totalPending = pendingSchedules.reduce((sum, s) => sum + s.amount, 0);

  return (
    <View
      style={{ borderColor: colors.slate[200] }}
      className="py-4 border-t gap-3.5"
    >
      <Text
        style={{ color: colors.slate[650], fontSize: RFValue(15) }}
        className="font-bold"
      >
        Financial Details
      </Text>

      {/* Fees breakdown */}
      {hasFees && (
        <>
          {property!.fees.caution_fee > 0 && (
            <View className="flex flex-row justify-between">
              <Text style={{ color: colors.slate[550], fontSize: RFValue(14.5) }}>
                Caution fee:
              </Text>
              <Text
                style={{ color: colors.slate[650], fontSize: RFValue(14.5) }}
                className="font-semibold"
              >
                {formatCurrency(property!.fees.caution_fee)}
              </Text>
            </View>
          )}
          {property!.fees.agency_fee_percent > 0 && (
            <View className="flex flex-row justify-between">
              <Text style={{ color: colors.slate[550], fontSize: RFValue(14.5) }}>
                Agency fee:
              </Text>
              <Text
                style={{ color: colors.slate[650], fontSize: RFValue(14.5) }}
                className="font-semibold"
              >
                {property!.fees.agency_fee_percent}%
              </Text>
            </View>
          )}
          {property!.fees.legal_fee_percent > 0 && (
            <View className="flex flex-row justify-between">
              <Text style={{ color: colors.slate[550], fontSize: RFValue(14.5) }}>
                Legal fee:
              </Text>
              <Text
                style={{ color: colors.slate[650], fontSize: RFValue(14.5) }}
                className="font-semibold"
              >
                {property!.fees.legal_fee_percent}%
              </Text>
            </View>
          )}
        </>
      )}

      {/* Payment schedules */}
      {hasPaymentSchedules && (
        <>
          {totalPaid > 0 && (
            <View className="flex flex-row justify-between">
              <Text style={{ color: colors.slate[550], fontSize: RFValue(14.5) }}>
                {status === "reserved" ? "Initial deposit:" : "Amount paid:"}
              </Text>
              <Text
                style={{
                  color: colors.slate[650],
                  fontSize: RFValue(14.5),
                }}
                className="font-bold"
              >
                {formatCurrency(totalPaid)}
              </Text>
            </View>
          )}

          {firstPending && (
            <View className="flex flex-row justify-between">
              <Text style={{ color: colors.slate[550], fontSize: RFValue(14.5) }}>
                Balance due:
              </Text>
              <Text className="text-red-500 font-bold text-[14.5px]">
                {formatDate(firstPending.due_date)}
              </Text>
            </View>
          )}

          {totalPending > 0 && (
            <View className="flex flex-row justify-between">
              <Text style={{ color: colors.slate[550], fontSize: RFValue(14.5) }}>
                {role === "renter" ? "Balance:" : "Balance payment:"}
              </Text>
              <Text
                style={{ color: colors.slate[650], fontSize: RFValue(14.5) }}
                className="font-bold"
              >
                {formatCurrency(totalPending)}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default FinancialDetails;
