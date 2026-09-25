import { Platform, StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import type { ReactNode, Ref } from 'react';

import { colors, radius, spacing, typography } from '../../theme';
import { AppText } from './AppText';

export type AppTextInputProps = Omit<TextInputProps, 'style'> & {
  disabled?: boolean;
  error?: boolean;
  inputStyle?: StyleProp<TextStyle>;
  label?: string;
  labelAccessory?: ReactNode;
  leftAccessory?: ReactNode;
  rightAccessory?: ReactNode;
  focused?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  ref?: Ref<TextInput>;
};

export const AppTextInput = ({
  containerStyle,
  disabled = false,
  error = false,
  focused = false,
  inputStyle,
  label,
  labelAccessory,
  leftAccessory,
  rightAccessory,
  ref,
  editable,
  ...props
}: AppTextInputProps) => (
  <View style={styles.fieldGroup}>
    {(label || labelAccessory) && (
      <View style={styles.labelRow}>
        {label ? <AppText color="primary" variant="labelMd">{label}</AppText> : <View />}
        {labelAccessory}
      </View>
    )}
    <View
      style={[
        styles.inputContainer,
        focused && styles.inputContainerFocused,
        error && styles.inputContainerError,
        disabled && styles.inputContainerDisabled,
        containerStyle,
      ]}
    >
      {leftAccessory && <View importantForAccessibility="no" style={styles.leadingIcon}>{leftAccessory}</View>}
      <TextInput
        {...props}
        editable={editable ?? !disabled}
        placeholderTextColor={props.placeholderTextColor ?? colors.text.muted}
        ref={ref}
        style={[styles.input, Boolean(leftAccessory) && styles.inputWithLeftAccessory, Boolean(rightAccessory) && styles.inputWithRightAccessory, inputStyle]}
      />
      {rightAccessory}
    </View>
  </View>
);

const styles = StyleSheet.create({
  fieldGroup: { gap: spacing.extraSmall },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputContainer: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.strong,
    borderRadius: radius.medium,
    backgroundColor: colors.surface.primary,
    ...Platform.select({
      ios: { shadowColor: colors.text.primary, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2 },
      android: { elevation: 1 },
    }),
  },
  inputContainerFocused: {
    borderColor: colors.primary.default,
    shadowColor: colors.interactive.focusRing,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  inputContainerError: { borderColor: colors.error.default },
  inputContainerDisabled: { backgroundColor: colors.interactive.disabledBackground },
  leadingIcon: { position: 'absolute', left: spacing.small, zIndex: 1 },
  input: { ...typography.bodyMd, flex: 1, minHeight: 44, paddingHorizontal: spacing.small, color: colors.text.primary },
  inputWithLeftAccessory: { paddingLeft: 40 },
  inputWithRightAccessory: { paddingRight: 0 },
});
