/**
 * IconButton — round, thick-outlined, chunky-lip button for single actions
 * (sound, repeat, back, parent). Always has an accessibilityLabel because the
 * icon alone must never be the only signal.
 */
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors, touchTarget } from '@/theme';

export type IconButtonVariant = 'default' | 'on' | 'coral';

export interface IconButtonProps {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
  variant?: IconButtonVariant;
  size?: number;
  disabled?: boolean;
  style?: ViewStyle;
}

const LIP = 5;

const FACE_COLOR: Record<IconButtonVariant, string> = {
  default: colors.softWhite,
  on: colors.sunshineYellow,
  coral: colors.coral,
};

export function IconButton({
  icon,
  label,
  onPress,
  variant = 'default',
  size = touchTarget,
  disabled = false,
  style,
}: IconButtonProps) {
  const [pressed, setPressed] = useState(false);
  const down = pressed && !disabled;
  const faceColor = disabled ? colors.disabled : FACE_COLOR[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[{ width: size, height: size + LIP }, style]}
    >
      <View style={[styles.lip, { top: LIP, borderRadius: size / 2 }]} />
      <View
        style={[
          styles.face,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: faceColor,
            transform: [{ translateY: down ? LIP : 0 }],
          },
        ]}
      >
        {icon}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.outline,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.outline,
  },
});
