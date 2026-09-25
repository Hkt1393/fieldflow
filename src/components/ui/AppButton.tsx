import { ActivityIndicator, Platform, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { colors, radius, spacing } from '../../theme';
import { AppPressable } from './AppPressable';
import { AppText } from './AppText';

export type AppButtonVariant = 'primary' | 'secondary' | 'destructive';
export type AppButtonProps = Omit<PressableProps, 'children' | 'style' | 'onPress'> & {
  disabled?: boolean;
  leadingIcon?: ReactNode;
  loading?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  title: string;
  trailingIcon?: ReactNode;
  variant?: AppButtonVariant;
};

export const AppButton = ({
  disabled = false,
  leadingIcon,
  loading = false,
  style,
  title,
  trailingIcon,
  variant = 'primary',
  ...props
}: AppButtonProps) => {
  const inactive = disabled || loading;
  return (
    <AppPressable
      {...props}
      accessibilityState={{ ...props.accessibilityState, disabled: inactive, busy: loading }}
      disabled={inactive}
      pressedStyle={variantStyles[variant].pressed}
      style={[styles.button, variantStyles[variant].button, inactive && styles.disabled, style]}
    >
      {leadingIcon}
      <AppText color={inactive ? 'muted' : variant === 'secondary' ? 'brand' : 'inverse'} variant="labelLg">
        {title}
      </AppText>
      {loading ? <ActivityIndicator color={colors.primary.default} size="small" /> : trailingIcon}
    </AppPressable>
  );
};

const styles = StyleSheet.create({
  button: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.small, paddingHorizontal: spacing.medium, borderRadius: radius.medium },
  primary: { backgroundColor: colors.primary.default, ...Platform.select({ ios: { shadowColor: colors.text.primary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2 }, android: { elevation: 1 } }) },
  secondary: { backgroundColor: colors.surface.elevated, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border.default },
  destructive: { backgroundColor: colors.error.default },
  primaryPressed: { backgroundColor: colors.primary.pressed },
  secondaryPressed: { backgroundColor: colors.background.elevated },
  destructivePressed: { backgroundColor: colors.error.text },
  disabled: { backgroundColor: colors.interactive.disabledBackground },
});

const variantStyles: Record<AppButtonVariant, { button: ViewStyle; pressed: ViewStyle }> = {
  primary: { button: styles.primary, pressed: styles.primaryPressed },
  secondary: { button: styles.secondary, pressed: styles.secondaryPressed },
  destructive: { button: styles.destructive, pressed: styles.destructivePressed },
};
