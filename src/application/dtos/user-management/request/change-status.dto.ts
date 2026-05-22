import z from 'zod';
import { ChangeStatusSchema } from '../../../../presentation/validators/user-management/change-status.validator';

export type ChangeUserStatusRequestDTO = z.infer<typeof ChangeStatusSchema>;
