import { Controller, type Control } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppPressable, AppText, AppTextInput } from '../../../components/ui';
import { strings } from '../../../constants/strings';
import type { Lead } from '../../../features/leads/types';
import type { FollowUpType } from '../../../features/followUps/types';
import type { CreateFollowUpFormData, CreateFollowUpFormValues } from '../../../features/followUps/validation';
import { colors } from '../../../theme';
import { styles } from './styles';

type CreateFollowUpViewProps = {
  control: Control<CreateFollowUpFormValues, unknown, CreateFollowUpFormData>;
  errorMessage: string | null;
  hasError: boolean;
  hasLeadLoadError: boolean;
  isLoadingLeads: boolean;
  isSubmitting: boolean;
  leads: Lead[];
  onCancel: () => void;
  onFormChange: () => void;
  onRetryLeads: () => void;
  onSubmit: () => void;
};

type TypeOptionProps = {
  accessibilityLabel: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

const TypeOption = ({ accessibilityLabel, label, selected, onPress }: TypeOptionProps) => (
  <AppPressable
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    onPress={onPress}
    pressedStyle={styles.optionPressed}
    style={[styles.option, selected && styles.optionSelected]}
  >
    <AppText color={selected ? 'inverse' : 'primary'} variant="labelMd">{label}</AppText>
  </AppPressable>
);

const followUpTypes: { value: FollowUpType; label: string }[] = [
  { value: 'call', label: strings.followUps.type.call },
  { value: 'email', label: strings.followUps.type.email },
  { value: 'meeting', label: strings.followUps.type.meeting },
  { value: 'task', label: strings.followUps.type.task },
];

const CreateFollowUpView = ({
  control,
  errorMessage,
  hasError,
  hasLeadLoadError,
  isLoadingLeads,
  isSubmitting,
  leads,
  onCancel,
  onFormChange,
  onRetryLeads,
  onSubmit,
}: CreateFollowUpViewProps) => (
  <SafeAreaView edges={['bottom']} style={styles.safeArea}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="headlineLg">{strings.followUps.create.title}</AppText>

        {isLoadingLeads ? (
          <View accessibilityRole="progressbar" style={styles.leadStatus}>
            <ActivityIndicator color={colors.primary.default} size="small" />
            <AppText color="secondary">{strings.leads.loading}</AppText>
          </View>
        ) : hasLeadLoadError ? (
          <View style={styles.leadStatus}>
            <AppText accessibilityRole="alert" color="error">{strings.followUps.create.leadLoadError}</AppText>
            <AppButton onPress={onRetryLeads} title={strings.common.retry} variant="secondary" />
          </View>
        ) : leads.length === 0 ? (
          <AppText accessibilityRole="alert" color="error">{strings.followUps.create.noLeads}</AppText>
        ) : (
          <Controller
            control={control}
            name="leadId"
            render={({ field, fieldState }) => (
              <View style={styles.fieldGroup}>
                <AppText variant="labelMd">{strings.followUps.create.leadLabel}</AppText>
                <View style={styles.optionList}>
                  {leads.map((lead) => (
                    <TypeOption
                      accessibilityLabel={lead.name}
                      key={lead.id}
                      label={lead.company ? `${lead.name} · ${lead.company}` : lead.name}
                      onPress={() => {
                        onFormChange();
                        field.onChange(lead.id);
                      }}
                      selected={field.value === lead.id}
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
        )}

        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.followUps.create.titleLabel}
              autoCapitalize="sentences"
              errorMessage={fieldState.error?.message}
              label={strings.followUps.create.titleLabel}
              onBlur={field.onBlur}
              onChangeText={(value) => {
                onFormChange();
                field.onChange(value);
              }}
              placeholder={strings.followUps.create.titlePlaceholder}
              ref={field.ref}
              returnKeyType="next"
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="type"
          render={({ field, fieldState }) => (
            <View style={styles.fieldGroup}>
              <AppText variant="labelMd">{strings.followUps.create.typeLabel}</AppText>
              <View style={styles.optionRow}>
                {followUpTypes.map((option) => (
                  <TypeOption
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
          name="dueDate"
          render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.followUps.create.dueDateLabel}
              autoCapitalize="none"
              errorMessage={fieldState.error?.message}
              label={strings.followUps.create.dueDateLabel}
              onBlur={field.onBlur}
              onChangeText={(value) => {
                onFormChange();
                field.onChange(value);
              }}
              placeholder={strings.followUps.create.dueDatePlaceholder}
              ref={field.ref}
              value={field.value}
            />
          )}
        />

        <Controller
          control={control}
          name="dueTime"
          render={({ field, fieldState }) => (
            <AppTextInput
              accessibilityLabel={strings.followUps.create.dueTimeLabel}
              autoCapitalize="none"
              errorMessage={fieldState.error?.message}
              label={strings.followUps.create.dueTimeLabel}
              onBlur={field.onBlur}
              onChangeText={(value) => {
                onFormChange();
                field.onChange(value);
              }}
              keyboardType="numbers-and-punctuation"
              placeholder={strings.followUps.create.dueTimePlaceholder}
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
              accessibilityLabel={strings.followUps.create.notesLabel}
              errorMessage={fieldState.error?.message}
              inputStyle={styles.notesInput}
              label={strings.followUps.create.notesLabel}
              multiline
              onBlur={field.onBlur}
              onChangeText={(value) => {
                onFormChange();
                field.onChange(value);
              }}
              placeholder={strings.followUps.create.notesPlaceholder}
              ref={field.ref}
              textAlignVertical="top"
              value={field.value}
            />
          )}
        />

        {hasError && errorMessage ? (
          <AppText accessibilityRole="alert" color="error" variant="bodyMd">{errorMessage}</AppText>
        ) : null}

        <View style={styles.actions}>
          <AppButton
            disabled={isSubmitting || isLoadingLeads}
            onPress={onCancel}
            style={styles.actionButton}
            title={strings.common.cancel}
            variant="secondary"
          />
          <AppButton
            disabled={isLoadingLeads || hasLeadLoadError || leads.length === 0}
            loading={isSubmitting}
            onPress={onSubmit}
            style={styles.actionButton}
            title={isSubmitting ? strings.followUps.create.submitting : strings.followUps.create.submit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

export default CreateFollowUpView;
