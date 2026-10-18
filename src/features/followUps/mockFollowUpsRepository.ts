import type {
  CreateFollowUpInput,
  FollowUp,
  FollowUpListOptions,
  FollowUpsRepository,
  UpdateFollowUpInput,
} from './types';
import { createMockFollowUpFixtures } from './mockFollowUpFixtures';

const cloneFollowUp = (followUp: FollowUp): FollowUp => ({ ...followUp });

const matchesSearch = (followUp: FollowUp, search: string): boolean => (
  [followUp.title, followUp.notes].some((value) => value?.toLowerCase().includes(search))
);

export const createMockFollowUpsRepository = (
  fixtures?: readonly Readonly<FollowUp>[],
  clock: () => Date = () => new Date(),
): FollowUpsRepository => {
  let records = (fixtures ?? createMockFollowUpFixtures(clock())).map(cloneFollowUp);
  let nextId = records.length + 1;

  const listRecords = async (options: FollowUpListOptions = {}): Promise<FollowUp[]> => {
    const search = options.search?.trim().toLowerCase() ?? '';
    const now = clock().getTime();

    return records
      .filter((followUp) => !options.leadId || followUp.leadId === options.leadId)
      .filter((followUp) => !options.status || followUp.status === options.status)
      .filter((followUp) => {
        if (!options.timeStatus) return true;
        if (followUp.status !== 'pending') return false;
        const isUpcoming = new Date(followUp.dueAt).getTime() >= now;
        return options.timeStatus === 'upcoming' ? isUpcoming : !isUpcoming;
      })
      .filter((followUp) => !search || matchesSearch(followUp, search))
      .slice()
      .sort((first, second) => {
        const comparison = first.dueAt.localeCompare(second.dueAt);
        const tieBreak = comparison === 0 ? first.id.localeCompare(second.id) : comparison;
        return options.sortDirection === 'desc' ? -tieBreak : tieBreak;
      })
      .map(cloneFollowUp);
  };

  return {
    list: listRecords,

    async getById(id) {
      const followUp = records.find((record) => record.id === id);
      return followUp ? cloneFollowUp(followUp) : null;
    },

    listByLeadId(leadId, options = {}) {
      return listRecords({ ...options, leadId });
    },

    async create(input: CreateFollowUpInput) {
      const now = clock().toISOString();
      let id = `follow-up-${String(nextId).padStart(3, '0')}`;
      while (records.some((record) => record.id === id)) {
        nextId += 1;
        id = `follow-up-${String(nextId).padStart(3, '0')}`;
      }
      nextId += 1;

      const followUp: FollowUp = {
        ...input,
        notes: input.notes ?? null,
        id,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };
      records = [...records, followUp];
      return cloneFollowUp(followUp);
    },

    async update(id: string, input: UpdateFollowUpInput) {
      const index = records.findIndex((record) => record.id === id);
      if (index === -1) return null;

      const updatedFollowUp: FollowUp = {
        ...records[index],
        ...(input.leadId === undefined ? {} : { leadId: input.leadId }),
        ...(input.title === undefined ? {} : { title: input.title }),
        ...(input.type === undefined ? {} : { type: input.type }),
        ...(input.notes === undefined ? {} : { notes: input.notes }),
        ...(input.dueAt === undefined ? {} : { dueAt: input.dueAt }),
        ...(input.status === undefined ? {} : { status: input.status }),
        updatedAt: clock().toISOString(),
      };
      records = records.map((record, recordIndex) => recordIndex === index ? updatedFollowUp : record);
      return cloneFollowUp(updatedFollowUp);
    },

    async complete(id: string) {
      const index = records.findIndex((record) => record.id === id);
      if (index === -1) return null;

      const completedFollowUp: FollowUp = {
        ...records[index],
        status: 'completed',
        updatedAt: clock().toISOString(),
      };
      records = records.map((record, recordIndex) => recordIndex === index ? completedFollowUp : record);
      return cloneFollowUp(completedFollowUp);
    },

    async delete(id: string) {
      const remaining = records.filter((record) => record.id !== id);
      if (remaining.length === records.length) return false;
      records = remaining;
      return true;
    },
  };
};
