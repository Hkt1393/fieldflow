import { Alert } from 'react-native';
import { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { strings } from '../../../constants/strings';
import { useLead } from '../../../features/leads/hooks/useLead';
import { useUpdateLead } from '../../../features/leads/hooks/useUpdateLead';
import { createLeadFormSchema } from '../../../features/leads/validation';
import type { CreateLeadFormData, CreateLeadFormValues } from '../../../features/leads/validation';
import type { AppStackParamList } from '../../../navigation/types';
import EditLeadView from './view';

const EditLeadContainer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'EditLead'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'EditLead'>>();
  const leadId = route.params?.leadId;
  const { lead, isLoading, hasError, isNotFound, retry } = useLead(leadId);
  const { clearError, hasError: hasUpdateError, isUpdating, updateLead } = useUpdateLead();
  const { control, handleSubmit, formState: { isSubmitting }, reset } = useForm<
    CreateLeadFormValues,
    unknown,
    CreateLeadFormData
  >({
    resolver: zodResolver(createLeadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      stage: 'new',
      priority: 'medium',
      dealValue: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (!lead) return;

    reset({
      name: lead.name,
      email: lead.email ?? '',
      phone: lead.phone ?? '',
      company: lead.company ?? '',
      title: lead.title ?? '',
      stage: lead.stage,
      priority: lead.priority,
      dealValue: lead.dealValueCents === null ? '' : (lead.dealValueCents / 100).toFixed(2),
      notes: lead.notes ?? '',
    });
  }, [lead, reset]);

  const submit = handleSubmit(async (input) => {
    if (!leadId) return;
    const updatedLead = await updateLead(leadId, {
      ...input,
      email: input.email ?? null,
      phone: input.phone ?? null,
      company: input.company ?? null,
      title: input.title ?? null,
      notes: input.notes ?? null,
    });
    if (updatedLead) {
      Alert.alert(strings.leads.edit.successTitle, strings.leads.edit.successMessage, [
        { text: strings.common.done, onPress: () => navigation.goBack() },
      ]);
    }
  });

  if (isLoading) return <EditLeadView state="loading" />;
  if (hasError) return <EditLeadView state="error" onRetry={retry} />;
  if (isNotFound || !lead) return <EditLeadView state="notFound" onBack={() => navigation.goBack()} />;

  return (
    <EditLeadView
      state="form"
      control={control}
      hasError={hasUpdateError}
      isSubmitting={isSubmitting || isUpdating}
      onCancel={() => navigation.goBack()}
      onFormChange={clearError}
      onSubmit={() => { void submit(); }}
    />
  );
};

export default EditLeadContainer;
