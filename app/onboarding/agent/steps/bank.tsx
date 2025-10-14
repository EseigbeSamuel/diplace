import AppButton from "@/components/button";
import Filter from "@/components/filter";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type props = {
  onNext: () => void;
};

const ID_OPTIONS = [
  { id: "access", label: "Access Bank PLC" },
  { id: "first", label: "First Bank of Nigeria" },
  { id: "opay", label: "OPAY" },
  { id: "monie", label: "Moniepoint FMB" },
  { id: "uba", label: "UBA" },
  { id: "gtb", label: "GTBank" },
  { id: "union", label: "Union Bank" },
  { id: "eco", label: "Eco Bank" },
  { id: "keystone", label: "Keystone Bank" },
];

const Bank = ({ onNext }: props) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedID, setSelectedID] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [docNumber, setDocNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleFetchData = () => {
    if (!selectedID || !docNumber) return;
    setLoading(true);
    setTimeout(() => {
      setUserData({ accountname: "Ibex Alex", accountnumber: "0972982258" });
      setLoading(false);
    }, 1500);
  };

  const handleContinue = () => {
    if (userData) onNext();
  };

  return (
    <>
      <SafeAreaViewContainer className=" justify-between">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-5 mt-4">
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image
                source={require("@/assets/icons/Bank Card - Iconly Pro.png")}
              />
            </TouchableOpacity>

            <View>
              <Text style={Styles.headText} className="font-semibold">
                Bank Details
              </Text>
              <Text style={Styles.text}>
                Please link your bank account you will use to collect payments.
              </Text>
            </View>
          </View>

          {/* Account Card */}
          <View className="mt-6">
            <View
              className="rounded-2xl p-5"
              style={{ backgroundColor: "#1E1E1E" }}
            >
              <View className="flex-row justify-between items-center mb-6">
                <Image
                  source={require("@/assets/icons/Bank Card - Iconly Pro.png")}
                  style={{ width: 40, height: 40, tintColor: "white" }}
                />
                <Text className="text-white text-sm">Account Number</Text>
              </View>

              <Text className="text-white text-xl font-semibold tracking-wider">
                {userData ? userData.accountnumber : "N/A"}
              </Text>

              <View className="flex-row justify-between mt-6">
                <View>
                  <Text className="text-gray-400 text-xs">Account Name</Text>
                  <Text className="text-white font-medium mt-1 capitalize">
                    {userData ? userData.accountname : "UNAVAILABLE"}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-gray-400 text-xs">Bank</Text>
                  <Text className="text-white font-medium mt-1 capitalize">
                    {selectedID ? selectedID.label : "UNAVAILABLE"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bank Selector */}
          <TouchableOpacity
            className="border border-gray-300 p-4 mt-6 rounded-2xl flex-row w-full justify-between"
            onPress={() => setModalVisible(true)}
          >
            <Text style={Styles.text}>
              {selectedID ? selectedID.label : "Bank Name"}
            </Text>
            <Image source={require("@/assets/icons/angle.png")} />
          </TouchableOpacity>

          {/* Account Number Field */}
          {selectedID && (
            <TextField
              label="Account Number"
              placeholder="Enter your account number"
              value={docNumber}
              onChange={setDocNumber}
              keyboardType="numeric"
            />
          )}

          {/* Loader */}
          {loading && (
            <View className="mt-4 flex-row items-center">
              <ActivityIndicator size="small" color="gray" />
              <Text className="ml-2 text-gray-600">Fetching data...</Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="flex-1 bg-black/40 justify-end">
            <View
              style={[Styles.container]}
              className="bg-white rounded-t-3xl px-6 pt-3 pb-8 max-h-[60%]"
            >
              <View className="w-full h-[30px] items-center mb-2">
                <View className="bg-gray-300 rounded-full h-2 w-[50px]" />
              </View>

              <Text
                style={Styles.headText}
                className="text-center font-semibold mb-3"
              >
                Select Your Bank
              </Text>

              <View className="py-2">
                <Filter size="small" />
              </View>

              <FlatList
                data={ID_OPTIONS}
                keyExtractor={(item) => item.id}
                contentContainerClassName="gap-3 pb-4"
                renderItem={({ item }) => {
                  const isSelected = selectedID?.id === item.id;
                  return (
                    <TouchableOpacity
                      style={Styles.border}
                      className="border p-4 rounded-2xl"
                      onPress={() => {
                        setSelectedID(item);
                        setUserData(null);
                        setDocNumber("");
                        setModalVisible(false);
                      }}
                    >
                      <View className="flex-row items-center">
                        <View
                          style={isSelected ? Styles.border2 : Styles.border}
                          className="h-5 w-5 rounded-full border-2 items-center justify-center mr-3"
                        >
                          {isSelected && (
                            <View className="bg-gray-800 h-2.5 w-2.5 rounded-full" />
                          )}
                        </View>
                        <Text style={Styles.text2} className="text-base">
                          {item.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />

              <View className="py-3 border-t border-gray-300 mt-2">
                <Text style={Styles.small} className="italic text-center">
                  🔐 Your data is 100% safe. We only crosscheck your data to be
                  sure you are real.
                </Text>
              </View>
            </View>
          </View>
        </Modal>

        {/* Button */}
        <View className="w-full">
          {!userData ? (
            <AppButton
              title={loading ? "Fetching..." : "Fetch Details"}
              onPress={handleFetchData}
              fullwidth
            />
          ) : (
            <AppButton title="Continue" onPress={handleContinue} fullwidth />
          )}
        </View>
      </SafeAreaViewContainer>
    </>
  );
};

export default Bank;

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    border: {
      borderColor: colors.slate[300],
      backgroundAttachment: colors.slate[150],
    },
    border2: {
      borderColor: colors.slate[650],
    },
    radio: {
      borderColor: colors.slate[650],
      backgroundColor: colors.background,
    },
    headText: {
      fontSize: RFValue(24),
      lineHeight: RFValue(32),
      color: colors.slate[650],
    },
    medText: {
      fontSize: RFValue(16),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    text: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
    text2: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[650],
    },
    small: {
      fontSize: RFValue(12),
      lineHeight: RFValue(16),
      color: colors.slate[600],
    },
  });
