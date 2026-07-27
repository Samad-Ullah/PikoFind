/**
 * PikoMascot — the friendly parrot, built as ONE react-native-svg shape whose
 * pose is driven by simple transforms (master plan §8: prefer static SVG + basic
 * transforms over frame-by-frame art). This is the Phase-1 placeholder concept
 * ported from the design Artifact; final illustration swaps in later without
 * changing callers.
 */
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

export type PikoPose =
  | 'idle'
  | 'speaking'
  | 'listening'
  | 'pointing'
  | 'celebrating'
  | 'thinking'
  | 'encouraging'
  | 'flying'
  | 'star'
  | 'sleeping';

export interface PikoMascotProps {
  size?: number;
  pose?: PikoPose;
}

const C = {
  teal: '#37BFD0',
  tealDark: '#289FAF',
  belly: '#D6F5FA',
  yellow: '#FFD84D',
  coral: '#FF7A6B',
  coralDark: '#F0685A',
  navy: '#26324A',
  white: '#FFFFFF',
  blush: '#FF7A6B',
} as const;

const STROKE = 4;

export function PikoMascot({ size = 160, pose = 'idle' }: PikoMascotProps) {
  const beakOpen = pose === 'speaking' || pose === 'celebrating' || pose === 'flying';
  const eyesClosed = pose === 'sleeping';

  const rightWing =
    pose === 'flying' ? -78 : pose === 'celebrating' ? -58 : pose === 'pointing' ? -46 : pose === 'thinking' ? -30 : pose === 'star' ? -30 : pose === 'encouraging' ? -18 : 0;
  const leftWing = pose === 'flying' ? 78 : pose === 'celebrating' ? 58 : pose === 'star' ? 30 : 0;
  const rootTilt = pose === 'listening' ? 7 : pose === 'sleeping' ? 4 : 0;

  return (
    <Svg width={size} height={size} viewBox="0 0 220 232">
      <G rotation={rootTilt} originX={110} originY={130} stroke={C.navy} strokeWidth={STROKE} strokeLinejoin="round" strokeLinecap="round">
        {/* tail */}
        <Path d="M84 196 q-6 26 6 30 q10 -6 12 -26 Z" fill={C.teal} />
        <Path d="M110 200 q0 28 0 30 q10 -4 12 -26 Z" fill={C.tealDark} />
        <Path d="M136 196 q6 26 -6 30 q-10 -6 -12 -26 Z" fill={C.teal} />

        {/* left wing */}
        <G rotation={leftWing} originX={64} originY={120}>
          <Ellipse cx={58} cy={132} rx={20} ry={36} fill={C.yellow} />
        </G>

        {/* body */}
        <Ellipse cx={110} cy={132} rx={62} ry={66} fill={C.teal} />
        <Ellipse cx={110} cy={148} rx={40} ry={46} fill={C.belly} />

        {/* feet */}
        <Path d="M96 196 v10 M90 206 h12" stroke={C.coralDark} strokeWidth={5} />
        <Path d="M124 196 v10 M118 206 h12" stroke={C.coralDark} strokeWidth={5} />

        {/* right wing */}
        <G rotation={rightWing} originX={162} originY={120}>
          <Ellipse cx={162} cy={132} rx={20} ry={36} fill={C.yellow} />
        </G>

        {/* held star */}
        {pose === 'star' && (
          <Path
            d="M110 118 L118 138 L140 138 L122 151 L129 172 L110 159 L91 172 L98 151 L80 138 L102 138 Z"
            fill={C.yellow}
            strokeWidth={4}
          />
        )}

        {/* head */}
        <Circle cx={110} cy={74} r={54} fill={C.teal} />

        {/* tuft */}
        <Path d="M110 24 q-4 -18 6 -22 q6 8 2 22 Z" fill={C.coral} />
        <Path d="M96 26 q-10 -14 -2 -22 q10 6 10 20 Z" fill={C.yellow} />
        <Path d="M124 26 q10 -14 2 -22 q-10 6 -10 20 Z" fill={C.yellow} />

        {/* cheeks */}
        <Circle cx={80} cy={88} r={10} fill={C.blush} opacity={0.38} stroke="none" />
        <Circle cx={140} cy={88} r={10} fill={C.blush} opacity={0.38} stroke="none" />

        {/* eyes */}
        {eyesClosed ? (
          <G fill="none">
            <Path d="M78 68 q14 12 28 0" />
            <Path d="M114 68 q14 12 28 0" />
          </G>
        ) : (
          <G>
            <Circle cx={92} cy={68} r={17} fill={C.white} />
            <Circle cx={128} cy={68} r={17} fill={C.white} />
            <Circle cx={94} cy={70} r={8} fill={C.navy} stroke="none" />
            <Circle cx={130} cy={70} r={8} fill={C.navy} stroke="none" />
            <Circle cx={90} cy={66} r={3} fill={C.white} stroke="none" />
            <Circle cx={126} cy={66} r={3} fill={C.white} stroke="none" />
          </G>
        )}

        {/* beak */}
        {beakOpen ? (
          <G>
            <Path d="M98 84 q12 8 24 0 q-12 6 -24 0 Z" fill={C.coralDark} />
            <Path d="M100 92 q10 12 20 0 q-10 6 -20 0 Z" fill="#FF9A8C" />
          </G>
        ) : (
          <Path d="M97 86 q13 20 26 0 q-13 12 -26 0 Z" fill={C.coral} />
        )}
      </G>
    </Svg>
  );
}
