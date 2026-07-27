/**
 * KidButton — the big, rounded, thick-outlined primary control. Presses down
 * onto a solid navy "lip" (the brand's chunky offset shadow). Large hit area,
 * no reliance on colour alone (shape + motion carry the affordance).
 */
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, radius, spacing, touchTarget, typography } from '@/theme';

export type KidButtonVariant = 'coral' | 'sky' | 'mint' | 'purple' | 'ghost';
export type KidButtonSize = 'regular' | 'play';

export interface KidButtonProps {
  label: string;
  onPress?: () => void;
  variant?: KidButtonVariant;
  size?: KidButtonSize;
  icon?: ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
}

const LIP = 6;

const FACE_COLOR: Record<KidButtonVariant, string> = {
  coral: colors.coral,
  sky: colors.skyBlue,
  mint: colors.mintGreen,
  purple: colors.premium,
  ghost: colors.softWhite,
};

export function KidButton({
  label,
  onPress,
  variant = 'coral',
  size = 'regular',
  icon,
  disabled = false,
  style,
}: KidButtonProps) {
  const [pressed, setPressed] = useState(false);
  const isGhost = variant === 'ghost';
  const faceColor = disabled ? colors.disabled : FACE_COLOR[variant];
  const textColor = disabled ? colors.disabledText : isGhost ? colors.text : colors.softWhite;
  const lipColor = disabled ? '#C4D0D8' : isGhost ? colors.hairline : colors.outline;
  const down = pressed && !disabled;

  const padV = size === 'play' ? spacing.lg : spacing.md;
  const padH = size === 'play' ? spacing.xxl : spacing.xl;
  const fontSize = size === 'play' ? 28 : typography.button.fontSize;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.wrap, style]}
    >
      <View style={[styles.lip, { backgroundColor: lipColor }]} />
      <View
        style={[
          styles.face,
          {
            backgroundColor: faceColor,
            borderColor: lipColor,
            paddingVertical: padV,
            paddingHorizontal: padH,
            transform: [{ translateY: down ? LIP : 0 }],
          },
        ]}
      >
        {icon}
        <Text style={[typography.button, { color: textColor, fontSize }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    paddingBottom: LIP,
    position: 'relative',
    minHeight: touchTarget,
    justifyContent: 'center',
  },
  lip: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: LIP,
    bottom: 0,
    borderRadius: radius.pill,
  },
  face: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 3,
  },
});
