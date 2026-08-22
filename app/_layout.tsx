import ToastHost from "@/components/toast-host";
import { ThemeProvider } from "@/contexts/themeContext";
import { UserProvider } from "@/contexts/user-context";
import { useIncomingCall } from "@/hooks";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

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

/**
 * Inner component that can safely call hooks (needs to be inside providers).
 * Registers push notifications and listens for incoming calls globally.
 */
function AppShell({ children }: { children: React.ReactNode }) {
  useIncomingCall();
  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontFiles);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <GestureHandlerRootView className="flex-1">
            <BottomSheetModalProvider>
              <UserProvider>
                <AppShell>
                  <Stack screenOptions={{ headerShown: false }}>
                    <StatusBar style="dark" animated />
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(tabs)" />
                  </Stack>
                  <ToastHost />
                </AppShell>
              </UserProvider>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
