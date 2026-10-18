import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '../../../theme';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.primary },
  keyboardView: { flex: 1 },
  content: { gap: spacing.medium, padding: spacing.medium, paddingBottom: spacing.large },
  feedback: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.medium, padding: spacing.medium },
  fieldGroup: { gap: spacing.small },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.small },
  option: {
    minWidth: 76, minHeight: 44, flexGrow: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.medium, paddingVertical: spacing.small, borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.default, borderRadius: radius.medium, backgroundColor: colors.surface.primary,
  },
  optionSelected: { borderColor: colors.primary.default, backgroundColor: colors.primary.default },
  optionPressed: { backgroundColor: colors.background.elevated },
  notesInput: { minHeight: 96, paddingTop: spacing.small },
  actions: { flexDirection: 'row', gap: spacing.small, marginTop: spacing.small },
  actionButton: { flex: 1 },
});
