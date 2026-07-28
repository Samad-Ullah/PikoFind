/**
 * Parent gate — an adult-verification barrier before the parent area (master
 * plan §7.11). A simple multiplication a four-year-old can't solve. (A press-and-
 * hold entry step is a planned refinement.) Solve → parent settings.
 */
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { BackIcon } from '@/components/icons';
import { colors, radius, shadow, spacing, typography } from '@/theme';

/** Two single digits in 3..9 — product is always two-plus digits, never trivial. */
function makeQuestion() {
  const rand = () => 3 + Math.floor(Math.random() * 7);
  const a = rand();
  const b = rand();
  return { a, b, answer: a * b };
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'enter'] as const;

export default function ParentGate() {
  const router = useRouter();
  const [q, setQ] = useState(makeQuestion);
  const [entry, setEntry] = useState('');
  const [wrong, setWrong] = useState(false);

  const press = (key: (typeof KEYS)[number]) => {
    setWrong(false);
    if (key === 'clear') {
      setEntry('');
    } else if (key === 'enter') {
      if (Number(entry) === q.answer) {
        router.replace('/parent/settings');
      } else {
        setWrong(true);
        setEntry('');
        setQ(makeQuestion());
      }
    } else if (entry.length < 3) {
      setEntry((e) => e + key);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.headerRow}>
        <IconButton label="Back" icon={<BackIcon />} onPress={() => router.back()} />
      </View>

      <View style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Ask a grown-up</Text>
          <Text style={styles.question}>
            {q.a} × {q.b} = ?
          </Text>
          <View style={[styles.display, wrong && styles.displayWrong]}>
            <Text style={styles.displayText}>{entry || '—'}</Text>
          </View>
          {wrong && <Text style={styles.wrongText}>Not quite — try again.</Text>}
        </View>

        <View style={styles.keypad}>
          {KEYS.map((k) => (
            <Pressable
              key={k}
              accessibilityRole="button"
              accessibilityLabel={k === 'enter' ? 'Enter' : k === 'clear' ? 'Clear' : k}
              onPress={() => press(k)}
              style={({ pressed }) => [
                styles.key,
                k === 'enter' && styles.keyEnter,
                k === 'clear' && styles.keyClear,
                pressed && styles.keyPressed,
              ]}
            >
              <Text style={[styles.keyText, (k === 'enter' || k === 'clear') && styles.keyTextLight]}>
                {k === 'enter' ? '✓' : k === 'clear' ? '⌫' : k}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const KEY_SIZE = 56;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.warmCream, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  headerRow: { flexDirection: 'row' },
  center: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xxl },
  card: {
    backgroundColor: colors.softWhite,
    borderColor: colors.outline,
    borderWidth: 3,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 240,
    ...shadow,
  },
  eyebrow: { ...typography.caption, color: colors.premium },
  question: { ...typography.display, fontSize: 40, color: colors.darkNavy },
  display: {
    minWidth: 120,
    alignItems: 'center',
    backgroundColor: colors.warmCream,
    borderColor: colors.outline,
    borderWidth: 3,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  displayWrong: { borderColor: colors.coral },
  displayText: { ...typography.title, color: colors.darkNavy },
  wrongText: { ...typography.body, color: colors.coral, fontWeight: '800' },
  keypad: { width: KEY_SIZE * 3 + spacing.sm * 2, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: radius.md,
    borderWidth: 3,
    borderColor: colors.outline,
    backgroundColor: colors.softWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyEnter: { backgroundColor: colors.mintGreen },
  keyClear: { backgroundColor: colors.greyBlue },
  keyPressed: { transform: [{ translateY: 2 }] },
  keyText: { ...typography.title, color: colors.darkNavy },
  keyTextLight: { color: colors.darkNavy },
});
