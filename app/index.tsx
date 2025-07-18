import React, { JSX, useEffect, useRef, useState } from "react";
import { BackHandler, View, Alert, Text, Image } from "react-native";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";
import * as Network from "expo-network";
import Fontisto from "@expo/vector-icons/Fontisto";

export default function Index(): JSX.Element {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [webViewReady, setWebViewReady] = useState<boolean>(false);
  const [connected, setIsConnected] = useState<any>(null)
  const [splash, setSplash] = useState<boolean>(true);


    useEffect(() => {
    const checkNetwork = async function () {
      const networkstatus = await Network.getNetworkStateAsync();
      setIsConnected(networkstatus.isConnected);
    };

    checkNetwork();
  }, []);
  const initialWebUrl = "https://path-ecommerce-pwtg.vercel.app/";
  // const initialWebUrl = "http://localhost:5173";
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

  // Enhanced deep link handler
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      console.log("Deep link received:", event.url);
      
      try {
        const { path, queryParams } = Linking.parse(event.url);
        console.log("Parsed path:", path);
        console.log("Parsed queryParams:", queryParams);
        
        if (path === "auth-callback" && queryParams?.token) {
          const token = queryParams.token as string;
          console.log("Token received:", token);

          // Wait for WebView to be ready before sending message
          const sendTokenToWebView = () => {
            if (webViewRef.current) {
              const message = JSON.stringify({
                type: "auth",
                token: token,
              });
              
              console.log("Sending message to WebView:", message);
              webViewRef.current.postMessage(message);
              
              Alert.alert("Success", "Authentication token sent to WebView");
            } else {
              console.error("WebView ref not available");
            }
          };

          // Send immediately if WebView is ready, otherwise wait
          if (webViewReady) {
            sendTokenToWebView();
          } else {
            // Wait for WebView to be ready
            setTimeout(sendTokenToWebView, 1000);
          }
        } else {
          console.log("Deep link does not match expected format");
        }
      } catch (error) {
        console.error("Error parsing deep link:", error);
        Alert.alert("Error", "Failed to parse authentication callback");
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    
    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("App opened with URL:", url);
        handleDeepLink({ url });
      }
    });

    return () => subscription.remove();
  }, [webViewReady]);

    useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 2000);
  }, [])

  return splash ? (<View style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column'}}>
        <Image source={require('@/assets/images/splashscreen.png')} style={{objectFit: 'cover', width: '100%', height: '100%'}}/>
      </View>) : connected ? (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: initialWebUrl }}
        onNavigationStateChange={(navState) => {
          console.log("Navigation state changed:", navState.url);
          setCanGoBack(navState.canGoBack);
        }}
        onMessage={(event) => {
          console.log("Message from WebView:", event.nativeEvent.data);
          
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "webview_ready") {
              console.log("WebView is ready to receive messages");
              setWebViewReady(true);
            }
          } catch (error) {
            console.log("Non-JSON message from WebView:", event.nativeEvent.data);
          }
        }}
        onShouldStartLoadWithRequest={(request) => {
          const url = request.url;
          console.log("Should start load with request:", url);

          // Handle Google OAuth redirects
          if (
            url.startsWith("https://accounts.google.com/") ||
            url.includes("oauth2") ||
            url.includes("google.com/signin") ||
            url.includes("accounts.google.com")
          ) {
            console.log("Opening Google Auth in system browser:", url);
            Linking.openURL(url);
            return false;
          }

          // Handle your app's deep links
          if (url.startsWith("spc://")) {
            console.log("Handling deep link:", url);
            return false;
          }

          return true;
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView error:", nativeEvent);
        }}
        onLoadStart={() => {
          console.log("WebView started loading");
        }}
        onLoadEnd={() => {
          console.log("WebView finished loading");
          setWebViewReady(true);
        }}
        // Enable JavaScript
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        // Allow mixed content for development
        mixedContentMode="always"
        // Enable third-party cookies for OAuth
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
      />
    </View>
  ) : (
    <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <Fontisto name="broken-link" size={45} color="black" />
          <Text style={{ marginTop: "5%",  textAlign: 'center', fontSize: 23 }}>
            You're <Text style={{ color: "red" }}>not connected</Text> to the
            internet.
          </Text>
        </View>
  );
}