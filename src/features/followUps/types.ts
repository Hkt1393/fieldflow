export type FollowUpType = 'call' | 'email' | 'meeting' | 'task';
export type FollowUpStatus = 'pending' | 'completed';
export type FollowUpTimeStatus = 'upcoming' | 'overdue';

export type FollowUp = {
  id: string;
  leadId: string;
  title: string;
  type: FollowUpType;
  notes: string | null;
  dueAt: string;
  status: FollowUpStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateFollowUpInput = Pick<FollowUp, 'leadId' | 'title' | 'type' | 'dueAt'> &
  Partial<Pick<FollowUp, 'notes'>>;

export type UpdateFollowUpInput = Partial<Pick<FollowUp, 'leadId' | 'title' | 'type' | 'notes' | 'dueAt' | 'status'>>;

export type FollowUpListOptions = {
  leadId?: string;
  status?: FollowUpStatus;
  timeStatus?: FollowUpTimeStatus;
  search?: string;
  sortDirection?: 'asc' | 'desc';
};

export type FollowUpsRepository = {
  list: (options?: FollowUpListOptions) => Promise<FollowUp[]>;
  getById: (id: string) => Promise<FollowUp | null>;
  listByLeadId: (leadId: string, options?: Omit<FollowUpListOptions, 'leadId'>) => Promise<FollowUp[]>;
  create: (input: CreateFollowUpInput) => Promise<FollowUp>;
  update: (id: string, input: UpdateFollowUpInput) => Promise<FollowUp | null>;
  complete: (id: string) => Promise<FollowUp | null>;
  delete: (id: string) => Promise<boolean>;
};
