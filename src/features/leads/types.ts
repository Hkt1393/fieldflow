export type LeadStatus = 'qualified' | 'proposal' | 'new' | 'contacted';
export type LeadAvatarTone = 'blue' | 'green' | 'cyan' | 'sky' | 'coral';

export type LeadSummary = {
  name: string;
  initials: string;
  title: string;
  company: string;
  value: string;
  status: LeadStatus;
  nextWhen: string;
  nextReason: string;
  avatar: LeadAvatarTone;
};
