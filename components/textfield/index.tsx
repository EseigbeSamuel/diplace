import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

const countryCodes = [
  { code: "+234", country: "Nigeria", flag: "NG" },
  { code: "+1", country: "USA", flag: "US" },
  { code: "+44", country: "UK", flag: "UK" },
  { code: "+233", country: "Ghana", flag: "GH" },
  { code: "+254", country: "Kenya", flag: "KE" },
  { code: "+27", country: "South Africa", flag: "ZA" },
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
  const { colors, isDarkMode } = useTheme();
  const style = styles(colors);
  const [showPassword, setShowPassword] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCode);

  useEffect(() => {
    setSelectedCountryCode(countryCode);
  }, [countryCode]);

  const selectedCountry = useMemo(
    () => countryCodes.find((item) => item.code === selectedCountryCode),
    [selectedCountryCode]
  );

  const baseInputProps: Partial<TextInputProps> = {
    ...rest,
    mode: "outlined",
    label,
    value,
    onChangeText: (text) => onChange(text),
    outlineStyle: style.outlineStyle,
    style: style.inputStyle,
    contentStyle: style.contentStyle,
    theme: {
      colors: {
        primary: colors.slate[650],
        text: colors.slate[650],
        placeholder: colors.slate[500],
        background: colors.slate[150],
        onSurfaceVariant: colors.slate[500],
      },
    },
  };

  const leftIcon =
    icon &&
    (() => (
      <Image source={icon} style={style.leftIconImage} resizeMode="contain" />
    ));

  const renderClearRight = () =>
    showCancel &&
    value.length > 0 && (
      <TextInput.Icon
        accessibilityLabel="Clear input"
        accessibilityRole="button"
        onPress={() => onChange("")}
        icon={() => (
          <Image
            source={require("../../assets/icons/close-contained.png")}
            style={style.clearIcon}
            resizeMode="contain"
          />
        )}
      />
    );

  const renderPasswordRight = () => (
    <TextInput.Icon
      accessibilityLabel={showPassword ? "Hide password" : "Show password"}
      accessibilityRole="button"
      onPress={() => setShowPassword((prev) => !prev)}
      icon={() => (
        <Image
          source={
            !showPassword
              ? isDarkMode
                ? require("../../assets/icons/eye-closed-light.png")
                : require("../../assets/icons/eye-closed-dark.png")
              : isDarkMode
              ? require("../../assets/icons/eye-open-light.png")
              : require("../../assets/icons/eye-open-dark.png")
          }
          style={style.passwordIcon}
          resizeMode="contain"
        />
      )}
    />
  );

  if (type === "dropdown") {
    return (
      <>
        <Pressable onPress={onDropdownPress}>
          <TextInput
            {...baseInputProps}
            editable={false}
            left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
            right={
              renderClearRight() || (
                <TextInput.Icon
                  icon={() => (
                    <Image
                      source={require("../../assets/icons/chevron-right.png")}
                      style={style.chevronIcon}
                      resizeMode="contain"
                    />
                  )}
                />
              )
            }
          />
        </Pressable>
        {subText ? <Text style={style.subText}>{subText}</Text> : null}
      </>
    );
  }

  if (type === "phone") {
    return (
      <>
        <View style={style.phoneWrapper}>
          <TextInput
            {...baseInputProps}
            keyboardType={rest.keyboardType ?? "phone-pad"}
            left={
              <TextInput.Affix
                text={`${selectedCountry?.flag ?? "NG"} ${selectedCountryCode}`}
              />
            }
            right={renderClearRight()}
          />

          <Pressable
            style={style.countrySelectorOverlay}
            onPress={() => setShowCountryModal(true)}
          />
        </View>
        {subText ? <Text style={style.subText}>{subText}</Text> : null}

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
                style={[style.modalHandle, { backgroundColor: colors.slate[300] }]}
              />
              <Text style={[style.modalTitle, { color: colors.slate[650] }]}>
                Select Country Code
              </Text>

              <ScrollView style={style.countryList}>
                {countryCodes.map((item) => (
                  <TouchableOpacity
                    key={item.code}
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
                    onPress={() => {
                      setSelectedCountryCode(item.code);
                      setShowCountryModal(false);
                      onCountryCodeChange?.(item.code);
                    }}
                  >
                    <Text style={style.countryFlag}>{item.flag}</Text>
                    <Text style={[style.countryName, { color: colors.slate[650] }]}>
                      {item.country}
                    </Text>
                    <Text
                      style={[style.countryCodeText, { color: colors.slate[600] }]}
                    >
                      {item.code}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }

  return (
    <>
      <TextInput
        {...baseInputProps}
        secureTextEntry={type === "password" && !showPassword}
        left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
        right={type === "password" ? renderPasswordRight() : renderClearRight()}
      />
      {subText ? <Text style={style.subText}>{subText}</Text> : null}
    </>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    inputStyle: {
      backgroundColor: colors.slate[150],
      marginVertical: 6,
      fontFamily: "InstrumentSansRegular",
    },
    contentStyle: {
      fontFamily: "InstrumentSansRegular",
      fontSize: RFValue(15),
      color: colors.slate[650],
      paddingTop: 2,
      paddingBottom: 2,
    },
    outlineStyle: {
      borderRadius: 10,
      borderColor: colors.slate[650],
    },
    leftIconImage: {
      width: 20,
      height: 20,
      tintColor: colors.slate[650],
    },
    clearIcon: {
      width: 18,
      height: 18,
      tintColor: colors.slate[650],
    },
    passwordIcon: {
      width: 20,
      height: 20,
      tintColor: colors.slate[650],
    },
    chevronIcon: {
      width: 16,
      height: 16,
      tintColor: colors.slate[600],
    },
    subText: {
      fontSize: 12,
      color: colors.slate[650],
      marginLeft: 4,
      marginTop: 2,
    },
    phoneWrapper: {
      position: "relative",
    },
    countrySelectorOverlay: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 120,
    },
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
      fontFamily: "InstrumentSansBold",
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
    countryFlag: {
      fontSize: RFValue(13),
      fontFamily: "InstrumentSansBold",
      width: RFValue(24),
    },
    countryName: {
      fontSize: RFValue(15),
      fontFamily: "InstrumentSansRegular",
      flex: 1,
    },
    countryCodeText: {
      fontSize: RFValue(14),
      fontFamily: "InstrumentSansRegular",
    },
  });
