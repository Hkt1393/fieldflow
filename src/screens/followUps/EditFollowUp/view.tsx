import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, type Control } from 'react-hook-form';

import { AppButton, AppPressable, AppText, AppTextInput } from '../../../components/ui';
import { strings } from '../../../constants/strings';
import type { CreateFollowUpFormData, CreateFollowUpFormValues } from '../../../features/followUps/validation';
import type { FollowUpType } from '../../../features/followUps/types';
import { colors } from '../../../theme';
import { styles } from './styles';

type EditFollowUpViewProps = {
  state: 'loading' | 'error' | 'notFound' | 'form';
  control?: Control<CreateFollowUpFormValues, unknown, CreateFollowUpFormData>;
  errorMessage?: string | null;
  isSubmitting?: boolean;
  onBack?: () => void;
  onCancel?: () => void;
  onFormChange?: () => void;
  onRetry?: () => void;
  onSubmit?: () => void;
};

const typeOptions: { value: FollowUpType; label: string }[] = [
  { value: 'call', label: strings.followUps.type.call },
  { value: 'email', label: strings.followUps.type.email },
  { value: 'meeting', label: strings.followUps.type.meeting },
  { value: 'task', label: strings.followUps.type.task },
];

const EditFollowUpView = ({
  state, control, errorMessage, isSubmitting = false, onBack, onCancel, onFormChange, onRetry, onSubmit,
}: EditFollowUpViewProps) => {
  if (state !== 'form') {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View accessibilityRole={state === 'loading' ? 'progressbar' : undefined} style={styles.feedback}>
          {state === 'loading' ? <ActivityIndicator color={colors.primary.default} size="small" /> : null}
          <AppText accessibilityRole={state === 'loading' ? undefined : 'alert'} color={state === 'notFound' ? 'error' : 'secondary'}>
            {state === 'loading' ? strings.followUps.loading
              : state === 'error' ? strings.followUps.edit.loadError : strings.followUps.edit.missing}
          </AppText>
          {state === 'error' ? <AppButton onPress={onRetry ?? (() => undefined)} title={strings.common.retry} variant="secondary" /> : null}
          {state === 'notFound' ? <AppButton onPress={onBack ?? (() => undefined)} title={strings.common.back} variant="secondary" /> : null}
        </View>
      </SafeAreaView>
    );
  }

  if (!control) return null;

  const onChange = () => onFormChange?.();
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <AppText variant="headlineLg">{strings.followUps.edit.title}</AppText>
          <Controller control={control} name="title" render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.followUps.create.titleLabel}
              autoCapitalize="sentences"
              errorMessage={fieldState.error?.message}
              label={strings.followUps.create.titleLabel}
              onBlur={field.onBlur}
              onChangeText={(value) => { onChange(); field.onChange(value); }}
              placeholder={strings.followUps.create.titlePlaceholder}
              ref={field.ref}
              value={field.value}
            />
          )} />
          <Controller control={control} name="type" render={({ field, fieldState }) => (
            <View style={styles.fieldGroup}>
              <AppText variant="labelMd">{strings.followUps.create.typeLabel}</AppText>
              <View style={styles.optionRow}>
                {typeOptions.map((option) => (
                  <AppPressable
                    accessibilityLabel={option.label}
                    accessibilityRole="button"
                    accessibilityState={{ selected: field.value === option.value }}
                    key={option.value}
                    onPress={() => { onChange(); field.onChange(option.value); }}
                    pressedStyle={styles.optionPressed}
                    style={[styles.option, field.value === option.value && styles.optionSelected]}
                  >
                    <AppText color={field.value === option.value ? 'inverse' : 'primary'} variant="labelMd">{option.label}</AppText>
                  </AppPressable>
                ))}
              </View>
              {fieldState.error?.message ? <AppText color="error" variant="caption">{fieldState.error.message}</AppText> : null}
            </View>
          )} />
          <Controller control={control} name="dueDate" render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.followUps.create.dueDateLabel}
              autoCapitalize="none"
              errorMessage={fieldState.error?.message}
              label={strings.followUps.create.dueDateLabel}
              onBlur={field.onBlur}
              onChangeText={(value) => { onChange(); field.onChange(value); }}
              placeholder={strings.followUps.create.dueDatePlaceholder}
              ref={field.ref}
              value={field.value}
            />
          )} />
          <Controller control={control} name="dueTime" render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.followUps.create.dueTimeLabel}
              autoCapitalize="none"
              errorMessage={fieldState.error?.message}
              keyboardType="numbers-and-punctuation"
              label={strings.followUps.create.dueTimeLabel}
              onBlur={field.onBlur}
              onChangeText={(value) => { onChange(); field.onChange(value); }}
              placeholder={strings.followUps.create.dueTimePlaceholder}
              ref={field.ref}
              value={field.value}
            />
          )} />
          <Controller control={control} name="notes" render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.followUps.create.notesLabel}
              errorMessage={fieldState.error?.message}
              inputStyle={styles.notesInput}
              label={strings.followUps.create.notesLabel}
              multiline
              onBlur={field.onBlur}
              onChangeText={(value) => { onChange(); field.onChange(value); }}
              placeholder={strings.followUps.create.notesPlaceholder}
              ref={field.ref}
              textAlignVertical="top"
              value={field.value}
            />
          )} />
          {errorMessage ? <AppText accessibilityRole="alert" color="error">{errorMessage}</AppText> : null}
          <View style={styles.actions}>
            <AppButton disabled={isSubmitting} onPress={onCancel ?? (() => undefined)} style={styles.actionButton} title={strings.common.cancel} variant="secondary" />
            <AppButton loading={isSubmitting} onPress={onSubmit ?? (() => undefined)} style={styles.actionButton} title={isSubmitting ? strings.followUps.edit.submitting : strings.followUps.edit.submit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditFollowUpView;
