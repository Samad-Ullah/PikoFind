/**
 * Session results (master plan §12.9) — a warm, low-pressure wrap-up: Piko
 * celebrates, the stars earned this session are shown, and the child can play
 * again or go home. No big-number scores, no comparison, no failure framing.
 * (Persisting stars/stickers to the profile is Phase 6.)
 */
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KidButton } from '@/components/KidButton';
import { PikoMascot } from '@/components/PikoMascot';
import { StarIcon } from '@/components/icons';
import { audio } from '@/features/audio';
import { useGameSession } from '@/game/useGameSession';
import { colors, spacing, typography } from '@/theme';

export default function Results() {
  const router = useRouter();
  const worldId = useGameSession((s) => s.worldId);
  const starsEarned = useGameSession((s) => s.starsEarned);
  const total = useGameSession((s) => s.levels.length);

  useEffect(() => {
    audio.playSfx('sticker');
  }, []);

  const goHome = () => {
    useGameSession.getState().reset();
    router.replace('/home');
  };

  const playAgain = () => {
    if (!worldId) {
      goHome();
      return;
    }
    router.replace({ pathname: '/game/[worldId]', params: { worldId } });
  };

  const starCount = Math.max(total, 1);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <PikoMascot pose="celebrating" size={180} />
      <Text style={styles.title}>Great finding!</Text>

      <View style={styles.stars}>
        {Array.from({ length: starCount }, (_, i) => (
          <View key={i} style={{ opacity: i < starsEarned ? 1 : 0.22 }}>
            <StarIcon size={44} />
          </View>
        ))}
      </View>
      <Text style={styles.count}>
        You earned {starsEarned} {starsEarned === 1 ? 'star' : 'stars'}!
      </Text>

      <View style={styles.actions}>
        <KidButton label="Play again" variant="mint" size="play" onPress={playAgain} />
        <KidButton label="Home" variant="ghost" onPress={goHome} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.warmCream,
    padding: spacing.xl,
  },
  title: { ...typography.display, fontSize: 40, color: colors.darkNavy },
  stars: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  count: { ...typography.instruction, color: colors.textSoft },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.md },
});
