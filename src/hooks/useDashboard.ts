import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { strings } from '../constants/strings';
import { followUpsService } from '../features/followUps/followUpsService';
import type { FollowUp, FollowUpStatus } from '../features/followUps/types';
import { leadsService } from '../features/leads/services/leadsService';
import type { Lead, LeadPriority, LeadStatus } from '../features/leads/types';

const leadStages: readonly LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal'];
const pendingStatus: FollowUpStatus = 'pending';
const priorityRank: Record<LeadPriority, number> = { high: 0, medium: 1, low: 2 };
const priorityLabels: Record<LeadPriority, string> = {
  low: strings.leads.details.priorities.low,
  medium: strings.leads.details.priorities.medium,
  high: strings.leads.details.priorities.high,
};
const leadStageLabels: Record<LeadStatus, string> = {
  new: strings.dashboard.stageNew,
  contacted: strings.dashboard.stageContacted,
  qualified: strings.dashboard.stageQualified,
  proposal: strings.dashboard.stageProposal,
};

export type DashboardPriorityFollowUp = {
  id: string;
  leadId: string;
  title: string;
  leadName: string;
  leadInitials: string;
  leadTitle: string;
  leadCompany: string;
  leadPriority: LeadPriority | null;
  leadPriorityLabel: string | null;
  dueTime: string;
  typeLabel: string;
  isCompleting: boolean;
  completionError: string | null;
};

export type DashboardRecentLead = {
  id: string;
  name: string;
  initials: string;
  company: string;
  createdAgo: string;
  value: string;
  stage: LeadStatus;
  stageLabel: string;
};

export type DashboardMetrics = {
  greeting: string;
  totalLeads: number;
  qualifiedLeads: number;
  qualifiedPipelineValue: string;
  contactedLeads: number;
  newLeads: number;
  pipelineStages: { stage: LeadStatus; label: string; count: number; percentage: number }[];
  todayFollowUpCount: number;
  nextFollowUp: DashboardPriorityFollowUp | null;
  priorityFollowUps: DashboardPriorityFollowUp[];
  recentLeads: DashboardRecentLead[];
  isEmpty: boolean;
};

type DashboardState = {
  metrics: DashboardMetrics | null;
  requestKey: number | null;
  hasError: boolean;
};

const uniqueById = <T extends { id: string }>(records: readonly T[]): T[] => (
  [...new Map(records.map((record) => [record.id, record])).values()]
);

const getInitials = (name: string | undefined): string => {
  if (!name?.trim()) return strings.dashboard.unknownInitials;
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();
};

const formatCurrency = (valueCents: number): string => (
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(valueCents / 100)
);

const formatLocalTime = (timestamp: string): string => (
  new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp))
);

const getGreeting = (now: number): string => {
  const hour = new Date(now).getHours();
  if (hour < 12) return strings.dashboard.greetingMorning;
  if (hour < 17) return strings.dashboard.greetingAfternoon;
  return strings.dashboard.greetingEvening;
};

const formatTimeSince = (timestamp: string, now: number): string => {
  const minutes = Math.max(0, Math.floor((now - Date.parse(timestamp)) / 60_000));
  if (minutes < 1) return strings.dashboard.justNow;
  if (minutes < 60) return strings.dashboard.minutesAgo.replace('{count}', String(minutes));
  return strings.dashboard.hoursAgo.replace('{count}', String(Math.floor(minutes / 60)));
};

const getLocalDayBounds = (now: number): { start: number; end: number } => {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.getTime(), end: end.getTime() };
};

