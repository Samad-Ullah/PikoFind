/**
 * PikoFind spacing, radius, border and shadow tokens (master plan §9.4–9.5).
 * Chunky, rounded, thick-outlined, with soft *static* shadows — no blur.
 */
import { Platform, type ViewStyle } from 'react-native';

import { colors } from './colors';

/** 4-point spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  xxl: 36,
  xxxl: 56,
} as const;

/** Corner radii — everything is generously rounded. */
export const radius = {
  sm: 12,
  md: 18,
  lg: 26,
  xl: 34,
  pill: 999,
} as const;

/** Outline weights — thick navy borders are a brand signature. */
export const border = {
  hair: 2,
  thick: 3,
  chunky: 4,
} as const;

/**
 * Minimum child-facing touch target (dp). Visible art may be smaller; the
 * pressable hitbox must not go below this.
 */
export const touchTarget = 64;

/**
 * Soft, static drop shadow (no blur views). Cross-platform: iOS shadow props +
 * Android elevation. Use for cards and raised surfaces.
 */
export const shadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: colors.darkNavy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
  },
  default: {
    elevation: 5,
  },
}) as ViewStyle;

export const shadowSm: ViewStyle = Platform.select({
  ios: {
    shadowColor: colors.darkNavy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  default: {
    elevation: 3,
  },
}) as ViewStyle;
