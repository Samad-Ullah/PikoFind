/**
 * ResponsiveScene — the game stage. Holds a fixed 16:9 canvas (master plan §10),
 * letterboxed to fit whatever space it's given, centred, so artwork never
 * stretches. Children position themselves with normalized 0..1 coordinates via
 * <SceneItem>, exactly how level data stores object positions.
 */
import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from 'react-native';

import { border, colors, radius } from '@/theme';

const ASPECT = 16 / 9;

export interface ResponsiveSceneProps {
  children?: ReactNode;
  /** Scene ground colour (final art will be a WebP background instead). */
  backgroundColor?: string;
  /** Extra style for the stage (e.g. a different border radius). */
  style?: ViewStyle;
  /** Whether to draw the brand navy frame (on by default). */
  framed?: boolean;
}

export function ResponsiveScene({
  children,
  backgroundColor = colors.warmCream,
  style,
  framed = true,
}: ResponsiveSceneProps) {
  const [box, setBox] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBox({ w: width, h: height });
  };

  // Letterbox: fit a 16:9 rect inside the measured area.
  let w = box.w;
  let h = box.w / ASPECT;
  if (h > box.h) {
    h = box.h;
    w = box.h * ASPECT;
  }

  return (
    <View style={styles.outer} onLayout={onLayout}>
      {box.w > 0 && (
        <View
          style={[
            styles.stage,
            { width: w, height: h, backgroundColor },
            framed && styles.framed,
            style,
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

export interface SceneItemProps {
  /** Normalized centre position (0..1). */
  x: number;
  y: number;
  /** Normalized width (0..1 of stage width). Height keeps the child's ratio unless given. */
  width: number;
  height?: number;
  children: ReactNode;
}

/** Places a child at a normalized centre point within a ResponsiveScene. */
export function SceneItem({ x, y, width, height, children }: SceneItemProps) {
  return (
    <View
      style={[
        styles.item,
        {
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          width: `${width * 100}%`,
          ...(height != null ? { height: `${height * 100}%` } : null),
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: {
    position: 'relative',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  framed: {
    borderWidth: border.chunky,
    borderColor: colors.outline,
  },
  item: {
    position: 'absolute',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
  },
});
