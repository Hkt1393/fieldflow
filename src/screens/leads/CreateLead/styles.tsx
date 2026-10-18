import { StyleSheet } from 'react-native';

import { colors, radius, scaleFont, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    gap: spacing.medium,
    padding: spacing.medium,
    paddingBottom: spacing.large,
  },
  title: {
    color: colors.text.primary,
    fontSize: scaleFont(24),
  },
  optionGroup: {
    gap: spacing.small,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.small,
  },
  choice: {
    minWidth: 76,
    minHeight: 44,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.medium,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.default,
    borderRadius: radius.medium,
    backgroundColor: colors.surface.primary,
  },
  choiceSelected: {
    borderColor: colors.primary.default,
    backgroundColor: colors.primary.default,
  },
  choicePressed: {
    backgroundColor: colors.background.elevated,
  },
  notesInput: {
    minHeight: 96,
    paddingTop: spacing.small,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.small,
    marginTop: spacing.small,
  },
  actionButton: {
    flex: 1,
  },
});
