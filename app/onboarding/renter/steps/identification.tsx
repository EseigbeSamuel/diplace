import AppButton from "@/components/button";
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
  { id: "nin", label: "Nat’l Identification No. (NIN)" },
  { id: "bvn", label: "Bank Verification No. (BVN)" },
  { id: "passport", label: "Int’l Passport" },
  { id: "license", label: "Driver’s License" },
];

const Identification = ({ onNext }: props) => {
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
  const [active, setActive] = useState(false);

  const isActive = () => {
    setActive(true);
  };

  const handleFetchData = async () => {
    if (!selectedID || !docNumber) return;
    setLoading(true);

    setTimeout(() => {
      setUserData({
        surname: "KALU",
        firstName: "SARAHMY",
        middleName: "UKO",
        dob: "28-10-1995",
      });
      setLoading(false);
    }, 1500);
  };

  const handleContinue = () => {
    if (userData) {
      onNext();
    }
  };

  return (
    <SafeAreaViewContainer className="flex-col justify-between h-full">
      <View className="gap-5">
        <View>
          <Image source={require("@/assets/icons/Camera - Iconly Pro.png")} />
        </View>

        <View>
          <Text style={Styles.headText} className="font-semibold ">
            Verify your identity
          </Text>
          <Text style={Styles.text}>
            Please select any means of identification to verify your account. We
            only crosscheck your data to be sure you are real.
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1">
          {/* ID Selector */}
          <TouchableOpacity
            className="border border-gray-300 p-4 mt-6 rounded-2xl"
            onPress={() => setModalVisible(true)}
          >
            <Text style={Styles.text} className="">
              {selectedID ? selectedID.label : "Select means of ID"}
            </Text>
          </TouchableOpacity>

          {/* Document Number Input */}
          {selectedID && (
            <TextField
              label="Document Number"
              placeholder="Document Number"
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

          {/* User Data */}
          {userData && (
            <View className="border border-gray-200 rounded-lg p-4 mt-4">
              <Text style={Styles.medText} className="font-medium pb-2">
                Personal Infomation
              </Text>
              <View className="flex-row flex-wrap justify-between mt-3">
                <View className="basis-1/2 pr-2 mb-3">
                  <Text style={Styles.text}>Surname:</Text>
                  <Text
                    style={Styles.medText}
                    className="font-medium capitalize"
                  >
                    {userData.surname}
                  </Text>
                </View>

                <View className="basis-1/2 pl-2 mb-3">
                  <Text style={Styles.text}>First Name:</Text>
                  <Text
                    style={Styles.medText}
                    className="font-medium capitalize"
                  >
                    {userData.firstName}
                  </Text>
                </View>

                <View className="basis-1/2 pr-2 mb-3">
                  <Text style={Styles.text}>Middle Name:</Text>
                  <Text
                    style={Styles.medText}
                    className="font-medium capitalize"
                  >
                    {userData.middleName}
                  </Text>
                </View>

                <View className="basis-1/2 pl-2 mb-3">
                  <Text style={Styles.text}>Date of Birth:</Text>
                  <Text
                    style={Styles.medText}
                    className="font-medium capitalize"
                  >
                    {userData.dob}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Complete Button */}
        {/* <TouchableOpacity
          disabled={!selectedID || (!docNumber && !userData)}
          onPress={handleFetchData}
          className={`rounded-lg p-4 mb-6 ${
            !selectedID || (!docNumber && !userData)
              ? "bg-gray-300"
              : "bg-black"
          }`}
        >
          <Text className="text-center text-white font-semibold">Complete</Text>
        </TouchableOpacity> */}
      </ScrollView>

      {/* ID Options Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-end">
          <View
            style={Styles.container}
            className=" rounded-t-2xl p-6 max-h-[450px]"
          >
            <View className="w-full h-[30px]  items-center">
              <View
                style={{ backgroundColor: colors.slate?.[650] }}
                className="rounded-full h-2 w-[50px] "
              ></View>
            </View>
            <View>
              <Text
                style={Styles.headText}
                className=" text-center font-semibold "
              >
                Choose means of identification
              </Text>
              <Text style={Styles.text} className="text-center">
                Select any means of identification to verify your account.
              </Text>
            </View>

            <FlatList
              data={ID_OPTIONS}
              keyExtractor={(item) => item.id}
              contentContainerClassName="gap-3"
              renderItem={({ item }) => {
                const isSelected = selectedID?.id === item.id;

                return (
                  <TouchableOpacity
                    style={Styles.border}
                    className="border p-4 rounded-2xl"
                    onPress={() => {
                      setSelectedID(item);
                      setModalVisible(false);
                      setUserData(null);
                      setDocNumber("");
                    }}
                  >
                    <View className="flex-row items-center">
                      {/* Radio circle */}
                      <View
                        style={isSelected ? Styles.border2 : Styles.border}
                        className={`h-5 w-5 rounded-full border-2 items-center justify-center mr-3 
            `}
                      >
                        {isSelected && (
                          <View
                            style={{ backgroundColor: colors.slate?.[650] }}
                            className="h-2.5 w-2.5 rounded-full "
                          />
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
            <View style={Styles.border} className="py-3 border-t-2">
              <Text style={Styles.small} className="italic text-center">
                🔐 Your data is 100% safe. We only crosscheck your data to be
                sure you are real.
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {!userData ? (
        <View className="w-full ">
          <AppButton
            title={loading ? "Fetching..." : "Fetch Details"}
            onPress={handleFetchData}
            fullwidth
          />
        </View>
      ) : (
        <View className="w-full ">
          <AppButton title="Continue" onPress={handleContinue} fullwidth />
        </View>
      )}

      {/* <View className="w-full ">
        <AppButton title="Continue" onPress={handleFetchData} fullwidth />
      </View> */}
    </SafeAreaViewContainer>
  );
};

export default Identification;
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
