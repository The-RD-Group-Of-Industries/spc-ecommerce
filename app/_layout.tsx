import { CustomStatusBar } from "@/components/StatusBar";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CustomStatusBar />
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, headerTitle: 'INFO SPHERE', headerTitleAlign: 'center'}}/>
      <Stack.Screen name="custom-webview" options={{ headerShown: true, headerTitle: 'Info Sphere', headerShadowVisible: false, headerTitleStyle: {fontSize: 19, fontWeight: 800, fontFamily: 'sans-serif'}, headerTitleAlign: 'center'}}/>
    </Stack>
    </SafeAreaProvider>
  );
}