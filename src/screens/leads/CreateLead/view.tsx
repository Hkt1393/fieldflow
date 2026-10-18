import { Controller, type Control } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppPressable, AppText, AppTextInput } from '../../../components/ui';
import { strings } from '../../../constants/strings';
import type { LeadPriority, LeadStatus } from '../../../features/leads/types';
import type { CreateLeadFormData, CreateLeadFormValues } from '../../../features/leads/validation';
import { styles } from './styles';

export type LeadFormViewProps = {
  control: Control<CreateLeadFormValues, unknown, CreateLeadFormData>;
  hasError: boolean;
  isSubmitting: boolean;
  title?: string;
  submitTitle?: string;
  submittingTitle?: string;
  errorMessage?: string;
  onCancel: () => void;
  onFormChange: () => void;
  onSubmit: () => void;
};

type ChoiceOptionProps = {
  accessibilityLabel: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

const ChoiceOption = ({ accessibilityLabel, label, selected, onPress }: ChoiceOptionProps) => (
  <AppPressable
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    onPress={onPress}
    pressedStyle={styles.choicePressed}
    style={[styles.choice, selected && styles.choiceSelected]}
  >
    <AppText color={selected ? 'inverse' : 'primary'} variant="labelMd">{label}</AppText>
  </AppPressable>
);

const stageOptions: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: strings.leads.statuses.new },
  { value: 'contacted', label: strings.leads.statuses.contacted },
  { value: 'qualified', label: strings.leads.statuses.qualified },
  { value: 'proposal', label: strings.leads.statuses.proposal },
];

const priorityOptions: { value: LeadPriority; label: string }[] = [
  { value: 'low', label: strings.leads.details.priorities.low },
  { value: 'medium', label: strings.leads.details.priorities.medium },
  { value: 'high', label: strings.leads.details.priorities.high },
];

export const LeadFormView = ({
  control,
  errorMessage = strings.leads.create.error,
  hasError,
  isSubmitting,
  onCancel,
  onFormChange,
  onSubmit,
  title = strings.leads.create.title,
  submitTitle = strings.leads.addLead,
  submittingTitle = strings.leads.create.submitting,
}: LeadFormViewProps) => (
  <SafeAreaView edges={['bottom']} style={styles.safeArea}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText style={styles.title} variant="headlineLg">{title}</AppText>

        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.leads.create.nameLabel}
              autoCapitalize="words"
              errorMessage={fieldState.error?.message}
              label={strings.leads.create.nameLabel}
              onBlur={field.onBlur}
              onChangeText={(value) => {
                onFormChange();
                field.onChange(value);
              }}
              placeholder={strings.leads.create.namePlaceholder}
              ref={field.ref}
              returnKeyType="next"
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.leads.details.email}
              autoCapitalize="none"
              autoComplete="email"
              errorMessage={fieldState.error?.message}
              keyboardType="email-address"
              label={strings.leads.details.email}
              onBlur={field.onBlur}
              onChangeText={(value) => {
                onFormChange();
                field.onChange(value);
              }}
              placeholder={strings.auth.emailPlaceholder}
              ref={field.ref}
              returnKeyType="next"
              textContentType="emailAddress"
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.leads.details.phone}
              autoComplete="tel"
              errorMessage={fieldState.error?.message}
              keyboardType="phone-pad"
              label={strings.leads.details.phone}
              onBlur={field.onBlur}
              onChangeText={(value) => {
                onFormChange();
                field.onChange(value);
              }}
              placeholder={strings.leads.create.phonePlaceholder}
              ref={field.ref}
              returnKeyType="next"
              textContentType="telephoneNumber"
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="company"
          render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.leads.details.company}
              autoCapitalize="words"
              errorMessage={fieldState.error?.message}
              label={strings.leads.details.company}
              onBlur={field.onBlur}
              onChangeText={(value) => {
                onFormChange();
                field.onChange(value);
              }}
              placeholder={strings.leads.create.companyPlaceholder}
              ref={field.ref}
              returnKeyType="next"
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.leads.details.jobTitle}
              autoCapitalize="words"
              errorMessage={fieldState.error?.message}
              label={strings.leads.details.jobTitle}
              onBlur={field.onBlur}
              onChangeText={(value) => {
                onFormChange();
                field.onChange(value);
              }}
              placeholder={strings.leads.create.titlePlaceholder}
              ref={field.ref}
              returnKeyType="next"
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="stage"
          render={({ field, fieldState }) => (
            <View style={styles.optionGroup}>
              <AppText variant="labelMd">{strings.leads.details.stage}</AppText>
              <View style={styles.optionRow}>
                {stageOptions.map((option) => (
                  <ChoiceOption
                    accessibilityLabel={option.label}
                    key={option.value}
                    label={option.label}
                    onPress={() => {
                      onFormChange();
                      field.onChange(option.value);
                    }}
                    selected={field.value === option.value}
                  />
                ))}
              </View>
              {fieldState.error?.message ? (
                <AppText accessibilityLiveRegion="polite" color="error" variant="caption">
                  {fieldState.error.message}
                </AppText>
              ) : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="priority"
          render={({ field, fieldState }) => (
            <View style={styles.optionGroup}>
              <AppText variant="labelMd">{strings.leads.details.priority}</AppText>
              <View style={styles.optionRow}>
                {priorityOptions.map((option) => (
                  <ChoiceOption
                    accessibilityLabel={option.label}
                    key={option.value}
                    label={option.label}
                    onPress={() => {
                      onFormChange();
                      field.onChange(option.value);
                    }}
                    selected={field.value === option.value}
                  />
                ))}
              </View>
              {fieldState.error?.message ? (
                <AppText accessibilityLiveRegion="polite" color="error" variant="caption">
                  {fieldState.error.message}
                </AppText>
              ) : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="dealValue"
          render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.leads.details.dealValue}
              errorMessage={fieldState.error?.message}
              keyboardType="decimal-pad"
              label={strings.leads.details.dealValue}
              onBlur={field.onBlur}
              onChangeText={(value) => {
                onFormChange();
                field.onChange(value);
              }}
              placeholder={strings.leads.create.dealValuePlaceholder}
              ref={field.ref}
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.leads.details.notesSection}
              errorMessage={fieldState.error?.message}
              inputStyle={styles.notesInput}
              label={strings.leads.details.notesSection}
              multiline
              onBlur={field.onBlur}
              onChangeText={(value) => {
                onFormChange();
                field.onChange(value);
              }}
              placeholder={strings.leads.create.notesPlaceholder}
              ref={field.ref}
              textAlignVertical="top"
              value={field.value}
            />
          )}
        />

        {hasError ? (
          <AppText accessibilityRole="alert" color="error" variant="bodyMd">
            {errorMessage}
          </AppText>
        ) : null}

        <View style={styles.actions}>
          <AppButton
            disabled={isSubmitting}
            onPress={onCancel}
            style={styles.actionButton}
            title={strings.common.cancel}
            variant="secondary"
          />
          <AppButton
            loading={isSubmitting}
            onPress={onSubmit}
            style={styles.actionButton}
            title={isSubmitting ? submittingTitle : submitTitle}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

export default LeadFormView;
