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

      <View style={styles.container} className="flex-1">
        {loading && !showError && (
          <View style={styles.loadingContainer} className="absolute top-[0px] left-[0px] right-[0px] bottom-[0px] justify-center items-center z-[10]">
            <ActivityIndicator size="large" color={colors.slate[650]} />
            <Text style={styles.loadingText} className="mt-[12px] text-[16px]">Loading Street View...</Text>
          </View>
        )}

        {showError ? (
          <View style={styles.errorContainer} className="flex-1 justify-center items-center p-[24px]">
            <Text style={styles.errorTitle} className="text-[18px] font-bold mb-[8px] text-center">Street View unavailable</Text>
            <Text style={styles.errorText} className="text-[14px] text-center leading-[20px]">
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
           className="flex-1"/>
        )}
      </View>
    </SafeAreaViewContainer>
  );
}

const createStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {

      backgroundColor: colors.background,
    },
    webview: {

      backgroundColor: colors.background,
    },
    loadingContainer: {







      backgroundColor: colors.background,

    },
    loadingText: {


      color: colors.slate[600],
    },
    errorContainer: {




      backgroundColor: colors.background,
    },
    errorTitle: {


      color: colors.slate[650],


    },
    errorText: {

      color: colors.slate[500],


    },
  });
