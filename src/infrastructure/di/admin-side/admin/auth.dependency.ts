import 'reflect-metadata';
import { container } from 'tsyringe';
import { AdminLogin } from '../../../../application/use-cases/auth/admin/login.usecase';
import { TOKENS } from '../../tokens';
import { AdminRefreshToken } from '../../../../application/use-cases/auth/admin/admin-refresh.usercase';
import { SaveAdminActivity } from '../../../../application/use-cases/admins/admin-activity.usecase';

export function registerAdminAuthDependencies(): void {
  container.registerSingleton<AdminLogin>(TOKENS.IAdminLogin, AdminLogin);
  container.registerSingleton<AdminRefreshToken>(
    TOKENS.IAdminRefreshToken,
    AdminRefreshToken,
  );
  container.registerSingleton<SaveAdminActivity>(
    TOKENS.ISaveAdminActivity,
    SaveAdminActivity,
  );
}
