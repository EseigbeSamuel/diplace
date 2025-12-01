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
const { minutes, seconds, isExpired } = useCountdown(9);

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

const InspectonPayment = () => {
  const { colors } = useTheme();
  const custom = styles(colors);
  const navigation = useNavigation();
  const openBank = useRef<BottomSheetModal>(null);
  const openCard = useRef<BottomSheetModal>(null);
  const router = useRouter();
  const snapPoints = useMemo(() => ["75%", "90%"], []);
  const [business, setBusiness] = useState(false);
  const [selectedPayVia, setSelectedPayVia] = useState<string | null>(null);

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
        <View>
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
            className="text-center font-medium w-full "
          >
            Pay for inspection
          </Text>
        </View>

        <View
          style={custom.back}
          className="flex-row items-center justify-between w-full p-5 rounded"
        >
          <View>
            <Text style={custom.small}>Amount Payable:</Text>
            <Text style={custom.title} className="font-semibold ">
              $1000
            </Text>
          </View>
          <View>
            <Image source={require("@/assets/icons/money-bag.png")} />
          </View>
        </View>

        <View className="py-3 border-t border-gray-300 mt-2 flex-col flex gap-5">
          <Text style={custom.subTitle} className=" font-medium ">
            Pay Via
          </Text>
          <FlatList
            data={payviaDB}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = selectedPayVia === item.id;

              return (
                <TouchableOpacity
                  onPress={() => setSelectedPayVia(item.id)}
                  className="w-full justify-between items-center flex-row"
                >
                  <View className="flex-row items-center gap-3">
                    <Image source={item.icon} />
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

        <View>
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

        {/* card */}
        <CustomBottomSheet
          bottomSheetProps={{
            ref: openCard,
            snapPoints,
          }}
        >
          <View>
            <View>
              <Text style={custom.title} className="font-semibold  ">
                Pay with card
              </Text>
              <Text style={custom.small}>
                Fill card details to complete transaction.
              </Text>
            </View>
            <View className="flex-row w-full">
              <TextField
                label="Account Number"
                placeholder="Enter your account number"
                value={formData.cardNum}
                onChange={(text) =>
                  setFormData({ ...formData, cardNum: text.toString() })
                }
                keyboardType="numeric"
              />
              <View className="flex-row items-center w-full justify-between">
                <TextField
                  label="Account Number"
                  placeholder="Enter your account number"
                  value={formData.expDate}
                  onChange={(text) =>
                    setFormData({ ...formData, expDate: text.toString() })
                  }
                  keyboardType="numeric"
                />
                <TextField
                  label="Account Number"
                  placeholder="Enter your account number"
                  value={formData.cvv}
                  onChange={(text) =>
                    setFormData({ ...formData, cvv: text.toString() })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="flex-row items-center w-full justify-between">
              <Text style={custom.text}>Save card details</Text>
              <View className="h-1">
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

            <View>
              <AppButton
                title="Confirm & Pay"
                onPress={() => {
                  router.push("/views/inspection/paymentReciept" as any);
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

        {/* bank */}
        {/* <CustomBottomSheet
          bottomSheetProps={{
            ref: openBank,
            snapPoints,
          }}
        >
          <View style={custom.back} className="p-5 rounded gap-5">
            <View>
              <Text style={custom.title} className="font-semibold  ">
                Pay via bank transfer
              </Text>
              <Text style={custom.small}>
                Transfer to the bank details below to complete transaction.
              </Text>
            </View>

            <View style={custom.back} className="flex-col gap-3 p-5 rounded">
              <View>
                <Text style={custom.small}>Account Name</Text>
                <Text style={custom.text} className="font-medium ">
                  Paystack/DiPlace Technologies
                </Text>
              </View>
              <View>
                <Text style={custom.small}>Account Number </Text>
                <Text style={custom.text} className="font-medium ">
                  8102934980
                </Text>
              </View>
              <View>
                <Text style={custom.small}>Bank Name</Text>
                <Text style={custom.text} className="font-medium ">
                  Wema Bank Plc
                </Text>
              </View>
            </View>
            <View>
              <Text style={custom.tiny} className="italic text-center">
                You have minutes to complete your transfer. This slot will
                expire if payment isn’t confirmed in time.
              </Text>
            </View>

            <View>
              <AppButton
                title="Confirm & Pay"
                onPress={() => {
                  router.push("/views/inspection/paymentReciept" as any);
                }}
                size="large"
              />
              <Text style={custom.tiny} className="italic text-center">
                🔐 Your payment is 100% secure. Funds are held safely until
                inspection is confirmed.
              </Text>
            </View>
          </View>
        </CustomBottomSheet> */}
        {/* bank bottom sheet */}
        <CustomBottomSheet
          bottomSheetProps={{
            ref: openBank,
            snapPoints,
          }}
        >
          <View>
            <View>
              <Text style={custom.title} className="font-semibold">
                Pay via bank transfer
              </Text>
              <Text style={custom.small}>
                Transfer to the bank details below to complete transaction.
              </Text>
            </View>

            <View
              style={custom.back}
              className="flex-col gap-3 p-5 rounded mt-3"
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

            {/* Countdown text */}
            <Text style={[custom.small, { marginTop: 10 }]}>
              You have{" "}
              <Text style={{ color: "red", fontWeight: "600" }}>
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </Text>{" "}
              minutes to complete your transfer. This slot will expire if
              payment isn’t confirmed in time.
            </Text>

            <View className="mt-4">
              <AppButton
                title="I’ve sent the money (₦1000)"
                onPress={() => {
                  router.push("/views/inspection/paymentReciept" as any);
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

export default InspectonPayment;

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
