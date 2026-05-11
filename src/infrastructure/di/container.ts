import { Redis } from 'ioredis';
import {
  BcryptHashService,
  JwtTokenService,
  RedisSessionService,
} from '../services';
import { PostgresUserRepository } from '../database/repositories/user.postgres.repository';
import { Register } from '../../application/use-cases/auth';
import { AuthController } from '../../presentation/controllers/user/auth/auth.controller';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { RedisOtpService } from '../services/redisOtp.service';
import { EmailService } from '../services/email.service';
import { EmailVerification } from '../../application/use-cases/auth/verify-email.usecase';
import { LoginUseCase } from '../../application/use-cases/auth/login.usecase';
import { ForgotPassword } from '../../application/use-cases/auth/forgot-password.usecase';
import { ResetPassword } from '../../application/use-cases/auth/reset-password.usecase';

export interface AppContainer {
  authController: AuthController;
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

  const authController = new AuthController(
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
  );
  return { authController };
}
