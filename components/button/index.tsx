import { useTheme } from "@/contexts/themeContext";
import { cn, ColorScheme } from "@/utils";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type ButtonProps = {
  title: string;
  variant?: "primary" | "secondary" | "tertiary";
  onPress: () => void;
  size?: "large" | "medium" | "small";
  fullwidth?: boolean;
  disabled?: boolean;
  beforeIcon?: ImageSourcePropType;
  afterIcon?: ImageSourcePropType;
  className?: string;
};

export default function AppButton(props: ButtonProps) {
  const {
    title,
    variant = "primary",
    onPress,
    size = "medium",
    fullwidth = false,
    disabled = false,
    beforeIcon,
    afterIcon,
    className,
  } = props;

  const { colors } = useTheme();

  const getVariantContaninerStyles = () => {
    if (variant === "primary") {
      return `${
        disabled ? "bg-[#7E808A]" : "bg-di-dark hover:bg-di-dark-secondary"
      }`;
    } else if (variant === "secondary") {
      return `${
        disabled
          ? "bg-[#7E808A] border border-[#E4E4E9]"
          : "bg-di-gray hover:bg-di-gray-secondary"
      }`;
    }
  };

  // const getBtnContainerSize = () => {
  //   if (size === "large") {
  //     return "p-4";
  //   } else if (size === "medium") {
  //     return "px-4 py-3";
  //   } else if (size === "small") {
  //     return "px-4 py-2.5";
  //   }
  // };

  const getBtnTextSize = () => {
    if (size === "large") {
      return "text-base";
    } else if (size === "medium") {
      return "text-base";
    } else if (size === "small") {
      return "text-sm";
    }
  };

  const style = styles({ colors, disabled, variant, size, fullwidth });

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={style.container}
      className={cn(
        `flex-row justify-center items-center gap-2 rounded-full`,
        // getBtnContainerSize(),
        // getVariantContaninerStyles(),
        fullwidth ? "w-full" : "w-fit",
        className
      )}
    >
      <Image
        source={beforeIcon}
        className={cn(
          `${size === "small" ? "h-[12px] w-[12px]" : "h-[14px] w-[14px]"}`
        )}
      />
      <Text style={style.title} className={cn("font-medium", getBtnTextSize())}>
        {title}
      </Text>
      <Image
        source={afterIcon}
        className={cn(
          `${size === "small" ? "h-[12px] w-[12px]" : "h-[14px] w-[14px]"}`
        )}
      />
    </TouchableOpacity>
  );
}

type StylesProps = {
  colors: ColorScheme;
  disabled: boolean;
  variant: "primary" | "secondary" | "tertiary";
  size: "large" | "medium" | "small";
  fullwidth: boolean;
};

const styles = (props: StylesProps) => {
  const { colors, disabled, variant, size, fullwidth } = props;

  return StyleSheet.create({
    container: {
      backgroundColor:
        variant === "primary"
          ? `${disabled ? colors.slate[550] : colors.slate[650]}`
          : variant === "secondary"
          ? `${disabled ? colors.slate[150] : colors.slate[250]}`
          : "transparent",
      paddingVertical: size === "large" ? 16 : size === "medium" ? 12 : 10,
      borderWidth: variant === "tertiary" ? 1 : 0,
      borderColor:
        variant === "primary"
          ? ""
          : variant === "secondary"
          ? ""
          : colors.slate[300],
    },
    title: {
      color:
        variant === "primary"
          ? "#fff"
          : variant === "secondary"
          ? `${disabled ? colors.slate[450] : colors.slate[650]}`
          : colors.slate[650],
      fontSize: size === "small" ? 14 : 16,
    },
  });
};
