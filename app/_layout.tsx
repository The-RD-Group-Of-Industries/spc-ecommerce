import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, headerTitle: 'INFO SPHERE', headerTitleAlign: 'center'}}/>
      <Stack.Screen name="custom-webview" options={{ headerShown: true, headerTitle: 'Info Sphere', headerShadowVisible: false, headerTitleStyle: {fontSize: 19, fontWeight: 800, fontFamily: 'sans-serif'}, headerTitleAlign: 'center'}}/>
    </Stack>
  );
}