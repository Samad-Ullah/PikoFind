/**
 * PikoFind colour tokens — the fixed brand palette from the master plan (§9).
 * Values are authoritative; do not invent new UI colours. See docs/DESIGN_SYSTEM.md
 * and the design Artifact for usage rules (one dominant ground + one action colour
 * per screen; yellow is reserved for rewards; never signal right/wrong by colour alone).
 */

export const palette = {
  // Primary
  skyBlue: '#43C6E8',
  sunshineYellow: '#FFD84D',
  coral: '#FF7A6B',
  mintGreen: '#6FD6A8',
  playfulPurple: '#9B7EDE',
  // Supporting
  warmCream: '#FFF8E7',
  darkNavy: '#26324A',
  softWhite: '#FFFFFF',
  greyBlue: '#D9E4EA',
} as const;

/** Semantic aliases — components should prefer these over raw palette entries. */
export const colors = {
  ...palette,
  background: palette.warmCream,
  card: palette.softWhite,
  text: palette.darkNavy,
  outline: palette.darkNavy,
  primaryAction: palette.coral,
  success: palette.mintGreen,
  reward: palette.sunshineYellow,
  premium: palette.playfulPurple,
  interface: palette.skyBlue,
  disabled: palette.greyBlue,
  disabledText: '#9AA7B4',
  /** Cream-biased neutral for hairline borders on cream (not a pure grey). */
  hairline: '#EBE3CE',
  /** Softer ink for secondary/parent copy. */
  textSoft: '#5A667C',
} as const;

export type ColorToken = keyof typeof colors;
