import { z } from 'zod';
export const SendOtpSchema = z.object({
  email: z.email('Invalid email address format.').toLowerCase().trim(),
  purpose: z.enum(['email_verify', 'password_reset']),
});
