import { z } from 'zod';
export const ChangeStatusSchema = z.object({
  userId: z.string('user id is required'),
  reason: z.string().nullable(),
  action: z.string('Action is required'),
});
