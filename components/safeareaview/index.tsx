import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SafeAreaViewContainer(props: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      className={props.className}
      edges={["top", "right", "bottom", "left"]}
      style={[styles(colors).container, { paddingBottom: insets.bottom }]}
    >
      {props.children}
    </SafeAreaView>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 10,
    },
  });
