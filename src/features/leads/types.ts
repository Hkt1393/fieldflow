export type LeadStatus = 'qualified' | 'proposal' | 'new' | 'contacted';
export type LeadPriority = 'low' | 'medium' | 'high';
export type LeadAvatarTone = 'blue' | 'green' | 'cyan' | 'sky' | 'coral';

export type LeadSummary = {
  id: string;
  name: string;
  initials: string;
  title: string;
  company: string;
  value: string;
  updatedAt: string;
  status: LeadStatus;
  nextWhen: string;
  nextReason: string;
  avatar: LeadAvatarTone;
};

export type Lead = {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  stage: LeadStatus;
  priority: LeadPriority;
  dealValueCents: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateLeadInput = Pick<Lead, 'name'> &
  Partial<Omit<Lead, 'id' | 'name' | 'createdAt' | 'updatedAt'>>;

export type UpdateLeadInput = Partial<CreateLeadInput>;

export type LeadListOptions = {
  search?: string;
  stage?: LeadStatus;
  priority?: LeadPriority;
  sortBy?: 'name' | 'updatedAt' | 'dealValueCents';
  sortDirection?: 'asc' | 'desc';
};

export type LeadsRepository = {
  list: (options?: LeadListOptions) => Promise<Lead[]>;
  getById: (id: string) => Promise<Lead | null>;
  create: (input: CreateLeadInput) => Promise<Lead>;
  update: (id: string, input: UpdateLeadInput) => Promise<Lead | null>;
  delete: (id: string) => Promise<boolean>;
};
