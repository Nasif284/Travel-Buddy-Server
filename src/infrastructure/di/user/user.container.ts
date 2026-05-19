import Redis from 'ioredis';
import {
  BcryptHashService,
  JwtTokenService,
  RedisSessionService,
} from '../../services';
import { EmailService } from '../../services/email.service';
import { RedisOtpService } from '../../services/redisOtp.service';
import { UserRepository } from '../../database/repositories/user.repository';
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
import { PrismaClient } from '@prisma/client';

export function BuildUserContainer(db: PrismaClient, redis: Redis) {
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService();
  const sessionService = new RedisSessionService(redis);
  const emailService = new EmailService();
  const redisOtpService = new RedisOtpService(redis, hashService, emailService);

  const userRepository = new UserRepository(db);

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
