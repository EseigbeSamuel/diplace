import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import { View, Pressable, Image, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const ViewHeader = ({ title }: { title: string }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const router = useRouter();
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Image
          source={require("@/assets/icons/arrow-left-light.png")}
          style={styles.backIcon}
        />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
const getStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    header: {
      paddingVertical: RFValue(10),
      gap: RFValue(6),
    },
    title: {
      fontSize: RFValue(24),
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: RFValue(12),
    },
    backIcon: {
      width: RFValue(20),
      height: RFValue(20),
      tintColor: colors.slate[650],
    },
    backButton: {
      padding: RFValue(8),
      backgroundColor: colors.slate[150],
      borderRadius: RFValue(300),
      width: RFValue(36),
    },
  });

export default ViewHeader;
