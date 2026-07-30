/**
 * PikoMascot — the friendly parrot, built as ONE react-native-svg shape whose
 * pose is driven by simple transforms (master plan §8: prefer static SVG + basic
 * transforms over frame-by-frame art). Expression lives in the face (eyes +
 * beak) and wings, so each pose reads as a different feeling. Final illustration
 * swaps in later without changing callers.
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
  | 'sleeping'
  | 'sad';

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
  beak: '#F79A2E',
  beakDark: '#E07E22',
  mouth: '#7A2E28',
  navy: '#26324A',
  white: '#FFFFFF',
  tear: '#7FD3E8',
} as const;

const STROKE = 4;

export function PikoMascot({ size = 160, pose = 'idle' }: PikoMascotProps) {
  const beakOpen = pose === 'speaking' || pose === 'celebrating' || pose === 'flying';
  const eyesClosed = pose === 'sleeping';
  const happyEyes = pose === 'celebrating' || pose === 'star';
  const sad = pose === 'sad';

  const rightWing =
    pose === 'flying' ? -84 : pose === 'celebrating' ? -62 : pose === 'pointing' ? -46 : pose === 'thinking' ? -30 : pose === 'star' ? -30 : pose === 'encouraging' ? -18 : 0;
  const leftWing = pose === 'flying' ? 84 : pose === 'celebrating' ? 62 : pose === 'star' ? 30 : 0;
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
        <Path d="M96 196 v10 M90 206 h12" stroke={C.beakDark} strokeWidth={5} />
        <Path d="M124 196 v10 M118 206 h12" stroke={C.beakDark} strokeWidth={5} />

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

        {/* sad worried brows */}
        {sad && (
          <G fill="none" strokeWidth={4}>
            <Path d="M80 58 Q90 53 101 52" />
            <Path d="M140 58 Q130 53 119 52" />
          </G>
        )}

        {/* eyes */}
        {eyesClosed ? (
          <G fill="none">
            <Path d="M78 68 q14 12 28 0" />
            <Path d="M114 68 q14 12 28 0" />
          </G>
        ) : happyEyes ? (
          <G fill="none" strokeWidth={5}>
            <Path d="M82 72 q10 -13 20 0" />
            <Path d="M118 72 q10 -13 20 0" />
          </G>
        ) : sad ? (
          <G>
            <Circle cx={92} cy={70} r={16} fill={C.white} />
            <Circle cx={128} cy={70} r={16} fill={C.white} />
            <Circle cx={92} cy={76} r={7} fill={C.navy} stroke="none" />
            <Circle cx={128} cy={76} r={7} fill={C.navy} stroke="none" />
            {/* a single tear */}
            <Path d="M84 86 q5 10 0 15 q-5 -5 0 -15 Z" fill={C.tear} strokeWidth={2} />
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

        {/* beak — warm amber parrot beak */}
        {beakOpen ? (
          <G>
            <Path d="M90 88 Q110 83 130 88 Q128 97 110 99 Q92 97 90 88 Z" fill={C.beak} />
            <Path d="M95 97 Q110 94 125 97 Q121 106 110 107 Q99 106 95 97 Z" fill={C.mouth} />
            <Path d="M96 105 Q110 109 124 105 Q120 115 110 116 Q100 115 96 105 Z" fill={C.beakDark} />
          </G>
        ) : (
          <Path d="M90 88 Q110 82 130 88 Q129 100 119 106 Q110 111 101 106 Q91 100 90 88 Z" fill={C.beak} />
        )}
      </G>
    </Svg>
  );
}
