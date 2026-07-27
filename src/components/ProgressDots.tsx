/**
 * ProgressDots — the only "score" a child sees during a session: a row of gentle
 * dots. Completed = mint, current = enlarged sunshine, upcoming = white. All with
 * the brand navy outline. Defaults to a 5-step session (master plan §7.6).
 */
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

export interface ProgressDotsProps {
  /** Total steps in the session. */
  total?: number;
  /** 0-based index of the current step. */
  current: number;
  /** Diameter of a base dot. */
  size?: number;
}

export function ProgressDots({ total = 5, current, size = 20 }: ProgressDotsProps) {
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: Math.min(current, total) }}
      accessibilityLabel={`Find ${Math.min(current + 1, total)} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: done ? colors.success : now ? colors.reward : colors.softWhite,
                transform: [{ scale: now ? 1.25 : 1 }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dot: {
    borderWidth: 3,
    borderColor: colors.outline,
  },
});
