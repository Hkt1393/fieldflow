import { strings } from '../../constants/strings';
import { leadsService } from '../leads/services/leadsService';
import type { Lead } from '../leads/types';
import { createFollowUpInputSchema, updateFollowUpInputSchema } from './validation';
import { createMockFollowUpsRepository } from './mockFollowUpsRepository';
import type {
  CreateFollowUpInput,
  FollowUp,
  FollowUpListOptions,
  FollowUpsRepository,
  UpdateFollowUpInput,
} from './types';

export type FollowUpsService = {
  list: (options?: FollowUpListOptions) => Promise<FollowUp[]>;
  getById: (id: string) => Promise<FollowUp | null>;
  listByLeadId: (leadId: string, options?: Omit<FollowUpListOptions, 'leadId'>) => Promise<FollowUp[]>;
  create: (input: CreateFollowUpInput) => Promise<FollowUp>;
  update: (id: string, input: UpdateFollowUpInput) => Promise<FollowUp | null>;
  complete: (id: string) => Promise<FollowUp | null>;
  delete: (id: string) => Promise<boolean>;
};

export class FollowUpValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FollowUpValidationError';
  }
}

type LeadLookup = (leadId: string) => Promise<Lead | null>;

export const createFollowUpsService = (
  repository: FollowUpsRepository,
  getLeadById: LeadLookup = (leadId) => leadsService.getById(leadId),
): FollowUpsService => {
  const assertLeadExists = async (leadId: string): Promise<void> => {
    const lead = await getLeadById(leadId);
    if (!lead) throw new FollowUpValidationError(strings.validation.followUpLeadNotFound);
  };

  return {
    list: (options) => repository.list(options),
    getById: (id) => repository.getById(id),
    listByLeadId: (leadId, options) => repository.listByLeadId(leadId, options),
    async create(input) {
      const validation = createFollowUpInputSchema.safeParse(input);
      if (!validation.success) {
        throw new FollowUpValidationError(
          validation.error.issues[0]?.message ?? strings.validation.invalidFollowUpData,
        );
      }
      await assertLeadExists(validation.data.leadId);
      return repository.create(validation.data);
    },
    async update(id, input) {
      const validation = updateFollowUpInputSchema.safeParse(input);
      if (!validation.success) {
        throw new FollowUpValidationError(
          validation.error.issues[0]?.message ?? strings.validation.invalidFollowUpData,
        );
      }
      const existing = await repository.getById(id);
      if (!existing) return null;
      if (validation.data.leadId) await assertLeadExists(validation.data.leadId);
      return repository.update(id, validation.data);
    },
    complete: (id) => repository.complete(id),
    delete: (id) => repository.delete(id),
  };
};

// The app selects one mock data source; replace this binding when another source is approved.
const repository = createMockFollowUpsRepository();

export const followUpsService = createFollowUpsService(repository);
