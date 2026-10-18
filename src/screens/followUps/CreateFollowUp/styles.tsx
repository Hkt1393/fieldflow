import { StyleSheet } from 'react-native';

import { colors, scaleFont, scaleRadius, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.medium,
  },
  title: {
    color: colors.text.primary,
    fontSize: scaleFont(20),
  },
  action: {
    marginTop: spacing.medium,
    borderRadius: scaleRadius(8),
    backgroundColor: colors.primary.default,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  actionText: {
    color: colors.background.primary,
    fontSize: scaleFont(16),
  },
});
