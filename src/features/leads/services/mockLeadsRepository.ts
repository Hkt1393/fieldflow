import type {
  CreateLeadInput,
  Lead,
  LeadListOptions,
  LeadsRepository,
  UpdateLeadInput,
} from '../types';
import { mockLeadsFixtures } from './mockLeadsFixtures';

const cloneLead = (lead: Lead): Lead => ({ ...lead });

const matchesSearch = (lead: Lead, search: string): boolean => {
  const searchableValues = [lead.name, lead.title, lead.company, lead.email, lead.phone];
  return searchableValues.some((value) => value?.toLowerCase().includes(search));
};

const compareLeads = (
  first: Lead,
  second: Lead,
  sortBy: NonNullable<LeadListOptions['sortBy']>,
  direction: NonNullable<LeadListOptions['sortDirection']>,
): number => {
  if (sortBy === 'dealValueCents') {
    if (first.dealValueCents === null) return second.dealValueCents === null ? first.id.localeCompare(second.id) : 1;
    if (second.dealValueCents === null) return -1;
  }

  const comparison = sortBy === 'name'
    ? first.name.localeCompare(second.name)
    : sortBy === 'updatedAt'
      ? first.updatedAt.localeCompare(second.updatedAt)
      : (first.dealValueCents ?? 0) - (second.dealValueCents ?? 0);

  return comparison === 0
    ? first.id.localeCompare(second.id)
    : direction === 'asc' ? comparison : -comparison;
};

export const createMockLeadsRepository = (
  fixtures: readonly Readonly<Lead>[] = mockLeadsFixtures,
): LeadsRepository => {
  let records = fixtures.map(cloneLead);
  let nextId = records.length + 1;

  return {
    async list(options = {}) {
      const search = options.search?.trim().toLowerCase() ?? '';
      const sortBy = options.sortBy ?? 'updatedAt';
      const sortDirection = options.sortDirection ?? 'desc';

      return records
        .filter((lead) => !options.stage || lead.stage === options.stage)
        .filter((lead) => !options.priority || lead.priority === options.priority)
        .filter((lead) => !search || matchesSearch(lead, search))
        .slice()
        .sort((first, second) => compareLeads(first, second, sortBy, sortDirection))
        .map(cloneLead);
    },

    async getById(id) {
      const lead = records.find((record) => record.id === id);
      return lead ? cloneLead(lead) : null;
    },

    async create(input: CreateLeadInput) {
      const now = new Date().toISOString();
      let id = `lead-${String(nextId).padStart(3, '0')}`;
      while (records.some((record) => record.id === id)) {
        nextId += 1;
        id = `lead-${String(nextId).padStart(3, '0')}`;
      }
      nextId += 1;

      const lead: Lead = {
        id,
        name: input.name,
        title: input.title ?? null,
        company: input.company ?? null,
        email: input.email ?? null,
        phone: input.phone ?? null,
        stage: input.stage ?? 'new',
        priority: input.priority ?? 'medium',
        dealValueCents: input.dealValueCents ?? null,
        notes: input.notes ?? null,
        createdAt: now,
        updatedAt: now,
      };

      records = [...records, lead];
      return cloneLead(lead);
    },

    async update(id: string, input: UpdateLeadInput) {
      const index = records.findIndex((record) => record.id === id);
      if (index === -1) return null;

      const updatedLead: Lead = {
        ...records[index],
        ...(input.name === undefined ? {} : { name: input.name }),
        ...(input.title === undefined ? {} : { title: input.title }),
        ...(input.company === undefined ? {} : { company: input.company }),
        ...(input.email === undefined ? {} : { email: input.email }),
        ...(input.phone === undefined ? {} : { phone: input.phone }),
        ...(input.stage === undefined ? {} : { stage: input.stage }),
        ...(input.priority === undefined ? {} : { priority: input.priority }),
        ...(input.dealValueCents === undefined ? {} : { dealValueCents: input.dealValueCents }),
        ...(input.notes === undefined ? {} : { notes: input.notes }),
        updatedAt: new Date().toISOString(),
      };
      records = records.map((record, recordIndex) => recordIndex === index ? updatedLead : record);
      return cloneLead(updatedLead);
    },

    async delete(id: string) {
      const remaining = records.filter((record) => record.id !== id);
      if (remaining.length === records.length) return false;
      records = remaining;
      return true;
    },
  };
};
