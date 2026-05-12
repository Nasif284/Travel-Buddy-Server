import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import Redis from 'ioredis';
import * as schema from '../../database/schema';
import {
  BcryptHashService,
  JwtTokenService,
  RedisSessionService,
} from '../../services';
import { EmailService } from '../../services/email.service';
import { RedisOtpService } from '../../services/redisOtp.service';
import { PostgresUserRepository } from '../../database/repositories/user.postgres.repository';
import { Register } from '../../../application/use-cases/auth/user';
import { EmailVerification } from '../../../application/use-cases/auth/user/verify-email.usecase';
import { LoginUseCase } from '../../../application/use-cases/auth/user/login.usecase';
import { ForgotPassword } from '../../../application/use-cases/auth/user/forgot-password.usecase';
import { ResetPassword } from '../../../application/use-cases/auth/user/reset-password.usecase';
import { RefreshToken } from '../../../application/use-cases/auth/user/refresh-tokem.usecase';
import { SendOtp } from '../../../application/use-cases/auth/user/send-otp.usecase';
import { Logout } from '../../../application/use-cases/auth/user/logout.usecase';
import { VerifyOtp } from '../../../application/use-cases/auth/user/otp-verify.usecase';
import { GoogleAuth } from '../../../application/use-cases/auth/user/google-auth.usecase';
import { AuthController } from '../../../presentation/controllers/user/auth/auth.controller';

export function BuildUserContainer(
  db: NodePgDatabase<typeof schema>,
  redis: Redis,
) {
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
  const refreshToken = new RefreshToken(
    tokenService,
    sessionService,
    userRepository,
  );

  const sendOtp = new SendOtp(redisOtpService);

  const logout = new Logout(tokenService, sessionService);
  const verifyOtp = new VerifyOtp(redisOtpService);
  const googleAuth = new GoogleAuth(
    userRepository,
    tokenService,
    sessionService,
  );

  const authController = new AuthController(
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
    refreshToken,
    sendOtp,
    logout,
    verifyOtp,
    googleAuth,
  );
  return { authController };
}
