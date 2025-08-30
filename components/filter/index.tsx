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
  const getSizeStyle = () => {
    if (props.size === "large") {
      return "py-[16px] pr-[8px] pl-[16px]";
    } else {
      return "w-full";
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: hp(2.5),
      }}
      className={cn(
        getSizeStyle(),
        "flex-row gap-4 border border-[#E4E4E9] bg-[#F9F9FB] rounded-full"
      )}
    >
      <Image
        source={require("@/assets/icons/search.png")}
        className="w-[24px] h-[24px]"
      />
      <TextInput
        className="w-full h-full placeholder:text-[#60646C]"
        placeholder="Search"
        onFocus={onFocus}
        {...rest}
      />
    </View>
  );
}
