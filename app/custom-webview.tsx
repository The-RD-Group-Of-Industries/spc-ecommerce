import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import WebView from "react-native-webview";

export default function CustomWebView() {
  const { url } = useLocalSearchParams<{ url: string }>();

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: url }} />
    </View>
  );
}
