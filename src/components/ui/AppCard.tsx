import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius, spacing } from '../../theme';

export type AppCardProps = ViewProps;

export const AppCard = ({ style, ...props }: AppCardProps) => (
  <View {...props} style={[styles.card, style]} />
);

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: spacing.medium,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.default,
    borderRadius: radius.large,
    backgroundColor: colors.surface.primary,
    ...Platform.select({
      ios: { shadowColor: colors.text.primary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2 },
      android: { elevation: 2 },
    }),
  },
});
