import { useTheme } from "@/contexts/themeContext";
import { cn } from "@/utils";
import React from "react";
import {
  Image,
  NativeSyntheticEvent,
  Pressable,
  TextInput,
  TextInputFocusEventData,
  View,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

// interface FilterProps {
//   size?: "small" | "large";
//   onFocus?:
//     | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
//     | undefined;
// }

// export default function Filter(props: FilterProps) {
//   const { size, onFocus, ...rest } = props;

//   const { colors, isDarkMode } = useTheme();

//   const getSizeStyle = () => {
//     if (props.size === "large") {
//       return "py-[16px] pr-[8px] pl-[16px]";
//     } else {
//       return "py-[10px] pr-[8px] pl-[12px]";
//     }
//   };

//   return (
//     <View
//       style={{
//         paddingHorizontal: hp(2.5),
//         backgroundColor: colors.slate[150],
//         borderColor: colors.slate[300],
//       }}
//       className={cn(getSizeStyle(), "flex-row gap-4 border rounded-full")}
//     >
//       <Image
//         source={
//           isDarkMode
//             ? require("@/assets/icons/search-light.png")
//             : require("@/assets/icons/search.png")
//         }
//         className="w-[24px] h-[24px]"
//       />
//       <TextInput
//         className="w-full h-full placeholder:text-red-400"
//         placeholder="Search"
//         // onFocus={onFocus}
//         style={{ color: colors.slate[650] }}
//         {...rest}
//       />
//     </View>
//   );
// }

interface FilterProps {
  size?: "small" | "large";
  value?: string;
  placeholder?: string;

  onChangeText?: (text: string) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onSubmit?: (text: string) => void;

  showFilter?: boolean;
  onFilterPress?: () => void;
}

export default function Filter(props: FilterProps) {
  const {
    size,
    value,
    placeholder = "Search",
    onChangeText,
    onFocus,
    onSubmit,
    showFilter,
    onFilterPress,
  } = props;

  const { colors, isDarkMode } = useTheme();
  // const custom = styles(colors);

  const getSizeStyle = () => {
    return size === "large"
      ? "py-[16px] pr-[8px] pl-[16px]"
      : "py-[10px] pr-[8px] pl-[12px]";
  };

  return (
    <View
      style={{
        paddingHorizontal: hp(2.5),
        backgroundColor: colors.slate[150],
        borderColor: colors.slate[300],
      }}
      className={cn(
        getSizeStyle(),
        "flex-row items-center gap-4 border rounded-full",
      )}
    >
      <Image
        source={
          isDarkMode
            ? require("@/assets/icons/search-light.png")
            : require("@/assets/icons/search.png")
        }
        className="w-[24px] h-[24px]"
      />

      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.slate[400]}
        onChangeText={onChangeText}
        // onFocus={onFocus}
        onSubmitEditing={(e) => onSubmit?.(e.nativeEvent.text)}
        style={{ color: colors.slate[650] }}
        className="flex-1"
      />

      {/* Optional filter button */}
      {showFilter && (
        <Pressable onPress={onFilterPress}>
          <Image
            source={
              isDarkMode
                ? require("@/assets/icons/Filter - Iconly Pro.png")
                : require("@/assets/icons/filter.png")
            }
            className="w-[22px] h-[22px]"
          />
        </Pressable>
      )}
    </View>
  );
}
