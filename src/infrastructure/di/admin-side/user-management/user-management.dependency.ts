import 'reflect-metadata';
import { container } from 'tsyringe';
import { GetAllUsers } from '../../../../application/use-cases/user-management/get-users.usecase';
import { TOKENS } from '../../tokens';
import { ChangeUserStatus } from '../../../../application/use-cases/user-management/change-user-status.usecase';

export function registerUsersManagementDependencies(): void {
  container.registerSingleton<GetAllUsers>(TOKENS.IGetAllUsers, GetAllUsers);
  container.registerSingleton<ChangeUserStatus>(
    TOKENS.IChangeUserStatus,
    ChangeUserStatus,
  );
}
