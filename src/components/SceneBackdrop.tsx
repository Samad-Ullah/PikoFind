/**
 * A simple, tasteful placeholder scene backdrop: a soft floor band and a rug so
 * the objects read as toys placed in a room rather than shapes floating in a
 * box. Non-interactive (pointerEvents none) and sits behind the SceneItems.
 * Final worlds swap in a real WebP background without touching this.
 */
import { StyleSheet, View } from 'react-native';

import { radius } from '@/theme';

export interface SceneBackdropProps {
  /** Floor colour (lower band). */
  floor: string;
  /** Rug colour (accent oval on the floor). */
  rug: string;
}

export function SceneBackdrop({ floor, rug }: SceneBackdropProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.floor, { backgroundColor: floor }]} />
      <View style={[styles.rug, { backgroundColor: rug }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  floor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '34%',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  rug: {
    position: 'absolute',
    left: '20%',
    width: '60%',
    bottom: '5%',
    height: '26%',
    borderRadius: 999,
    opacity: 0.45,
  },
});
