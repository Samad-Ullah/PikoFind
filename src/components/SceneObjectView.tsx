/**
 * A single interactive scene object. Until real artwork exists (Phase 5) it
 * renders as a labelled coloured shape with a chunky navy outline. Placed by a
 * parent <SceneItem>, so it fills that box.
 *
 * Feedback (master plan §3.3): a wrong tap makes THIS object wiggle gently — no
 * red cross, no penalty. After enough wrong taps the correct object softly
 * pulses (`highlighted`) to guide the child. Generous `hitSlop` keeps taps easy.
 */
import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import type { PlaceholderShape, SceneObject } from '@/content/types';
import { colors, radius } from '@/theme';

export interface SceneObjectViewProps {
  object: SceneObject;
  onPress: (id: string) => void;
  /** Ignore taps during instruction / feedback. */
  disabled?: boolean;
  /** Play the "good try" wiggle. */
  wiggle?: boolean;
  /** Assistance pulse on the correct object. */
  highlighted?: boolean;
}

/** Shapes drawn as an SVG polygon (0..100 viewBox); others are plain Views. */
const POLYGON_POINTS: Partial<Record<PlaceholderShape, string>> = {
  triangle: '50,10 92,90 8,90',
  star: '50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38',
};

function borderRadiusFor(shape: PlaceholderShape): number | undefined {
  if (shape === 'circle') return 999;
  if (shape === 'rounded') return radius.lg;
  if (shape === 'square') return radius.sm;
  return undefined; // polygon shapes draw their own outline
}

export function SceneObjectView({ object, onPress, disabled, wiggle, highlighted }: SceneObjectViewProps) {
  const [rotate] = useState(() => new Animated.Value(0));
  const [scale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!wiggle) return;
    Animated.sequence([
      Animated.timing(rotate, { toValue: 1, duration: 70, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: -1, duration: 140, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 1, duration: 140, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: 0, duration: 70, useNativeDriver: true }),
    ]).start();
  }, [wiggle, rotate]);

  useEffect(() => {
    if (!highlighted) {
      scale.stopAnimation(() => scale.setValue(1));
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.12, duration: 480, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 480, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [highlighted, scale]);

  const spin = rotate.interpolate({ inputRange: [-1, 1], outputRange: ['-8deg', '8deg'] });
  const br = borderRadiusFor(object.shape);

  return (
    <Animated.View style={{ transform: [{ rotate: spin }, { scale }] }}>
      <Pressable
        onPress={() => onPress(object.id)}
        disabled={disabled}
        hitSlop={20}
        accessibilityRole="button"
        accessibilityLabel={object.label}
        style={styles.press}
      >
        <View style={styles.shadow} pointerEvents="none" />
        <View style={styles.shapeBox}>
          {POLYGON_POINTS[object.shape] ? (
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
              <Polygon
                points={POLYGON_POINTS[object.shape]}
                fill={object.color}
                stroke={colors.outline}
                strokeWidth={6}
                strokeLinejoin="round"
              />
            </Svg>
          ) : (
            <View style={[styles.solid, { backgroundColor: object.color, borderRadius: br }]} />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  press: { alignItems: 'center' },
  shapeBox: { width: '100%', aspectRatio: 1 },
  solid: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: colors.outline,
  },
  // Soft contact shadow so objects look placed on the floor, not floating.
  shadow: {
    position: 'absolute',
    left: '16%',
    right: '16%',
    bottom: -6,
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(38,50,74,0.16)',
  },
});
