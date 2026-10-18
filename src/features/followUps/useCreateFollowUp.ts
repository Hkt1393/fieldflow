import { useCallback, useEffect, useRef, useState } from 'react';

import { strings } from '../../constants/strings';
import { leadsService } from '../leads/services/leadsService';
import type { Lead } from '../leads/types';
import { followUpsService, FollowUpValidationError } from './followUpsService';
import type { CreateFollowUpInput, FollowUp } from './types';

type LeadsState = {
  leads: Lead[];
  requestKey: number | null;
  hasError: boolean;
};

export const useCreateFollowUp = () => {
  const [leadsState, setLeadsState] = useState<LeadsState>({
    leads: [],
    requestKey: null,
    hasError: false,
  });
  const [leadRetryCount, setLeadRetryCount] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  useEffect(() => {
    let isCurrentRequest = true;

    void leadsService.list()
      .then((leads) => {
        if (isCurrentRequest) setLeadsState({ leads, requestKey: leadRetryCount, hasError: false });
      })
      .catch(() => {
        if (isCurrentRequest) {
          setLeadsState((current) => ({ ...current, requestKey: leadRetryCount, hasError: true }));
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [leadRetryCount]);

  const createFollowUp = async (input: CreateFollowUpInput): Promise<FollowUp | null> => {
    if (requestInProgress.current) return null;

    requestInProgress.current = true;
    setIsCreating(true);
    setErrorMessage(null);

    try {
      return await followUpsService.create(input);
    } catch (error) {
      setErrorMessage(error instanceof FollowUpValidationError ? error.message : strings.followUps.create.error);
      return null;
    } finally {
      requestInProgress.current = false;
      setIsCreating(false);
    }
  };

  const retryLeads = useCallback(() => setLeadRetryCount((count) => count + 1), []);
  const clearError = useCallback(() => setErrorMessage(null), []);

  return {
    ...leadsState,
    isLoading: leadsState.requestKey !== leadRetryCount,
    hasError: leadsState.requestKey === leadRetryCount && leadsState.hasError,
    clearError,
    createFollowUp,
    errorMessage,
    isCreating,
    retryLeads,
  };
};
