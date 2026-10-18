import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { strings } from '../../../constants/strings';
import { leadsService } from '../services/leadsService';
import type { Lead, LeadAvatarTone, LeadListOptions, LeadSummary } from '../types';

type LeadsState = {
  leads: LeadSummary[];
  requestKey: string | null;
  hasError: boolean;
};

const avatarTones: readonly LeadAvatarTone[] = ['blue', 'green', 'cyan', 'sky', 'coral'];

const getInitials = (name: string): string => name
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part.charAt(0))
  .join('')
  .toUpperCase();

const formatDealValue = (dealValueCents: number | null): string => (
  dealValueCents === null
    ? strings.leads.undisclosedValue
    : new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(dealValueCents / 100)
);

const formatTimestamp = (timestamp: string | null | undefined): string => {
  if (!timestamp) return strings.leads.details.missingValue;

  const date = new Date(timestamp);

  return Number.isNaN(date.getTime())
    ? strings.leads.details.missingValue
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

const toLeadSummary = (lead: Lead): LeadSummary => {
  const avatarIndex = [...lead.id].reduce((total, character) => total + character.charCodeAt(0), 0);

  return {
    id: lead.id,
    name: lead.name,
    initials: getInitials(lead.name),
    title: lead.title ?? strings.leads.unknownTitle,
    company: lead.company ?? strings.leads.unknownCompany,
    value: formatDealValue(lead.dealValueCents),
    updatedAt: formatTimestamp(lead.updatedAt),
    status: lead.stage,
    nextWhen: strings.leads.noFollowUpScheduled,
    nextReason: strings.leads.noFollowUpDetails,
    avatar: avatarTones[avatarIndex % avatarTones.length],
  };
};

export const useLeads = (options: LeadListOptions) => {
  const [state, setState] = useState<LeadsState>({
    leads: [],
    requestKey: null,
    hasError: false,
  });
  const [retryCount, setRetryCount] = useState(0);
  const { search, stage, priority, sortBy, sortDirection } = options;
  const requestKey = JSON.stringify([search, stage, priority, sortBy, sortDirection, retryCount]);

  useFocusEffect(useCallback(() => {
    let isCurrentRequest = true;

    setState((current) => ({ ...current, leads: [], requestKey: null, hasError: false }));

    void leadsService.list({ search, stage, priority, sortBy, sortDirection })
      .then((leads) => {
        if (isCurrentRequest) {
          setState({ leads: leads.map(toLeadSummary), requestKey, hasError: false });
        }
      })
      .catch(() => {
        if (isCurrentRequest) {
          setState((current) => ({ ...current, requestKey, hasError: true }));
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [requestKey, search, stage, priority, sortBy, sortDirection]));

  const refresh = useCallback(() => setRetryCount((count) => count + 1), []);

  return {
    ...state,
    isLoading: state.requestKey !== requestKey,
    hasError: state.requestKey === requestKey && state.hasError,
    refresh,
    retry: refresh,
  };
};
