import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateLead } from '../../../features/leads/hooks/useCreateLead';
import { createLeadFormSchema } from '../../../features/leads/validation';
import type { CreateLeadFormData, CreateLeadFormValues } from '../../../features/leads/validation';
import { ROUTES } from '../../../constants/routes';
import type { AppStackParamList } from '../../../navigation/types';
import CreateLeadView from './view';

const CreateLeadContainer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'CreateLead'>>();
  const { clearError, createLead, hasError, isCreating } = useCreateLead();
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<
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

  const submit = handleSubmit(async (input) => {
    const createdLead = await createLead(input);
    if (createdLead) {
      navigation.replace(ROUTES.LeadDetails, { leadId: createdLead.id });
    }
  });

  return (
    <CreateLeadView
      control={control}
      hasError={hasError}
      isSubmitting={isSubmitting || isCreating}
      onCancel={() => navigation.goBack()}
      onFormChange={clearError}
      onSubmit={() => { void submit(); }}
    />
  );
};

export default CreateLeadContainer;
