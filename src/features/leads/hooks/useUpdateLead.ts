import { useRef, useState } from 'react';

import { leadsService } from '../services/leadsService';
import type { Lead, UpdateLeadInput } from '../types';

export const useUpdateLead = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const requestInProgress = useRef(false);

  const updateLead = async (id: string, input: UpdateLeadInput): Promise<Lead | null> => {
    if (requestInProgress.current) return null;

    requestInProgress.current = true;
    setIsUpdating(true);
    setHasError(false);

    try {
      const lead = await leadsService.update(id, input);
      if (!lead) setHasError(true);
      return lead;
    } catch {
      setHasError(true);
      return null;
    } finally {
      requestInProgress.current = false;
      setIsUpdating(false);
    }
  };

  const clearError = () => setHasError(false);

  return { clearError, hasError, isUpdating, updateLead };
};
