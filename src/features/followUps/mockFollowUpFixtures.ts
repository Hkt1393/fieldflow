import type { FollowUp } from './types';

const offsetIsoTimestamp = (base: Date, offsetInDays: number): string => (
  new Date(base.getTime() + offsetInDays * 24 * 60 * 60 * 1000).toISOString()
);

export const createMockFollowUpFixtures = (now: Date): readonly Readonly<FollowUp>[] => {
  return [
    {
      id: 'follow-up-001',
      leadId: 'lead-001',
      title: 'Review proposal timeline',
      type: 'call',
      notes: 'Confirm the decision date and next stakeholders.',
      dueAt: offsetIsoTimestamp(now, 1),
      status: 'pending',
      createdAt: offsetIsoTimestamp(now, -2),
      updatedAt: offsetIsoTimestamp(now, -2),
    },
    {
      id: 'follow-up-002',
      leadId: 'lead-001',
      title: 'Send product overview',
      type: 'email',
      notes: 'Include the overview requested after the discovery call.',
      dueAt: offsetIsoTimestamp(now, -1),
      status: 'pending',
      createdAt: offsetIsoTimestamp(now, -4),
      updatedAt: offsetIsoTimestamp(now, -4),
    },
    {
      id: 'follow-up-003',
      leadId: 'lead-003',
      title: 'Discuss security requirements',
      type: 'meeting',
      notes: null,
      dueAt: offsetIsoTimestamp(now, -3),
      status: 'completed',
      createdAt: offsetIsoTimestamp(now, -5),
      updatedAt: offsetIsoTimestamp(now, -3),
    },
    {
      id: 'follow-up-004',
      leadId: 'lead-004',
      title: 'Prepare discovery questions',
      type: 'task',
      notes: 'Focus on the current intake process.',
      dueAt: offsetIsoTimestamp(now, 7),
      status: 'pending',
      createdAt: offsetIsoTimestamp(now, -1),
      updatedAt: offsetIsoTimestamp(now, -1),
    },
  ];
};
