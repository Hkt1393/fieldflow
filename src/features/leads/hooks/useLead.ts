import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { leadsService } from '../services/leadsService';
import type { Lead } from '../types';

type LeadState = {
  lead: Lead | null;
  requestKey: string | null;
  hasError: boolean;
};

export const useLead = (leadId: string | undefined) => {
  const [state, setState] = useState<LeadState>({
    lead: null,
    requestKey: null,
    hasError: false,
  });
  const [retryCount, setRetryCount] = useState(0);
  const requestKey = JSON.stringify([leadId, retryCount]);

  useFocusEffect(useCallback(() => {
    let isCurrentRequest = true;

    if (!leadId) {
      return () => {
        isCurrentRequest = false;
      };
    }

    setState((current) => ({ ...current, requestKey: null, hasError: false }));

    void leadsService.getById(leadId)
      .then((lead) => {
        if (isCurrentRequest) {
          setState({ lead, requestKey, hasError: false });
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
  }, [leadId, requestKey]));

  const requestComplete = state.requestKey === requestKey;

  return {
    lead: requestComplete ? state.lead : null,
    isLoading: Boolean(leadId) && !requestComplete,
    hasError: requestComplete && state.hasError,
    isNotFound: !leadId || (requestComplete && !state.hasError && state.lead === null),
    retry: () => setRetryCount((count) => count + 1),
  };
};