export const calculateDashboardMetrics = (
  leadRecords: readonly Lead[],
  followUpRecords: readonly FollowUp[],
  now: number = Date.now(),
): DashboardMetrics => {
  const leads = uniqueById(leadRecords);
  const followUps = uniqueById(followUpRecords);
  const leadById = new Map(leads.map((lead) => [lead.id, lead]));
  const today = getLocalDayBounds(now);
  const todayPendingFollowUps = followUps.filter((followUp) => {
    if (followUp.status !== pendingStatus) return false;
    const dueAt = Date.parse(followUp.dueAt);
    return Number.isFinite(dueAt) && dueAt >= today.start && dueAt < today.end;
  });
  const toPriorityItem = (followUp: FollowUp): DashboardPriorityFollowUp => {
    const lead = leadById.get(followUp.leadId);
    return {
      id: followUp.id,
      leadId: followUp.leadId,
      title: followUp.title,
      leadName: lead?.name ?? strings.dashboard.unknownLead,
      leadInitials: getInitials(lead?.name),
      leadTitle: lead?.title ?? strings.dashboard.noTitle,
      leadCompany: lead?.company ?? strings.dashboard.noCompany,
      leadPriority: lead?.priority ?? null,
      leadPriorityLabel: lead?.priority ? priorityLabels[lead.priority] : null,
      dueTime: formatLocalTime(followUp.dueAt),
      typeLabel: strings.followUps.type[followUp.type],
      isCompleting: false,
      completionError: null,
    };
  };
  const chronologicalToday = todayPendingFollowUps
    .slice()
    .sort((first, second) => first.dueAt.localeCompare(second.dueAt) || first.id.localeCompare(second.id));
  const priorityFollowUps = chronologicalToday
    .slice()
    .sort((first, second) => {
      const firstPriority = leadById.get(first.leadId)?.priority;
      const secondPriority = leadById.get(second.leadId)?.priority;
      const priorityComparison = (firstPriority ? priorityRank[firstPriority] : 3)
        - (secondPriority ? priorityRank[secondPriority] : 3);
      return priorityComparison || first.dueAt.localeCompare(second.dueAt) || first.id.localeCompare(second.id);
    })
    .slice(0, 3)
    .map(toPriorityItem);
  const qualifiedLeads = leads.filter((lead) => lead.stage === 'qualified');
  const qualifiedValueCents = qualifiedLeads.reduce((total, lead) => (
    lead.dealValueCents !== null && Number.isSafeInteger(lead.dealValueCents) && lead.dealValueCents >= 0
      ? total + lead.dealValueCents
      : total
  ), 0);
  const pipelineStages = leadStages.map((stage) => {
    const count = leads.filter((lead) => lead.stage === stage).length;
    return {
      stage,
      label: leadStageLabels[stage],
      count,
      percentage: leads.length === 0 ? 0 : Math.round((count / leads.length) * 100),
    };
  });
  const recentLeads = leads
    .filter((lead) => {
      const createdAt = Date.parse(lead.createdAt);
      return Number.isFinite(createdAt) && createdAt >= now - 24 * 60 * 60 * 1000 && createdAt <= now;
    })
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt) || first.id.localeCompare(second.id))
    .slice(0, 3)
    .map((lead) => ({
      id: lead.id,
      name: lead.name,
      initials: getInitials(lead.name),
      company: lead.company ?? strings.dashboard.noCompany,
      createdAgo: formatTimeSince(lead.createdAt, now),
      value: lead.dealValueCents === null ? strings.leads.undisclosedValue : formatCurrency(lead.dealValueCents),
      stage: lead.stage,
      stageLabel: leadStageLabels[lead.stage],
    }));
  return {
    greeting: getGreeting(now),
    totalLeads: leads.length,
    qualifiedLeads: qualifiedLeads.length,
    qualifiedPipelineValue: formatCurrency(qualifiedValueCents),
    contactedLeads: leads.filter((lead) => lead.stage === 'contacted').length,
    newLeads: leads.filter((lead) => lead.stage === 'new').length,
    pipelineStages,
    todayFollowUpCount: todayPendingFollowUps.length,
    nextFollowUp: chronologicalToday[0] ? toPriorityItem(chronologicalToday[0]) : null,
    priorityFollowUps,
    recentLeads,
    isEmpty: leads.length === 0 && followUps.length === 0,
  };
};

export const useDashboard = () => {
  const [state, setState] = useState<DashboardState>({ metrics: null, requestKey: null, hasError: false });
  const [retryCount, setRetryCount] = useState(0);
  const [completingIds, setCompletingIds] = useState<Set<string>>(() => new Set());
  const [completionErrors, setCompletionErrors] = useState<Record<string, string>>({});
  const completionRequests = useRef(new Set<string>());

  useFocusEffect(useCallback(() => {
    let isCurrentRequest = true;
    setState((current) => ({ ...current, requestKey: null, hasError: false }));

    void Promise.all([leadsService.list(), followUpsService.list()])
      .then(([leads, followUps]) => {
        if (isCurrentRequest) {
          setState({
            metrics: calculateDashboardMetrics(leads, followUps, Date.now()),
            requestKey: retryCount,
            hasError: false,
          });
          setCompletionErrors({});
        }
      })
      .catch(() => {
        if (isCurrentRequest) setState({ metrics: null, requestKey: retryCount, hasError: true });
      });

    return () => { isCurrentRequest = false; };
  }, [retryCount]));

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);
  const completeFollowUp = useCallback(async (followUpId: string): Promise<void> => {
    const displayed = state.metrics?.priorityFollowUps.some((item) => item.id === followUpId);
    if (!displayed || completionRequests.current.has(followUpId)) return;

    completionRequests.current.add(followUpId);
    setCompletingIds((current) => new Set(current).add(followUpId));
    setCompletionErrors((current) => {
      const next = { ...current };
      delete next[followUpId];
      return next;
    });
    try {
      const existing = await followUpsService.getById(followUpId);
      if (!existing || existing.status !== pendingStatus) {
        setCompletionErrors((current) => ({ ...current, [followUpId]: strings.followUps.completionMissing }));
        retry();
        return;
      }
      const completed = await followUpsService.complete(followUpId);
      if (!completed) {
        setCompletionErrors((current) => ({ ...current, [followUpId]: strings.followUps.completionMissing }));
        return;
      }
      retry();
    } catch {
      setCompletionErrors((current) => ({ ...current, [followUpId]: strings.dashboard.completionError }));
    } finally {
      completionRequests.current.delete(followUpId);
      setCompletingIds((current) => {
        const next = new Set(current);
        next.delete(followUpId);
        return next;
      });
    }
  }, [retry, state.metrics]);

  const metrics = state.metrics ? {
    ...state.metrics,
    priorityFollowUps: state.metrics.priorityFollowUps.map((item) => ({
      ...item,
      isCompleting: completingIds.has(item.id),
      completionError: completionErrors[item.id] ?? null,
    })),
  } : null;

  return {
    metrics,
    isLoading: state.requestKey !== retryCount,
    hasError: state.requestKey === retryCount && state.hasError,
    completeFollowUp,
    retry,
  };
};
