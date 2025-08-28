import { colors } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  StyleSheet,
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
};

export default function TextField({
  label,
  value,
  onChange,
  icon,
  type = "default",
  ...rest
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 new state
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute" as const,
    left: icon ? 38 : 10,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 4],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: "#888",
  };

  return (
    <View
      style={[
        styles.container,
        isFocused ? { borderColor: colors["slate-900"], borderWidth: 2 } : {},
      ]}
    >
      {icon && <Image source={icon} style={styles.icon} />}
      <Animated.Text style={labelStyle}>{label}</Animated.Text>

      <TextInput
        {...rest}
        style={[styles.input, icon ? { paddingLeft: 35 } : {}]}
        value={value}
        onChangeText={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={type === "password" && !showPassword}
      />

      {type !== "password" && value.length > 0 && (
        <TouchableOpacity onPress={() => onChange("")} style={styles.clearBtn}>
          <Image
            style={{ width: 18, height: 18 }}
            source={require("../../assets/icons/close-contained.png")}
          />
        </TouchableOpacity>
      )}

      {type === "password" && (
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.clearBtn}
        >
          <Image
            style={{ width: 20, height: 20 }}
            source={
              !showPassword
                ? require("../../assets/icons/password-hide.png") // 👈 eye-off
                : require("../../assets/icons/password-show.png") // 👈 eye
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    marginVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 20,
    width: "100%",
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
  },
});
