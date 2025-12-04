import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";

export default function StreetView() {
  const { lat, lng } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);

  // Full immersive Street View URL - this gives you the 360° panorama view
  const streetViewUrl = `https://www.google.com/maps/@${latitude},${longitude},3a,75y,0h,90t/data=!3m7!1e1!3m5!1s0!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail!7i16384!8i8192`;

  // Alternative simpler URL that also works
  const simpleUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Loading Street View...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Street View not available for this location
          </Text>
        </View>
      )}

      <WebView
        source={{ uri: simpleUrl }}
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
        // Important for Street View interaction
        bounces={false}
        scrollEnabled={true}
      />
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
