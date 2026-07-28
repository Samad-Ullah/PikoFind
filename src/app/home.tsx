/**
 * Home — the landscape hub. Play is the largest element (master plan §7.3). No
 * bottom navigation bar. The parent button leads to the gate, never straight to
 * settings.
 */
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/IconButton';
import { KidButton } from '@/components/KidButton';
import { PikoMascot } from '@/components/PikoMascot';
import { ParentIcon, SoundIcon, SoundOffIcon, StarIcon } from '@/components/icons';
import { useSettings } from '@/store/useSettings';
import { colors, spacing, typography } from '@/theme';

export default function Home() {
  const router = useRouter();
  const soundOn = useSettings((s) => s.soundOn);
  const toggleSound = useSettings((s) => s.toggleSound);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.topbar}>
        <Text style={styles.wordmark}>
          Piko<Text style={styles.find}>Find</Text>
        </Text>
        <View style={styles.topRight}>
          <View style={styles.stars}>
            <StarIcon size={30} />
            <Text style={styles.starCount}>0</Text>
          </View>
          <IconButton
            label={soundOn ? 'Sound on' : 'Sound off'}
            variant={soundOn ? 'on' : 'default'}
            icon={soundOn ? <SoundIcon /> : <SoundOffIcon />}
            onPress={toggleSound}
          />
        </View>
      </View>

      <View style={styles.center}>
        <PikoMascot pose="idle" size={190} />
        <KidButton label="Play" size="play" icon={<StarIcon size={28} />} onPress={() => router.push('/worlds')} />
      </View>

      <View style={styles.bottombar}>
        <IconButton label="Parent area" icon={<ParentIcon />} onPress={() => router.push('/parent/gate')} />
        <KidButton label="Stickers" variant="ghost" onPress={() => router.push('/gallery')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.warmCream, paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wordmark: { ...typography.title, color: colors.darkNavy },
  find: { color: colors.skyBlue },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  stars: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  starCount: { ...typography.title, color: colors.darkNavy },
  center: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xxl },
  bottombar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
