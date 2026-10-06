import SafeAreaViewContainer from "@/components/safeareaview";
import ViewHeader from "@/components/view-header";
import { useTheme } from "@/contexts/themeContext";
import { useMyTransactionHistory } from "@/hooks";
import { Transaction } from "@/types/screens/transaction";
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

const MyEarnings = ({ noHeader = false }) => {
  const { colors, isDarkMode } = useTheme();
  const router = useRouter();
  const earningsStyles = styles(colors);

  const { transactionHistory, isTransactionHistoryLoading } =
    useMyTransactionHistory({ limit: 100 });
  const recentTransactions = transactionHistory.slice(0, 5);
  const totalEarnings = transactionHistory
    .filter((transaction) =>
      ["approved", "completed", "verified"].includes(transaction.status),
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  const Wrapper = noHeader ? View : SafeAreaViewContainer;

  const getTransactionIcon = (purpose: Transaction["purpose"]) => {
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

  const handleSeeAll = () => {
    router.push("/views/profile/recent-earnings");
  };

  const formatCurrency = (amount: number) =>
    `NGN ${amount.toLocaleString("en-NG")}`;
  const getDescription = (purpose: Transaction["purpose"]) =>
    purpose.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const formatDate = (value?: string) =>
    value
      ? new Date(value).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recent";

  return (
    <Wrapper>
      {noHeader ? null : <ViewHeader title="My Earnings" />}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Earnings Card */}
        <View style={earningsStyles.earningsCard} className="overflow-hidden">
          <View style={earningsStyles.earningsCardContent} className="items-center">
            <Text style={earningsStyles.earningsLabel}>Your Earnings</Text>
            <View style={earningsStyles.earningsAmountRow} className="flex-row items-center relative">
              <Text style={earningsStyles.earningsAmount} className="font-bold">₦500,000.00</Text>
              <Image
                source={require("@/assets/icons/password-hide.png")}
                style={earningsStyles.eyeIcon}
              />
              <View style={earningsStyles.liveEarningsAmount} className="absolute left-[0px] top-[0px] bottom-[0px] justify-center">
                <Text style={earningsStyles.earningsAmount} className="font-bold">
                  {formatCurrency(totalEarnings)}
                </Text>
              </View>
            </View>
            <View style={earningsStyles.earningsStats} className="flex-row items-center">
              <Image
                source={require("@/assets/icons/trend-up-thin.png")}
                style={earningsStyles.trendingIcon}
              />
              <Text style={earningsStyles.statsText} className="font-semibold">
                {transactionHistory.length}
              </Text>
              <Text style={earningsStyles.statsLabel}>transactions</Text>
              <Image
                source={require("@/assets/icons/chevron-down.png")}
                style={earningsStyles.chevronDownIcon}
              />
            </View>
          </View>
        </View>

        {/* Recent Earnings Section */}
        <View>
          <View style={earningsStyles.sectionHeader} className="flex-row justify-between items-center">
            <Text style={earningsStyles.sectionTitle} className="font-semibold">Recent Earnings</Text>
            <Pressable onPress={handleSeeAll}>
              <View style={earningsStyles.seeAllButton} className="flex-row items-center">
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
            {isTransactionHistoryLoading ? (
              <Text style={earningsStyles.transactionDate}>Loading earnings...</Text>
            ) : recentTransactions.length ? recentTransactions.map((transaction) => (
              <View key={transaction.public_id} style={earningsStyles.transactionCard} className="flex-row justify-between items-center border-b">
                <View  className="flex-row items-center flex-1">
                  <View style={earningsStyles.iconContainer} className="items-center justify-center">
                    <Image
                      source={getTransactionIcon(transaction.purpose)}
                      style={earningsStyles.transactionIcon}
                    />
                  </View>
                  <View  className="flex-1">
                    <Text style={earningsStyles.transactionDescription}>
                      {getDescription(transaction.purpose)}
                    </Text>
                    <Text style={earningsStyles.transactionDate}>
                      {formatDate(transaction.date_created)}
                    </Text>
                  </View>
                </View>
                <Text style={earningsStyles.transactionAmount} className="font-semibold">
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
            )) : (
              <Text style={earningsStyles.transactionDate}>No transactions yet.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default MyEarnings;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    earningsCard: {marginBottom: RFValue(24),
backgroundColor: colors.slate[650],
borderRadius: RFValue(16)},
    earningsCardContent: {padding: RFValue(24)},
    earningsLabel: {
      fontSize: RFValue(14),
      color: colors.slate[200],
      marginBottom: RFValue(8),
    },
    earningsAmountRow: {marginBottom: RFValue(16)},
    earningsAmount: {fontSize: RFValue(27),
color: colors.slate[100],
marginRight: RFValue(12)},
    liveEarningsAmount: {backgroundColor: colors.slate[650],
paddingRight: RFValue(8)},
    eyeIcon: {
      width: RFValue(24),
      height: RFValue(24),
      tintColor: colors.slate[200],
    },
    earningsStats: {gap: RFValue(6)},
    trendingIcon: {
      width: RFValue(16),
      height: RFValue(16),
      tintColor: colors.success[300],
    },
    statsText: {fontSize: RFValue(14),
color: colors.success[300]},
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
    sectionHeader: {marginBottom: RFValue(16)},
    sectionTitle: {fontSize: RFValue(18),
color: colors.slate[650]},
    seeAllButton: {gap: RFValue(4)},
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
    transactionCard: {paddingVertical: RFValue(12),
borderBottomColor: colors.slate[300]},
    transactionLeft: {},
    iconContainer: {width: RFValue(40),
height: RFValue(40),
borderRadius: RFValue(20),
backgroundColor: colors.slate[200],
marginRight: RFValue(12)},
    transactionIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    transactionInfo: {},
    transactionDescription: {
      fontSize: RFValue(15),
      color: colors.slate[650],
      marginBottom: RFValue(4),
    },
    transactionDate: {
      fontSize: RFValue(13),
      color: colors.slate[500],
    },
    transactionAmount: {fontSize: RFValue(15),
color: colors.slate[650]},
  });
