/**
 * Game screen (master plan §12.6) — the finding game. A full-screen scene of
 * tappable objects, Piko's spoken instruction with a replay button, a
 * five-step progress indicator and a sound toggle. No scores, timers, ads or
 * settings in the child's view.
 *
 * All game logic lives in the `useGameSession` store; this screen reacts to its
 * `phase` to drive audio (via the engine), Piko's pose, feedback animations and
 * the short pauses between challenges. Feedback is always kind: a wrong tap
 * wiggles the object and Piko says "Good try", never a penalty.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { KidButton } from '@/components/KidButton';
import { PikoMascot, type PikoPose } from '@/components/PikoMascot';
import { ProgressDots } from '@/components/ProgressDots';
import { ResponsiveScene, SceneItem } from '@/components/ResponsiveScene';
import { SceneObjectView } from '@/components/SceneObjectView';
import { BackIcon, ReplayIcon, SoundIcon, SoundOffIcon } from '@/components/icons';
import { getLevels } from '@/content/levels';
import { getWorld } from '@/content/worlds';
import { audio } from '@/features/audio';
import { currentLevel, useGameSession } from '@/game/useGameSession';
import { useSettings } from '@/store/useSettings';
import { colors, radius, shadowSm, spacing, typography } from '@/theme';

/** Encouragement phrase played on a wrong tap (silent until recorded). */
const TRY_AGAIN_VOICE = 'feedback.try-again';

function pikoPoseFor(phase: string): PikoPose {
  if (phase === 'correct') return 'celebrating';
  if (phase === 'incorrect') return 'encouraging';
  if (phase === 'instruction') return 'speaking';
  return 'pointing';
}

export default function GameScreen() {
  const router = useRouter();
  const { worldId } = useLocalSearchParams<{ worldId: string }>();
  const world = getWorld(worldId);
  const levels = useMemo(() => (world ? getLevels(world.id) : []), [world]);
  const hasContent = levels.length > 0;

  const session = useGameSession();
  const soundOn = useSettings((s) => s.soundOn);
  const toggleSound = useSettings((s) => s.toggleSound);
  const level = currentLevel(session);
  const { phase, index, attempts, lastWrongId, highlightTarget, repeatToken } = session;

  // Start / tear down the session.
  useEffect(() => {
    if (!world || !hasContent) return;
    useGameSession.getState().start(world.id, levels);
    audio.playMusic(world.id);
    return () => {
      audio.stopMusic();
      audio.stopVoice();
    };
  }, [world, hasContent, levels]);

  // Speak the instruction, then open the level for tapping.
  useEffect(() => {
    if (phase !== 'instruction' || !level) return;
    let active = true;
    void audio.playVoice(level.instructionAudioKey).then(() => {
      if (active) useGameSession.getState().instructionDone();
    });
    return () => {
      active = false;
    };
  }, [phase, level]);

  // Assistance auto-repeat of the instruction.
  useEffect(() => {
    if (repeatToken > 0 && level) void audio.playVoice(level.instructionAudioKey);
  }, [repeatToken, level]);

  // Correct: celebrate, then advance after a short pause.
  useEffect(() => {
    if (phase !== 'correct') return;
    audio.playSfx('correct');
    const t = setTimeout(() => useGameSession.getState().resolveCorrect(), 1300);
    return () => clearTimeout(t);
  }, [phase, index]);

  // Incorrect: soft sound + "good try", then reopen the level.
  useEffect(() => {
    if (phase !== 'incorrect') return;
    audio.playSfx('wrong');
    void audio.playVoice(TRY_AGAIN_VOICE);
    const t = setTimeout(() => useGameSession.getState().resolveIncorrect(), 1100);
    return () => clearTimeout(t);
  }, [phase, attempts]);

  // Session finished → results.
  useEffect(() => {
    if (phase !== 'complete') return;
    audio.stopMusic();
    router.replace('/results');
  }, [phase, router]);

  const exit = () => {
    audio.stopMusic();
    audio.stopVoice();
    useGameSession.getState().reset();
    router.replace('/worlds');
  };

  const replay = () => {
    if (level) void audio.playVoice(level.instructionAudioKey);
  };

  if (!world) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.notice}>Hmm, that world isn’t here.</Text>
        <KidButton label="Back" variant="ghost" onPress={() => router.replace('/worlds')} />
      </SafeAreaView>
    );
  }

  if (!hasContent) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: world.ground }]}>
        <PikoMascot pose="thinking" size={150} />
        <Text style={styles.notice}>This world’s games are coming very soon! 🎉</Text>
        <KidButton label="Back" variant="mint" onPress={() => router.replace('/worlds')} />
      </SafeAreaView>
    );
  }

  const canTap = phase === 'waiting';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: world.ground }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <IconButton label="Leave game" icon={<BackIcon />} onPress={exit} />
        <ProgressDots total={levels.length} current={index} />
        <IconButton
          label={soundOn ? 'Turn sound off' : 'Turn sound on'}
          icon={soundOn ? <SoundIcon /> : <SoundOffIcon />}
          onPress={toggleSound}
        />
      </View>

      <View style={styles.instruction}>
        <PikoMascot pose={pikoPoseFor(phase)} size={96} />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText} numberOfLines={2}>
            {level?.instructionText}
          </Text>
        </View>
        <IconButton label="Hear it again" icon={<ReplayIcon />} onPress={replay} />
      </View>

      <ResponsiveScene backgroundColor={world.ground}>
        {level?.objects.map((obj) => (
          <SceneItem key={obj.id} x={obj.x} y={obj.y} width={obj.width}>
            <SceneObjectView
              object={obj}
              onPress={(id) => useGameSession.getState().tap(id)}
              disabled={!canTap}
              wiggle={phase === 'incorrect' && lastWrongId === obj.id}
              highlighted={highlightTarget && canTap && level.targetObjectIds.includes(obj.id)}
            />
          </SceneItem>
        ))}
      </ResponsiveScene>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, backgroundColor: colors.warmCream, padding: spacing.xl },
  notice: { ...typography.title, color: colors.darkNavy, textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  instruction: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xs },
  bubble: {
    flex: 1,
    backgroundColor: colors.softWhite,
    borderColor: colors.outline,
    borderWidth: 3,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    ...shadowSm,
  },
  bubbleText: { ...typography.instruction, fontSize: 22, color: colors.darkNavy },
});
