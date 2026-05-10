import { RegisterSchema } from '../../../../presentation/validators/user/auth/register.validator';
import { z } from 'zod';
export type RegisterRequestDTO = z.infer<typeof RegisterSchema>;
