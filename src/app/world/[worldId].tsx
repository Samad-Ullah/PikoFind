/**
 * Level map (Duolingo-style) for a world. A scrolling zig-zag path of level
 * nodes: completed levels show their stars, the current level is highlighted and
 * playable, later levels are locked until the one before is finished. Progress
 * is loaded from (and kept in) the persistent progress store.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { KidButton } from '@/components/KidButton';
import { PikoMascot } from '@/components/PikoMascot';
import { BackIcon, LockIcon, StarIcon } from '@/components/icons';
import { getLevelCount, getLevelName } from '@/content/levels';
import { getWorld } from '@/content/worlds';
import { isLevelUnlocked, useProgress } from '@/store/useProgress';
import { colors, shadow, spacing, typography } from '@/theme';

/** Horizontal offsets that make the path gently zig-zag. */
const OFFSETS = [0, 68, 0, -68];
const NODE = 84;

export default function LevelMap() {
  const router = useRouter();
  const { worldId } = useLocalSearchParams<{ worldId: string }>();
  const world = getWorld(worldId);
  const results = useProgress((s) => (world ? s.byWorld[world.id] : undefined)) ?? {};

  useEffect(() => {
    if (world) void useProgress.getState().hydrateWorld(world.id);
  }, [world]);

  if (!world) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.title}>Hmm, that world isn’t here.</Text>
        <KidButton label="Back" variant="ghost" onPress={() => router.replace('/worlds')} />
      </SafeAreaView>
    );
  }

  const count = getLevelCount(world.id);
  const levels = Array.from({ length: count }, (_, i) => i + 1);
  const currentLevel = levels.find((n) => isLevelUnlocked(results, n) && !results[n]?.completed) ?? count;
  const totalStars = Object.values(results).reduce((sum, r) => sum + (r?.stars ?? 0), 0);

  const openLevel = (n: number) => {
    router.push({ pathname: '/game/[worldId]', params: { worldId: world.id, level: String(n) } });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: world.ground }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <IconButton label="Back to worlds" icon={<BackIcon />} onPress={() => router.replace('/worlds')} />
        <Text style={styles.worldTitle} numberOfLines={1}>
          {world.title}
        </Text>
        <View style={styles.starTotal}>
          <StarIcon size={22} />
          <Text style={styles.starTotalText}>{totalStars}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.path} showsVerticalScrollIndicator={false}>
        {levels.map((n) => {
          const res = results[n];
          const completed = res?.completed === true;
          const locked = !isLevelUnlocked(results, n);
          const isCurrent = n === currentLevel;
          const offset = OFFSETS[(n - 1) % OFFSETS.length];

          const face = locked ? colors.disabled : completed ? colors.mintGreen : colors.sunshineYellow;

          return (
            <View key={n} style={[styles.nodeRow, { transform: [{ translateX: offset }] }]}>
              <View style={styles.nodeCol}>
                {completed && (
                  <View style={styles.starsRow}>
                    {[0, 1, 2].map((i) => (
                      <View key={i} style={{ opacity: i < (res?.stars ?? 0) ? 1 : 0.25 }}>
                        <StarIcon size={18} />
                      </View>
                    ))}
                  </View>
                )}
                {isCurrent && <PikoMascot pose="pointing" size={64} />}
                <Pressable
                  onPress={() => openLevel(n)}
                  disabled={locked}
                  accessibilityRole="button"
                  accessibilityLabel={locked ? `Level ${n}, ${getLevelName(world.id, n)}, locked` : `Level ${n}, ${getLevelName(world.id, n)}`}
                  style={[styles.node, { backgroundColor: face }, isCurrent && styles.nodeCurrent]}
                >
                  {locked ? (
                    <LockIcon size={30} color={colors.disabledText} />
                  ) : (
                    <Text style={styles.nodeNum}>{n}</Text>
                  )}
                </Pressable>
                <Text style={[styles.nodeName, locked && styles.nodeNameLocked]} numberOfLines={1}>
                  {getLevelName(world.id, n)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, backgroundColor: colors.warmCream, padding: spacing.xl },
  title: { ...typography.title, color: colors.darkNavy, textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  worldTitle: { ...typography.title, fontSize: 22, color: colors.darkNavy, flex: 1, textAlign: 'center' },
  starTotal: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  starTotalText: { ...typography.button, fontSize: 20, color: colors.darkNavy },
  path: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.xl },
  nodeRow: { alignItems: 'center' },
  nodeCol: { alignItems: 'center', gap: spacing.xs },
  starsRow: { flexDirection: 'row', gap: 3 },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  nodeCurrent: { borderColor: colors.coral },
  nodeNum: { ...typography.display, fontSize: 34, color: colors.darkNavy },
  nodeName: { ...typography.caption, color: colors.darkNavy, maxWidth: 160, textAlign: 'center' },
  nodeNameLocked: { color: colors.disabledText },
});
