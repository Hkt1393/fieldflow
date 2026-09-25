import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from './AppText';
import { colors, spacing } from '../../theme';

export type AppDividerProps = Omit<ViewProps, 'children'> & { label: string };

export const AppDivider = ({ label, style, ...props }: AppDividerProps) => (
  <View {...props} style={[styles.row, style]}>
    <View style={styles.line} />
    <AppText color="secondary" style={styles.label} variant="caption">{label}</AppText>
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  row: { minHeight: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.small },
  line: { height: StyleSheet.hairlineWidth, flex: 1, backgroundColor: colors.background.elevated },
  label: { marginHorizontal: spacing.small, textTransform: 'uppercase', letterSpacing: 1 },
});
