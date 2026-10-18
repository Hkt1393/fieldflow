import type {
  CreateLeadInput,
  Lead,
  LeadListOptions,
  LeadsRepository,
  UpdateLeadInput,
} from '../types';
import { strings } from '../../../constants/strings';
import { createLeadInputSchema, updateLeadInputSchema } from '../validation';
import { createMockLeadsRepository } from './mockLeadsRepository';

export type LeadsService = {
  list: (options?: LeadListOptions) => Promise<Lead[]>;
  getById: (id: string) => Promise<Lead | null>;
  create: (input: CreateLeadInput) => Promise<Lead>;
  update: (id: string, input: UpdateLeadInput) => Promise<Lead | null>;
  delete: (id: string) => Promise<boolean>;
};

export class LeadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LeadValidationError';
  }
}

export const createLeadsService = (repository: LeadsRepository): LeadsService => ({
  list: (options) => repository.list(options),
  getById: (id) => repository.getById(id),
  create: (input) => {
    const validation = createLeadInputSchema.safeParse(input);
    if (!validation.success) {
      throw new LeadValidationError(validation.error.issues[0]?.message ?? strings.validation.invalidLeadData);
    }
    return repository.create(validation.data);
  },
  update: (id, input) => {
    const validation = updateLeadInputSchema.safeParse(input);
    if (!validation.success) {
      throw new LeadValidationError(validation.error.issues[0]?.message ?? strings.validation.invalidLeadData);
    }
    return repository.update(id, validation.data);
  },
  delete: (id) => repository.delete(id),
});

// Select the mock implementation here; replace this binding when another source is approved.
const repository = createMockLeadsRepository();

export const leadsService = createLeadsService(repository);
