import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * Root layout. A plain stack for now — the real application shell (splash,
 * onboarding, home, worlds, parent area) arrives in Phase 2. Orientation is
 * locked to landscape in app.json. The app commits to one light palette, so
 * there is no dark-mode theme provider.
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
