import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { ActivityIndicator, Appearance, Platform, SafeAreaView, View } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'

import '~/global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

//auth
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

WebBrowser.maybeCompleteAuthSession()

export function InitialLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { isLoaded, isSignedIn } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  usePlatformSpecificSetup();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    if (!isLoaded) return;

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(dashboard)');
    } else if (!isSignedIn) {
      router.replace('/(auth)/login');
    }
  }, [isSignedIn, isLoaded]);


  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name='(auth)/login'
          options={{
            title: 'Starter Base',
            headerRight: () => <ThemeToggle />
          }}
        />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  )

}

export default function RootLayout() {

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>

  )
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    // Adds the background color to the html element to prevent white background on overscroll.
    document.documentElement.classList.add('bg-background');
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? 'light');
  }, []);
}

function noop() { }
