import z from 'zod';
import { CreateAdminSchema } from '../../../../presentation/validators/admin/create-admin.validator';

export type CreateAdminRequestDTO = z.infer<typeof CreateAdminSchema>;
