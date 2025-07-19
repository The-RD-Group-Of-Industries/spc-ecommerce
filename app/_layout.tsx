import { CustomStatusBar } from "@/components/StatusBar";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'white' }}>
      <CustomStatusBar />
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, headerTitle: 'SPC ZONE', headerTitleAlign: 'center'}}/>
      <Stack.Screen name="custom-webview" options={{ headerShown: true, headerTitle: 'SPC ZONE', headerShadowVisible: false, headerTitleStyle: {fontSize: 19, fontWeight: 800, fontFamily: 'sans-serif'}, headerTitleAlign: 'center'}}/>
    </Stack>
    </SafeAreaProvider>
  );
}