/**
 * TEMPORARY component gallery (Phase 1). Not a real screen — it exists to verify
 * the design tokens and components render and scale correctly in landscape on
 * phone and tablet. It is replaced by the real Home screen in Phase 2.
 */
import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { KidButton } from '@/components/KidButton';
import { PikoMascot, type PikoPose } from '@/components/PikoMascot';
import { ProgressDots } from '@/components/ProgressDots';
import { ResponsiveScene, SceneItem } from '@/components/ResponsiveScene';
import {
  BackIcon,
  HeartIcon,
  ParentIcon,
  ReplayIcon,
  SoundIcon,
  SoundOffIcon,
  StarIcon,
} from '@/components/icons';
import { colors, radius, shadowSm, spacing, typography } from '@/theme';

const SWATCHES: { name: string; hex: string; dark?: boolean }[] = [
  { name: 'Sky', hex: colors.skyBlue },
  { name: 'Sunshine', hex: colors.sunshineYellow },
  { name: 'Coral', hex: colors.coral },
  { name: 'Mint', hex: colors.mintGreen },
  { name: 'Purple', hex: colors.playfulPurple },
  { name: 'Cream', hex: colors.warmCream },
  { name: 'Navy', hex: colors.darkNavy, dark: true },
  { name: 'Grey-blue', hex: colors.greyBlue },
];

