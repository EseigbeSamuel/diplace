import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { RFValue } from "react-native-responsive-fontsize";

const Selector = ({
  image,
  title,
}: {
  image: ImageSourcePropType;
  title: string;
}) => {
  const { colors } = useTheme();
  const Styles = styles(colors);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <View
      className="p-4 flex-1 flex-row w-full items-center gap-4 rounded-xl"
      style={Styles.borderGray}
    >
      <View className="flex-1 flex-row gap-4">
        <Image source={image} className="w-6 h-6" />
        <Text style={Styles.subTitle}>{title}</Text>
      </View>
      <Pressable
        onPress={() => setIsChecked(!isChecked)}
        className="rounded-full w-6 h-6 items-center justify-center"
        style={Styles.checkboxButton}
      >
        {isChecked && <Text style={Styles.checkbox}>✔</Text>}
      </Pressable>
    </View>
  );
};

export default Selector;
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    textBlack: {
      color: colors.slate[650],
    },
    checkbox: {
      //   backgroundColor: colors.slate[650],
      color: colors.slate[650],
    },
    checkboxButton: {
      color: colors.slate[100],
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: colors.slate[600],
    },
    borderGray: {
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: colors.slate[600],
    },
    title: {
      fontSize: RFValue(18),
      lineHeight: RFValue(24),
      color: colors.slate[650],
    },
    subTitle: {
      fontSize: RFValue(14),
      lineHeight: RFValue(20),
      color: colors.slate[600],
    },
  });
