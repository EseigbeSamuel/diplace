import { CustomBottomSheet } from "@/components/bottom-sheet";
import AppButton from "@/components/button";
import { useCountdown } from "@/components/countdown";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { BottomSheetModal, TouchableOpacity } from "@gorhom/bottom-sheet";
import { useNavigation, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";

import {
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";

type payvia = {
  id: string;
  label: string;
  icon: ImageSourcePropType;
};

const payviaDB: payvia[] = [
  {
    id: "card",
    label: "Credit/Debit card",
    icon: require("@/assets/icons/Bank Card - Iconly Pro.png"),
  },
  {
    id: "bank",
    label: "Bank transfer",
    icon: require("@/assets/icons/bank emoji.png"),
  },
  {
    id: "ussd",
    label: "USSD",
    icon: require("@/assets/icons/phone emoji.png"),
  },
];

const InspectionPayment = () => {
  const { colors } = useTheme();
  const custom = styles(colors);
  const navigation = useNavigation();
  const router = useRouter();

  const openBank = useRef<BottomSheetModal>(null);
  const openCard = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["75%", "90%"], []);
  const [business, setBusiness] = useState(false);
  const [selectedPayVia, setSelectedPayVia] = useState<string | null>(null);
  const { minutes, seconds, isExpired } = useCountdown(9);

  const [formData, setFormData] = useState({
    cardNum: "",
    expDate: "",
    cvv: "",
  });

  const handleMakePayment = () => {
    if (!selectedPayVia) return;

    if (selectedPayVia === "card") {
      openCard.current?.present();
    } else if (selectedPayVia === "bank") {
      openBank.current?.present();
    } else if (selectedPayVia === "ussd") {
      // You can add a USSD sheet too
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleToggle = (value: boolean) => {
    setBusiness(value);
  };

  return (
    <SafeAreaViewContainer>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        enableAutomaticScroll={true}
      >
        <View className="flex-col gap-10 h-full">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleBackPress}
              className="p-4 bg-gray-100 rounded-full w-[50px] "
            >
              <Image
                source={require("@/assets/icons/arrow-left-dark.png")}
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <Text
              style={custom.subTitle}
              className=" text-center font-medium w-full "
            >
              Pay for inspection
            </Text>
          </View>

          <View
            style={custom.back}
            className="flex-row items-center justify-between w-full p-5 rounded-3xl"
          >
            <View>
              <Text style={custom.small}>Amount Payable:</Text>
              <Text style={custom.title} className="font-semibold ">
                $1000
              </Text>
            </View>
            <View>
              <Image
                source={require("@/assets/icons/money-bag.png")}
                className="h-10 w-10"
              />
            </View>
          </View>

          <View
            style={custom.tborder}
            className="py-3 border-t mt-2 flex-col flex gap-5"
          >
            <FlatList
              data={payviaDB}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={
                <>
                  <Text style={custom.subTitle} className=" font-medium ">
                    Pay Via
                  </Text>
                </>
              }
              contentContainerClassName="gap-5 p-5"
              renderItem={({ item }) => {
                const isSelected = selectedPayVia === item.id;

                return (
                  <TouchableOpacity
                    onPress={() => setSelectedPayVia(item.id)}
                    className="w-full justify-between items-center flex-row"
                  >
                    <View className="flex-row items-center gap-3">
                      <Image source={item.icon} className="h-10 w-10" />

                      <Text style={custom.text} className="capitalize">
                        {item.label}
                      </Text>
                    </View>

                    <View
                      style={isSelected ? custom.border2 : custom.border}
                      className="h-5 w-5 rounded-full border-2 items-center justify-center mr-3"
                    >
                      {isSelected && (
                        <View
                          style={{ backgroundColor: colors.slate?.[650] }}
                          className="h-2.5 w-2.5 rounded-full"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        <View className="flex-col gap-5 ">
          <AppButton
            title="Make Payment"
            onPress={handleMakePayment}
            size="large"
            disabled={!selectedPayVia}
          />
          <Text style={custom.tiny} className="italic text-center">
            🔐 Your payment is 100% secure. Funds are held safely until
            inspection is confirmed.
          </Text>
        </View>

        {/* card transfer bottom sheets */}
        <CustomBottomSheet
          bottomSheetProps={{
            ref: openCard,
            snapPoints,
          }}
        >
          <View className="w-full flex-col gap-5">
            <View>
              <Text
                style={custom.title}
                className="font-semibold text-center  "
              >
                Pay with card
              </Text>
              <Text style={custom.small} className="text-center">
                Fill card details to complete transaction.
              </Text>
            </View>

            <View className="w-full">
              <TextField
                label="Card Number"
                placeholder="Enter your card number"
                value={formData.cardNum}
                onChange={(text) =>
                  setFormData({ ...formData, cardNum: text.toString() })
                }
                keyboardType="numeric"
              />
              <View className="flex-row items-center gap-3">
                <View className="flex-1">
                  <TextField
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={formData.expDate}
                    onChange={(text) =>
                      setFormData({ ...formData, expDate: text.toString() })
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <TextField
                    label="CVV"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(text) =>
                      setFormData({ ...formData, cvv: text.toString() })
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View className="flex-row items-center w-full justify-between">
              <Text style={custom.text} className="">
                Save card details
              </Text>
              <View className="">
                <Switch
                  trackColor={{
                    false: colors.slate[300],
                    true: colors.success[300],
                  }}
                  thumbColor="#fff"
                  ios_backgroundColor={colors.slate[300]}
                  onValueChange={handleToggle}
                  value={business}
                />
              </View>
            </View>

            <View className="flex-col gap-5">
              <AppButton
                title="Confirm & Pay"
                onPress={() => {
                  router.push("/views/inspection/paymentReceipt");
                  openCard.current?.dismiss();
                }}
                size="large"
              />
              <Text style={custom.tiny} className="italic text-center">
                🔐 Your payment is 100% secure. Funds are held safely until
                inspection is confirmed.
              </Text>
            </View>
          </View>
        </CustomBottomSheet>

        {/* bank bottom sheet */}
        <CustomBottomSheet
          bottomSheetProps={{
            ref: openBank,
            snapPoints,
          }}
        >
          <View className="flex-col gap-5">
            <View>
              <Text style={custom.title} className="font-semibold text-center">
                Pay via bank transfer
              </Text>
              <Text style={custom.small} className="text-center">
                Transfer to the bank details below to complete transaction.
              </Text>
            </View>

            <View
              style={custom.back}
              className="flex-col gap-3 p-5 rounded-3xl mt-3"
            >
              <View>
                <Text style={custom.small}>Account Name</Text>
                <Text style={custom.text} className="font-medium">
                  Paystack/DiPlace Technologies
                </Text>
              </View>

              <View>
                <Text style={custom.small}>Account Number</Text>
                <Text style={custom.text} className="font-medium">
                  8102934980
                </Text>
              </View>

              <View>
                <Text style={custom.small}>Bank Name</Text>
                <Text style={custom.text} className="font-medium">
                  Wema Bank Plc
                </Text>
              </View>
            </View>

            <Text style={[custom.small, { marginTop: 10 }]}>
              You have
              <Text style={{ color: "red", fontWeight: "600" }}>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </Text>
              minutes to complete your transfer. This slot will expire if
              payment isn’t confirmed in time.
            </Text>

            <View className="mt-4">
              <AppButton
                title="I’ve sent the money (₦1000)"
                onPress={() => {
                  router.push("/views/inspection/paymentReceipt");
                  openBank.current?.dismiss();
                }}
                size="large"
              />
              <Text style={custom.tiny} className="italic text-center mt-2">
                🔐 Your payment is 100% secure. Funds are held safely until
                inspection is confirmed.
              </Text>
            </View>
          </View>
        </CustomBottomSheet>
      </KeyboardAwareScrollView>
    </SafeAreaViewContainer>
  );
};

export default InspectionPayment;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    background: {
      backgroundColor: colors.background,
    },
    back: { backgroundColor: colors.slate[150] },
    border: {
      borderColor: colors.slate[300],
      backgroundColor: colors.slate[150],
    },
    border2: {
      borderColor: colors.slate[650],
    },
    tborder: { borderColor: colors.slate[400] },
    title: {
      fontSize: RFValue(20),
      lineHeight: RFValue(28),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(16),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    small: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    tiny: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[650],
    },
  });
