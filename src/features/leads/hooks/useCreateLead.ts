import { useRef, useState } from 'react';

import { leadsService } from '../services/leadsService';
import type { CreateLeadInput, Lead } from '../types';

export const useCreateLead = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const requestInProgress = useRef(false);

  const createLead = async (input: CreateLeadInput): Promise<Lead | null> => {
    if (requestInProgress.current) return null;

    requestInProgress.current = true;
    setIsCreating(true);
    setHasError(false);

    try {
      return await leadsService.create(input);
    } catch {
      setHasError(true);
      return null;
    } finally {
      requestInProgress.current = false;
      setIsCreating(false);
    }
  };

  const clearError = () => setHasError(false);

  return { clearError, createLead, hasError, isCreating };
};
