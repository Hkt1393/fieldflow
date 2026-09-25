import { StyleSheet } from 'react-native';

import { colors, scaleFont, scaleRadius, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.medium,
  },
  title: {
    color: colors.text,
    fontSize: scaleFont(20),
  },
  action: {
    marginTop: spacing.medium,
    borderRadius: scaleRadius(8),
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
  },
  actionText: {
    color: colors.background,
    fontSize: scaleFont(16),
  },
});
