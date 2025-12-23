import { Stack } from "expo-router";
import { useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { AppProvider } from "../contexts/AppContext";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AppProvider>
      {isLoading ? (
        <LoadingScreen onLoadComplete={() => setIsLoading(false)} />
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </AppProvider>
  );
}
