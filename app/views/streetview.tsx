import {
  GOOGLE_MAPS_API_KEY,
  HAS_GOOGLE_MAPS_API_KEY,
} from "@/constants/google";
import SafeAreaViewContainer from "@/components/safeareaview";
import SectionHeader from "@/components/sectionheader";
import { useTheme } from "@/contexts/themeContext";
import { ColorScheme } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const parseCoordinate = (value?: string | string[]) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const coordinate = Number(rawValue);
  return Number.isFinite(coordinate) ? coordinate : null;
};

export default function StreetView() {
  const { lat, lng } = useLocalSearchParams<{
    lat?: string;
    lng?: string;
  }>();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const latitude = parseCoordinate(lat);
  const longitude = parseCoordinate(lng);
  const hasValidCoordinates = latitude !== null && longitude !== null;

  const streetViewUrl = useMemo(() => {
    if (!hasValidCoordinates) return null;

    if (HAS_GOOGLE_MAPS_API_KEY) {
      const params = new URLSearchParams({
        key: GOOGLE_MAPS_API_KEY,
        location: `${latitude},${longitude}`,
        heading: "0",
        pitch: "0",
        fov: "90",
      });

      return `https://www.google.com/maps/embed/v1/streetview?${params.toString()}`;
    }

    const params = new URLSearchParams({
      api: "1",
      map_action: "pano",
      viewpoint: `${latitude},${longitude}`,
    });

    return `https://www.google.com/maps/@?${params.toString()}`;
  }, [hasValidCoordinates, latitude, longitude]);

  const showError = error || !streetViewUrl;

  return (
    <SafeAreaViewContainer disableBottom>
      <SectionHeader title="Street View" rightIconView={<View />} />

      <View style={styles.container}>
        {loading && !showError && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.slate[650]} />
            <Text style={styles.loadingText}>Loading Street View...</Text>
          </View>
        )}

        {showError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Street View unavailable</Text>
            <Text style={styles.errorText}>
              This location may not have Street View imagery yet.
            </Text>
          </View>
        ) : (
          <WebView
            source={{ uri: streetViewUrl }}
            style={styles.webview}
            originWhitelist={["https://*", "http://*"]}
            onLoadStart={() => {
              setError(false);
              setLoading(true);
            }}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            onHttpError={() => {
              setLoading(false);
              setError(true);
            }}
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
            geolocationEnabled
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            bounces={false}
            scrollEnabled
          />
        )}
      </View>
    </SafeAreaViewContainer>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    webview: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      zIndex: 10,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: colors.slate[600],
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      backgroundColor: colors.background,
    },
    errorTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.slate[650],
      marginBottom: 8,
      textAlign: "center",
    },
    errorText: {
      fontSize: 14,
      color: colors.slate[500],
      textAlign: "center",
      lineHeight: 20,
    },
  });
