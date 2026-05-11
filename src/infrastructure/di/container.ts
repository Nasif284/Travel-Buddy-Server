import { Redis } from 'ioredis';
import {
  BcryptHashService,
  JwtTokenService,
  RedisSessionService,
} from '../services';
import { PostgresUserRepository } from '../database/repositories/user.postgres.repository';
import { Register } from '../../application/use-cases/auth/user';
import { AuthController } from '../../presentation/controllers/user/auth/auth.controller';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { RedisOtpService } from '../services/redisOtp.service';
import { EmailService } from '../services/email.service';
import { EmailVerification } from '../../application/use-cases/auth/user/verify-email.usecase';
import { LoginUseCase } from '../../application/use-cases/auth/user/login.usecase';
import { ForgotPassword } from '../../application/use-cases/auth/user/forgot-password.usecase';
import { ResetPassword } from '../../application/use-cases/auth/user/reset-password.usecase';
import { RefreshToken } from '../../application/use-cases/auth/user/refresh-tokem.usecase';
import { AdminLogin } from '../../application/use-cases/auth/admin/login.usecase';
import { AdminAuthController } from '../../presentation/controllers/admin/auth/admin.auth.controller';
import { PostgresAdminRepository } from '../database/repositories/admin.prostgres.respository';
import { CreateAdmin } from '../../application/use-cases/auth/admin/create.usecase';

export interface AppContainer {
  authController: AuthController;
  adminAuthController: AdminAuthController;
}

export function buildContainer(
  db: NodePgDatabase<typeof schema>,
  redis: Redis,
): AppContainer {
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService();
  const sessionService = new RedisSessionService(redis);
  const emailService = new EmailService();
  const redisOtpService = new RedisOtpService(redis, hashService, emailService);

  const userRepository = new PostgresUserRepository(db);
  const adminRepository = new PostgresAdminRepository(db);

  const register = new Register(
    userRepository,
    hashService,
    tokenService,
    sessionService,
    redisOtpService,
  );
  const verifyEmail = new EmailVerification(redisOtpService, userRepository);
  const login = new LoginUseCase(
    userRepository,
    tokenService,
    hashService,
    sessionService,
  );
  const forgotPassword = new ForgotPassword(redisOtpService);
  const resetPassword = new ResetPassword(hashService, userRepository);
  const refreshToken = new RefreshToken(
    tokenService,
    sessionService,
    userRepository,
  );
  const adminLoginUseCase = new AdminLogin(
    adminRepository,
    tokenService,
    sessionService,
    hashService,
  );
  const createAdmin = new CreateAdmin(adminRepository, hashService);

  const authController = new AuthController(
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
    refreshToken,
  );
  const adminAuthController = new AdminAuthController(
    adminLoginUseCase,
    createAdmin,
  );

  return { authController, adminAuthController };
}
