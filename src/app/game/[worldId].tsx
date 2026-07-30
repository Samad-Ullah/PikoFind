/**
 * Game screen (master plan §12.6) — plays ONE level: its 10 find-it questions.
 * Full-screen scene of tappable objects, Piko's spoken instruction + replay, a
 * progress indicator, a sound toggle. No scores, timers, ads or settings here.
 *
 * All game logic lives in `useGameSession`; this screen reacts to `phase` to
 * drive audio (via the engine), Piko's pose + spoken reactions, feedback
 * animations and the short pauses between questions. On completion it saves the
 * level result (stars) and returns to the level map. Feedback stays kind.
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
import { SceneBackdrop } from '@/components/SceneBackdrop';
import { SceneObjectView } from '@/components/SceneObjectView';
import { BackIcon, ReplayIcon, SoundIcon, SoundOffIcon } from '@/components/icons';
import { getChallenges } from '@/content/levels';
import { getWorld } from '@/content/worlds';
import { audio } from '@/features/audio';
import { computeStars, currentChallenge, useGameSession } from '@/game/useGameSession';
import { useProgress } from '@/store/useProgress';
import { useSettings } from '@/store/useSettings';
import { colors, radius, shadowSm, spacing, typography } from '@/theme';

/** Piko's spoken reactions (device TTS until real recordings exist). */
const CORRECT_CHEERS = ['Yahoo!', 'Woohoo!', 'You did it!', 'Hooray!'];
const WRONG_NUDGES = ['Ohh! Try again.', 'Oops! Look again.', 'Almost! Try again.'];

/** Per-question rug tint so each scene looks a little different. */
const RUG_TINTS = [colors.skyBlue, colors.mintGreen, colors.coral, colors.playfulPurple, colors.sunshineYellow];

function pikoPoseFor(phase: string): PikoPose {
  if (phase === 'correct') return 'celebrating';
  if (phase === 'incorrect') return 'sad';
  if (phase === 'instruction') return 'speaking';
  return 'pointing';
}

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ worldId: string; level?: string }>();
  const world = getWorld(params.worldId);
  const levelNum = Math.max(1, Number(params.level) || 1);
  const challenges = useMemo(() => (world ? getChallenges(world.id, levelNum) : []), [world, levelNum]);
  const hasContent = challenges.length > 0;

  const session = useGameSession();
  const soundOn = useSettings((s) => s.soundOn);
  const toggleSound = useSettings((s) => s.toggleSound);
  const challenge = currentChallenge(session);
  const { phase, index, attempts, lastWrongId, highlightTarget, repeatToken } = session;

  // Start / tear down the level.
  useEffect(() => {
    if (!world || !hasContent) return;
    useGameSession.getState().start(world.id, levelNum, challenges);
    audio.playMusic(world.id);
    return () => {
      audio.stopMusic();
      audio.stopVoice();
      useGameSession.getState().reset();
    };
  }, [world, hasContent, challenges, levelNum]);

  // Speak the instruction, then open the question for tapping.
  useEffect(() => {
    if (phase !== 'instruction' || !challenge) return;
    let active = true;
    void audio.playVoice(challenge.instructionAudioKey, challenge.instructionText).then(() => {
      if (active) useGameSession.getState().instructionDone();
    });
    return () => {
      active = false;
    };
  }, [phase, challenge]);

  // Assistance auto-repeat of the instruction.
  useEffect(() => {
    if (repeatToken > 0 && challenge) void audio.playVoice(challenge.instructionAudioKey, challenge.instructionText);
  }, [repeatToken, challenge]);

  // Correct: Piko cheers out loud, then advance after a short pause.
  useEffect(() => {
    if (phase !== 'correct') return;
    audio.playSfx('correct');
    void audio.speak(CORRECT_CHEERS[index % CORRECT_CHEERS.length]);
    const t = setTimeout(() => useGameSession.getState().resolveCorrect(), 1500);
    return () => clearTimeout(t);
  }, [phase, index]);

  // Incorrect: a gentle "ohh, try again" (never shaming), then reopen.
  useEffect(() => {
    if (phase !== 'incorrect') return;
    audio.playSfx('wrong');
    void audio.speak(WRONG_NUDGES[attempts % WRONG_NUDGES.length]);
    const t = setTimeout(() => useGameSession.getState().resolveIncorrect(), 1300);
    return () => clearTimeout(t);
  }, [phase, attempts]);

  // Level finished → save stars, then show results. Guard against a stale
  // 'complete' left over from a previous level (only act on THIS level's run).
  useEffect(() => {
    if (phase !== 'complete' || !world) return;
    const st = useGameSession.getState();
    if (st.level !== levelNum || st.challenges.length === 0) return;
    const stars = computeStars(st.correctCount, st.totalAttempts);
    void useProgress.getState().recordResult(world.id, levelNum, stars);
    audio.stopMusic();
    router.replace({ pathname: '/results', params: { worldId: world.id, level: String(levelNum), stars: String(stars) } });
  }, [phase, world, levelNum, router]);

  const exit = () => {
    audio.stopMusic();
    audio.stopVoice();
    if (world) router.replace({ pathname: '/world/[worldId]', params: { worldId: world.id } });
    else router.replace('/worlds');
  };

  const replay = () => {
    if (challenge) void audio.playVoice(challenge.instructionAudioKey, challenge.instructionText);
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
        <Text style={styles.notice}>This level is coming very soon! 🎉</Text>
        <KidButton label="Back" variant="mint" onPress={exit} />
      </SafeAreaView>
    );
  }

  const canTap = phase === 'waiting';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: world.ground }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <IconButton label="Leave game" icon={<BackIcon />} onPress={exit} />
        <View style={styles.progress}>
          <Text style={styles.levelLabel}>
            Level {levelNum} · {index + 1}/{challenges.length}
          </Text>
          <ProgressDots total={challenges.length} current={index} size={14} />
        </View>
        <IconButton
          label={soundOn ? 'Turn sound off' : 'Turn sound on'}
          icon={soundOn ? <SoundIcon /> : <SoundOffIcon />}
          onPress={toggleSound}
        />
      </View>

      <View style={styles.instruction}>
        <PikoMascot pose={pikoPoseFor(phase)} size={92} />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText} numberOfLines={2}>
            {challenge?.instructionText}
          </Text>
        </View>
        <IconButton label="Hear it again" icon={<ReplayIcon />} onPress={replay} />
      </View>

      <ResponsiveScene backgroundColor={world.ground}>
        <SceneBackdrop floor="#F3E1BE" rug={RUG_TINTS[index % RUG_TINTS.length]} />
        {challenge?.objects.map((obj) => (
          <SceneItem key={obj.id} x={obj.x} y={obj.y} width={obj.width}>
            <SceneObjectView
              object={obj}
              onPress={(id) => useGameSession.getState().tap(id)}
              disabled={!canTap}
              wiggle={phase === 'incorrect' && lastWrongId === obj.id}
              highlighted={highlightTarget && canTap && challenge.targetObjectIds.includes(obj.id)}
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
  progress: { alignItems: 'center', gap: spacing.xs },
  levelLabel: { ...typography.caption, color: colors.darkNavy },
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
