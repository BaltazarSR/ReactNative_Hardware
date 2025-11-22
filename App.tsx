import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';

export default function App() {

  const [loaded, error] = useFonts({
    'StackSans-ExtraLight': require('./assets/fonts/StackSansText-ExtraLight.ttf'),
    'StackSans-Light': require('./assets/fonts/StackSansText-Light.ttf'),
    'StackSans-Regular': require('./assets/fonts/StackSansText-Regular.ttf'),
    'StackSans-Medium': require('./assets/fonts/StackSansText-Medium.ttf'),
    'StackSans-SemiBold': require('./assets/fonts/StackSansText-SemiBold.ttf'),
    'StackSans-Bold': require('./assets/fonts/StackSansText-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const requestPermissions = async () => {
      // Request location permissions
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        console.warn('Location permission not granted');
      }

      // Request motion sensor permissions
      const { status: motionStatus } = await Pedometer.requestPermissionsAsync();
      if (motionStatus !== 'granted') {
        console.warn('Motion sensor permission not granted');
      }
    };

    requestPermissions();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
}