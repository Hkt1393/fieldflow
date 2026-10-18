import { Alert } from 'react-native';
import { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { strings } from '../../../constants/strings';
import { useEditFollowUp } from '../../../features/followUps/useEditFollowUp';
import {
  createFollowUpFormSchema,
  type CreateFollowUpFormData,
  type CreateFollowUpFormValues,
} from '../../../features/followUps/validation';
import type { AppStackParamList } from '../../../navigation/types';
import EditFollowUpView from './view';

const pad = (value: number): string => String(value).padStart(2, '0');

const getLocalDueAt = (timestamp: string): { dueDate: string; dueTime: string } => {
  const date = new Date(timestamp);
  return {
    dueDate: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    dueTime: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
};

const EditFollowUpContainer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'EditFollowUp'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'EditFollowUp'>>();
  const followUpId = route.params?.followUpId;
  const {
    clearError, followUp, hasError, isLoading, isNotFound, isUpdating, retry, updateError, updateFollowUp,
  } = useEditFollowUp(followUpId);
  const { control, getValues, handleSubmit, formState: { isSubmitting }, reset } = useForm<
    CreateFollowUpFormValues,
    unknown,
    CreateFollowUpFormData
  >({
    resolver: zodResolver(createFollowUpFormSchema),
    defaultValues: { leadId: '', title: '', type: 'call', dueDate: '', dueTime: '', notes: '' },
  });

  useEffect(() => {
    if (!followUp) return;
    reset({
      leadId: followUp.leadId,
      title: followUp.title,
      type: followUp.type,
      ...getLocalDueAt(followUp.dueAt),
      notes: followUp.notes ?? '',
    });
  }, [followUp, reset]);

  const submit = handleSubmit(async (input) => {
    if (!followUp) return;
    const originalLocal = getLocalDueAt(followUp.dueAt);
    const currentValues = getValues();
    const updatedInput = currentValues.dueDate === originalLocal.dueDate && currentValues.dueTime === originalLocal.dueTime
      ? { ...input, dueAt: followUp.dueAt }
      : input;
    const updated = await updateFollowUp(updatedInput);
    if (updated) {
      Alert.alert(strings.followUps.edit.successTitle, strings.followUps.edit.successMessage, [
        { text: strings.common.done, onPress: () => navigation.goBack() },
      ]);
    }
  });

  if (isLoading) return <EditFollowUpView state="loading" />;
  if (hasError) return <EditFollowUpView state="error" onRetry={retry} />;
  if (isNotFound || !followUp) {
    return <EditFollowUpView state="notFound" onBack={() => navigation.goBack()} />;
  }

  return (
    <EditFollowUpView
      state="form"
      control={control}
      errorMessage={updateError}
      isSubmitting={isSubmitting || isUpdating}
      onCancel={() => navigation.goBack()}
      onFormChange={clearError}
      onSubmit={() => { void submit(); }}
    />
  );
};

export default EditFollowUpContainer;
