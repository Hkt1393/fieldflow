import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { AppIcon } from './AppIcon';
import { AppPressable } from './AppPressable';
import { AppText } from './AppText';

export type AppCheckboxProps = {
  accessibilityLabel: string;
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export const AppCheckbox = ({ accessibilityLabel, checked, disabled = false, label, onChange, style }: AppCheckboxProps) => (
  <AppPressable
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="checkbox"
    accessibilityState={{ checked, disabled }}
    disabled={disabled}
    onPress={() => onChange(!checked)}
    style={[styles.row, style]}
  >
    <View style={[styles.box, checked && styles.checked]}>
      {checked && <AppIcon color="inverse" name="check" size={16} />}
    </View>
    <AppText color="secondary" style={styles.label} variant="bodySm">{label}</AppText>
  </AppPressable>
);

const styles = StyleSheet.create({
  row: { minHeight: 44, flexShrink: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.small },
  box: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border.strong, borderRadius: radius.small, backgroundColor: colors.surface.primary },
  checked: { borderColor: colors.primary.default, backgroundColor: colors.primary.default },
  label: { flexShrink: 1 },
});
