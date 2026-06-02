import 'reflect-metadata';
import { container } from 'tsyringe';
import { AdminLogin } from '../../../application/use-cases/auth/admin/login.usecase';
import { TOKENS } from '../tokens';
import { CreateAdmin } from '../../../application/use-cases/auth/admin/create.usecase';
import { AdminRefreshToken } from '../../../application/use-cases/auth/admin/admin-refresh.usercase';

export function registerAdminAuthDependencies(): void {
  container.registerSingleton<AdminLogin>(TOKENS.IAdminLogin, AdminLogin);
  container.registerSingleton<CreateAdmin>(TOKENS.ICreateAdmin, CreateAdmin);
  container.registerSingleton<AdminRefreshToken>(
    TOKENS.IAdminRefreshToken,
    AdminRefreshToken,
  );
}
