/**
 * PikoFind icon set — small react-native-svg glyphs used by IconButton and the
 * UI. Simple, thick, single-colour (or fixed brand colour for the star). Ported
 * from the design Artifact. Keep them boxed in a 0 0 100 100 viewBox.
 */
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

export interface IconProps {
  size?: number;
  color?: string;
}

const box = (size: number) => ({ width: size, height: size, viewBox: '0 0 100 100' });

export function SoundIcon({ size = 26, color = colors.text }: IconProps) {
  return (
    <Svg {...box(size)}>
      <Path d="M14 38 h14 l16 -14 v52 l-16 -14 H14Z" fill={color} />
      <Path d="M56 34 q12 16 0 32 M64 26 q22 24 0 48" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
    </Svg>
  );
}

export function SoundOffIcon({ size = 26, color = colors.text }: IconProps) {
  return (
    <Svg {...box(size)}>
      <Path d="M14 38 h14 l16 -14 v52 l-16 -14 H14Z" fill={color} />
      <Path d="M58 40 l26 20 M84 40 l-26 20" stroke={color} strokeWidth={6} strokeLinecap="round" />
    </Svg>
  );
}

export function ReplayIcon({ size = 26, color = colors.text }: IconProps) {
  return (
    <Svg {...box(size)}>
      <Path d="M74 30 v18 h-18" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M72 44 a26 26 0 1 0 6 22" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />
    </Svg>
  );
}

export function BackIcon({ size = 26, color = colors.text }: IconProps) {
  return (
    <Svg {...box(size)}>
      <Path d="M58 24 L34 50 L58 76" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ParentIcon({ size = 26, color = colors.text }: IconProps) {
  return (
    <Svg {...box(size)}>
      <Circle cx={50} cy={36} r={14} fill={color} />
      <Path d="M24 82 q0 -26 26 -26 q26 0 26 26Z" fill={color} />
    </Svg>
  );
}

export function LockIcon({ size = 26, color = colors.text }: IconProps) {
  return (
    <Svg {...box(size)}>
      <Rect x={26} y={46} width={48} height={36} rx={8} fill={color} />
      <Path d="M36 46 v-8 a14 14 0 0 1 28 0 v8" fill="none" stroke={color} strokeWidth={7} />
    </Svg>
  );
}

export function HeartIcon({ size = 26, color = colors.coral }: IconProps) {
  return (
    <Svg {...box(size)}>
      <Path
        d="M50 80 C20 58 22 30 42 30 q8 0 8 12 q0 -12 8 -12 c20 0 22 28 -8 50Z"
        fill={color}
        stroke={colors.outline}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** The star is a fixed reward glyph: sunshine fill, navy outline. */
export function StarIcon({ size = 26 }: Pick<IconProps, 'size'>) {
  return (
    <Svg {...box(size)}>
      <G>
        <Path
          d="M50 6 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38 Z"
          fill={colors.sunshineYellow}
          stroke={colors.outline}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}
