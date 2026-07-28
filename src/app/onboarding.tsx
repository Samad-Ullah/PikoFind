/**
 * First-launch parent introduction (master plan §7.2). Shown once — after "Start
 * PikoFind" the `onboarded` flag is saved so it never reappears. This screen is
 * for the grown-up, not the child.
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KidButton } from '@/components/KidButton';
import { PikoMascot } from '@/components/PikoMascot';
import { setBoolSetting } from '@/db/settings';
import { colors, radius, shadowSm, spacing, typography } from '@/theme';

const POINTS = [
  'Made for children aged 4–7.',
  'Works fully offline — no internet needed.',
  'No account, and no personal information is collected.',
  'Sound matters — please turn the volume on.',
  'The first world is free; more unlock in the parent area.',
];

export default function Onboarding() {
  const router = useRouter();

  const start = async () => {
    await setBoolSetting('onboarded', true);
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.row}>
        <PikoMascot pose="speaking" size={160} />
        <View style={styles.card}>
          <Text style={styles.title}>Hello, grown-ups 👋</Text>
          {POINTS.map((p) => (
            <View key={p} style={styles.point}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.pointText}>{p}</Text>
            </View>
          ))}
          <KidButton label="Start PikoFind" size="play" onPress={start} style={styles.cta} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.warmCream, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl },
  card: {
    flex: 1,
    maxWidth: 560,
    backgroundColor: colors.softWhite,
    borderColor: colors.outline,
    borderWidth: 3,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    ...shadowSm,
  },
  title: { ...typography.title, color: colors.darkNavy, marginBottom: spacing.xs },
  point: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  bullet: { ...typography.body, color: colors.skyBlue, fontWeight: '900' },
  pointText: { ...typography.body, color: colors.textSoft, flex: 1 },
  cta: { marginTop: spacing.md },
});
