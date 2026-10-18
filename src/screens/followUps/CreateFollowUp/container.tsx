import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { strings } from '../../../constants/strings';
import { useCreateFollowUp } from '../../../features/followUps/useCreateFollowUp';
import {
  createFollowUpFormSchema,
  type CreateFollowUpFormData,
  type CreateFollowUpFormValues,
} from '../../../features/followUps/validation';
import type { AppStackParamList } from '../../../navigation/types';
import CreateFollowUpView from './view';

const getDefaultLocalDueAt = (): { dueDate: string; dueTime: string } => {
  const dueAt = new Date(Date.now() + 60 * 60 * 1000);
  const pad = (value: number) => String(value).padStart(2, '0');

  return {
    dueDate: `${dueAt.getFullYear()}-${pad(dueAt.getMonth() + 1)}-${pad(dueAt.getDate())}`,
    dueTime: `${pad(dueAt.getHours())}:${pad(dueAt.getMinutes())}`,
  };
};

const CreateFollowUpContainer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'CreateFollowUp'>>();
  const {
    clearError,
    createFollowUp,
    errorMessage,
    hasError: hasLeadLoadError,
    isCreating,
    isLoading: isLoadingLeads,
    leads,
    retryLeads,
  } = useCreateFollowUp();
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<
    CreateFollowUpFormValues,
    unknown,
    CreateFollowUpFormData
  >({
    resolver: zodResolver(createFollowUpFormSchema),
    defaultValues: {
      leadId: '',
      title: '',
      type: 'call',
      ...getDefaultLocalDueAt(),
      notes: '',
    },
  });

  const submit = handleSubmit(async (input) => {
    const createdFollowUp = await createFollowUp(input);
    if (createdFollowUp) {
      Alert.alert(
        strings.followUps.create.successTitle,
        strings.followUps.create.successMessage,
        [{ text: strings.common.done, onPress: () => navigation.goBack() }],
      );
    }
  });

  return (
    <CreateFollowUpView
      control={control}
      errorMessage={errorMessage}
      hasError={Boolean(errorMessage)}
      hasLeadLoadError={hasLeadLoadError}
      isLoadingLeads={isLoadingLeads}
      isSubmitting={isSubmitting || isCreating}
      leads={leads}
      onCancel={() => navigation.goBack()}
      onFormChange={clearError}
      onRetryLeads={retryLeads}
      onSubmit={() => { void submit(); }}
    />
  );
};

export default CreateFollowUpContainer;
