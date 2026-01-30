import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

// Country codes data
const countryCodes = [
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
];

type Props = TextInputProps & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ImageSourcePropType;
  type?: "default" | "password" | "dropdown" | "phone" | string;
  subText?: string;
  showCancel?: boolean;
  onDropdownPress?: () => void;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
};

export default function TextField({
  label,
  value,
  onChange,
  icon,
  type = "default",
  subText,
  showCancel = true,
  onDropdownPress,
  countryCode = "+234",
  onCountryCodeChange,
  ...rest
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCode);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  const { colors } = useTheme();

  const handleSelectCountry = (code: string) => {
    setSelectedCountryCode(code);
    setShowCountryModal(false);
    if (onCountryCodeChange) {
      onCountryCodeChange(code);
    }
  };

  const getCountryFlag = (code: string) => {
    const country = countryCodes.find((c) => c.code === code);
    return country?.flag || "🇳🇬";
  };

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute" as const,
    left: type === "phone" ? 100 : icon ? 38 : 12,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 4],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: isFocused ? colors.slate[650] : "#888",
  };

  const style = styles(colors);

  // If it's a dropdown, render it as a touchable
  if (type === "dropdown") {
    return (
      <>
        <TouchableOpacity
          style={[
            style.container,
            isFocused ? { borderColor: colors.slate[650], borderWidth: 2 } : {},
          ]}
          onPress={onDropdownPress}
          activeOpacity={0.7}
        >
          {icon && <Image source={icon} style={style.icon} />}
          <Animated.Text style={labelStyle}>{label}</Animated.Text>

          <View
            style={[
              style.input,
              { paddingTop: 25 },
              icon ? { paddingLeft: 35 } : {},
            ]}
          >
            <Text style={style.dropdownText}>{value || ""}</Text>
          </View>

          <View style={style.clearBtn}>
            <Image
              style={{ tintColor: colors.slate[600] }}
              source={require("../../assets/icons/chevron-right.png")}
            />
          </View>
        </TouchableOpacity>

        {subText && <Text style={style.subText}>{subText}</Text>}
      </>
    );
  }

  // If it's a phone number, render with country code selector
  if (type === "phone") {
    return (
      <>
        <View
          style={[
            style.container,
            isFocused ? { borderColor: colors.slate[650], borderWidth: 2 } : {},
          ]}
        >
          {/* Country Code Selector */}
          <TouchableOpacity
            style={style.countryCodeContainer}
            onPress={() => setShowCountryModal(true)}
            activeOpacity={0.7}
          >
            <Text style={style.flagEmoji}>
              {getCountryFlag(selectedCountryCode)}
            </Text>
            <Text style={[style.countryCodeText, { color: colors.slate[650] }]}>
              {selectedCountryCode}
            </Text>
            <Image
              source={require("../../assets/icons/chevron-down.png")}
              style={[style.chevronDown, { tintColor: colors.slate[500] }]}
            />
          </TouchableOpacity>

          {/* Separator Line */}
          <View
            style={[style.separator, { backgroundColor: colors.slate[300] }]}
          />

          <Animated.Text style={labelStyle}>{label}</Animated.Text>

          <TextInput
            {...rest}
            style={[style.phoneInput, { color: colors.slate[650] }]}
            value={value}
            onChangeText={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType="phone-pad"
            placeholder=""
          />

          {showCancel && value.length > 0 && (
            <TouchableOpacity
              onPress={() => onChange("")}
              style={style.clearBtn}
            >
              <Image
                style={{ width: 18, height: 18 }}
                source={require("../../assets/icons/close-contained.png")}
              />
            </TouchableOpacity>
          )}
        </View>

        {subText && <Text style={style.subText}>{subText}</Text>}

        {/* Country Code Modal */}
        <Modal
          visible={showCountryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCountryModal(false)}
        >
          <Pressable
            style={style.modalOverlay}
            onPress={() => setShowCountryModal(false)}
          >
            <Pressable
              style={[
                style.modalContent,
                { backgroundColor: colors.background },
              ]}
              onPress={(e) => e.stopPropagation()}
            >
              <View
                style={[
                  style.modalHandle,
                  { backgroundColor: colors.slate[300] },
                ]}
              />

              <Text style={[style.modalTitle, { color: colors.slate[650] }]}>
                Select Country Code
              </Text>

              <ScrollView style={style.countryList}>
                {countryCodes.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      style.countryItem,
                      {
                        backgroundColor: colors.slate[150],
                        borderColor: colors.slate[300],
                      },
                      selectedCountryCode === item.code && {
                        borderColor: colors.slate[650],
                        backgroundColor: colors.slate[200],
                      },
                    ]}
                    onPress={() => handleSelectCountry(item.code)}
                  >
                    <Text style={style.countryFlagEmoji}>{item.flag}</Text>
                    <Text
                      style={[style.countryName, { color: colors.slate[650] }]}
                    >
                      {item.country}
                    </Text>
                    <Text
                      style={[
                        style.countryCodeTextModal,
                        { color: colors.slate[600] },
                      ]}
                    >
                      {item.code}
                    </Text>
                    {selectedCountryCode === item.code && (
                      <Image
                        source={require("../../assets/icons/checkbox-circle-fill.png")}
                        style={[
                          style.checkIcon,
                          { tintColor: colors.slate[650] },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }

  // Regular text input
  return (
    <>
      <View
        style={[
          style.container,
          isFocused ? { borderColor: colors.slate[650], borderWidth: 2 } : {},
        ]}
      >
        {icon && <Image source={icon} style={style.icon} />}
        <Animated.Text style={labelStyle}>{label}</Animated.Text>

        <TextInput
          {...rest}
          style={[style.input, icon ? { paddingLeft: 35 } : {}]}
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={type === "password" && !showPassword}
          placeholder=""
        />

        {type !== "password" && showCancel && value.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")} style={style.clearBtn}>
            <Image
              style={{ width: 18, height: 18 }}
              source={require("../../assets/icons/close-contained.png")}
            />
          </TouchableOpacity>
        )}

        {type === "password" && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={style.clearBtn}
          >
            <Image
              style={{ width: 20, height: 20 }}
              source={
                !showPassword
                  ? require("../../assets/icons/password-hide.png")
                  : require("../../assets/icons/password-show.png")
              }
            />
          </TouchableOpacity>
        )}
      </View>

      {subText && <Text style={style.subText}>{subText}</Text>}
    </>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      height: RFValue(56),
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      backgroundColor: colors.slate[150],
      marginVertical: 6,
      paddingHorizontal: 10,
      justifyContent: "center",
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.slate[650],
      width: "100%",
      paddingTop: Platform.OS === "android" ? 8 : 0,
      paddingBottom: Platform.OS === "android" ? 0 : 6,
      textAlignVertical: "center",
      fontFamily: "InstrumentSansRegular",
    },
    dropdownText: {
      fontSize: 16,
      color: colors.slate[650],
      fontFamily: "InstrumentSansRegular",
    },
    icon: {
      position: "absolute",
      left: 10,
      width: 18,
      height: 18,
      tintColor: "#555",
      resizeMode: "contain",
    },
    clearBtn: {
      position: "absolute",
      right: 10,
      height: "100%",
      justifyContent: "center",
    },
    subText: {
      fontSize: 12,
      color: colors.slate[650],
      marginLeft: 4,
    },
    // Phone Input Styles
    countryCodeContainer: {
      position: "absolute",
      left: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingRight: 10,
      height: "100%",
    },
    flagIcon: {
      width: 24,
      height: 18,
      borderRadius: 2,
    },
    flagEmoji: {
      fontSize: 20,
    },
    countryCodeText: {
      fontSize: 15,
      fontWeight: "500",
      fontFamily: "InstrumentSansRegular",
    },
    chevronDown: {
      width: 12,
      height: 12,
    },
    separator: {
      position: "absolute",
      left: 95,
      width: 1,
      height: "60%",
      alignSelf: "center",
    },
    phoneInput: {
      flex: 1,
      fontSize: 16,
      width: "100%",
      paddingLeft: 90,
      paddingTop: Platform.OS === "android" ? 8 : 0,
      paddingBottom: Platform.OS === "android" ? 0 : 6,
      textAlignVertical: "center",
      fontFamily: "InstrumentSansRegular",
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(32),
      maxHeight: "70%",
    },
    modalHandle: {
      width: RFValue(40),
      height: RFValue(4),
      borderRadius: RFValue(2),
      alignSelf: "center",
      marginVertical: RFValue(12),
    },
    modalTitle: {
      fontSize: RFValue(20),
      fontWeight: "700",
      marginBottom: RFValue(20),
    },
    countryList: {
      maxHeight: RFValue(400),
    },
    countryItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: RFValue(14),
      paddingHorizontal: RFValue(16),
      borderRadius: RFValue(12),
      marginBottom: RFValue(8),
      borderWidth: 1,
      gap: RFValue(12),
    },
    countryFlagEmoji: {
      fontSize: 24,
    },
    countryName: {
      fontSize: RFValue(15),
      fontWeight: "500",
      flex: 1,
    },
    countryCodeTextModal: {
      fontSize: RFValue(14),
      fontWeight: "500",
    },
    checkIcon: {
      width: RFValue(20),
      height: RFValue(20),
    },
  });
