/**
 * PikoFind typography tokens (master plan §9.3). Brand face is **Nunito**
 * (SemiBold / Bold / ExtraBold). Until the Nunito files are bundled (a small
 * follow-up via expo-font), `fontFamily` is left undefined so the platform's
 * default rounded system font is used — the master plan requires a system
 * fallback anyway. Sizes and weights below are the source of truth.
 */
import { type TextStyle } from 'react-native';

/**
 * Set once Nunito is loaded (e.g. 'Nunito_800ExtraBold'). Keeping it undefined
 * renders the system font — safe on every device.
 */
export const fontFamily: string | undefined = undefined;

export const fontWeight = {
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

/** Named text roles used across the app. Child-facing text stays large. */
export const typography = {
  /** Splash / celebratory wordmark-scale text. */
  display: { fontFamily, fontSize: 48, fontWeight: '900', letterSpacing: -1 },
  /** Screen titles. */
  title: { fontFamily, fontSize: 28, fontWeight: '900', letterSpacing: -0.3 },
  /** KidButton label (master plan: 26–32). */
  button: { fontFamily, fontSize: 24, fontWeight: '900' },
  /** Spoken-instruction caption (24–30). */
  instruction: { fontFamily, fontSize: 26, fontWeight: '800' },
  /** General body copy. */
  body: { fontFamily, fontSize: 17, fontWeight: '600' },
  /** Parent-area text (16–20). */
  parent: { fontFamily, fontSize: 18, fontWeight: '700' },
  /** Small uppercase labels / eyebrows. */
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
} satisfies Record<string, TextStyle>;

export type TypographyRole = keyof typeof typography;
