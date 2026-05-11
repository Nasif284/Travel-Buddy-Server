import { z } from 'zod';
export const ResetPasswordSchema = z.object({
  email: z.email('Invalid email address format.').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password cannot exceed 128 characters.')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase and one number.',
    ),
});
