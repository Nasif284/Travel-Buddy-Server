import { ForgotPasswordSchema } from '../../../../presentation/validators/user/auth/forgot-password.validator';
import { z } from 'zod';
export type ForgotPasswordRequestDTO = z.infer<typeof ForgotPasswordSchema>;
