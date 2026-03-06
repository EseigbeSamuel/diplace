import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import ViewHeader from "@/components/view-header";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

interface Transaction {
  id: number;
  type: "reservation" | "inspection" | "booking";
  description: string;
  date: string;
  amount: number;
}

const MyEarnings = ({ noHeader = false }) => {
  const { colors, isDarkMode } = useTheme();
  const router = useRouter();
  const earningsStyles = styles(colors);

  const recentTransactions: Transaction[] = [
    {
      id: 1,
      type: "reservation",
      description: "Payment for reservation",
      date: "Today, 08:00",
      amount: 400000,
    },
    {
      id: 2,
      type: "inspection",
      description: "Payment for inspection",
      date: "01 Sept' 25, 14:23",
      amount: 2000,
    },
    {
      id: 3,
      type: "booking",
      description: "Payment for booking",
      date: "29 Aug' 25, 12:58",
      amount: 140000,
    },
    {
      id: 4,
      type: "inspection",
      description: "Payment for inspection",
      date: "20 Aug' 25, 14:23",
      amount: 2000,
    },
    {
      id: 5,
      type: "booking",
      description: "Payment for booking",
      date: "20 Aug' 25, 12:58",
      amount: 175000,
    },
  ];

  const Wrapper = noHeader ? View : SafeAreaViewContainer;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "reservation":
        return require("@/assets/icons/Lock.png");
      case "inspection":
        return isDarkMode
          ? require("@/assets/icons/calender-white.png")
          : require("@/assets/icons/calendar.png");
      case "booking":
        return require("@/assets/icons/success.png");
      default:
        return require("@/assets/icons/success.png");
    }
  };

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const handleSeeAll = () => {
    router.push("/views/profile/recent-earnings");
  };

  return (
    <Wrapper>
      {noHeader ? null : <ViewHeader title="My Earnings" />}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Earnings Card */}
        <View style={earningsStyles.earningsCard}>
          <View style={earningsStyles.earningsCardContent}>
            <Text style={earningsStyles.earningsLabel}>Your Earnings</Text>
            <View style={earningsStyles.earningsAmountRow}>
              <Text style={earningsStyles.earningsAmount}>₦500,000.00</Text>
              <Image
                source={require("@/assets/icons/password-hide.png")}
                style={earningsStyles.eyeIcon}
              />
            </View>
            <View style={earningsStyles.earningsStats}>
              <Image
                source={require("@/assets/icons/trend-up-thin.png")}
                style={earningsStyles.trendingIcon}
              />
              <Text style={earningsStyles.statsText}>+5.5%</Text>
              <Text style={earningsStyles.statsLabel}>All time</Text>
              <Image
                source={require("@/assets/icons/chevron-down.png")}
                style={earningsStyles.chevronDownIcon}
              />
            </View>
          </View>
        </View>

        {/* Recent Earnings Section */}
        <View>
          <View style={earningsStyles.sectionHeader}>
            <Text style={earningsStyles.sectionTitle}>Recent Earnings</Text>
            <Pressable onPress={handleSeeAll}>
              <View style={earningsStyles.seeAllButton}>
                <Text style={earningsStyles.seeAllText}>See all</Text>
                <Image
                  source={require("@/assets/icons/arrow-right-dark.png")}
                  style={earningsStyles.arrowIcon}
                />
              </View>
            </Pressable>
          </View>

          {/* Transaction List */}
          <View style={earningsStyles.transactionList}>
            {recentTransactions.map((transaction) => (
              <View key={transaction.id} style={earningsStyles.transactionCard}>
                <View style={earningsStyles.transactionLeft}>
                  <View style={earningsStyles.iconContainer}>
                    <Image
                      source={getTransactionIcon(transaction.type)}
                      style={earningsStyles.transactionIcon}
                    />
                  </View>
                  <View style={earningsStyles.transactionInfo}>
                    <Text style={earningsStyles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={earningsStyles.transactionDate}>
                      {transaction.date}
                    </Text>
                  </View>
                </View>
                <Text style={earningsStyles.transactionAmount}>
                  +{formatAmount(transaction.amount)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default MyEarnings;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    earningsCard: {
      marginBottom: RFValue(24),
      backgroundColor: colors.slate[650],
      borderRadius: RFValue(16),
      overflow: "hidden",
    },
    earningsCardContent: {
      padding: RFValue(24),
      alignItems: "center",
    },
    earningsLabel: {
      fontSize: RFValue(14),
      color: colors.slate[200],
      marginBottom: RFValue(8),
    },
    earningsAmountRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: RFValue(16),
    },
    earningsAmount: {
      fontSize: RFValue(27),
      fontWeight: "700",
      color: colors.slate[100],
      marginRight: RFValue(12),
    },
    eyeIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[200],
    },
    earningsStats: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(6),
    },
    trendingIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.success[300],
    },
    statsText: {
      fontSize: RFValue(14),
      color: colors.success[300],
      fontWeight: "600",
    },
    statsLabel: {
      fontSize: RFValue(14),
      color: colors.slate[200],
      marginRight: RFValue(4),
    },
    chevronDownIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[200],
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: RFValue(16),
    },
    sectionTitle: {
      fontSize: RFValue(18),
      fontWeight: "600",
      color: colors.slate[650],
    },
    seeAllButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: RFValue(4),
    },
    seeAllText: {
      fontSize: RFValue(14),
      color: colors.slate[650],
    },
    arrowIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.slate[650],
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
