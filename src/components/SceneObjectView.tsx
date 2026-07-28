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
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import type { PlaceholderShape, SceneObject } from '@/content/types';
import { colors, radius, typography } from '@/theme';

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

function borderRadiusFor(shape: PlaceholderShape): number | undefined {
  if (shape === 'circle') return 999;
  if (shape === 'rounded') return radius.lg;
  if (shape === 'square') return radius.sm;
  return undefined; // triangle draws its own outline
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
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={object.label}
        style={styles.press}
      >
        <View style={styles.shapeBox}>
          {object.shape === 'triangle' ? (
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
              <Polygon points="50,10 92,90 8,90" fill={object.color} stroke={colors.outline} strokeWidth={6} strokeLinejoin="round" />
            </Svg>
          ) : (
            <View style={[styles.solid, { backgroundColor: object.color, borderRadius: br }]} />
          )}
        </View>
        <View style={styles.caption}>
          <Text style={styles.captionText} numberOfLines={1}>
            {object.label}
          </Text>
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
  caption: {
    marginTop: 4,
    backgroundColor: colors.softWhite,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    opacity: 0.92,
  },
  captionText: { ...typography.caption, color: colors.textSoft },
});
