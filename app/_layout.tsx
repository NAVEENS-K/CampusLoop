import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { AppStoreProvider } from "@/data/AppStore";

export default function Layout() {
  return (
    <AppStoreProvider>
      <View style={{ flex: 1, backgroundColor: "#F4F5F7" }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </AppStoreProvider>
  );
}