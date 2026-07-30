import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { audio } from '@/features/audio';
import { useSettings } from '@/store/useSettings';

/**
 * Root layout. A plain stack over the shell screens. Loads saved settings from
 * SQLite once on launch, then starts the audio engine (it reads those settings
 * live, so hydrate first to avoid a flash of music when sound is off).
 * Orientation is locked to landscape in app.json; the app commits to one light
 * palette, so there is no dark-mode theme provider.
 */
export default function RootLayout() {
  useEffect(() => {
    void useSettings.getState().hydrate().finally(() => audio.init());
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
    </SafeAreaProvider>
  );
}
