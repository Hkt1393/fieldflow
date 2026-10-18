import { strings } from '../../../constants/strings';
import type { Lead } from '../types';

type SampleLead = (typeof strings.leads.sampleLeads)[number];
type SampleLeadName = SampleLead['name'];

const fixtureMetadata: Record<SampleLeadName, Pick<Lead, 'id' | 'createdAt' | 'updatedAt' | 'priority'>> = {
  'Marcus Vance': {
    id: 'lead-001',
    createdAt: '2025-09-01T09:00:00.000Z',
    updatedAt: '2025-10-18T09:00:00.000Z',
    priority: 'high',
  },
  'Sarah Lin': {
    id: 'lead-002',
    createdAt: '2025-09-02T09:00:00.000Z',
    updatedAt: '2025-10-17T09:00:00.000Z',
    priority: 'medium',
  },
  'Elena Rostova': {
    id: 'lead-003',
    createdAt: '2025-09-03T09:00:00.000Z',
    updatedAt: '2025-10-16T09:00:00.000Z',
    priority: 'high',
  },
  'Liam Campbell': {
    id: 'lead-004',
    createdAt: '2025-09-04T09:00:00.000Z',
    updatedAt: '2025-10-15T09:00:00.000Z',
    priority: 'low',
  },
  'David Miller': {
    id: 'lead-005',
    createdAt: '2025-09-05T09:00:00.000Z',
    updatedAt: '2025-10-14T09:00:00.000Z',
    priority: 'medium',
  },
};

const toFixture = (summary: SampleLead): Lead => ({
  ...fixtureMetadata[summary.name],
  name: summary.name,
  title: summary.title,
  company: summary.company,
  email: null,
  phone: null,
  stage: summary.status,
  dealValueCents: Number(summary.value.replace(/[$,]/g, '')) * 100,
  notes: null,
});

export const mockLeadsFixtures: readonly Readonly<Lead>[] = strings.leads.sampleLeads.map(toFixture);
