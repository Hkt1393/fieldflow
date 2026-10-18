import { useCallback, useEffect, useRef, useState } from 'react';

import { strings } from '../../constants/strings';
import { followUpsService, FollowUpValidationError } from './followUpsService';
import type { FollowUp } from './types';
import type { CreateFollowUpFormData } from './validation';

type FollowUpState = {
  followUp: FollowUp | null;
  requestKey: string | null;
  hasError: boolean;
};

export const useEditFollowUp = (followUpId: string | undefined) => {
  const [state, setState] = useState<FollowUpState>({ followUp: null, requestKey: null, hasError: false });
  const [retryCount, setRetryCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const updateInProgress = useRef(false);

  useEffect(() => {
    let isCurrentRequest = true;
    if (!followUpId) {
      return () => { isCurrentRequest = false; };
    }

    const requestKey = `${followUpId}:${retryCount}`;
    void followUpsService.getById(followUpId)
      .then((followUp) => {
        if (isCurrentRequest) setState({ followUp, requestKey, hasError: false });
      })
      .catch(() => {
        if (isCurrentRequest) setState((current) => ({ ...current, requestKey, hasError: true }));
      });

    return () => { isCurrentRequest = false; };
  }, [followUpId, retryCount]);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);
  const clearError = useCallback(() => setUpdateError(null), []);
  const currentRequestKey = followUpId ? `${followUpId}:${retryCount}` : null;
  const updateFollowUp = useCallback(async (
    input: CreateFollowUpFormData,
  ): Promise<FollowUp | null> => {
    if (!followUpId || updateInProgress.current) return null;
    updateInProgress.current = true;
    setIsUpdating(true);
    setUpdateError(null);
    try {
      const updatedFollowUp = await followUpsService.update(followUpId, {
        title: input.title,
        type: input.type,
        dueAt: input.dueAt,
        notes: input.notes,
      });
      if (!updatedFollowUp) {
        setUpdateError(strings.followUps.edit.missing);
        return null;
      }
      return updatedFollowUp;
    } catch (error) {
      setUpdateError(
        error instanceof FollowUpValidationError ? error.message : strings.followUps.edit.error,
      );
      return null;
    } finally {
      updateInProgress.current = false;
      setIsUpdating(false);
    }
  }, [followUpId]);

  return {
    followUp: state.followUp,
    isLoading: Boolean(followUpId) && state.requestKey !== currentRequestKey,
    hasError: Boolean(followUpId) && state.requestKey === currentRequestKey && state.hasError,
    isNotFound: !followUpId || (state.requestKey === currentRequestKey && !state.hasError && !state.followUp),
    retry,
    clearError,
    updateFollowUp,
    updateError,
    isUpdating,
  };
};
