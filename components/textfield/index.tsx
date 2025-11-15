import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type Props = TextInputProps & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ImageSourcePropType;
  type?: "default" | "password" | string;
  subText?: string;
};

export default function TextField({
  label,
  value,
  onChange,
  icon,
  type = "default",
  subText,
  ...rest
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  const { colors } = useTheme();

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute" as const,
    left: icon ? 38 : 12,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 4],
      // outputRange: [Platform.OS === "android" ? 20 : 18, 6], // ✅ different baseline for Android
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: isFocused ? colors.slate[650] : "#888",
  };

  const style = styles(colors);

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

        {type !== "password" && value.length > 0 && (
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
      height: 56,
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
  });
