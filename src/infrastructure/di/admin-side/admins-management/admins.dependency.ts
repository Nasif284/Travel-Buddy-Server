import 'reflect-metadata';
import { container } from 'tsyringe';
import { UpdateAdmin } from '../../../../application/use-cases/admins/update-admin.usecase';
import { TOKENS } from '../../tokens';
import { GetAdmins } from '../../../../application/use-cases/admins/get-admins.usecase';
import { CreateAdmin } from '../../../../application/use-cases/admins/create.usecase';

export function registerAdminsDependencies(): void {
  container.registerSingleton<GetAdmins>(TOKENS.IGetAdmins, GetAdmins);
  container.registerSingleton<CreateAdmin>(TOKENS.ICreateAdmin, CreateAdmin);
  container.registerSingleton<UpdateAdmin>(TOKENS.IUpdateAdmin, UpdateAdmin);
}
