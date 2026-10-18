import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { strings } from '../../../constants/strings';
import { ROUTES } from '../../../constants/routes';
import type { LeadSummary } from '../../../features/leads/types';
import type { AppStackParamList, TabParamList } from '../../../navigation/types';
import LeadsView from './view';

type SortOrder = 'updated' | 'value';

const leads: LeadSummary[] = [...strings.leads.sampleLeads];

const LeadsContainer = () => {
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'Leads'>,
      NativeStackNavigationProp<AppStackParamList>
    >
  >();
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('updated');

  const normalizedSearch = search.trim().toLowerCase();
  const filteredLeads = leads.filter((lead) =>
    `${lead.name} ${lead.title} ${lead.company}`.toLowerCase().includes(normalizedSearch),
  );
  const visibleLeads = sortOrder === 'updated'
    ? filteredLeads
    : [...filteredLeads].sort((first, second) =>
      Number(second.value.replace(/[$,]/g, '')) - Number(first.value.replace(/[$,]/g, '')),
    );

  return (
    <LeadsView
      leads={visibleLeads}
      search={search}
      sortOrder={sortOrder}
      onAddLead={() => navigation.navigate(ROUTES.CreateLead)}
      onChangeSearch={setSearch}
      onOpenLead={() => navigation.navigate(ROUTES.LeadDetails)}
      onToggleSort={() => setSortOrder((current) => current === 'updated' ? 'value' : 'updated')}
    />
  );
};

export default LeadsContainer;
