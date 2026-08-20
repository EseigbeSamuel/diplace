import {
  GOOGLE_MAPS_API_KEY,
  HAS_GOOGLE_MAPS_API_KEY,
} from "@/constants/google";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

export default function StreetView() {
  const { lat, lng } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);
  const hasValidCoordinates =
    Number.isFinite(latitude) && Number.isFinite(longitude);

  const streetViewUrl =
    HAS_GOOGLE_MAPS_API_KEY && hasValidCoordinates
      ? `https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_MAPS_API_KEY}&location=${latitude},${longitude}&heading=0&pitch=0&fov=90`
      : `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;

  return (
    <View style={{ flex: 1 }}>
      {loading && hasValidCoordinates && !error && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Loading Street View...</Text>
        </View>
      )}

      {(error || !hasValidCoordinates) && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Street View not available for this location.
          </Text>
        </View>
      )}

      {hasValidCoordinates && !error && (
        <WebView
          source={{ uri: streetViewUrl }}
          style={{ flex: 1 }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          bounces={false}
          scrollEnabled={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
  },
});
