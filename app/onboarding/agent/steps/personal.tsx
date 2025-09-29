import AppButton from "@/components/button";
import SafeAreaViewContainer from "@/components/safeareaview";
import TextField from "@/components/textfield";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RFValue } from "react-native-responsive-fontsize";
type props = {
  onNext: () => void;
};

const ID_OPTIONS = [
  { id: "abuja", label: "Abuja" },
  { id: "lagos", label: "Lagos" },
  { id: "port", label: "Port Harcourt " },
  { id: "owerri", label: "Owerri" },
];

const Personal = ({ onNext }: props) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedID, setSelectedID] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [address, setAddress] = useState("");

  const [fullname, setFullname] = useState("");
  return (
    <SafeAreaViewContainer className="flex-col justify-between h-full pb-5">
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={20}
        enableAutomaticScroll
        contentContainerClassName="flex-1 justify-center gap-4"
      >
        <View>
          <View>
            <Image
              source={require("@/assets/icons/Profile - Iconly Pro-1.png")}
            />
          </View>
          <View>
            <Text style={Styles.headText} className="font-semibold ">
              Personal Details
            </Text>
            <Text style={Styles.text}>
              Complete your KYC by providing your location and bank details.
            </Text>
          </View>
        </View>

        <View>
          <View>
            <Text>use business name</Text>
            <Text>if you are listing for a business</Text>
          </View>
        </View>

        <View>
          <TextField
            label="Full Name"
            placeholder="fullname"
            value={fullname}
            onChange={setFullname}
          />
        </View>

        <View>
          <View className="flex w-full justify-between">
            <Text>Location</Text>
            <Text>Use live location</Text>
          </View>

          <View>
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
                value={address}
                onChange={setAddress}
                keyboardType="numeric"
              />
            )}
          </View>
        </View>

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
                        setAddress("");
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
      </KeyboardAwareScrollView>
      <View className="w-full ">
        <AppButton title="Continue" onPress={onNext} fullwidth />
      </View>
    </SafeAreaViewContainer>
  );
};

export default Personal;
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
