import { z } from 'zod';
export const LoginSchema = z.object({
  email: z.email('Invalid email address.').toLowerCase().trim(),
  password: z.string().min(1, 'Password cannot be empty.'),
});
