import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomStatusBar() {
  const insets = useSafeAreaInsets();
  
  return (
    <View>
      <View 
        style={{
          height: insets.top,
          backgroundColor: '#090015'
        }} 
        />
      <StatusBar style="light" />
    </View>
  );
}
