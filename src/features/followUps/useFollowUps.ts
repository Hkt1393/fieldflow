import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { strings } from '../../constants/strings';
import { leadsService } from '../leads/services/leadsService';
import type { Lead, LeadPriority } from '../leads/types';
import { followUpsService } from './followUpsService';
import type { FollowUp, FollowUpType } from './types';

export type FollowUpCategory = 'today' | 'upcoming' | 'completed';
export type FollowUpTypeFilter = 'all' | FollowUpType;

export type FollowUpListItem = {
  id: string;
  leadId: string;
  title: string;
  notes: string | null;
  leadName: string;
  leadTitle: string | null;
  leadCompany: string | null;
  leadPhone: string | null;
  leadEmail: string | null;
  leadPriority: LeadPriority | null;
  leadPriorityLabel: string | null;
  leadUnavailable: boolean;
  initials: string;
  type: FollowUpType;
  typeLabel: string;
  dueAt: string;
  dueTimeLabel: string;
  dueDateLabel: string;
  statusLabel: string;
  isCompleted: boolean;
  isCompleting: boolean;
  completionError: string | null;
};

export type FollowUpGroup = {
  id: string;
  title: string;
  rangeLabel: string;
  count: number;
  countLabel: string;
  items: FollowUpListItem[];
};

type FollowUpsState = {
  items: FollowUpListItem[];
  requestKey: number | null;
  hasError: boolean;
  loadedAt: number | null;
};

const priorityLabels: Record<LeadPriority, string> = {
  low: strings.leads.details.priorities.low,
  medium: strings.leads.details.priorities.medium,
  high: strings.leads.details.priorities.high,
};

const getLocalDayStart = (timestamp: number): number => {
  const start = new Date(timestamp);
  start.setHours(0, 0, 0, 0);
  return start.getTime();
};

const formatDate = (timestamp: number): string => (
  new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(timestamp)
);

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime())
    ? strings.followUps.invalidDueDate
    : new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);
};

const formatDueDate = (timestamp: string, todayStart: number, isPending: boolean): string => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return strings.followUps.invalidDueDate;
  const dueStart = getLocalDayStart(date.getTime());
  if (isPending && dueStart < todayStart) return strings.followUps.overdue;
  if (dueStart === todayStart) return strings.followUps.today;
  return formatDate(date.getTime());
};

const getInitials = (name: string | undefined): string => {
  if (!name?.trim()) return strings.followUps.unknownInitials;
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();
};

const toListItem = (followUp: FollowUp, lead: Lead | null, loadedAt: number): FollowUpListItem => ({
  id: followUp.id,
  leadId: followUp.leadId,
  title: followUp.title,
  notes: followUp.notes,
  leadName: lead?.name ?? strings.followUps.unknownLead,
  leadTitle: lead?.title ?? null,
  leadCompany: lead?.company ?? null,
  leadPhone: lead?.phone && /^\+?[\d\s().-]+$/.test(lead.phone) && lead.phone.replace(/\D/g, '').length >= 7 && lead.phone.replace(/\D/g, '').length <= 15
    ? lead.phone
    : null,
  leadEmail: lead?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)
    ? lead.email
    : null,
  leadPriority: lead?.priority ?? null,
  leadPriorityLabel: lead?.priority ? priorityLabels[lead.priority] : null,
  leadUnavailable: !lead,
  initials: getInitials(lead?.name),
  type: followUp.type,
  typeLabel: strings.followUps.type[followUp.type],
  dueAt: followUp.dueAt,
  dueTimeLabel: formatTime(followUp.dueAt),
  dueDateLabel: formatDueDate(followUp.dueAt, getLocalDayStart(loadedAt), followUp.status === 'pending'),
  statusLabel: strings.followUps.status[followUp.status],
  isCompleted: followUp.status === 'completed',
  isCompleting: false,
  completionError: null,
});

