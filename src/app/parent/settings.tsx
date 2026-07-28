/**
 * Parent settings — reached only through the gate. Sound controls, language,
 * purchase, restore, reset (double-confirmed) and version. Toggles use the
 * settings store (persistence to SQLite lands in the next slice). Purchase and
 * reset are stubs until Phases 6/8.
 */
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { KidButton } from '@/components/KidButton';
import { BackIcon } from '@/components/icons';
import { useSettings } from '@/store/useSettings';
import { colors, radius, shadowSm, spacing, typography } from '@/theme';

function SettingRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.mintGreen, false: colors.greyBlue }}
        thumbColor={colors.softWhite}
        accessibilityLabel={label}
      />
    </View>
  );
}

export default function ParentSettings() {
  const router = useRouter();
  const { musicOn, voiceOn, effectsOn, setMusic, setVoice, setEffects } = useSettings();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const confirmReset = () => {
    Alert.alert('Reset all progress?', 'Stars and stickers cannot come back.', [
      { text: 'Keep', style: 'cancel' },
      { text: 'Erase', style: 'destructive', onPress: () => Alert.alert('Progress will reset here once saving is added.') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <IconButton label="Back to home" icon={<BackIcon />} onPress={() => router.replace('/home')} />
        <Text style={styles.title}>Parent area</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.columns}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sound</Text>
            <SettingRow label="Music" value={musicOn} onValueChange={setMusic} />
            <SettingRow label="Voice" value={voiceOn} onValueChange={setVoice} />
            <SettingRow label="Sound effects" value={effectsOn} onValueChange={setEffects} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Language</Text>
              <Text style={styles.rowValue}>English</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Full game</Text>
            <Text style={styles.note}>Unlock Garden and Classroom, every sticker and future languages. One payment, forever.</Text>
            <KidButton label="Unlock · $2.99" variant="purple" onPress={() => Alert.alert('Purchase arrives in a later update.')} />
            <KidButton label="Restore purchase" variant="ghost" onPress={() => Alert.alert('Nothing to restore yet.')} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>App version</Text>
            <Text style={styles.rowValue}>{version}</Text>
          </View>
          <KidButton label="Reset progress" variant="ghost" onPress={confirmReset} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.warmCream, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...typography.title, color: colors.darkNavy },
  spacer: { width: 64 },
  content: { gap: spacing.lg, paddingVertical: spacing.lg },
  columns: { flexDirection: 'row', gap: spacing.lg },
  card: {
    flex: 1,
    backgroundColor: colors.softWhite,
    borderColor: colors.outline,
    borderWidth: 3,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadowSm,
  },
  cardTitle: { ...typography.caption, color: colors.premium },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLabel: { ...typography.parent, color: colors.darkNavy },
  rowValue: { ...typography.parent, color: colors.textSoft },
  note: { ...typography.body, color: colors.textSoft },
});
