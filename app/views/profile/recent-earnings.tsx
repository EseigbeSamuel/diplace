import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import ViewHeader from "@/components/view-header";
import { useTheme } from "@/contexts/themeContext";
import { useMyTransactionHistory } from "@/hooks";
import { Transaction as ApiTransaction } from "@/types/screens/transaction";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface MockTransaction {
  id: number;
  type: "reservation" | "inspection" | "booking";
  description: string;
  date: string;
  amount: number;
  month: string;
}

const RecentEarnings = () => {
  const { colors, isDarkMode } = useTheme();
  const router = useRouter();
  const recentEarningsStyles = styles(colors);
  const [selectedFilter, setSelectedFilter] = useState("All time");

  const mockTransactions: MockTransaction[] = [
    {
      id: 1,
      type: "reservation",
      description: "Payment for reservation",
      date: "Today, 08:00",
      amount: 400000,
      month: "August, 2025",
    },
    {
      id: 2,
      type: "inspection",
      description: "Payment for inspection",
      date: "01 Sept' 25, 14:23",
      amount: 2000,
      month: "August, 2025",
    },
    {
      id: 3,
      type: "booking",
      description: "Payment for booking",
      date: "29 Aug' 25, 12:58",
      amount: 140000,
      month: "August, 2025",
    },
    {
      id: 4,
      type: "booking",
      description: "Payment for booking",
      date: "25 Aug' 25, 12:58",
      amount: 140000,
      month: "July, 2025",
    },
    {
      id: 5,
      type: "booking",
      description: "Payment for booking",
      date: "01 Aug' 25, 12:58",
      amount: 175000,
      month: "July, 2025",
    },
    {
      id: 6,
      type: "inspection",
      description: "Payment for inspection",
      date: "26 Aug' 25, 14:23",
      amount: 2000,
      month: "July, 2025",
    },
    {
      id: 7,
      type: "booking",
      description: "Payment for booking",
      date: "20 Aug' 25, 12:58",
      amount: 175000,
      month: "July, 2025",
    },
    {
      id: 8,
      type: "booking",
      description: "Payment for booking",
      date: "01 Aug' 25, 12:58",
      amount: 175000,
      month: "July, 2025",
    },
  ];
  const { transactionHistory, isTransactionHistoryLoading } =
    useMyTransactionHistory({ limit: 100 });
  const transactions = transactionHistory;

  const getTransactionIcon = (purpose: ApiTransaction["purpose"]) => {
    switch (purpose) {
      case "booking_deposit":
        return require("@/assets/icons/Lock.png");
      case "inspection_fee":
        return isDarkMode
          ? require("@/assets/icons/calender-white.png")
          : require("@/assets/icons/calendar.png");
      case "booking_rent":
      case "booking_balance":
        return require("@/assets/icons/success.png");
      default:
        return require("@/assets/icons/success.png");
    }
  };

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleEarningsClicked = () => {
    router.push("/views/profile/payment-receipt");
  };

  const getDescription = (purpose: ApiTransaction["purpose"]) =>
    purpose.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const formatDate = (value?: string) =>
    value
      ? new Date(value).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recent";
  const formatMonth = (value?: string) =>
    value
      ? new Date(value).toLocaleDateString("en-NG", {
          month: "long",
          year: "numeric",
        })
      : "Recent";

  // Group transactions by month
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const month = formatMonth(transaction.date_created);
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(transaction);
    return acc;
  }, {} as Record<string, ApiTransaction[]>);

  const handleFilterPress = () => {
    // Open filter menu
    console.log("Open filter menu");
  };

  return (
    <SafeAreaViewContainer>
      <ViewHeader title="Recent Earnings" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Filter Section */}
        <View style={recentEarningsStyles.filterContainer}>
          <Pressable
            style={recentEarningsStyles.filterButton}
            onPress={handleFilterPress}
          >
            <Text style={recentEarningsStyles.filterText}>
              {selectedFilter}
            </Text>
            <Image
              source={require("@/assets/icons/chevron-down.png")}
              style={recentEarningsStyles.chevronIcon}
            />
          </Pressable>
        </View>

        {/* Grouped Transactions */}
        <View style={recentEarningsStyles.container}>
          {isTransactionHistoryLoading ? (
            <Text style={recentEarningsStyles.transactionDate}>Loading earnings...</Text>
          ) : Object.entries(groupedTransactions).length ? Object.entries(groupedTransactions).map(
            ([month, monthTransactions]) => (
              <View key={month} style={recentEarningsStyles.monthGroup}>
                <Text style={recentEarningsStyles.monthTitle}>{month}</Text>
                <View style={recentEarningsStyles.transactionList}>
                  {monthTransactions.map((transaction) => (
                    <TouchableOpacity
                      key={transaction.public_id}
                      style={recentEarningsStyles.transactionCard}
                      onPress={handleEarningsClicked}
                    >
                      <View style={recentEarningsStyles.transactionLeft}>
                        <View style={recentEarningsStyles.iconContainer}>
                          <Image
                            source={getTransactionIcon(transaction.purpose)}
                            style={recentEarningsStyles.transactionIcon}
                          />
                        </View>
                        <View style={recentEarningsStyles.transactionInfo}>
                          <Text
                            style={recentEarningsStyles.transactionDescription}
                          >
                            {getDescription(transaction.purpose)}
                          </Text>
                          <Text style={recentEarningsStyles.transactionDate}>
                            {formatDate(transaction.date_created)}
                          </Text>
                        </View>
                      </View>
                      <Text style={recentEarningsStyles.transactionAmount}>
                        NGN {transaction.amount.toLocaleString("en-NG")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )
          ) : (
            <Text style={recentEarningsStyles.transactionDate}>No transactions yet.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

export default RecentEarnings;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    filterContainer: {
      alignItems: "flex-end",
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(8),
      backgroundColor: colors.slate[200],
      borderRadius: RFValue(8),
      gap: RFValue(8),
    },
    filterText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
      fontWeight: "500",
    },
    chevronIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
    },
    container: {
      paddingHorizontal: RFValue(3),
    },
    monthGroup: {
      marginBottom: RFValue(24),
    },
    monthTitle: {
      fontSize: RFValue(16),
      fontWeight: "600",
      color: colors.slate[650],
      marginBottom: RFValue(16),
    },
    transactionList: {
      gap: RFValue(16),
    },
    transactionCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: RFValue(12),
      borderBottomWidth: 1,
      borderBottomColor: colors.slate[300],
    },
    transactionLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      width: RFValue(40),
      height: RFValue(40),
      borderRadius: RFValue(20),
      backgroundColor: colors.slate[200],
      alignItems: "center",
      justifyContent: "center",
      marginRight: RFValue(12),
    },
    transactionIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: RFValue(15),
      color: colors.slate[650],
      marginBottom: RFValue(4),
    },
    transactionDate: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    transactionAmount: {
      fontSize: RFValue(15),
      fontWeight: "600",
      color: colors.slate[650],
    },
  });
