import { z } from 'zod';

import { strings } from '../../constants/strings';

const followUpTypeSchema = z.enum(['call', 'email', 'meeting', 'task'], {
  error: strings.validation.invalidFollowUpData,
});
const followUpStatusSchema = z.enum(['pending', 'completed'], {
  error: strings.validation.invalidFollowUpData,
});
const leadIdSchema = z.string().trim().min(1, strings.validation.followUpLeadNotFound);
const titleSchema = z.string().trim().min(1, strings.validation.followUpTitleRequired);
const dueAtSchema = z.string().refine((value) => {
  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) && new Date(milliseconds).toISOString() === value;
}, strings.validation.invalidFollowUpDueAt);
const notesSchema = z.string().trim().nullable().transform((value) => value || null).optional();

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const toLocalIsoTimestamp = (dateValue: string, timeValue: string): string => {
  const [year, month, day] = dateValue.split('-').map(Number);
  const [hour, minute] = timeValue.split(':').map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const createFollowUpInputSchema = z.object({
  leadId: leadIdSchema,
  title: titleSchema,
  type: followUpTypeSchema,
  notes: notesSchema,
  dueAt: dueAtSchema,
});

export const createFollowUpFormSchema = z.object({
  leadId: z.string().trim().min(1, strings.validation.followUpLeadRequired),
  title: titleSchema,
  type: followUpTypeSchema,
  dueDate: z.string().regex(datePattern, strings.validation.invalidFollowUpDueAt),
  dueTime: z.string().regex(timePattern, strings.validation.invalidFollowUpDueAt),
  notes: z.string(),
}).superRefine(({ dueDate, dueTime }, context) => {
  if (!datePattern.test(dueDate) || !timePattern.test(dueTime)) return;

  const [year, month, day] = dueDate.split('-').map(Number);
  const [hour, minute] = dueTime.split(':').map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(hour, minute, 0, 0);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    context.addIssue({ code: 'custom', message: strings.validation.invalidFollowUpDueAt, path: ['dueDate'] });
  }
}).transform(({ dueDate, dueTime, notes, ...input }) => ({
  ...input,
  dueAt: toLocalIsoTimestamp(dueDate, dueTime),
  notes: notes.trim() || null,
}));

export type CreateFollowUpFormValues = z.input<typeof createFollowUpFormSchema>;
export type CreateFollowUpFormData = z.output<typeof createFollowUpFormSchema>;

export const updateFollowUpInputSchema = z.object({
  leadId: leadIdSchema.optional(),
  title: titleSchema.optional(),
  type: followUpTypeSchema.optional(),
  notes: notesSchema,
  dueAt: dueAtSchema.optional(),
  status: followUpStatusSchema.optional(),
}).refine((input) => Object.keys(input).length > 0, strings.validation.invalidFollowUpData);
