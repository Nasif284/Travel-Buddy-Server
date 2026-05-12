import { z } from 'zod';
import { ResetPasswordSchema } from '../../../../../presentation/validators/user/auth/reset-password.validator';
export type ResetPasswordRequestDTO = z.infer<typeof ResetPasswordSchema>;
