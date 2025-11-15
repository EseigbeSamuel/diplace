import { useTheme } from "@/contexts/themeContext";
import { cn } from "@/utils";
import React from "react";
import {
  Image,
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  View,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface FilterProps {
  size?: "small" | "large";
  onFocus?:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
}

export default function Filter(props: FilterProps) {
  const { size, onFocus, ...rest } = props;

  const { colors } = useTheme();

  const getSizeStyle = () => {
    if (props.size === "large") {
      return "py-[16px] pr-[8px] pl-[16px]";
    } else {
      return "py-[10px] pr-[8px] pl-[12px]";
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: hp(2.5),
        backgroundColor: colors.slate[150],
        borderColor: colors.slate[300],
      }}
      className={cn(getSizeStyle(), "flex-row gap-4 border rounded-full")}
    >
      <Image
        source={require("@/assets/icons/search.png")}
        className="w-[24px] h-[24px]"
      />
      <TextInput
        className="w-full h-full"
        placeholder="Search"
        onFocus={onFocus}
        style={{ color: colors.slate[650] }}
        {...rest}
      />
    </View>
  );
}
