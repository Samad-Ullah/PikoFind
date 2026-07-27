/**
 * PikoFind design tokens — single import surface.
 *
 *   import { colors, spacing, radius, typography } from '@/theme';
 *
 * Tokens implement the design Artifact / docs/DESIGN_SYSTEM.md. The app commits
 * to one warm daylight palette (no dark mode) by design.
 */
import { colors } from './colors';
import { border, radius, shadow, shadowSm, spacing, touchTarget } from './spacing';
import { fontFamily, fontWeight, typography } from './typography';

export { colors, palette, type ColorToken } from './colors';
export { spacing, radius, border, touchTarget, shadow, shadowSm } from './spacing';
export { typography, fontWeight, fontFamily, type TypographyRole } from './typography';

export const theme = {
  colors,
  spacing,
  radius,
  border,
  touchTarget,
  shadow,
  shadowSm,
  typography,
  fontWeight,
  fontFamily,
} as const;

export type Theme = typeof theme;
