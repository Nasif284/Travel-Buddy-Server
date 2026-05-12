import { z } from 'zod';
export const VerifyOtpSchema = z.object({
  email: z.email('Invalid email address.').toLowerCase().trim(),
  code: z
    .string()
    .length(6, 'OTP must be exactly 6 digits.')
    .regex(/^\d{6}$/, 'OTP must contain only digits.'),
  purpose: z.enum(['email_verify', 'password_reset']),
});
