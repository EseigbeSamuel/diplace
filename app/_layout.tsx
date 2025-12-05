import { ThemeProvider } from "@/contexts/themeContext";
import { UserProvider } from "@/contexts/user-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import fontFiles from "@/constants/fonts";
import "../global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontFiles);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <GestureHandlerRootView className="flex-1">
        <BottomSheetModalProvider>
          <UserProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <StatusBar style="dark" animated />
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </UserProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
