import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ROUTES } from '../../../constants/routes';
import { useLeads } from '../../../features/leads/hooks/useLeads';
import type { LeadPriority, LeadStatus } from '../../../features/leads/types';
import type { AppStackParamList, TabParamList } from '../../../navigation/types';
import LeadsView from './view';

type SortOrder = 'updated' | 'value';

const LeadsContainer = () => {
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'Leads'>,
      NativeStackNavigationProp<AppStackParamList>
    >
  >();
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('updated');
  const [selectedStage, setSelectedStage] = useState<LeadStatus | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<LeadPriority | undefined>();

  const { leads, isLoading, hasError, retry } = useLeads({
    search,
    stage: selectedStage,
    priority: selectedPriority,
    sortBy: sortOrder === 'updated' ? 'updatedAt' : 'dealValueCents',
    sortDirection: 'desc',
  });
  const selectedFilterCount = Number(Boolean(selectedStage)) + Number(Boolean(selectedPriority));

  return (
    <LeadsView
      hasError={hasError}
      isLoading={isLoading}
      leads={leads}
      search={search}
      selectedFilterCount={selectedFilterCount}
      selectedPriority={selectedPriority}
      selectedStage={selectedStage}
      sortOrder={sortOrder}
      onAddLead={() => navigation.navigate(ROUTES.CreateLead)}
      onChangeSearch={setSearch}
      onOpenLead={(leadId) => navigation.navigate(ROUTES.LeadDetails, { leadId })}
      onRetry={retry}
      onToggleQualifiedFilter={() => {
        setSelectedStage((current) => current === 'qualified' ? undefined : 'qualified');
      }}
      onTogglePriorityFilter={() => {
        setSelectedPriority((current) => current === 'high' ? undefined : 'high');
      }}
      onToggleSort={() => setSortOrder((current) => current === 'updated' ? 'value' : 'updated')}
    />
  );
};

export default LeadsContainer;
