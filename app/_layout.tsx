import { ThemeProvider } from "@/contexts/themeContext";
import { UserProvider } from "@/contexts/user-context";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import fontFiles from "@/constants/fonts";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontFiles);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GestureHandlerRootView className="flex-1">
          <BottomSheetModalProvider>
            <UserProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <StatusBar style="dark" animated />
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
              </Stack>
              <Toast autoHide position="top" visibilityTime={2000} />
            </UserProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
