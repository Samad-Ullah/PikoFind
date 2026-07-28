/**
 * World introduction — Piko introduces the world (by voice, once audio lands in
 * Phase 3). Start / Repeat / Back. The finding game itself is Phase 4, so Start
 * currently shows a friendly "coming soon" note.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { KidButton } from '@/components/KidButton';
import { PikoMascot } from '@/components/PikoMascot';
import { BackIcon, ReplayIcon } from '@/components/icons';
import { getWorld } from '@/content/worlds';
import { colors, radius, shadowSm, spacing, typography } from '@/theme';

export default function WorldIntro() {
  const router = useRouter();
  const { worldId } = useLocalSearchParams<{ worldId: string }>();
  const world = getWorld(worldId);
  const [started, setStarted] = useState(false);

  if (!world) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Hmm, that world isn’t here.</Text>
        <KidButton label="Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: world.ground }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.headerRow}>
        <IconButton label="Back" icon={<BackIcon />} onPress={() => router.back()} />
      </View>

      <View style={styles.stage}>
        <PikoMascot pose={started ? 'celebrating' : 'speaking'} size={190} />
        <View style={styles.right}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>
              {started ? 'The finding game is coming very soon! 🎉' : `Welcome to ${world.title}! ${world.blurb} Listen and find with me.`}
            </Text>
          </View>
          <View style={styles.actions}>
            <IconButton label="Repeat" icon={<ReplayIcon />} onPress={() => {}} />
            <KidButton
              label={started ? 'Back' : 'Start'}
              variant={started ? 'ghost' : 'mint'}
              onPress={() => (started ? router.back() : setStarted(true))}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.warmCream, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  headerRow: { flexDirection: 'row' },
  title: { ...typography.title, color: colors.darkNavy, textAlign: 'center', margin: spacing.lg },
  stage: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  right: { flex: 1, maxWidth: 460, gap: spacing.lg },
  bubble: {
    backgroundColor: colors.softWhite,
    borderColor: colors.outline,
    borderWidth: 3,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadowSm,
  },
  bubbleText: { ...typography.instruction, fontSize: 22, color: colors.darkNavy },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
});
