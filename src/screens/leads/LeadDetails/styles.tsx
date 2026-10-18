import { StyleSheet } from 'react-native';

import { colors, scaleFont, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    gap: spacing.medium,
    padding: spacing.medium,
    paddingBottom: spacing.large,
  },
  heading: {
    gap: spacing.extraSmall,
    paddingVertical: spacing.small,
  },
  leadName: {
    color: colors.text.primary,
    fontSize: scaleFont(28),
  },
  sectionCard: {
    gap: spacing.small,
  },
  sectionTitle: {
    marginBottom: spacing.extraSmall,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.medium,
  },
  detailValue: {
    flex: 1,
    color: colors.text.primary,
    textAlign: 'right',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border.default,
  },
  feedbackState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.medium,
    padding: spacing.large,
  },
});
