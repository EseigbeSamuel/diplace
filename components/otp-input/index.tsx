import React, { useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

type OTPInputProps = {
  length?: number; // how many digits
  onChange: (otp: string) => void;
};

export default function OTPInput({ length = 6, onChange }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.charAt(text.length - 1); // only last char

    setOtp(newOtp);
    onChange(newOtp.join(""));

    if (text && index < length - 1) {
      inputs.current[index + 1].focus(); // move to next
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus(); // go back on delete
    }
  };

  return (
    <View style={styles.container}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputs.current[index] = ref;
            }}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            returnKeyType="done"
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  input: {
    width: 50,
    height: 56,
    borderWidth: 1,
    borderRadius: 15,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#f9f9f9",
    borderColor: "#ccc",
    color: "#000",
  },
});
