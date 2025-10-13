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
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";

interface Transaction {
  id: number;
  type: "reservation" | "inspection" | "booking";
  description: string;
  date: string;
  amount: number;
  month: string;
}

const RecentEarnings = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const recentEarningsStyles = styles(colors);
  const [selectedFilter, setSelectedFilter] = useState("All time");

  const transactions: Transaction[] = [
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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "reservation":
        return require("@/assets/icons/Lock.png");
      case "inspection":
        return require("@/assets/icons/Calendar.png");
      case "booking":
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

  // Group transactions by month
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const month = transaction.month;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const handleFilterPress = () => {
    // Open filter menu
    console.log("Open filter menu");
  };

  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Recent Earnings" />
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
              source={require("@/assets/icons/arrow-right-light.png")}
              style={recentEarningsStyles.chevronIcon}
            />
          </Pressable>
        </View>

        {/* Grouped Transactions */}
        <View style={recentEarningsStyles.container}>
          {Object.entries(groupedTransactions).map(
            ([month, monthTransactions]) => (
              <View key={month} style={recentEarningsStyles.monthGroup}>
                <Text style={recentEarningsStyles.monthTitle}>{month}</Text>
                <View style={recentEarningsStyles.transactionList}>
                  {monthTransactions.map((transaction) => (
                    <TouchableOpacity
                      key={transaction.id}
                      style={recentEarningsStyles.transactionCard}
                      onPress={handleEarningsClicked}
                    >
                      <View style={recentEarningsStyles.transactionLeft}>
                        <View style={recentEarningsStyles.iconContainer}>
                          <Image
                            source={getTransactionIcon(transaction.type)}
                            style={recentEarningsStyles.transactionIcon}
                          />
                        </View>
                        <View style={recentEarningsStyles.transactionInfo}>
                          <Text
                            style={recentEarningsStyles.transactionDescription}
                          >
                            {transaction.description}
                          </Text>
                          <Text style={recentEarningsStyles.transactionDate}>
                            {transaction.date}
                          </Text>
                        </View>
                      </View>
                      <Text style={recentEarningsStyles.transactionAmount}>
                        +{formatAmount(transaction.amount)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )
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
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(16),
      alignItems: "flex-end",
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(8),
      backgroundColor: colors.slate[150],
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
      paddingHorizontal: RFValue(16),
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
