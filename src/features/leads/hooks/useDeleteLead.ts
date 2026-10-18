import { useEffect, useRef, useState } from 'react';

import { leadsService } from '../services/leadsService';

export type DeleteLeadResult = 'deleted' | 'missing' | 'failed' | 'inProgress';

export const useDeleteLead = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const requestInProgress = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const deleteLead = async (leadId: string): Promise<DeleteLeadResult> => {
    if (requestInProgress.current) return 'inProgress';

    requestInProgress.current = true;
    if (isMounted.current) {
      setIsDeleting(true);
      setHasError(false);
    }

    try {
      const deleted = await leadsService.delete(leadId);
      return deleted ? 'deleted' : 'missing';
    } catch {
      if (isMounted.current) setHasError(true);
      return 'failed';
    } finally {
      requestInProgress.current = false;
      if (isMounted.current) setIsDeleting(false);
    }
  };

  return { deleteLead, hasError, isDeleting };
};