const matchesSearch = (item: FollowUpListItem, query: string): boolean => {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return true;
  return [item.title, item.notes, item.leadName, item.leadCompany, item.typeLabel]
    .some((value) => value?.toLocaleLowerCase().includes(normalized));
};

const isValidDate = (timestamp: string): boolean => Number.isFinite(Date.parse(timestamp));

const groupOrder = ['overdue', 'morning', 'afternoon', 'evening', 'unscheduled'] as const;
type GroupId = (typeof groupOrder)[number];

const getGroupId = (item: FollowUpListItem, todayStart: number, showOverdue = true): GroupId => {
  const timestamp = Date.parse(item.dueAt);
  if (!Number.isFinite(timestamp)) return 'unscheduled';
  if (showOverdue && getLocalDayStart(timestamp) < todayStart) return 'overdue';
  const hour = new Date(timestamp).getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const groupLabels: Record<GroupId, { title: string; range: string }> = {
  overdue: { title: strings.followUps.overdue, range: strings.followUps.overdueRange },
  morning: { title: strings.followUps.morning, range: strings.followUps.morningRange },
  afternoon: { title: strings.followUps.afternoon, range: strings.followUps.afternoonRange },
  evening: { title: strings.followUps.evening, range: strings.followUps.eveningRange },
  unscheduled: { title: strings.followUps.unscheduled, range: strings.followUps.unscheduledRange },
};

export const useFollowUps = () => {
  const [state, setState] = useState<FollowUpsState>({ items: [], requestKey: null, hasError: false, loadedAt: null });
  const [retryCount, setRetryCount] = useState(0);
  const [completingIds, setCompletingIds] = useState<Record<string, boolean>>({});
  const [completionErrors, setCompletionErrors] = useState<Record<string, string>>({});
  const [category, setCategory] = useState<FollowUpCategory>('today');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<FollowUpTypeFilter>('all');
  const completionRequests = useRef(new Set<string>());

  useFocusEffect(useCallback(() => {
    let isCurrentRequest = true;
    setState((current) => ({ ...current, requestKey: null, hasError: false }));

    void (async () => {
      try {
        const loadedAt = Date.now();
        const followUps = await followUpsService.list();
        const leadIds = [...new Set(followUps.map((followUp) => followUp.leadId))];
        const leadResults = await Promise.allSettled(leadIds.map((leadId) => leadsService.getById(leadId)));
        const leadsById = new Map<string, Lead | null>();
        leadResults.forEach((result, index) => {
          const leadId = leadIds[index];
          if (leadId) leadsById.set(leadId, result.status === 'fulfilled' ? result.value : null);
        });

        if (isCurrentRequest) {
          setState({
            items: followUps.map((followUp) => toListItem(followUp, leadsById.get(followUp.leadId) ?? null, loadedAt)),
            requestKey: retryCount,
            hasError: false,
            loadedAt,
          });
        }
      } catch {
        if (isCurrentRequest) setState((current) => ({ ...current, requestKey: retryCount, hasError: true }));
      }
    })();

    return () => { isCurrentRequest = false; };
  }, [retryCount]));

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);
  const markCompleted = useCallback(async (id: string): Promise<void> => {
    const item = state.items.find((followUp) => followUp.id === id);
    if (!item || item.isCompleted || completionRequests.current.has(id)) return;
    completionRequests.current.add(id);
    setCompletingIds((current) => ({ ...current, [id]: true }));
    setCompletionErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });

    try {
      const existing = await followUpsService.getById(id);
      if (!existing) {
        setCompletionErrors((current) => ({ ...current, [id]: strings.followUps.completionMissing }));
        retry();
        return;
      }
      if (existing.status === 'completed') {
        retry();
        return;
      }
      const completed = await followUpsService.complete(id);
      if (!completed) {
        setCompletionErrors((current) => ({ ...current, [id]: strings.followUps.completionMissing }));
        retry();
        return;
      }
      retry();
    } catch {
      setCompletionErrors((current) => ({ ...current, [id]: strings.followUps.completionError }));
    } finally {
      completionRequests.current.delete(id);
      setCompletingIds((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    }
  }, [retry, state.items]);

  const todayTimestamp = state.loadedAt ?? 0;
  const todayStart = getLocalDayStart(todayTimestamp);
  const filteredItems = state.items
    .map((item) => ({
      ...item,
      isCompleting: Boolean(completingIds[item.id]),
      completionError: completionErrors[item.id] ?? null,
    }))
    .filter((item) => (typeFilter === 'all' || item.type === typeFilter) && matchesSearch(item, search))
    .sort((first, second) => {
      const firstDue = Date.parse(first.dueAt);
      const secondDue = Date.parse(second.dueAt);
      const firstOrder = Number.isFinite(firstDue) ? firstDue : Number.MAX_SAFE_INTEGER;
      const secondOrder = Number.isFinite(secondDue) ? secondDue : Number.MAX_SAFE_INTEGER;
      return firstOrder - secondOrder || first.id.localeCompare(second.id);
    });
  const isPending = (item: FollowUpListItem): boolean => !item.isCompleted;
  const todayPending = state.items.filter((item) => (
    isPending(item) && isValidDate(item.dueAt) && getLocalDayStart(Date.parse(item.dueAt)) === todayStart
  ));
  const upcomingPending = state.items.filter((item) => (
    isPending(item) && isValidDate(item.dueAt) && getLocalDayStart(Date.parse(item.dueAt)) > todayStart
  ));
  const completedItems = state.items.filter((item) => item.isCompleted);
  const currentItems = category === 'today'
    ? filteredItems.filter((item) => isPending(item) && (!isValidDate(item.dueAt) || getLocalDayStart(Date.parse(item.dueAt)) <= todayStart))
    : category === 'upcoming'
      ? filteredItems.filter((item) => isPending(item) && isValidDate(item.dueAt) && getLocalDayStart(Date.parse(item.dueAt)) > todayStart)
      : filteredItems.filter((item) => item.isCompleted);
  const visibleGroupIds = category === 'upcoming'
    ? groupOrder.filter((id) => id !== 'overdue' && id !== 'unscheduled')
    : groupOrder.filter((id) => id !== 'overdue' || category === 'today');
  const groups: FollowUpGroup[] = visibleGroupIds.flatMap((id) => {
    const groupItems = currentItems.filter((item) => getGroupId(item, todayStart, category === 'today') === id);
    if (groupItems.length === 0) return [];
    const label = groupLabels[id];
    const pendingCount = groupItems.filter(isPending).length;
    return [{
      id,
      title: label.title,
      rangeLabel: label.range,
      count: category === 'completed' ? groupItems.length : pendingCount,
      countLabel: category === 'completed' ? strings.followUps.completedCount : strings.followUps.pendingCount,
      items: groupItems,
    }];
  });
  const categoryCounts = {
    today: todayPending.filter((item) => (typeFilter === 'all' || item.type === typeFilter) && matchesSearch(item, search)).length,
    upcoming: upcomingPending.filter((item) => (typeFilter === 'all' || item.type === typeFilter) && matchesSearch(item, search)).length,
    completed: completedItems.filter((item) => (typeFilter === 'all' || item.type === typeFilter) && matchesSearch(item, search)).length,
  };
  const todayScheduledCount = todayPending.length;

  return {
    category,
    setCategory,
    categoryCounts,
    groups,
    isLoading: state.requestKey !== retryCount,
    hasError: state.requestKey === retryCount && state.hasError,
    hasAnyRecords: currentItems.length > 0,
    todayScheduledCount,
    todayDateLabel: state.loadedAt === null ? '' : formatDate(todayTimestamp),
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    hasActiveFilters: Boolean(search.trim()) || typeFilter !== 'all',
    clearFilters: () => { setSearch(''); setTypeFilter('all'); },
    markCompleted,
    retry,
  };
};
