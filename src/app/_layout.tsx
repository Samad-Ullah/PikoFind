import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useSettings } from '@/store/useSettings';

/**
 * Root layout. A plain stack over the shell screens. Loads saved settings from
 * SQLite once on launch. Orientation is locked to landscape in app.json; the app
 * commits to one light palette, so there is no dark-mode theme provider.
 */
export default function RootLayout() {
  useEffect(() => {
    void useSettings.getState().hydrate();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
