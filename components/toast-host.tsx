import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useToastStore } from "@/lib/toast";

const typeStyles = {
  success: { backgroundColor: "#16a34a" },
  info: { backgroundColor: "#2563eb" },
  warning: { backgroundColor: "#d97706" },
  danger: { backgroundColor: "#dc2626" },
  default: { backgroundColor: "#334155" },
} as const;

const positionStyles = {
  top: { top: 54 },
  center: { top: "45%" as const },
  bottom: { bottom: 48 },
} as const;

export default function ToastHost() {
  const toast = useToastStore((state) => state.toast);
  if (!toast.visible) return null;

  const cardStyle = typeStyles[toast.type] || typeStyles.default;
  const positionStyle = positionStyles[toast.position] || positionStyles.top;

  return (
    <View pointerEvents="none" style={[styles.container, positionStyle]}>
      <View style={[styles.card, cardStyle]}>
        <Text style={styles.title}>{toast.text1}</Text>
        {!!toast.text2 && <Text style={styles.body}>{toast.text2}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 99999,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  body: {
    marginTop: 4,
    color: "#f8fafc",
    fontSize: 12,
    fontWeight: "500",
  },
});

