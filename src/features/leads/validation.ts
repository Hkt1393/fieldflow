import { z } from 'zod';

import { strings } from '../../constants/strings';

const leadStatusSchema = z.enum(['qualified', 'proposal', 'new', 'contacted']);
const leadPrioritySchema = z.enum(['low', 'medium', 'high']);
const leadNameSchema = z.string().trim().min(1, strings.validation.leadNameRequired);
const dealValueCentsSchema = z.number().nullable().refine(
  (value) => value === null || (Number.isSafeInteger(value) && value >= 0),
  strings.validation.invalidDealValue,
);
const optionalTextSchema = z.string().trim().nullable().optional();
const emailAddressSchema = z.string().trim().email(strings.validation.invalidEmail);
const optionalEmailSchema = emailAddressSchema.nullable().optional();

export const createLeadInputSchema = z.object({
  name: leadNameSchema,
  title: optionalTextSchema,
  company: optionalTextSchema,
  email: optionalEmailSchema,
  phone: optionalTextSchema,
  stage: leadStatusSchema.optional(),
  priority: leadPrioritySchema.optional(),
  dealValueCents: dealValueCentsSchema.optional(),
  notes: optionalTextSchema,
});

export const updateLeadInputSchema = createLeadInputSchema.partial();

const optionalFormTextSchema = z.string().trim().transform((value) => value || undefined);
const emailFormSchema = z.string().trim()
  .pipe(z.union([emailAddressSchema, z.literal('')]))
  .transform((value) => value || undefined);
const dealValueFormSchema = z.string().trim()
  .refine((value) => value === '' || /^\d+(\.\d{1,2})?$/.test(value), strings.validation.invalidDealValue)
  .transform((value) => {
    if (value === '') return null;
    const [whole, fraction = ''] = value.split('.');
    return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  })
  .pipe(dealValueCentsSchema);

export const createLeadFormSchema = z.object({
  name: leadNameSchema,
  email: emailFormSchema,
  phone: optionalFormTextSchema,
  company: optionalFormTextSchema,
  title: optionalFormTextSchema,
  stage: leadStatusSchema,
  priority: leadPrioritySchema,
  dealValue: dealValueFormSchema,
  notes: optionalFormTextSchema,
}).transform(({ dealValue, ...lead }) => ({
  ...lead,
  dealValueCents: dealValue,
}));

export type CreateLeadFormValues = z.input<typeof createLeadFormSchema>;
export type CreateLeadFormData = z.output<typeof createLeadFormSchema>;
