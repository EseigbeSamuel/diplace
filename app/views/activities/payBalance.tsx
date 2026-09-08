import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { useGetBookingDetail } from "@/hooks";
import { ColorScheme } from "@/utils";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const formatCurrency = (val: number) =>
  `₦${val.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

const PayBalance = () => {
  const { colors, isDarkMode } = useTheme();
  const homeStyles = styles(colors);
  const params = useLocalSearchParams<{
    bookingId?: string;
    propertyId?: string;
    title?: string;
    location?: string;
    balance?: string;
    totalAmount?: string;
    initialDeposit?: string;
    price?: string;
    costFrequency?: string;
    imageUri?: string;
  }>();

  const { data: bookingDetail, isLoading } = useGetBookingDetail(
    params.bookingId ?? "",
  );

  // Derived values from endpoint or params
  const paidSchedules =
    bookingDetail?.payment_schedules?.filter((s) => s.schedule_status === "paid") ?? [];
  const pendingSchedules =
    bookingDetail?.payment_schedules?.filter((s) => s.schedule_status === "pending") ?? [];
  const paidTotal = paidSchedules.reduce((sum, s) => sum + s.amount, 0);
  const pendingTotal = pendingSchedules.reduce((sum, s) => sum + s.amount, 0);

  const property = bookingDetail?.property;
  const propTitle = property?.title || params.title || "Atraz Palace Event Hall";
  const propLocation =
    [property?.address?.street, property?.address?.city, property?.address?.state]
      .filter(Boolean)
      .join(", ") || params.location || "GRA Phase II, Port Harcourt";
  const propPrice = property?.price ?? (params.price ? Number(params.price) : 400000);
  const costFreq = (property?.cost_frequency || params.costFrequency || "day").replace("per_", "");

  const cautionFee = property?.fees?.caution_fee ?? 50000;
  const platformFee = property?.fees?.platform_fee ?? 6000;
  const totalAmount =
    bookingDetail
      ? propPrice + cautionFee + platformFee
      : params.totalAmount
      ? Number(params.totalAmount)
      : 1256000;
  const initialDeposit =
    paidTotal > 0
      ? paidTotal
      : params.initialDeposit
      ? Number(params.initialDeposit)
      : 251200;
  const balanceDue =
    pendingTotal > 0
      ? pendingTotal
      : params.balance
      ? Number(params.balance)
      : totalAmount - initialDeposit;

  const renter = bookingDetail?.user;
  const renterName = renter
    ? `${renter.first_name} ${renter.last_name}`.trim() || renter.email
    : "Rhema Generation Inc.";
  const renterEmail = renter?.email || "info@rgiworld.com";
  const renterPhone = renter?.phone_number || "+2348102934980";

  const eventType =
    (bookingDetail?.details?.event_type as string) || "Wedding & Engagement";
  const eventDate =
    (bookingDetail?.details?.dates as string) || "Thu. 17 Aug, - Sat. 19 Aug, 2025";
  const eventDuration =
    (bookingDetail?.details?.duration as string) || "8 hours";

  const imageSource =
    params.imageUri || property?.media?.[0]?.file_url
      ? { uri: params.imageUri || property?.media?.[0]?.file_url }
      : require("@/assets/images/featuredSpaceImage1.png");

  const handleConfirmPay = () => {
    router.push({
      pathname: "/views/booking/payment",
      params: {
        bookingId: params.bookingId,
        propertyId: params.propertyId || property?.public_id,
        amountValue: String(balanceDue),
        totalAmount: formatCurrency(balanceDue),
        propertyName: propTitle,
      },
    });
  };
  return (
    <SafeAreaViewContainer>
      <SectionHeader title="Pay Balance" />
      <View className="flex-1 py-4">
        <View className="flex flex-row items-center justify-between p-4 my-4 bg-black rounded-xl">
          <View>
            <Text className="text-white">Total Amount Payable:</Text>
            <Text className="text-xl font-semibold text-white">
              {formatCurrency(balanceDue)}
            </Text>
          </View>
          <View>
            <Image
              source={require("@/assets/icons/money-bag.png")}
              className="w-6 h-6"
            />
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={colors.slate[650]}
            className="my-8"
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={homeStyles.borderB} className="py-4 my-4 border-t">
              <Text className="py-4" style={homeStyles.title}>
                Property Info
              </Text>
              <View className="flex flex-row items-center gap-4">
                <View>
                  <Image
                    source={imageSource}
                    className="w-[76px] h-[76px] rounded-lg"
                  />
                </View>
                <View className="flex flex-col gap-2 flex-1">
                  <Text style={homeStyles.title} numberOfLines={1}>
                    {propTitle}
                  </Text>
                  <Text style={homeStyles.gray} numberOfLines={1}>
                    {propLocation}
                  </Text>
                  <Text style={homeStyles.title}>
                    ₦{propPrice.toLocaleString("en-NG")}
                    <Text style={homeStyles.gray}>/{costFreq}</Text>
                  </Text>
                </View>
              </View>
            </View>

            <View style={homeStyles.borderB} className="py-4 my-4 border-t">
              <Text style={homeStyles.title} className="pb-4">
                Cost Breakdown
              </Text>
              <View>
                <View className="flex flex-row justify-between py-2">
                  <Text style={homeStyles.titleGray}>Rent</Text>
                  <Text style={homeStyles.text} className="text-lg font-semibold">
                    {formatCurrency(propPrice)}
                  </Text>
                </View>
                {cautionFee > 0 && (
                  <View className="flex flex-row justify-between py-2">
                    <Text style={homeStyles.titleGray}>
                      Caution fee (refundable)
                    </Text>
                    <Text style={homeStyles.text} className="text-lg font-semibold">
                      {formatCurrency(cautionFee)}
                    </Text>
                  </View>
                )}
                {platformFee > 0 && (
                  <View className="flex flex-row justify-between py-2">
                    <Text style={homeStyles.titleGray}>
                      DiPlace Platform fee
                    </Text>
                    <Text style={homeStyles.text} className="text-lg font-semibold">
                      {formatCurrency(platformFee)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={homeStyles.borderB} className="py-4 border-t ">
              <View className="flex flex-row justify-between">
                <Text className="" style={homeStyles.subTitle}>
                  Total Amount
                </Text>
                <Text className="font-semibold" style={homeStyles.title}>
                  {formatCurrency(totalAmount)}
                </Text>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="" style={homeStyles.titleGray}>
                  Initial deposit
                </Text>
                <Text className="font-semibold" style={homeStyles.title}>
                  {formatCurrency(initialDeposit)}
                </Text>
              </View>
            </View>
            <View
              style={homeStyles.borderB}
              className="flex flex-row justify-between py-4 border-t"
            >
              <Text className="" style={homeStyles.subTitle}>
                Balance Due
              </Text>
              <Text className="font-semibold text-red-500" style={homeStyles.title}>
                {formatCurrency(balanceDue)}
              </Text>
            </View>
            <View style={homeStyles.borderB} className="py-4 border-t ">
              <Text style={homeStyles.title}>Renter’s Information</Text>
              <View
                style={homeStyles.infoBox}
                className=" rounded-xl p-4 mt-4"
              >
                <Text style={homeStyles.title}>{renterName}</Text>
                <Text style={homeStyles.subTitlegray}>Renter</Text>
                <Text style={homeStyles.subTitlegray}>
                  {renterEmail} | {renterPhone}
                </Text>
              </View>
            </View>
            <View style={homeStyles.borderB} className="py-4 border-t">
              <Text style={homeStyles.title}>Event Details</Text>
              <View
                style={homeStyles.infoBox}
                className=" rounded-xl p-4 mt-4 flex flex-col gap-1"
              >
                <View>
                  <Text style={homeStyles.title}>{eventType}</Text>
                </View>
                <View className="flex flex-row gap-2">
                  <Image
                    source={
                      isDarkMode
                        ? require("@/assets/icons/calender-white.png")
                        : require("@/assets/icons/calendar.png")
                    }
                    className="w-5 h-5"
                  />
                  <Text style={homeStyles.subTitlegray}>Event Date:</Text>
                  <Text style={homeStyles.text}>
                    {eventDate}
                  </Text>
                </View>
                <View className="flex flex-row gap-2">
                  <Image
                    source={require("@/assets/icons/clock.png")}
                    className="w-5 h-5"
                  />
                  <Text style={homeStyles.subTitlegray}>Estimated Duration:</Text>
                  <Text style={homeStyles.text}>{eventDuration}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
        <View className="py-4">
          <AppButton title="Confirm & Pay" onPress={handleConfirmPay} />
        </View>
      </View>
    </SafeAreaViewContainer>
  );
};

export default PayBalance;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    titleGray: {
      fontSize: RFValue(16),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    subTitle: {
      fontSize: RFValue(16),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    subTitlegray: {
      fontSize: RFValue(16),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    borderB: {
      borderTopColor: colors.slate[300],
    },
    gray: {
      color: colors.slate[600],
    },
    infoBox: {
      backgroundColor: colors.slate[150],
    },
  });
