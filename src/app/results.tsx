/**
 * Level results (master plan §12.9) — a warm, low-pressure wrap-up after a level:
 * Piko celebrates, the level's star rating (1–3) is shown, and the child can
 * continue (back to the level map, where the next level is now unlocked) or
 * replay the level. No big-number scores, no comparison, no failure framing.
 * The stars were already saved by the game screen on completion.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KidButton } from '@/components/KidButton';
import { PikoMascot } from '@/components/PikoMascot';
import { StarIcon } from '@/components/icons';
import { audio } from '@/features/audio';
import { colors, spacing, typography } from '@/theme';

export default function Results() {
  const router = useRouter();
  const params = useLocalSearchParams<{ worldId?: string; level?: string; stars?: string }>();
  const worldId = params.worldId;
  const level = Math.max(1, Number(params.level) || 1);
  const stars = Math.max(0, Math.min(3, Number(params.stars) || 0));

  useEffect(() => {
    audio.playSfx('sticker');
    void audio.speak('Great job!');
  }, []);

  const toMap = () => {
    if (worldId) router.replace({ pathname: '/world/[worldId]', params: { worldId } });
    else router.replace('/worlds');
  };

  const playAgain = () => {
    if (worldId) router.replace({ pathname: '/game/[worldId]', params: { worldId, level: String(level) } });
    else toMap();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.row}>
        <PikoMascot pose="celebrating" size={150} />
        <View style={styles.panel}>
          <Text style={styles.title}>Level {level} done!</Text>
          <View style={styles.stars}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ opacity: i < stars ? 1 : 0.22 }}>
                <StarIcon size={48} />
              </View>
            ))}
          </View>
          <View style={styles.actions}>
            <KidButton label="Continue" variant="mint" size="play" onPress={toMap} />
            <KidButton label="Play again" variant="ghost" onPress={playAgain} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warmCream,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xxl },
  panel: { alignItems: 'center', gap: spacing.md, maxWidth: 460 },
  title: { ...typography.display, fontSize: 34, color: colors.darkNavy },
  stars: { flexDirection: 'row', gap: spacing.sm },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.xs },
});