const POSES: PikoPose[] = [
  'idle',
  'speaking',
  'listening',
  'pointing',
  'celebrating',
  'thinking',
  'encouraging',
  'flying',
  'star',
  'sleeping',
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function ComponentGallery() {
  const router = useRouter();
  const [stars, setStars] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [step, setStep] = useState(2);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <KidButton label="← Home" variant="ghost" onPress={() => router.replace('/home')} />
        <Text style={styles.h1}>
          Piko<Text style={{ color: colors.skyBlue }}>Find</Text> · Component Gallery
        </Text>
        <Text style={styles.sub}>Phase 1 design-system foundation — temporary dev screen.</Text>

        <Section title="Colour">
          <View style={styles.swatchRow}>
            {SWATCHES.map((s) => (
              <View key={s.name} style={styles.swatch}>
                <View style={[styles.swatchChip, { backgroundColor: s.hex }]} />
                <Text style={styles.swatchName}>{s.name}</Text>
                <Text style={styles.swatchHex}>{s.hex}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Typography">
          <View style={styles.card}>
            <Text style={typography.title}>Screen title</Text>
            <Text style={typography.instruction}>Find the yellow star</Text>
            <Text style={typography.body}>Great job! You found it. Here is a sticker.</Text>
            <Text style={[typography.parent, { color: colors.textSoft }]}>Parent · Restore purchase</Text>
            <Text style={[typography.caption, { color: colors.premium }]}>World 1 · Playroom</Text>
          </View>
        </Section>

        <Section title="KidButton">
          <View style={styles.rowWrap}>
            <KidButton label="Play" size="play" icon={<StarIcon size={26} />} onPress={() => setStars((n) => n + 1)} />
            <KidButton label="Start" variant="sky" onPress={() => {}} />
            <KidButton label="Next" variant="mint" onPress={() => {}} />
            <KidButton label="Unlock" variant="purple" onPress={() => {}} />
            <KidButton label="Back" variant="ghost" onPress={() => {}} />
            <KidButton label="Locked" disabled />
          </View>
          <View style={styles.starTally}>
            <StarIcon size={26} />
            <Text style={[typography.instruction, { color: colors.text }]}>{stars}</Text>
            <Text style={[typography.body, { color: colors.textSoft }]}>tap Play to earn a star</Text>
          </View>
        </Section>

        <Section title="IconButton">
          <View style={styles.rowWrap}>
            <IconButton
              label={soundOn ? 'Sound on' : 'Sound off'}
              variant={soundOn ? 'on' : 'default'}
              icon={soundOn ? <SoundIcon /> : <SoundOffIcon />}
              onPress={() => setSoundOn((v) => !v)}
            />
            <IconButton label="Repeat" icon={<ReplayIcon />} onPress={() => {}} />
            <IconButton label="Back" icon={<BackIcon />} onPress={() => {}} />
            <IconButton label="Parent area" icon={<ParentIcon />} onPress={() => {}} />
            <IconButton label="Encourage" variant="coral" icon={<HeartIcon color={colors.softWhite} />} onPress={() => {}} />
          </View>
        </Section>

        <Section title="ProgressDots — find 5">
          <View style={styles.rowWrap}>
            <ProgressDots current={step} />
            <KidButton
              label="Advance"
              variant="sky"
              onPress={() => setStep((s) => (s >= 5 ? 0 : s + 1))}
            />
          </View>
        </Section>

        <Section title="Piko — 10 poses">
          <View style={styles.poseWrap}>
            {POSES.map((p) => (
              <View key={p} style={styles.poseTile}>
                <PikoMascot pose={p} size={92} />
                <Text style={styles.poseLabel}>{p}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="ResponsiveScene — normalized 0..1 placement">
          <View style={styles.sceneHost}>
            <ResponsiveScene backgroundColor="#E8F8FC">
              <SceneItem x={0.2} y={0.62} width={0.18}>
                <PikoMascot pose="pointing" size={110} />
              </SceneItem>
              <SceneItem x={0.55} y={0.4} width={0.1}>
                <StarIcon size={54} />
              </SceneItem>
              <SceneItem x={0.78} y={0.66} width={0.1}>
                <HeartIcon size={54} />
              </SceneItem>
              <View style={styles.bubble}>
                <Text style={styles.bubbleText}>Can you find the star?</Text>
              </View>
              <View style={styles.dotsOverlay}>
                <ProgressDots current={1} size={12} />
              </View>
            </ResponsiveScene>
          </View>
        </Section>

        <Text style={styles.footer}>Listen, look and find! 🦜</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, gap: spacing.xl, paddingBottom: spacing.xxxl },
  h1: { ...typography.title, color: colors.text },
  sub: { ...typography.body, color: colors.textSoft, marginTop: -spacing.md },
  section: { gap: spacing.md },
  sectionTitle: { ...typography.caption, color: colors.premium },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.outline,
    borderWidth: 3,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadowSm,
  },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, alignItems: 'center' },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  swatch: {
    width: 96,
    borderRadius: radius.md,
    borderWidth: 3,
    borderColor: colors.outline,
    overflow: 'hidden',
    backgroundColor: colors.card,
    ...shadowSm,
  },
  swatchChip: { height: 52 },
  swatchName: { ...typography.body, fontSize: 13, paddingHorizontal: spacing.sm, paddingTop: spacing.xs },
  swatchHex: { fontSize: 11, color: colors.textSoft, paddingHorizontal: spacing.sm, paddingBottom: spacing.xs },
  starTally: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  poseWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  poseTile: {
    width: 104,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 3,
    borderColor: colors.outline,
    borderRadius: radius.md,
    paddingTop: spacing.sm,
    ...shadowSm,
  },
  poseLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSoft,
    width: '100%',
    textAlign: 'center',
    backgroundColor: colors.warmCream,
    borderTopWidth: 2,
    borderTopColor: colors.hairline,
    paddingVertical: spacing.xs,
    marginTop: spacing.xs,
  },
  sceneHost: { height: 260 },
  bubble: {
    position: 'absolute',
    left: '5%',
    top: '8%',
    backgroundColor: colors.softWhite,
    borderColor: colors.outline,
    borderWidth: 3,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleText: { ...typography.body, fontWeight: '800', color: colors.text },
  dotsOverlay: { position: 'absolute', right: '5%', top: '10%' },
  footer: { ...typography.body, color: colors.textSoft, textAlign: 'center', marginTop: spacing.lg },
});
