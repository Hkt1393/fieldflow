import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { colors, typography } from '../../theme';

export type AppTextVariant = keyof typeof typography;
export type AppTextColor = 'primary' | 'secondary' | 'muted' | 'inverse' | 'brand' | 'success' | 'successStrong' | 'error' | 'info';

const textColorStyles = StyleSheet.create({
  primary: { color: colors.text.primary },
  secondary: { color: colors.text.secondary },
  muted: { color: colors.text.muted },
  inverse: { color: colors.text.inverse },
  brand: { color: colors.primary.default },
  success: { color: colors.success.text },
  successStrong: { color: colors.success.text },
  error: { color: colors.error.text },
  info: { color: colors.info.default },
});

export type AppTextProps = Omit<TextProps, 'style'> & {
  color?: AppTextColor;
  style?: StyleProp<TextStyle>;
  variant?: AppTextVariant;
};

export const AppText = ({ color = 'primary', style, variant = 'bodyMd', ...props }: AppTextProps) => (
  <Text {...props} style={[typography[variant], textColorStyles[color], style]} />
);
