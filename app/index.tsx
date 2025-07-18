import React, { JSX, useEffect, useRef, useState } from "react";
import { BackHandler, View } from "react-native";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";

export default function Index(): JSX.Element {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>("https://path-ecommerce-pwtg.vercel.app/");

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [canGoBack]);

  // Deep link handler
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { hostname, queryParams } = Linking.parse(event.url);

      if (hostname === "auth-callback" && queryParams?.token) {
        // Inject token into your webview session
        const token = queryParams.token as string;
        setWebUrl(`https://path-ecommerce-pwtg.vercel.app/auth/callback?token=${token}`);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: webUrl }}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url;

          if (
            url.startsWith("https://accounts.google.com/") ||
            url.includes("oauth2") ||
            url.includes("google.com/signin")
          ) {
            Linking.openURL(url);
            return false;
          }

          return true;
        }}
      />
    </View>
  );
}
