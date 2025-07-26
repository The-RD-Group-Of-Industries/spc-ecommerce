import { Text, View, BackHandler, Image, KeyboardAvoidingView, Platform } from "react-native";
import WebView from "react-native-webview";
import * as Network from "expo-network";
import { useEffect, useRef, useState } from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Index() {
  const [isConnected, setIsConnected]: any = useState(null);
  const [splash, setSplash] = useState<boolean>(true);
  const router = useRouter();
  
  useEffect(() => {
    const checkNetwork = async () => {
      const networkstatus = await Network.getNetworkStateAsync();
      setIsConnected(networkstatus.isConnected);
    };
    checkNetwork();
  }, []);
  
  const webViewRef: any = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  
  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [canGoBack]);
  
  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 2000);
  }, []);
  
  const insets = useSafeAreaInsets();
  
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={{ 
        flex: 1, 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom, 
        backgroundColor: "white" 
      }}>
        {splash ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("@/assets/images/splashscreen.png")}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </View>
        ) : isConnected ? (
          <WebView
            ref={webViewRef}
            source={{ uri: "https://path-ecommerce-pwtg.vercel.app" }}
            onNavigationStateChange={(navState) =>
              setCanGoBack(navState.canGoBack)
            }
            onShouldStartLoadWithRequest={(request) => {
              const url = request.url;
              const host = new URL(url).host;
              if (host !== "path-ecommerce-pwtg.vercel.app") {
                setTimeout(() => {
                  router.push({
                    pathname: "/custom-webview",
                    params: { url },
                  });
                }, 0);
                return false;
              }
              return true;
            }}
            // Additional props for better keyboard handling
            automaticallyAdjustContentInsets={false}
            keyboardDisplayRequiresUserAction={false}
            hideKeyboardAccessoryView={true}
            // Inject JavaScript to handle focus events
            injectedJavaScript={`
              (function() {
                function adjustForKeyboard() {
                  const activeElement = document.activeElement;
                  if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    setTimeout(() => {
                      activeElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                      });
                    }, 300);
                  }
                }
                
                document.addEventListener('focusin', adjustForKeyboard);
                document.addEventListener('touchstart', function(e) {
                  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    setTimeout(adjustForKeyboard, 300);
                  }
                });
              })();
              true;
            `}
          />
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Fontisto name="broken-link" size={45} color="black" />
            <Text style={{ marginTop: "5%", fontSize: 23 }}>
              You're <Text style={{ color: "red" }}>not</Text> connected to the
              internet.
            </Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}