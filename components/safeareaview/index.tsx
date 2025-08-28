import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SafeAreaViewContainer(props: Props) {
  const { colors } = useTheme();

  return (
    <SafeAreaView className={props.className} style={styles(colors).container}>
      {props.children}
    </SafeAreaView>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      padding: 16,
    },
  });
