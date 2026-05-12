import { IAdminRepository } from '../../../application/interfaces/repositories/admin.respository';
import { IUserRepository } from '../../../application/interfaces/repositories/user.reposetory';
import { AdminRefreshToken } from '../../../application/use-cases/auth/admin/admin-refresh.usercase';
import { CreateAdmin } from '../../../application/use-cases/auth/admin/create.usecase';
import { AdminLogin } from '../../../application/use-cases/auth/admin/login.usecase';
import { Logout } from '../../../application/use-cases/auth/user/logout.usecase';
import { GetAllUsers } from '../../../application/use-cases/user-management/get-users.usecase';
import {
  BcryptHashService,
  JwtTokenService,
  RedisSessionService,
} from '../../services';

export function BuildAdminUseCases(
  adminRepository: IAdminRepository,
  userRepository: IUserRepository,
  tokenService: JwtTokenService,
  sessionService: RedisSessionService,
  hashService: BcryptHashService,
) {
  return {
    createAdmin: new CreateAdmin(adminRepository, hashService),
    adminLoginUseCase: new AdminLogin(
      adminRepository,
      tokenService,
      sessionService,
      hashService,
    ),
    logout: new Logout(tokenService, sessionService),
    getAllUsers: new GetAllUsers(userRepository),
    refreshToken: new AdminRefreshToken(
      tokenService,
      sessionService,
      adminRepository,
    ),
  };
}
