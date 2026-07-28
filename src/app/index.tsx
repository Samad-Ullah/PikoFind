/**
 * Splash — brief branded entry with one Piko movement, then hands off to Home.
 * (Native splash config lives in app.json; this is the short in-app moment.)
 */
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PikoMascot } from '@/components/PikoMascot';
import { colors, spacing, typography } from '@/theme';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/home'), 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.root}>
      <PikoMascot pose="idle" size={168} />
      <Text style={styles.wordmark}>
        Piko<Text style={styles.find}>Find</Text>
      </Text>
      <Text style={styles.tagline}>Listen, look and find!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.skyBlue,
    gap: spacing.sm,
  },
  wordmark: { ...typography.display, color: colors.darkNavy },
  find: { color: colors.softWhite },
  tagline: { ...typography.instruction, color: colors.darkNavy, opacity: 0.85 },
});
