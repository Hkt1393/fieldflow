import { Alert } from 'react-native';
import { useCallback, useEffect, useRef } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ROUTES } from '../../../constants/routes';
import { strings } from '../../../constants/strings';
import { useDeleteLead } from '../../../features/leads/hooks/useDeleteLead';
import { useLead } from '../../../features/leads/hooks/useLead';
import type { Lead } from '../../../features/leads/types';
import type { AppStackParamList } from '../../../navigation/types';
import type { LeadDetailsData, LeadDetailsViewProps } from './view';
import LeadDetailsView from './view';

const formatDealValue = (dealValueCents: number | null): string => (
  dealValueCents === null
    ? strings.leads.details.missingDealValue
    : new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(dealValueCents / 100)
);

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);

  return Number.isNaN(date.getTime())
    ? strings.leads.details.missingValue
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

const toDetailsData = (lead: Lead): LeadDetailsData => ({
  name: lead.name,
  title: lead.title || strings.leads.details.missingValue,
  company: lead.company || strings.leads.details.missingValue,
  email: lead.email || strings.leads.details.missingValue,
  phone: lead.phone || strings.leads.details.missingValue,
  stage: strings.leads.statuses[lead.stage],
  priority: strings.leads.details.priorities[lead.priority],
  dealValue: formatDealValue(lead.dealValueCents),
  notes: lead.notes?.trim() || strings.leads.details.missingNotes,
  createdAt: formatTimestamp(lead.createdAt),
  updatedAt: formatTimestamp(lead.updatedAt),
});

const LeadDetailsContainer = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, 'LeadDetails'>>();
  const route = useRoute<RouteProp<AppStackParamList, 'LeadDetails'>>();
  const leadId = route.params?.leadId;
  const { lead, isLoading, hasError, isNotFound, retry } = useLead(leadId);
  const { deleteLead, hasError: hasDeleteError, isDeleting } = useDeleteLead();
  const isMounted = useRef(true);
  const isFocused = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useFocusEffect(useCallback(() => {
    isFocused.current = true;
    return () => {
      isFocused.current = false;
    };
  }, []));

  const navigateToLeads = () => navigation.navigate(ROUTES.Tabs, { screen: ROUTES.Leads });

  const confirmDeletion = () => {
    if (!leadId) return;

    Alert.alert(
      strings.leads.deleteConfirmation.title,
      strings.leads.deleteConfirmation.message,
      [
        { text: strings.common.cancel, style: 'cancel' },
        {
          text: strings.leads.deleteLead,
          style: 'destructive',
          onPress: () => {
            void deleteLead(leadId).then((result) => {
              if (!isMounted.current || !isFocused.current) return;
              if (result === 'deleted') {
                navigateToLeads();
              } else if (result === 'missing') {
                Alert.alert(
                  strings.leads.deleteConfirmation.missingTitle,
                  strings.leads.deleteConfirmation.missing,
                  [{ text: strings.common.done, onPress: navigateToLeads }],
                  { cancelable: false },
                );
              }
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  let viewProps: LeadDetailsViewProps;

  if (isLoading) {
    viewProps = { state: 'loading' };
  } else if (hasError) {
    viewProps = { state: 'error', onRetry: retry };
  } else if (isNotFound || !lead) {
    viewProps = { state: 'notFound' };
  } else {
    viewProps = {
      state: 'success',
      lead: toDetailsData(lead),
      isDeleting,
      hasDeleteError,
      onDelete: confirmDeletion,
      onEdit: () => navigation.navigate(ROUTES.EditLead, { leadId: lead.id }),
    };
  }

  return <LeadDetailsView {...viewProps} />;
};

export default LeadDetailsContainer;
