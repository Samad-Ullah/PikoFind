/**
 * World selection — three large cards. Locked (premium) worlds stay visible with
 * a lock and route to the parent gate before any purchase (master plan §7.4),
 * never a hard sell in the child's face.
 */
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { PikoMascot, type PikoPose } from '@/components/PikoMascot';
import { BackIcon, LockIcon } from '@/components/icons';
import { WORLDS, type WorldId } from '@/content/worlds';
import { colors, radius, shadowSm, spacing, typography } from '@/theme';

const POSE_FOR: Record<WorldId, PikoPose> = {
  playroom: 'pointing',
  garden: 'idle',
  classroom: 'thinking',
};

export default function Worlds() {
  const router = useRouter();

  const openWorld = (id: WorldId, premium: boolean) => {
    if (premium) {
      router.push('/parent/gate');
    } else {
      router.push({ pathname: '/world/[worldId]', params: { worldId: id } });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <IconButton label="Back" icon={<BackIcon />} onPress={() => router.back()} />
        <Text style={styles.title}>Choose a world</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.row}>
        {WORLDS.map((w) => (
          <Pressable
            key={w.id}
            accessibilityRole="button"
            accessibilityLabel={`${w.title}${w.premium ? ', locked' : ''}`}
            onPress={() => openWorld(w.id, w.premium)}
            style={({ pressed }) => [styles.card, { backgroundColor: w.ground }, pressed && styles.pressed]}
          >
            {w.premium && (
              <View style={styles.lock}>
                <LockIcon size={16} color={colors.darkNavy} />
              </View>
            )}
            <View style={styles.cardArt}>
              <PikoMascot pose={POSE_FOR[w.id]} size={96} />
            </View>
            <View style={styles.cardCaption}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {w.title}
              </Text>
              <Text style={styles.cardBlurb} numberOfLines={2}>
                {w.blurb}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.warmCream, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...typography.title, color: colors.darkNavy },
  spacer: { width: 64 },
  row: { flex: 1, flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.lg },
  card: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.outline,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...shadowSm,
  },
  pressed: { transform: [{ translateY: 3 }] },
  lock: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.outline,
    backgroundColor: colors.softWhite,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  cardArt: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.md },
  cardCaption: {
    width: '100%',
    backgroundColor: colors.softWhite,
    borderTopWidth: 3,
    borderTopColor: colors.outline,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 2,
  },
  cardTitle: { ...typography.body, fontWeight: '900', fontSize: 16, color: colors.darkNavy },
  cardBlurb: { ...typography.body, fontSize: 13, color: colors.textSoft },
});
