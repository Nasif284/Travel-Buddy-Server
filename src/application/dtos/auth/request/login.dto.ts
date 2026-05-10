import z from 'zod';
import { LoginSchema } from '../../../../presentation/validators/user/auth/login.validator';

export type LoginRequestDTO = z.infer<typeof LoginSchema>;
